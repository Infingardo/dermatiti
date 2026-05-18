# DermPath v2.17.0

Strumento di supporto decisionale per dermatopatologia. Valutazione morfologica EE-first con motore a compatibilità euristica conservativa. Non produce diagnosi automatiche: produce un ranking ragionato di ipotesi diagnostiche con esplicitazione dei criteri soddisfatti, mancanti e controindicanti.

---

## Principi di funzionamento

**Il vetrino comanda. Il punteggio porta il caffè.**

Il tool non assegna probabilità diagnostiche. Assegna una *compatibilità euristica corretta* — percentuale grezzo sul peso risposto, poi corretta per:

- dati insufficienti (soglia minima di peso risposto)
- required mancanti o contrari
- elementi contro (`against`)
- red flags morfologiche attive

Una diagnosi è *proponibile* solo se supera la soglia del 50% **dopo** tutte le correzioni. In caso contrario appare come "da considerare, non chiudibile".

---

## Architettura del motore

### Struttura di una diagnosi

```javascript
{
  nome, cat,
  required: [...],                    // bloccanti se mancanti o contrari
  conditionalRequired: [              // bloccanti solo se la condizione è vera
    { field: 'campo', when: d => ... }
  ],
  major: { campo: valore_atteso },    // peso 3
  minor: { campo: valore_atteso },    // peso 1
  against: { campo: valore_atteso },  // penalità -12 per hit
  note, workup
}
```

### Pipeline di scoring

1. Valuta `major` e `minor` → calcola `raw` e `answeredWeight`
2. Verifica `required` → popola `missingRequired` / `failedRequired`
3. Valuta `conditionalRequired` → aggiunge a `missingRequired` se condizione vera e campo mancante
4. Verifica `against` → accumula `againstHits`
5. Applica red flags → `excludedByFlags`
6. Corregge il punteggio:
   - `lowData` (answeredWeight < 6 o matchedCriteria < 3) → cap a 49%
   - `requiredProblem` → cap a 49%
   - ogni `againstHit` → -12 punti
   - ogni `excludedByFlag` → -25 punti (min 5%)
7. `blocked = pct < 50 || lowData || requiredProblem || excludedByFlags.length > 0`

### Logica di matching

```javascript
matchAtLeast(field, expected, actual)
```

Per la maggior parte dei campi ordinali (`epidermotropismo`, `linfociti_atipici`, `spongiosi`, ecc.) usa confronto "almeno": `actual >= expected` nella scala ordinale.

**Eccezione — `EXACT_FIELDS`**: confronto esatto per campi dove "più" non implica "meglio":

| Campo | Motivazione |
|---|---|
| `paracheratosi` | focale ≠ marcata in diagnostica differenziale |
| `pattern_primario` | categoriale puro |
| `infiltrato_distribuzione` | categoriale puro |
| `spongiosi_proporzionata` | booleano semantico |

**Eccezione — `EXACT_ARRAY_FIELDS`**: per `spongiosi`, `paracheratosi`, `neutrofili` passati come array in major/minor, usa `includes()` invece di `some(matchAtLeast)`. Effetto: se il major attende `['moderata','marcata']`, solo quei valori esatti soddisfano il criterio — non il valore superiore per inferenza ordinale.

### Semantica dei campi non compilati: `isUnansweredCriterion`

```javascript
const isUnansweredCriterion = (expected, actual) => {
  if(expected === true && actual === false) return true;
  return isMissing(actual);
};
```

I campi checkbox con valore atteso `true` (es. `saw_toothing`, `assottigliamento_soprapapillare`) non hanno stato "non so" esplicito nell'UI. Se non spuntati (`false`), vengono trattati come *non documentati*, non come *assenza provata*. Non contribuiscono al punteggio, ma non penalizzano.

Questo evita che l'assenza di documentazione di un reperto positivo opzionale venga interpretata come evidenza contraria.

### required condizionali

Meccanismo per required che dipendono da altri campi:

```javascript
conditionalRequired: [
  { field: 'spongiosi_proporzionata', when: d => ['presente','marcato'].includes(d.epidermotropismo) }
]
```

Usato attualmente per MF early: `spongiosi_proporzionata` è morfologicamente cruciale solo se epidermotropismo è presente o marcato.

