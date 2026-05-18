// DermPath diagnostic engine — pure JS, no React.
// Caricato sia da index.html (UI) sia da test.html (regressione).
// Modifiche qui devono essere coperte da un test in test.html.

const SC = {
  MAJOR: 3,
  MINOR: 1,
  THRESH: 50,
  MIN_CRITERIA_FOR_HIGH: 3,
  MIN_ANSWERED_WEIGHT: 6,
  RED_PENALTY: 25,
  REQUIRED_CAP: 49,
  LOW_DATA_CAP: 49,
  AGAINST_PENALTY: 12
};

const ORD = {
  epidermotropismo:['assente','presente','marcato'],
  linfociti_atipici:['assenti','rari','presenti','abbondanti'],
  necrosi_keratinociti:['assente','presente','marcata'],
  plasmacellule:['assenti','presenti','abbondanti'],
  spongiosi:['assente','lieve','moderata','marcata'],
  esocitosi:['assente','lieve','presente','marcata'],
  neutrofili:['assenti','rari','presenti','abbondanti'],
  eosinofili:['assenti','rari','presenti','abbondanti'],
  vacuolizzazione_basale:['assente','presente','marcata'],
  acantosi:['assente','lieve','moderata','marcata'],
  paracheratosi:['assente','focale','moderata','marcata'],
  infiltrato_densita:['assente','lieve','moderata','marcata']
};

const EXACT_ARRAY_FIELDS = new Set(['spongiosi','paracheratosi','neutrofili']);

// Campi non realmente ordinali: "marcata" non implica "focale".
const EXACT_FIELDS = new Set([
  'paracheratosi',
  'pattern_primario',
  'infiltrato_distribuzione',
  'spongiosi_proporzionata',
  'sede_bolla',
  'tipo_granuloma'
]);

const isMissing = (v) => v === '' || v === null || v === undefined;
const isUnansweredCriterion = (expected, actual) => {
  // Checkbox-only true clues have no explicit "unknown" state in the UI.
  // Unchecked optional positive clue → non documentato, non assenza provata.
  if(expected === true && actual === false) return true;
  return isMissing(actual);
};

const labelize = (field) => ({
  pattern_primario:'pattern primario',
  spongiosi:'spongiosi',
  esocitosi:'esocitosi',
  acantosi:'acantosi',
  paracheratosi:'paracheratosi',
  ipogranulosi:'ipogranulosi',
  ipergranulosi:'ipergranulosi',
  vacuolizzazione_basale:'vacuolizzazione basale',
  necrosi_keratinociti:'necrosi cheratinocitaria',
  infiltrato_distribuzione:'distribuzione infiltrato',
  eosinofili:'eosinofili',
  neutrofili:'neutrofili',
  plasmacellule:'plasmacellule',
  linfociti_atipici:'linfociti atipici',
  epidermotropismo:'epidermotropismo',
  spongiosi_proporzionata:'spongiosi proporzionata',
  alone_chiaro:'alone chiaro',
  microascessi_munro:'microascessi di Munro',
  corpi_civatte:'corpi di Civatte',
  saw_toothing:'saw-toothing',
  assottigliamento_soprapapillare:'assottigliamento sovrapapillare',
  capillari_dilatati_papille:'capillari dilatati nelle papille',
  mucina_dermica:'mucina dermica',
  infiltrato_perianessiale:'infiltrato perianessiale',
  atrofia_epidermica:'atrofia epidermica',
  ispessimento_bmz:'ispessimento BMZ (membrana basale)',
  sede_bolla:'sede della bolla',
  acantolisi:'acantolisi',
  tipo_granuloma:'tipo di granuloma',
  necrobiosi:'necrobiosi'
}[field] || field.replaceAll('_',' '));

const matchAtLeast = (field, expected, actual) => {
  if(EXACT_FIELDS.has(field)) return actual === expected;
  const rank = ORD[field];
  if(!rank) return actual === expected;
  const eIdx = rank.indexOf(expected);
  const aIdx = rank.indexOf(actual);
  if(eIdx < 0 || aIdx < 0) return actual === expected;
  return aIdx >= eIdx;
};

