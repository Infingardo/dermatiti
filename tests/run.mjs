// Runner node dei casi di regressione — nessun framework.
// Esecuzione:  node tests/run.mjs   (oppure: npm test)   Exit code 0 = tutto verde.
//
// I casi vivono in tests/cases.js, condivisi con test.html: prima erano scritti
// dentro test.html e giravano solo aprendolo in un browser — e soprattutto
// giravano su engine.js mentre l'applicazione eseguiva una PROPRIA copia inline.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const E = require('../engine.js');
const CASES = require('./cases.js');

let pass = 0, fail = 0; const failures = [];
let group = null;

for (const c of CASES) {
  if (c.group) { group = c.group; console.log(`\n• ${c.group}`); continue; }
  let reason = null;
  try {
    reason = c.check(E.Engine.calc({ ...E.INIT, ...c.input }));
  } catch (e) {
    reason = 'eccezione: ' + e.message;
  }
  if (reason) { fail++; failures.push(`[${group}] ${c.name} — ${reason}`); } else pass++;
}

// ── Invarianti strutturali che i casi non coprono ────────────────────────────
console.log('\n• invarianti del motore e del progetto');
const inv = (name, cond, detail = '') => cond ? pass++ : (fail++, failures.push(`[invarianti] ${name}${detail ? ' — ' + detail : ''}`));

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const engSrc = fs.readFileSync(new URL('../engine.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Il motore non deve tornare a essere duplicato dentro la pagina.
inv('index.html carica engine.js', /<script src="engine\.js/.test(html));
['const SC = {', 'const DX = {', 'const Engine = {', 'const RED_FLAGS', 'const INIT = {'].forEach(marker =>
  inv(`index.html non ridefinisce ${marker.replace('const ', '').replace(' = {', '').trim()}`, !html.includes('\n' + marker)));
inv('il motore non tocca il DOM', !/document\.|getElementById|window\./.test(engSrc));
inv('versione allineata a package.json', html.includes(`engine.js?v=${pkg.version}`), pkg.version);
inv('VERSION del motore allineata a package.json', E.VERSION === pkg.version, `${E.VERSION} vs ${pkg.version}`);

// Ogni DX deve restare raggiungibile con il proprio input ideale.
const ideale = (dx) => {
  const d = { ...E.INIT };
  const put = (f, v) => { d[f] = Array.isArray(v) ? v[v.length - 1] : v; };
  Object.entries(dx.major || {}).forEach(([f, v]) => put(f, v));
  Object.entries(dx.minor || {}).forEach(([f, v]) => put(f, v));
  return d;
};
Object.entries(E.DX).forEach(([k, dx]) => {
  const res = E.Engine.calc(ideale(dx));
  inv(`${k} raggiungibile con input ideale`, res.diagnoses.some(x => x.key === k),
    `pct ${res.allScores.find(x => x.key === k).pct}`);
});

// Nessun campo può essere contemporaneamente atteso e contrario sulla stessa scala.
Object.entries(E.DX).forEach(([k, dx]) => {
  const mm = { ...(dx.major || {}), ...(dx.minor || {}) };
  Object.entries(dx.against || {}).forEach(([f, av]) => {
    if (!(f in mm)) return;
    const scala = E.ORD[f];
    if (!scala) return;
    // Esiste un valore che soddisfa insieme il criterio atteso e quello contrario?
    const ambigui = scala.filter(v => E.matches(f, mm[f], v) && E.matches(f, av, v));
    inv(`${k}.${f} non conta a favore e contro insieme`, ambigui.length === 0,
      `atteso ${JSON.stringify(mm[f])}, against ${JSON.stringify(av)}, ambiguo su ${JSON.stringify(ambigui)}`);
  });
});

// Un elenco di valori su scala ordinale deve avere davvero un tetto.
Object.entries(E.DX).forEach(([k, dx]) => {
  [['major', dx.major], ['minor', dx.minor]].forEach(([tier, obj]) => {
    Object.entries(obj || {}).forEach(([f, v]) => {
      if (!Array.isArray(v) || !E.ORD[f]) return;
      // Un elenco vale come insieme esatto: nessun valore fuori elenco deve poterlo soddisfare.
      const fuori = E.ORD[f].filter(x => !v.includes(x));
      inv(`${k}.${tier}.${f}: l'elenco non ammette valori fuori lista`,
        fuori.every(x => !E.matches(f, v, x)),
        `${JSON.stringify(v)} accetta anche ${JSON.stringify(fuori.filter(x => E.matches(f, v, x)))}`);
    });
  });
});

// Le red flag non devono contenere configurazione inerte.
E.RED_FLAGS.forEach(rf => {
  [...(rf.escludi || []), ...(rf.favorisce || [])].forEach(k =>
    inv(`red flag "${rf.label}" → ${k} esiste`, !!E.DX[k]));
  inv(`red flag "${rf.label}": favorisce viene letto`,
    !(rf.favorisce || []).length || /f\.favorisce/.test(engSrc),
    'dichiarato ma mai letto dal motore');
});

console.log(`\n${fail === 0 ? 'OK' : 'FALLITO'} — ${pass} pass, ${fail} fail`);
if (failures.length) { console.log('\nFallimenti:'); failures.forEach(f => console.log('  ✗ ' + f)); }
process.exit(fail === 0 ? 0 : 1);