| Scenario | Risultato |
|---|---|
| epidermotropismo assente | MF bloccata da required `epidermotropismo` |
| epidermotropismo presente, spongiosi_proporzionata non compilata | MF non proponibile |
| epidermotropismo presente + spongiosi_proporzionata = sì | MF penalizzata (against) |
| epidermotropismo presente + spongiosi_proporzionata = no | MF può salire |

### Red flags

Layer separato dalla pipeline di scoring. Ogni red flag ha:
- `test(d)` → funzione che valuta i dati
- `escludi[]` → lista di chiavi DX penalizzate se il test è vero

Le red flags sono interrupt, non pesi. Una red flag attiva non blocca necessariamente la diagnosi correlata, ma la penalizza di 25 punti e la mostra esplicitamente nell'output.

Red flags implementate:

| Flag | Condizione | Diagnosi segnalata | DX penalizzate |
|---|---|---|---|
| Microascessi di Munro | `microascessi_munro = 'si'` | Psoriasi | DAC, DA acuta |
| Corpi di Civatte | `corpi_civatte = 'si'` | Interfaccia lichenoide | Psoriasi |
| Plasmacellule in psoriasiforme | `pattern psoriasiforme + plasmacellule` | Escludere sifilide | Psoriasi |
| Epidermotropismo + alone chiaro | epidermotropismo + alone_chiaro | Sospetto T-linfoproliferativo | DAC |
| Spongiosi proporzionata in MF | spongiosi_proporzionata = sì + epidermotropismo | Dermatite > MF | MF early |
| PLEVA | necrosi diffusa + eritrociti intraepidermici | Considerare PLEVA | MF early |

### unsupportedPattern

```javascript
const isPatternSupported = (pattern) => Object.values(DX).some(dx => {
  const exp = dx.major?.pattern_primario;
  return Array.isArray(exp) ? exp.includes(pattern) : exp === pattern;
});
```

Calcolato direttamente sui DX, non su `compatibility > 0`. Robusto a contaminazione da campi condivisi tra diagnosi.

---

## Diagnosi implementate

| Chiave | Nome | Pattern |
|---|---|---|
| `dermatite_allergica_contatto` | Dermatite allergica da contatto | Spongotico |
| `dermatite_atopica_acuta` | Dermatite atopica, fase acuta | Spongotico |
| `dermatite_seborroica` | Dermatite seborroica | Spongotico / Psoriasiforme |
| `psoriasi_vulgaris` | Psoriasi vulgaris | Psoriasiforme |
| `lichen_planus` | Lichen planus | Interfaccia lichenoide |
| `micosi_fungoide_early` | Micosi fungoide, fase iniziale | Spongotico / Interfaccia lichenoide |
| `eritema_multiforme` | Eritema multiforme / TEN | Interfaccia vacuolare |
| `lupus_eritematoso` | Lupus eritematoso (DLE/SCLE) | Interfaccia vacuolare |
| `reazione_lichenoide_farmaci` | Reazione lichenoide da farmaci | Interfaccia lichenoide |
| `pemfigoide_bolloso` | Pemfigoide bolloso | Subepidermico bolloso |
| `pemfigo_volgare` | Pemfigo volgare | Intraepidermico bolloso |
| `granuloma_anulare` | Granuloma anulare | Granulomatoso a palizzata |
| `necrobiosi_lipoide` | Necrobiosi lipoide | Granulomatoso a palizzata |
| `sarcoide_cutaneo` | Sarcoide cutaneo | Granulomatoso |
| `vasculite_leucocitoclastica` | Vasculite leucocitoclastica | Vasculitico |
| `impetigine_bollosa` | Impetigine bollosa | Subcorneo |
| `agep` | AGEP (pustolosi esantematica acuta) | Subcorneo |
| `sneddon_wilkinson` | Pustolosi subcornea Sneddon-Wilkinson | Subcorneo |
| `pitiriasi_rosea` | Pitiriasi rosea | Perivascolare |
| `urticaria` | Urticaria | Perivascolare |
| `reazione_puntura` | Reazione a puntura / scabbia | Perivascolare eosinofilo |
| `drug_eruption_morbilliforme` | Reazione a farmaci morbilliforme | Perivascolare eosinofilo |
| `vasculopatia_trombotica` | Vasculopatia trombotica | Vasculopatico |
| `wells_syndrome` | Wells syndrome (cellulite eosinofila) | Interstiziale eosinofilo |
| `eritema_nodoso` | Eritema nodoso | Panniculitico settale |
| `lupus_profundus` | Lupus profundus (panniculite lupica) | Panniculitico lobulare |
| `eritema_indurato_bazin` | Eritema indurato di Bazin | Panniculitico lobulare con vasculite |
| `mastocitosi_cutanea` | Mastocitosi cutanea | Mastocitario |
| `pleva` | PLEVA / Mucha-Habermann | Interfaccia vacuolare con necrosi |
| `sifilide_secondaria` | Sifilide secondaria | Psoriasiforme / Lichenoide |
| `pemfigo_foliaceo` | Pemfigo foliaceo | Intraepidermico bolloso superficiale |
| `dermatite_erpetiforme` | Dermatite erpetiforme (Duhring) | Subepidermico bolloso |
| `lichen_sclerosus` | Lichen sclerosus | Interfaccia vacuolare con sclerosi |