const matches = (field, expected, actual) => {
  if(typeof expected === 'boolean') return actual === expected;
  if(Array.isArray(expected)){
    if(EXACT_ARRAY_FIELDS.has(field)) return expected.includes(actual);
    return expected.some(e => matchAtLeast(field,e,actual));
  }
  return matchAtLeast(field,expected,actual);
};

const INIT = {
  pattern_primario:'',
  spongiosi:'', esocitosi:'', acantosi:'', paracheratosi:'', ipogranulosi:'', ipergranulosi:'',
  vacuolizzazione_basale:'', necrosi_keratinociti:'',
  infiltrato_distribuzione:'', infiltrato_densita:'',
  eosinofili:'', neutrofili:'', plasmacellule:'', linfociti_atipici:'', epidermotropismo:'',
  spongiosi_proporzionata:'', alone_chiaro:'', microascessi_munro:'', corpi_civatte:'',
  saw_toothing:false, assottigliamento_soprapapillare:false, capillari_dilatati_papille:false,
  necrosi_cheratinociti_diffusa:false, eritrociti_extravasati_intraepidermici:false,
  mucina_dermica:'', infiltrato_perianessiale:'', atrofia_epidermica:'', ispessimento_bmz:'',
  sede_bolla:'', acantolisi:'',
  tipo_granuloma:'', necrobiosi:'',
  sede_anatomica:'', note_cliniche:''
};

const PATTERNS = [
  {value:'spongotico',label:'Spongotico',desc:'Edema intercellulare, esocitosi, eczema-like'},
  {value:'psoriasiforme',label:'Psoriasiforme',desc:'Allungamento regolare/irregolare delle creste'},
  {value:'interfaccia_lichenoide',label:'Interfaccia lichenoide',desc:'Infiltrato a banda, danno basale'},
  {value:'interfaccia_vacuolare',label:'Interfaccia vacuolare',desc:'Vacuoli basali, infiltrato meno denso'},
  {value:'perivascolare',label:'Perivascolare',desc:'Infiltrato attorno ai vasi'},
  {value:'perivascolare_eosinofilo',label:'Perivascolare eosinofilo',desc:'Iperergia/puntura/farmaco'},
  {value:'vasculitico',label:'Vasculitico',desc:'Necrosi fibrinoide, leucocitoclasia'},
  {value:'vasculopatico',label:'Vasculopatico',desc:'Trombi senza vera vasculite'},
  {value:'granulomatoso',label:'Granulomatoso',desc:'Granulomi dermici'},
  {value:'granulomatoso_palizzata',label:'Granulomatoso a palizzata',desc:'Necrobiosi + istiociti'},
  {value:'subcorneo',label:'Subcorneo',desc:'Pustole sottocornee'},
  {value:'intraepidermico',label:'Intraepidermico bolloso',desc:'Acantolisi o vescicole intraepidermiche'},
  {value:'subepidermico_bolloso',label:'Subepidermico bolloso',desc:'Bolla sottoepidermica'},
  {value:'interstiziale_eosinofilo',label:'Interstiziale eosinofilo',desc:'Eosinofili interstiziali diffusi'},
  {value:'panniculitico',label:'Panniculitico',desc:'Sottocute prevalente'},
  {value:'mastocitario',label:'Mastocitario',desc:'Infiltrato mastocitario'}
];

