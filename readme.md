# 🔬 DermPath - Sistema Diagnostico Pattern-Based

Sistema di supporto decisionale per dermatopatologia basato su approccio pattern recognition (metodo Ackerman modificato).

🌐 **Demo live:** [https://infingardo.github.io/dermatiti/](https://infingardo.github.io/dermatiti/)

## ✨ Caratteristiche

- ✅ **Form guidato in 4 step** intuitivo e facile da usare
- ✅ **10 diagnosi differenziali** evidence-based
- ✅ **Linfomi cutanei** con alert automatici IHC/PCR
- ✅ **Export referto** professionale (.txt)
- ✅ **Interfaccia responsive** (desktop/tablet/mobile)
- ✅ **Terminologia italiana** medica corretta
- ✅ **Bibliografia** per ogni diagnosi

## 🎯 Diagnosi implementate

### Dermatiti Spongiotiche
- Dermatite allergica da contatto (fase acuta)
- Dermatite atopica (fase acuta)

### Dermatiti Psoriasiformi
- Psoriasi vulgaris

### Dermatiti da Interfaccia
- Lichen planus
- Lupus eritematoso cutaneo cronico (discoide)
- Eritema multiforme

### Dermatiti Vasculitiche
- Vasculite leucocitoclastica

### Linfomi Cutanei ⚠️
- Micosi fungoide (early patch/plaque stage)
- Micosi fungoide (tumor stage)
- Linfoma anaplastico cutaneo primitivo (pcALCL)

## 🚀 Uso

### Online
Apri direttamente: **[https://infingardo.github.io/dermatiti/](https://infingardo.github.io/dermatiti/)**

### Locale
```bash
git clone https://github.com/Infingardo/dermatiti.git
cd dermatiti
# Apri index.html nel browser
```

## 📋 Come funziona

1. **Step 1 - Pattern:** Seleziona il pattern architetturale predominante (spongotico, psoriasiforme, interfaccia, ecc.)
2. **Step 2 - Epidermide:** Indica le caratteristiche epidermiche (spongiosi, acantosi, paracheratosi, ecc.)
3. **Step 3 - Infiltrato:** Descrivi l'infiltrato dermico e valuta presenza di linfociti atipici
4. **Step 4 - Finalizza:** Aggiungi sede anatomica e note cliniche
5. **Risultati:** Il sistema genera automaticamente la diagnosi differenziale con percentuali di compatibilità

## ⚠️ Alert Linfomi

Il sistema identifica automaticamente pattern sospetti per linfomi cutanei e fornisce:
- Alert visivi rossi
- Indicazioni per IHC obbligatoria (CD3, CD4, CD8, CD20, CD30, CD7, Ki67)
- Suggerimenti per workup molecolare (PCR TCR/IgH)
- Raccomandazioni per staging

## 📄 Export Referto

Ogni diagnosi può essere esportata come referto testuale (.txt) contenente:
- Pattern architetturale
- Caratteristiche istologiche complete
- Diagnosi differenziale ordinata per probabilità
- Colorazioni/IHC suggerite
- Note e bibliografia

## 🛠️ Tecnologie

- React 18 (standalone)
- Tailwind CSS
- Vanilla JavaScript
- Nessuna dipendenza backend

## 📚 Bibliografia

Ogni diagnosi è supportata da riferimenti bibliografici evidence-based:
- Ackerman AB, 2005 - Spongiotic dermatitis patterns
- Elder DE, 2020 - Atopic dermatitis histology
- Nestle FO, 2009 - Psoriasis histopathology
- Shiohara T, 2012 - Lichen planus histologic criteria
- Willemze R, 2019 - WHO-EORTC classification MF
- E altri...

## ⚖️ Disclaimer

**Questo è uno strumento di supporto decisionale, non sostituisce il giudizio clinico.**

La diagnosi definitiva richiede sempre:
- Correlazione clinico-patologica
- Valutazione del contesto clinico
- Indagini supplementari quando indicate
- Consulenza con colleghi esperti in caso di dubbio

## 📧 Contatti

Per segnalazioni, suggerimenti o contributi, apri una issue su GitHub.

## 📝 Licenza

Uso educativo e professionale. Non per scopi commerciali.

---

**DermPath v1.0** - Pattern-based diagnostic system for inflammatory dermatoses and cutaneous lymphomas
