# DermPath v2.10.1

Tool di supporto diagnostico per dermatopatologia. Single-file HTML/JS (React + Babel standalone), zero dipendenze esterne, funzionante offline. Non sostituisce il giudizio morfologico del patologo.

---

## Utilizzo

Aprire `index_v2.10.1.html` in qualsiasi browser moderno. Nessuna installazione, nessun server.

---

## Modalità

| Modalità | Campi | Indicata per |
|----------|-------|--------------|
| **Rapida** | Subset essenziali (~15 campi) | Screening rapido, pattern comune |
| **Completa** | ~60 campi, 4 step | Analisi sistematica, DD difficili |

> In modalità rapida le percentuali sono più sensibili al numero ridotto di criteri inseriti — variabilità fisiologica del denominatore ridotto.

---

## Pattern supportati

| Pattern | Diagnosi incluse |
|---------|-----------------|
| **Spongotico** | DAC, Dermatite atopica acuta, ICD, Pitiriasi rosea |
| **Psoriasiforme** | Psoriasi vulgaris, Sifilide secondaria, LSC |
| **Interfaccia lichenoide** | Lichen planus, PLEVA |
| **Interfaccia vacuolare** | LED, LECS, Dermatomiosite, Eritema multiforme |
| **Vasculitico / Vasculopatico** | LCV, Vasculopatia livedoide |
| **Eosinofilo** | Reazione da puntura, Wells, Drug eosinofila, Orticaria, Prurigo nodularis, Follicolite eosinofila |
| **Linfoma cutaneo T** | MF early |
| **Granulomatoso** | GA, Necrobiosi lipoidica, Sarcoidosi cutanea |
| **Bolloso** | Pemfigo volgare, Pemfigoide bolloso, Dermatite erpetiforme |
| **Panniculitico** | EN, Lupus panniculitis, Panniculite pancreatica, SPTCL, Vasculite nodulare |
| **Mastocitario** | Mastocitosi cutanea |

---

## Motore di scoring

### Pesi

```
MAJOR  = 3 pt
MINOR  = 1 pt
THRESH = 50%   (soglia diagnosi "alta confidenza")
lowConf = 30–49% (mostrate sempre come "Altri differenziali rilevanti")
RED_PENALTY = −25 pt (flag escludente attivo)
MIN_EXCL    = 5%  (floor per diagnosi penalizzata)
MF_SPONG_PENALTY = −15 pt (spongiosi proporzionata con epidermotropismo)
```

### Denominatore adattivo

Il denominatore include **solo i criteri effettivamente valutati**. I campi non compilati escono dal calcolo.

Tre categorie di campo:

| Tipo | Valore non valutato | Nel denominatore? |
|------|--------------------|--------------------|
| Select (stringa) | `''` | No |
| Tri-state (TS) | `''` | No |
| Boolean (checkbox) | `false` | Sì — semanticamente "assente" è esplicito |

### Monotonia ordinale (`matchAtLeast`)

Per i campi con scala intensità, un valore più forte soddisfa un criterio più debole:

> "marcato" soddisfa "presente"; "abbondanti" soddisfa "presenti"

Campi con ranking ordinale esplicito (`ORD`):

`epidermotropismo` · `linfociti_atipici` · `necrosi_keratinociti` · `plasmacellule` · `spongiosi` · `esocitosi` · `neutrofili` · `eosinofili` · `vacuolizzazione_basale` · `acantosi` · `paracheratosi` · `mucina_dermica` · `eritrociti_extravasati` · `edema_dermico`

### Range chiuso (`EXACT_ARRAY_FIELDS`)

Per alcuni campi un array nei criteri è `oneOf`, non `atLeast(min)`. Un valore fuori range **non** soddisfa il criterio:

- `spongiosi` — es. `["lieve","moderata"]` non accetta "marcata" (PR, PLEVA)
- `paracheratosi` — es. `["focale","moderata"]` non accetta "marcata"
- `neutrofili` — es. `["rari","presenti"]` non accetta "abbondanti" (ICD)

---

## Red flags

Meccanismo che penalizza diagnosi incompatibili con combinazioni morfologiche specifiche. Esempi:

| Flag | Trigger | Penalizza |
|------|---------|-----------|
| `epidermotropismo_alone` | epidermotropismo ≥ presente + alone chiaro | DAC |
| `spongiosi_proporzionata_mf` | spongiosi "si" + epidermotropismo ≥ presente | MF early |
| `mxa_cd123_lupus` | MxA+ o CD123 clusters | (nessuna esclusione — solo boost contestuale) |
| `trombi_no_lcv` | trombi fibrina + leucocitoclasia === 'no' (esplicito) | Vasculite vera |
| `flame_figures_eosinofili` | flame figures + eosinofili abbondanti | Reazione da puntura |
| `pleva_necrosi_eritrociti` | necrosi cheratinociti diffusa + eritrociti intraepidermici | MF early |