const DX = {
  dermatite_allergica_contatto:{
    nome:'Dermatite allergica da contatto', cat:'Spongotico',
    required:['pattern_primario','spongiosi','esocitosi'],
    major:{pattern_primario:'spongotico', spongiosi:['moderata','marcata'], esocitosi:'presente'},
    minor:{eosinofili:['presenti','abbondanti'], infiltrato_distribuzione:'perivascolare_superficiale', spongiosi_proporzionata:'si'},
    against:{linfociti_atipici:'presenti', epidermotropismo:'presente', microascessi_munro:'si'},
    note:'Pattern di dermatite spongiotica. Diagnosi da integrare con sede, esposizione e cronologia clinica.',
    workup:['PAS se dubbio dermatofiti','correlazione clinica/espositiva','evitare diagnosi specifica se quadro aspecifico']
  },
  dermatite_atopica_acuta:{
    nome:'Dermatite atopica, fase acuta', cat:'Spongotico',
    required:['pattern_primario','spongiosi','esocitosi'],
    major:{pattern_primario:'spongotico', spongiosi:['moderata','marcata'], esocitosi:'presente'},
    minor:{eosinofili:['presenti','abbondanti'], paracheratosi:'focale', spongiosi_proporzionata:'si'},
    against:{linfociti_atipici:'presenti', epidermotropismo:'presente', microascessi_munro:'si'},
    note:'Spongiosi proporzionata al danno epidermico: favorisce dermatite rispetto a MF early.',
    workup:['PAS se indicato','correlare con atopia/distribuzione/recidive']
  },
  psoriasi_vulgaris:{
    nome:'Psoriasi vulgaris', cat:'Psoriasiforme',
    required:['pattern_primario','acantosi','paracheratosi','ipogranulosi'],
    major:{pattern_primario:'psoriasiforme', acantosi:'marcata', paracheratosi:['moderata','marcata'], ipogranulosi:'si'},
    minor:{neutrofili:['presenti','abbondanti'], microascessi_munro:'si', assottigliamento_soprapapillare:true, capillari_dilatati_papille:true},
    against:{plasmacellule:'presenti', eosinofili:'abbondanti', spongiosi:'marcata'},
    note:'Richiede architettura psoriasiforme coerente: creste regolari, ipogranulosi, paracheratosi neutrofilica, capillari papillari.',
    workup:['PAS se pattern psoriasiforme atipico','se plasmacellule: escludere sifilide','evitare chiusura se eosinofili marcati/spongiosi dominante']
  },
  lichen_planus:{
    nome:'Lichen planus', cat:'Interfaccia/Lichenoide',
    required:['pattern_primario','infiltrato_distribuzione','vacuolizzazione_basale'],
    major:{pattern_primario:'interfaccia_lichenoide', infiltrato_distribuzione:'banda_lichenoide', vacuolizzazione_basale:'presente'},
    minor:{necrosi_keratinociti:'presente', ipergranulosi:'si', corpi_civatte:'si', saw_toothing:true},
    against:{plasmacellule:'presenti', spongiosi:'marcata'},
    note:'Banda lichenoide vera, danno basale e cheratinociti apoptotici. Se manca la banda, pensare a interfaccia vacuolare/drug/lupus.',
    workup:['DIF se sede/clinica compatibile','considerare lupus/drug reaction se pattern non classico']
  },
  reazione_lichenoide_farmaci:{
    nome:'Reazione lichenoide da farmaci', cat:'Interfaccia/Lichenoide',
    required:['pattern_primario','infiltrato_distribuzione','vacuolizzazione_basale'],
    major:{pattern_primario:'interfaccia_lichenoide', infiltrato_distribuzione:'banda_lichenoide', vacuolizzazione_basale:'presente', eosinofili:['presenti','abbondanti']},
    minor:{necrosi_keratinociti:'presente', paracheratosi:'focale', plasmacellule:['presenti','abbondanti'], corpi_civatte:'si'},
    against:{saw_toothing:true, ipergranulosi:'si'},
    note:'Reazione lichenoide drug-indotta. Distingue dal lichen planus classico per: eosinofili (raramente nel LP), paracheratosi focale (LP è ortocheratosico), plasmacellule possibili, assenza di saw-toothing e ipergranulosi tipici del LP. Distribuzione spesso non orale, esordio temporalmente correlato al farmaco.',
    workup:['anamnesi farmacologica accurata (ACE-inibitori, FANS, antimalarici, statine, beta-bloccanti, anti-TNF)','periodo di latenza farmaco-lesioni (settimane-mesi)','sospensione/switch del farmaco sospetto','DIF di solito negativa o aspecifica','rebiopsy dopo sospensione se persistenza']
  },
  dermatite_seborroica:{
    nome:'Dermatite seborroica', cat:'Spongotico/Psoriasiforme',
    required:['pattern_primario'],
    major:{pattern_primario:['spongotico','psoriasiforme'], infiltrato_distribuzione:'perivascolare_superficiale', paracheratosi:'focale'},
    minor:{spongiosi:['lieve','moderata'], neutrofili:['presenti','abbondanti'], esocitosi:['lieve','presente'], acantosi:['lieve','moderata']},
    against:{infiltrato_distribuzione:'banda_lichenoide', eosinofili:'abbondanti', spongiosi:'marcata', ipogranulosi:'si'},
    note:'Pattern spongotico con spongiosi lieve-moderata e paracheratosi focale (spesso periostiale/follicolare). Neutrofili frequenti nel corneo. La distinzione da psoriasi si basa su spongiosi presente, ipogranulosi assente, acantosi irregolare. Diagnosi fortemente supportata dalla sede (cuoio capelluto, volto, area sternale) e dalla clinica.',
    workup:['PAS se dubbio dermatofiti','correlare con sede anatomica: cuoio capelluto/volto/petto/area sternale','se quadro psoriasiforme pulito con ipogranulosi: escludere psoriasi','se eosinofili prominenti: considerare reazione da farmaci o dermatite atopica']
  },
  micosi_fungoide_early:{
    nome:'Micosi fungoide, fase iniziale', cat:'Linfoma cutaneo T',
    required:['pattern_primario','linfociti_atipici','epidermotropismo'],
    conditionalRequired:[
      {field:'spongiosi_proporzionata', when:d => ['presente','marcato'].includes(d.epidermotropismo)}
    ],
    major:{pattern_primario:['spongotico','interfaccia_lichenoide'], linfociti_atipici:'presenti', epidermotropismo:'presente', spongiosi_proporzionata:'no'},
    minor:{alone_chiaro:'si'},
    against:{spongiosi_proporzionata:'si', eosinofili:'abbondanti', necrosi_keratinociti:'marcata'},
    note:'Da proporre come sospetto morfologico solo se epidermotropismo sproporzionato e linfociti atipici sono documentati. La clinica pesa molto.',
    workup:['CD3/CD4/CD8/CD7/CD5','TOX con cautela','TCR clonality, meglio su più sedi/campioni','integrazione clinica: persistenza, recidiva, distribuzione']
  },
  lupus_eritematoso:{
    nome:'Lupus eritematoso (DLE/SCLE)', cat:'Interfaccia vacuolare',
    required:['pattern_primario','vacuolizzazione_basale'],
    major:{pattern_primario:'interfaccia_vacuolare', vacuolizzazione_basale:'presente', mucina_dermica:'si', infiltrato_perianessiale:'si'},
    minor:{atrofia_epidermica:'si', ispessimento_bmz:'si', plasmacellule:['presenti','abbondanti'], necrosi_keratinociti:'presente', paracheratosi:'focale'},
    against:{microascessi_munro:'si', necrosi_keratinociti:'marcata', eosinofili:'abbondanti', infiltrato_distribuzione:'banda_lichenoide'},
    note:'Interfaccia vacuolare con infiltrato perivascolare e perianessiale, mucina dermica, ispessimento della membrana basale. Distingue da EM/TEN per il pattern perianessiale, la mucina dermica e l\'evoluzione cronica con atrofia. DIF (IgG/IgM/C3 lineare alla BMZ — lupus band test) è dirimente. DLE: più atrofia e follicular plugging; SCLE: meno atrofia, più apoptosi e fotodistribuzione.',
    workup:['DIF: lupus band test (IgG/IgM/C3 alla BMZ)','colorazione Alcian/colloidal iron per quantificare mucina','PAS per ispessimento BMZ','ANA, anti-Ro/SSA (SCLE), anti-La/SSB, anti-dsDNA','correlazione clinica: fotodistribuzione, lesioni discoidi, sintomi sistemici']
  },
  eritema_multiforme:{
    nome:'Eritema multiforme / interfaccia vacuolare', cat:'Interfaccia vacuolare',
    required:['pattern_primario','vacuolizzazione_basale','necrosi_keratinociti'],
    major:{pattern_primario:'interfaccia_vacuolare', vacuolizzazione_basale:'marcata', necrosi_keratinociti:'presente'},
    minor:{corpi_civatte:'si', eosinofili:['presenti','abbondanti'], infiltrato_distribuzione:'perivascolare_superficiale'},
    against:{microascessi_munro:'si', infiltrato_distribuzione:'banda_lichenoide', acantosi:'marcata'},
    note:'Danno vacuolare basale con necrosi cheratinocitaria. Vacuolizzazione marcata + necrosi + corpi di Civatte orientano verso EM/TEN. Distingui da lupus (DIF, distribuzione, clinica) e da reazione lichenoide se l\'infiltrato tende a banda. TEN: valutare estensione della necrosi epidermica.',
    workup:['DIF se sospetto lupus eritematoso','escludere farmaci (causa più frequente di interfaccia vacuolare drug-indotta)','ricerca HSV/Mycoplasma se clinica EM classica','se necrosi epidermica estesa: considerare TEN — conta cheratinociti necrotici vs bulla subepidermica']
  },
  pemfigoide_bolloso:{
    nome:'Pemfigoide bolloso', cat:'Subepidermico bolloso',
    required:['pattern_primario','sede_bolla'],
    major:{pattern_primario:'subepidermico_bolloso', sede_bolla:'subepidermica', eosinofili:['presenti','abbondanti']},
    minor:{infiltrato_distribuzione:'perivascolare_superficiale'},
    against:{acantolisi:'si', neutrofili:'abbondanti'},
    note:'Bolla subepidermica con eosinofili nel derma superficiale e nella bolla, senza acantolisi. Maggiore distensione della bolla con tetto epidermico integro. Differenziale con altre malattie bollose subepidermiche (EBA, pemfigoide gestationis, dermatite erpetiforme con neutrofili).',
    workup:['DIF su cute perilesionale: IgG e C3 lineari alla giunzione dermo-epidermica','salt-split skin: depositi sul tetto della bolla (BMZ epidermica)','autoantigeni circolanti: BP180 (NC16A), BP230','escludere LABD (IgA), EBA (depositi sotto la sublamina densa)']
  },
  pemfigo_volgare:{
    nome:'Pemfigo volgare', cat:'Intraepidermico bolloso',
    required:['pattern_primario','sede_bolla','acantolisi'],
    major:{pattern_primario:'intraepidermico', sede_bolla:'intraepidermica', acantolisi:'si'},
    minor:{infiltrato_distribuzione:'perivascolare_superficiale'},
    against:{eosinofili:'abbondanti', neutrofili:'abbondanti'},
    note:'Acantolisi soprabasale con cheratinociti basali "a lapide" rimasti adesi alla BMZ. Bolla intraepidermica fragile. Infiltrato di solito scarso. Eosinofili possibili ma meno prominenti del pemfigoide. Coinvolgimento mucoso quasi costante (Dsg3 mucoso).',
    workup:['DIF: IgG intercellulari in epidermide ("a rete" / "fish-net")','autoantigeni: desmogleina 3 (mucoso), desmogleina 1 (cute)','IIF su esofago di scimmia','distinguere da Hailey-Hailey (acantolisi a tutti i livelli, no autoanticorpi) e Darier (acantolisi focale, corpi rotondi/grains)']
  },
  granuloma_anulare:{
    nome:'Granuloma anulare', cat:'Granulomatoso a palizzata',
    required:['pattern_primario','tipo_granuloma'],
    major:{pattern_primario:'granulomatoso_palizzata', tipo_granuloma:'a_palizzata', necrobiosi:'si'},
    minor:{mucina_dermica:'si', infiltrato_distribuzione:'interstiziale'},
    against:{plasmacellule:['presenti','abbondanti'], tipo_granuloma:'sarcoide_like'},
    note:'Granulomi a palizzata di istiociti attorno a necrobiosi focale del collagene, con mucina interstiziale. Plasmacellule scarse o assenti (differenza con necrobiosi lipoide). Distribuzione tipica: dorso mani, piedi.',
    workup:['Alcian/colloidal iron per mucina','correlare con sede: dorso mani/piedi (GA classico) vs arto inferiore (NL)','se plasmacellule prominenti: considerare necrobiosi lipoide','escludere GA generalizzato (diabete, dislipidemia) se lesioni multiple']
  },
  necrobiosi_lipoide:{
    nome:'Necrobiosi lipoide', cat:'Granulomatoso a palizzata',
    required:['pattern_primario','tipo_granuloma','necrobiosi'],
    major:{pattern_primario:'granulomatoso_palizzata', tipo_granuloma:'a_palizzata', necrobiosi:'si', plasmacellule:['presenti','abbondanti']},
    minor:{infiltrato_distribuzione:'perivascolare_profondo'},
    against:{tipo_granuloma:'sarcoide_like'},
    note:'Granulomi a palizzata con necrobiosi diffusa "a strati" del collagene che attraversa tutto il derma, plasmacellule prominenti, ispessimento e ialinosi delle pareti vasali. Sede tipica: pretibiale. Forte associazione con diabete mellito.',
    workup:['correlazione clinica: pretibiale, placche giallastre atrofiche','glicemia/HbA1c — fortemente associato a diabete','differenziale con GA: plasmacellule + necrobiosi a strati + sede pretibiale → NL','se ulcerazione: rischio carcinoma squamoso a lungo termine']
  },
  sarcoide_cutaneo:{
    nome:'Sarcoide cutaneo', cat:'Granulomatoso',
    required:['pattern_primario','tipo_granuloma'],
    major:{pattern_primario:'granulomatoso', tipo_granuloma:'sarcoide_like'},
    minor:{infiltrato_distribuzione:'perivascolare_profondo', infiltrato_densita:['lieve','moderata']},
    against:{necrobiosi:'si', plasmacellule:['presenti','abbondanti'], tipo_granuloma:['a_palizzata','tubercolare_caseoso']},
    note:'Granulomi epitelioidi "naked" (poco infiltrato linfocitario perilesionale), non caseificanti, senza necrobiosi. Cellule giganti di Langhans possibili. Differenziale principale con tubercolosi cutanea (caseosi, micobatteri), reazione a corpo estraneo (polariscopia), GA (palizzata + mucina) e NL.',
    workup:['colorazione Ziehl-Neelsen e Fite per micobatteri','polariscopia per materiale rifrangente (corpi estranei)','PAS e Grocott per funghi','correlare con clinica sistemica: ACE, lisozima, calcio, RX torace, EGA, scintigrafia con gallio','differenziale con linfoma cutaneo se infiltrato denso atipico']
  }
};