**Tutti i 16 pattern riconosciuti sono implementati. 28 DX totali.**

### Differential explorer (v2.17.0+)

Quando ci sono ≥ 2 diagnosi proponibili, il tool mostra automaticamente una tabella di campi che discriminano tra le prime due ipotesi. Per ogni campo: ruolo nella DX A (major/minor/contro/non usato) vs ruolo nella DX B. Aiuta a chiudere il differenziale identificando rapidamente i reperti da verificare.

---

## Architettura del codice

```
engine.js     — motore puro JS (SC, ORD, DX, RED_FLAGS, Engine, buildExportText)
                Single source of truth. Caricato sia da index.html che da test.html.
                Export Node-compatible per esecuzione test da CLI.

index.html    — UI React (single-page). Carica engine.js, contiene solo componenti,
                hook (useForm, useData), getCompClass e App.

test.html     — Suite di regressione browser. Carica engine.js, esegue ~33 casi,
                visualizza pass/fail. Aprire localmente o in preview.
```

Per eseguire i test da CLI (Node):

```bash
node -e "
const eng = require('./engine.js');
const { Engine, INIT, DX, discriminantFields } = eng;
const html = require('fs').readFileSync('./test.html','utf-8');
const m = html.match(/const CASES = \[([\s\S]*?)\];\s*\n\s*\/\/ Run/);
const tmp = '/tmp/_dermpath_cases.js';
require('fs').writeFileSync(tmp,
  'const topScore = (res,key) => res.allScores.find(x => x.key===key);\n' +
  'const DX = ' + JSON.stringify(DX) + ';\n' +
  'const discriminantFields = ' + discriminantFields.toString() + ';\n' +
  'const CASES = [' + m[1] + ']; module.exports = CASES;'
);
const CASES = require(tmp);
let p=0,f=0,t=0;
CASES.forEach(c => { if(c.group) return; t++;
  try { const r=Engine.calc({...INIT,...c.input}); const x=c.check(r); if(x){f++;console.log('✗',c.name,'—',x);} else p++; }
  catch(e){f++;console.log('✗',c.name,'—THROW:',e.message);}
});
console.log(p+'/'+t+' passati');
"
```

---

## Parametri configurabili (SC)

```javascript
const SC = {
  MAJOR: 3,               // peso criterio major
  MINOR: 1,               // peso criterio minor
  THRESH: 50,             // soglia minima per "proponibile"
  MIN_CRITERIA_FOR_HIGH: 3,  // n. criteri matched minimi
  MIN_ANSWERED_WEIGHT: 6,    // peso totale risposto minimo
  RED_PENALTY: 25,        // penalità per red flag
  REQUIRED_CAP: 49,       // cap se required mancanti
  LOW_DATA_CAP: 49,       // cap se dati insufficienti
  AGAINST_PENALTY: 12     // penalità per elemento contro
};
```

---

## Bug noti / limitazioni del motore

### failedRequired troppo aggressivo

`required` blocca la diagnosi non solo se il campo è **assente** ma anche se è **presente ma sotto-soglia** rispetto al major. Esempio:

