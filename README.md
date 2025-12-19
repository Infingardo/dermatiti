# 🔬 DermPath v1.9

**Sistema diagnostico pattern-based per dermatiti infiammatorie e linfomi cutanei**

App web standalone per la diagnosi differenziale istopatologica delle dermatiti, basata su pattern architetturali secondo l'approccio di Ackerman.

🔗 **Live:** [https://infingardo.github.io/dermatiti/](https://infingardo.github.io/dermatiti/)

---

## ✨ Features

### Pattern Supportati
- **Spongotico** - ACD, AD, ICD, Pitiriasi rosea
- **Psoriasiforme** - Psoriasi, Sifilide secondaria, LSC
- **Interfaccia Lichenoide** - Lichen planus, Drug reaction lichenoide
- **Interfaccia Vacuolare** - Lupus (DLE, SCLE), Dermatomiosite, EM
- **Perivascolare/Eosinofilo** - Orticaria, Drug reaction, Wells, Bite, Follicolite eosinofila
- **Vasculitico** - LCV, Vasculite IgA
- **Vasculopatico** - Vasculopatia livedoide, Porpora pigmentaria
- **Granulomatoso** - Sarcoidosi, GA, Necrobiosi lipoidica, Nodulo reumatoide
- **Bolloso** - Pemfigo, Pemfigoide, Dermatite erpetiforme, EBA
- **Panniculitico** - EN, Lupus panniculitis, Panniculite pancreatica, SPTCL, Vasculite nodulare
- **Mastocitario** - Mastocitosi cutanea

### Sistema Diagnostico
- **Scoring pesato**: criteri maggiori (×3) e minori (×1)
- **Red flags automatici**: esclusione diagnosi incompatibili
- **Alert linfomi**: identificazione pattern sospetti (MF, SPTCL)
- **Pannello IHC dinamico**: suggerimenti mirati per DD equivoche

### Marcatori IHC Integrati
| Marcatore | Indicazione | Sens/Spec |
|-----------|-------------|-----------|
| PCR TCR dual-site | MF vs dermatite | 82.6%/95.7% |
| DIF Lupus Band | Lupus cutaneo | 71-84%/>90% |
| MxA | Lupus/DM vs altri | 85-95%/>90% |
| CD123 clusters | Lupus vs MF | 70-80%/>90% |
| Ki-67 soprabasale | Psoriasi vs eczema | ~83%/~70% |
| IL-36γ | Psoriasi vs altri | alta/alta |
| BP180 ELISA | Pemfigoide | 82-90%/94% |
| CD117/CD25 | Mastocitosi | >95%/>95% |

---

## 🚀 Utilizzo

### Workflow in 4 Step

1. **Pattern** - Seleziona pattern architetturale predominante + fase lesione
2. **Epidermide** - Caratteristiche epidermiche e clues morfologici
3. **Derma** - Infiltrato, composizione cellulare, pattern speciali
4. **Speciali** - Sospetto linfoma, marcatori IHC, contesto clinico

### Output
- Diagnosi differenziale ranked per % compatibilità
- Red flags con diagnosi escluse
- Colorazioni/IHC suggerite per conferma
- Bibliografia con PMID per ogni diagnosi
- Export referto (.txt)

---

## 📋 Changelog

### v1.9 (Dicembre 2024)
**+8 nuove diagnosi:**
- Pitiriasi rosea (paracheratosi "a tumuli", infiltrato "a manicotto")
- Dermatite irritativa (ICD) - necrosi cheratinociti superficiali
- Dermatomiosite - vacuolare + mucina + MxA+
- Vasculopatia livedoide - trombi senza leucocitoclasia
- Porpora pigmentaria cronica
- Panniculite pancreatica - ghost cells
- Necrobiosi lipoidica - pattern "sandwich"
- Mastocitosi cutanea - CD117/CD25

**Nuovi marcatori:**
- MxA (firma IFN tipo I)
- CD123 clusters vs sparso
- IL-36γ
- Pannello mastocitosi

**Nuovi clues:**
- Vasculite vs vasculopatia (leucocitoclasia)
- Ghost cells panniculite
- Follicoli germinativi (lupus panniculitis)

### v1.8
- Panniculiti complete (EN, Lupus, SPTCL, Vasculite nodulare)
- Sistema pannello IHC psoriasi vs spongotico
- Fase lesione (acuta/subacuta/cronica)

### v1.7
- Pattern eosinofilo completo (Wells, Bite, Drug, Follicolite)
- Prurigo nodularis
- Clues morfologici espansi

### v1.6
- Malattie bollose (Pemfigo, Pemfigoide, DH)
- Granulomatosi (Sarcoidosi, GA)
- Performance IHC con sensibilità/specificità

### v1.5
- Alert linfomi automatico
- Sifilide secondaria
- Red flags system

---

## 🛠️ Tecnologie

- React 18 (standalone via CDN)
- CSS inline (zero dipendenze esterne)
- Vanilla JavaScript
- Single-file HTML (~60KB)

---

## 📚 Bibliografia Principale

Ogni diagnosi include riferimenti PMID. Fonti principali:

- Willemze R et al. WHO-EORTC classification. *Blood* 2019
- Armstrong AW et al. Psoriasis. *JAMA* 2020
- Weidinger S et al. Atopic Dermatitis. *Lancet* 2016
- Requena L et al. Panniculitis I-II. *JAAD* 2001
- Joly P et al. Pemphigus guidelines. *JEADV* 2020
- Schmidt E et al. Pemphigoid. *J Invest Dermatol* 2016
- Valent P et al. Mastocytosis WHO. *Blood* 2017

---

## ⚠️ Disclaimer

**Strumento di supporto decisionale - NON sostituisce il giudizio clinico.**

La diagnosi definitiva richiede sempre:
- Correlazione clinico-patologica
- Valutazione morfologica diretta
- Indagini supplementari quando indicate
- Consulenza con colleghi esperti in caso di dubbio

---

## 📝 Licenza

Uso educativo e professionale. Non per scopi commerciali.

---

**DermPath v1.9** - Pattern-based diagnostic system for inflammatory dermatoses