const RED_FLAGS = [
  {
    flag:'microascessi_munro', label:'Microascessi di Munro', diagnosi:'Psoriasi',
    test:d => d.microascessi_munro === 'si',
    escludi:['dermatite_allergica_contatto','dermatite_atopica_acuta']
  },
  {
    flag:'corpi_civatte', label:'Corpi di Civatte', diagnosi:'Interfaccia lichenoide',
    test:d => d.corpi_civatte === 'si',
    escludi:['psoriasi_vulgaris']
  },
  {
    flag:'plasmacellule_psoriasiforme', label:'Plasmacellule in pattern psoriasiforme', diagnosi:'Escludere sifilide secondaria',
    test:d => d.pattern_primario === 'psoriasiforme' && ['presenti','abbondanti'].includes(d.plasmacellule),
    escludi:['psoriasi_vulgaris']
  },
  {
    flag:'epidermotropismo_alone', label:'Epidermotropismo con alone chiaro', diagnosi:'Sospetto linfoproliferativo T',
    test:d => ['presente','marcato'].includes(d.epidermotropismo) && d.alone_chiaro === 'si',
    escludi:['dermatite_allergica_contatto']
  },
  {
    flag:'spongiosi_proporzionata_mf', label:'Epidermotropismo con spongiosi proporzionata', diagnosi:'Dermatite più probabile di MF',
    test:d => d.spongiosi_proporzionata === 'si' && ['presente','marcato'].includes(d.epidermotropismo),
    escludi:['micosi_fungoide_early']
  },
  {
    flag:'pleva_necrosi_eritrociti', label:'Necrosi cheratinocitaria diffusa + eritrociti intraepidermici', diagnosi:'Considerare PLEVA/Mucha-Habermann',
    test:d => d.necrosi_cheratinociti_diffusa === true && d.eritrociti_extravasati_intraepidermici === true,
    escludi:['micosi_fungoide_early']
  }
];