- `spongiosi: lieve` con DAC → `matches('spongiosi', ['moderata','marcata'], 'lieve')` → false → **failedRequired → DAC bloccata**
- `linfociti_atipici: rari` con MF → `matches('linfociti_atipici', 'presenti', 'rari')` → false → **failedRequired → MF bloccata**

Il comportamento atteso sarebbe: blocca solo se **assente** (campo vuoto) o **esplicitamente contrario** (es. spongiosi assente in DAC); penalizza invece se presente ma sub-threshold. Il fix richiede separare la logica di required in due livelli: presenza vs coerenza.

---

## Changelog

| Versione | Modifiche |
|---|---|
| v2.17.0 | +5 diagnosi: PLEVA/Mucha-Habermann, sifilide secondaria, pemfigo foliaceo, dermatite erpetiforme (Duhring), lichen sclerosus. Nuovi campi: ialinosi del derma papillare (LS), microascessi neutrofilici nelle papille (DH). **Differential explorer**: card automatica con tabella dei campi che discriminano le prime due ipotesi proponibili. Test suite a 90 casi (90/90). Totale DX: 28 |
| v2.16.0 | +5 diagnosi: Wells syndrome, eritema nodoso, lupus profundus, eritema indurato di Bazin, mastocitosi cutanea. **Tutti i 16 pattern ora coperti**. Nuovi campi: figure a fiamma, tipo di panniculite, vasculite sottocutanea, mastociti aumentati. Test suite a 77 casi (77/77) |
| v2.15.0 | +5 diagnosi: pitiriasi rosea, urticaria, reazione a puntura/scabbia, reazione a farmaci morbilliforme, vasculopatia trombotica; pattern perivascolare, perivascolare eosinofilo e vasculopatico ora coperti; nuovo campo: trombi vasali luminali; test suite a 66 casi (66/66) |
| v2.14.0 | +4 diagnosi: vasculite leucocitoclastica, impetigine bollosa, AGEP, pustolosi Sneddon-Wilkinson; pattern vasculitico e subcorneo ora coperti; nuovi campi: necrosi fibrinoide vasale, leucocitoclasia, eritrociti extravasati dermici; test suite a 56 casi (56/56) |
| v2.13.0 | +6 diagnosi: reazione lichenoide da farmaci, pemfigoide bolloso, pemfigo volgare, granuloma anulare, necrobiosi lipoide, sarcoide cutaneo; nuovi campi: sede della bolla, acantolisi, tipo di granuloma, necrobiosi; PDF print (`window.print()` + CSS @media print); test suite estesa a 48 casi (48/48) |
| v2.12.0 | Refactor architetturale: motore estratto in `engine.js` (pure JS), `index.html` solo UI React; aggiunta `test.html` con suite di regressione (33 casi, eseguibili anche da Node); aggiunta diagnosi `lupus_eritematoso` (DLE/SCLE); nuovi campi morfologici: mucina dermica, infiltrato perianessiale, atrofia epidermica, ispessimento BMZ |
| v2.11.5 | Fix `failedRequired`: campi ordinali bloccano solo se esplicitamente assenti, non sub-threshold; aggiunte diagnosi `dermatite_seborroica` e `eritema_multiforme`; export referto (copia testo); localStorage draft |
| v2.11.4 | Allineamento versione; nessuna modifica al motore rispetto a v2.11.3 |
| v2.11.3 | Aggiunta `isUnansweredCriterion`: checkbox boolean non compilate trattate come non documentate, non come assenze provate |
| v2.11.2 | required condizionale per MF (spongiosi_proporzionata); isPatternSupported robusto; EXACT_FIELDS per paracheratosi/pattern/infiltrato/spongiosi_proporzionata |
| v2.11.1 | MIN_ANSWERED_WEIGHT 4→6; MIN_CRITERIA_FOR_HIGH 2→3; spongiosi_proporzionata rimossa dai required globali di MF |
| v2.11.0 | Motore conservativo con matchAtLeast ordinale, EXACT_ARRAY_FIELDS, required/against pipeline, red flags layer separato |

---

## Disclaimer

Strumento di supporto diagnostico ad uso esclusivo di medici specialisti. Non sostituisce la valutazione morfologica diretta del preparato istologico, il giudizio clinico e la correlazione anatomo-clinica. La compatibilità euristica non è una probabilità diagnostica.