> `trombi_no_lcv` richiede leucocitoclasia === `'no'` **esplicito**. Il tri-state vuoto (`''`) non attiva il flag — non valutato ≠ assente.

---

## Pannello IHC psoriasi vs spongotico

Appare quando psoriasi e almeno un competitor spongiotic (DAC, DA, LSC) hanno entrambi score ≥ 30% con gap < 25 punti. Basato su tutti gli score (`allScores`), non solo sulle diagnosi alte.

Marcatori: Ki-67 · p53 · CD34 · IL-36γ  
Fonte: Canavese M et al. *JAAD* 2025.

---

## Alert clinici

Attivati su `diagnoses + lowConf` — un sospetto a 48% non scompare:

- 🔴 **Sospetto linfoma** — IHC: CD3, CD4, CD8, CD7, TOX | PCR TCR
- 🔍 **Pattern panniculitico** — rimming + atipia + emofagocitosi + fenotipo T citotossico → aumentare sospetto SPTCL; rimming da solo non discrimina da LEP
- 🔶 **Pattern eosinofilo** — flame figures: suggestive per Wells, non specifiche (artropod reactions, EGPA)

---

## Note scientifiche rilevanti

**SPTCL vs LEP**  
Il rimming adipocitario è un reperto *supportivo*, non discriminante da LEP da solo. Correlare con: atipia citologica, emofagocitosi, fenotipo T citotossico (CD8+, TIA-1+, granzyme B+), Ki-67 focale, CD123 (plasmocitoidi dendritiche). Rif.: Magro 2021, *J Cutan Pathol*.

**Flame figures**  
Suggestive per Wells nel contesto clinico, non patognomoniche. Presenti anche in artropod reactions e EGPA.

**PCR TCR dual-site**  
Sensibilità 82.6%, specificità 95.7% in setting selezionato dual-site. Resa variabile per metodo, tessuto e pretest probability. Clonalità ≠ malignità (PLEVA, PLC, dermatiti croniche).

**MxA / CD123**  
Utili come supporto per CLE/DM, non come interruttori on/off per escludere MF. Il tool non penalizza MF automaticamente su questi marcatori.

**IL-36γ IHC**  
Alta specificità per psoriasi vs spongotico in biopsia routinaria. Rif.: Canavese M et al. *JAAD* 2025.

---

## Export

Tasto **Esporta referto** → file `.txt` con:
- Pattern primario e varianti
- Warning rimming / sifilide se attivi
- Diagnosi alte con % e nota
- Altri differenziali rilevanti (lowConf, sempre inclusi)
- Hints di pattern se nessuna diagnosi alta
- Pannello IHC se DD equivoca

---

## Struttura tecnica

```
index_v2.10.1.html
├── CSS inline (custom + classi Tailwind essenziali)
├── React 18 UMD + Babel standalone
├── Dati (INIT, PATTERNS, DX, RED_FLAGS, IHC_*)
├── Engine (calcScore, scorePat, calc, needsIHCPanel, hints)
├── Componenti UI (Sel, Chk, TS, DxCard, LowCard, HintsBox, IHCBox, IHCPanel)
└── App (useForm, useData, Step1–4, QuickForm, Results)
```

Componente **TS** (tri-state): `Sì | No | —`  
Il pulsante `—` imposta il campo a `''` → esce dal denominatore.

---

## Disclaimer

Tool di supporto diagnostico per uso interno. La compatibilità istologica calcolata **non equivale a probabilità clinica**. La diagnosi dermatopatologica richiede integrazione di morfologia, immunoistochimica, clinica e, dove indicato, biologia molecolare. Il vetrino decide, non il form.

---

## Changelog sintetico

| Versione | Intervento principale |
|----------|-----------------------|
| 2.3 | Fix CSS, rimming→minor, flame figures, export |
| 2.4 | Denominatore adattivo (campi stringa `''` esclusi), MxA non esclude MF |
| 2.5 | Tri-state 22 criteri morfologici critici, `needsIHCPanel` su `allScores` |
| 2.6 | Export rimming `==='si'`, `trombi_no_lcv` coerente tri-state, TS +4 IHC |
| 2.7 | `matchAtLeast` + `ORD` 14 campi ordinali, alert su `dx+lowConf` |
| 2.8 | `EXACT_ARRAY_FIELDS` (oneOf vs atLeast), `esocitosi` in ORD, peso denominatore in card |
| 2.9 | Badge CSS ripristinato, `lowConf` sempre visibile ed esportato, `neutrofili` in EXACT |
| 2.9.1 | Fix regressione `HintsBox` con `dx=0` e `lowConf>0` |
| 2.10 | 5 booleani irraggiungibili → TS esposti in UI, fantasma `drug_reaction_lichenoide` rimosso, hints in export, versioning coerente |
| 2.10.1 | Fix duplicato `necrosi_epidermica_focale` in INIT (boolean sovrascriveva tri-state) |