const findCriterionExpected = (dx, field) => {
  if(dx.major && Object.prototype.hasOwnProperty.call(dx.major,field)) return dx.major[field];
  if(dx.minor && Object.prototype.hasOwnProperty.call(dx.minor,field)) return dx.minor[field];
  return undefined;
};

const Engine = {
  scoreDx:(key,dx,d,flags) => {
    let raw = 0, answeredWeight = 0, totalWeight = 0, matchedCriteria = 0;
    const matched = [], unmatched = [], missing = [], missingRequired = [], failedRequired = [], againstHits = [];

    const addCrit = (field, expected, weight, tier) => {
      totalWeight += weight;
      const actual = d[field];
      if(isUnansweredCriterion(expected, actual)){
        missing.push(field);
        return;
      }
      answeredWeight += weight;
      const hit = matches(field, expected, actual);
      if(hit){
        raw += weight;
        matchedCriteria += 1;
        matched.push({field, expected, actual, tier});
      }else{
        unmatched.push({field, expected, actual, tier});
      }
    };

    Object.entries(dx.major || {}).forEach(([f,e]) => addCrit(f,e,SC.MAJOR,'major'));
    Object.entries(dx.minor || {}).forEach(([f,e]) => addCrit(f,e,SC.MINOR,'minor'));

    (dx.required || []).forEach(field => {
      const actual = d[field];
      const expected = findCriterionExpected(dx,field);
      if(isMissing(actual)) {
        missingRequired.push(field);
      } else if(expected !== undefined && !matches(field,expected,actual)) {
        const rank = ORD[field];
        const isOrdinal = rank && !EXACT_FIELDS.has(field);
        // Ordinali: failedRequired solo se al minimo (assente/assenti).
        // Sub-threshold è penalizzato dallo scoring (unmatched), non bloccante.
        // Categoriali (EXACT_FIELDS): sempre failedRequired se non corrisponde.
        if(!isOrdinal || actual === rank[0]) failedRequired.push(field);
      }
    });

    (dx.conditionalRequired || []).forEach(rule => {
      if(rule.when(d)){
        const actual = d[rule.field];
        if(isMissing(actual)) missingRequired.push(rule.field);
      }
    });

    Object.entries(dx.against || {}).forEach(([field,expected]) => {
      const actual = d[field];
      if(!isMissing(actual) && matches(field,expected,actual)) againstHits.push({field,expected,actual});
    });

    const compatibility = answeredWeight > 0 ? Math.round((raw / answeredWeight) * 100) : 0;
    const completeness = totalWeight > 0 ? Math.round((answeredWeight / totalWeight) * 100) : 0;
    const excludedByFlags = flags.filter(rf => rf.escludi.includes(key));

    let pct = compatibility;
    const lowData = answeredWeight < SC.MIN_ANSWERED_WEIGHT || matchedCriteria < SC.MIN_CRITERIA_FOR_HIGH;
    const requiredProblem = missingRequired.length > 0 || failedRequired.length > 0;

    if(lowData) pct = Math.min(pct,SC.LOW_DATA_CAP);
    if(requiredProblem) pct = Math.min(pct,SC.REQUIRED_CAP);
    if(againstHits.length) pct = Math.max(0,pct - againstHits.length * SC.AGAINST_PENALTY);
    if(excludedByFlags.length) pct = Math.max(5,pct - SC.RED_PENALTY);

    const blocked = pct < SC.THRESH || lowData || requiredProblem || excludedByFlags.length > 0;

    return {
      key,...dx,
      pct, compatibility, completeness, answeredWeight, totalWeight, matchedCriteria,
      matched, unmatched, missing, missingRequired, failedRequired, againstHits, excludedByFlags,
      lowData, requiredProblem, blocked
    };
  },
  calc:(d) => {
    const flags = RED_FLAGS.filter(rf => rf.test(d));
    const scores = Object.entries(DX).map(([key,dx]) => Engine.scoreDx(key,dx,d,flags)).sort((a,b)=>b.pct-a.pct);
    const isPatternSupported = (pattern) => Object.values(DX).some(dx => {
      const exp = dx.major?.pattern_primario;
      return Array.isArray(exp) ? exp.includes(pattern) : exp === pattern;
    });

    const unsupportedPattern = d.pattern_primario && !isPatternSupported(d.pattern_primario);
    const diagnoses = unsupportedPattern ? [] : scores.filter(x => x.pct >= SC.THRESH && !x.blocked);
    const considered = unsupportedPattern ? [] : scores.filter(x => x.pct > 0 && !diagnoses.includes(x)).slice(0,5);
    return {diagnoses, considered, allScores:scores, flags, unsupportedPattern};
  }
};

const buildExportText = (data, res, version='v2.13.0') => {
  const lines = [
    `DERMPATH ${version} — Valutazione morfologica`,
    `Pattern: ${data.pattern_primario || '—'}`,
    data.sede_anatomica ? `Sede: ${data.sede_anatomica}` : null,
    data.note_cliniche ? `Note cliniche: ${data.note_cliniche}` : null,
    '',
  ];
  if(res.flags.length) {
    lines.push('RED FLAGS ATTIVE:');
    res.flags.forEach(f => lines.push(`  ⚠ ${f.label}: ${f.diagnosi}`));
    lines.push('');
  }
  if(res.unsupportedPattern) {
    lines.push('Pattern riconosciuto ma modulo diagnostico non implementato.');
  } else if(res.diagnoses.length) {
    lines.push('DIAGNOSI PROPONIBILI:');
    res.diagnoses.forEach((dx,i) => {
      lines.push(`${i+1}. ${dx.nome} (compatibilità corretta: ${dx.pct}%)`);
      if(dx.matched.length) lines.push(`   Criteri presenti: ${dx.matched.map(c=>labelize(c.field)).join(', ')}`);
      if(dx.workup?.length) { lines.push('   Workup:'); dx.workup.forEach(w=>lines.push(`     – ${w}`)); }
    });
    lines.push('');
  } else {
    lines.push('Nessuna diagnosi proponibile con i dati inseriti.');
    lines.push('');
  }
  if(res.considered.length) {
    lines.push('DA CONSIDERARE (non chiudibili):');
    res.considered.forEach((dx,i) => lines.push(`${i+1}. ${dx.nome} (${dx.pct}%) — ${[...dx.missingRequired,...dx.failedRequired].map(labelize).join(', ') || 'dati insufficienti'}`));
    lines.push('');
  }
  lines.push('---');
  lines.push('Compatibilità euristica corretta. Non sostituisce la valutazione morfologica diretta del preparato istologico.');
  return lines.filter(l=>l!==null).join('\n');
};

// Export per Node (test runner) e browser (script tag).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SC, ORD, EXACT_FIELDS, EXACT_ARRAY_FIELDS, isMissing, isUnansweredCriterion, labelize, matchAtLeast, matches, INIT, PATTERNS, DX, RED_FLAGS, findCriterionExpected, Engine, buildExportText };
}
