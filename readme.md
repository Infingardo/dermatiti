# DermPath Dermatiti - v1.0 → v1.1 Refactoring

## 🎯 Obiettivo
Trasformare il tool da **matching rigido** a **system di ragionamento clinico** con soft scoring, red flags discriminanti e migliore granularità diagnostica.

---

## ✅ Cambiamenti Implementati

### 1. **Scoring System - Soft Matching con Tolleranza -10%**
**Prima:** Match rigoroso (sì/no, 0 o 3 punti)  
**Dopo:** Tolleranza per valori prossimi (es. "moderata" vs "marcata" = -10% penalty)

```javascript
// Soft matching example
if (criterio === "spongiosi" && valoreCorrente === "moderata" && valoreAtteso.includes("marcata")) {
    score += 2.7; // 3 * 0.9 (penalty -10%)
}
```

**Effetto clinico:** Due dermatiti acute con pattern quasi identico ma spongiosi leggermente diversa vengono entrambe considerate, non escluse.

---

### 2. **Threshold Rialzato: 40% → 50%**
**Razionale:** Evitare diagnosi spurie da matching parziale su un solo criterio.

| Threshold | Comportamento |
|-----------|---------------|
| 40% | Troppo permissivo, genera molto rumore |
| 50% | Richiede ~50% dei criteri, buon equilibrio |

---

### 3. **Sistema Red Flags Discriminanti**
**8 red flags implementati** che suggeriscono diagnosi forti o esclusioni:

| Red Flag | Diagnosi Suggerita | Escludi Da |
|----------|-------------------|-----------|
| Microascessi di Munro | **Psoriasi** | Dermatiti semplici |
| Infiltrato a banda (lichenoide) | **Lichen planus / GVHD** | Spongotico acuto |
| Corpi di Civatte | **Lichen planus** | Psoriasi, dermatiti |
| Eosinofili abbondanti + edema | **Dermatite da contatto** | Atopica cronica, psoriasi |
| Pustole subcornee + neutrofili | **Pustolosi subcornea** | Psoriasi, dermatiti |
| Palisading + necrosi mucinosa | **Granuloma anulare** | Infiammazioni superficiali |
| Spongiosi + microvescicole | **Eczema acuto** | Pattern cronici |
| Epidermotropismo + alone chiaro | **Linfoma cutaneo** | Dermatiti, lichen |

**Effetto:**
- Red flags NON escludono (mantieni 5% score minimo)
- Penalità di -25 punti sui risultati non supportati dal flag
- Visualizzazione separata nei risultati

---

### 4. **Nuova Diagnosi: Granuloma Anulare**
**Pattern:** Granulomatoso (nuovo)  
**Criteri maggiori:**
- Pattern primario: granulomatoso
- Palisading + necrosi mucinosa
- Infiltrato: derma medio-profondo

**Criteri minori:**
- Necrosi collagenosa
- Mucina dermica

**Fondamento:** Clinica frequente, pattern architetturale distintivo (palisading), merita posizionamento sistematico.

---

### 5. **Miglioramento Granularità Step 2-3**

#### Step 2 (Epidermide) - Già granulare ✅

#### Step 3 (Infiltrato) - Nuove opzioni:
- **Edema dermico:** assente/lieve/moderato/marcato (era assente)
- **Red flags checkbox:**
  - Palisading + necrosi mucinosa
  - Microvescicole intraepidermiche
  - Corpi di Civatte
- **Pattern primario:**
  - Aggiunto: "Granulomatoso" (per Granuloma anulare)
  - Aggiunto: "Subcorneo" (per Pustolosi subcornea)

---

### 6. **Normalizzazione Tipi Dato**
**Prima:** Mix di string e boolean per lo stesso criterio (Inconsistente)

```javascript
// Inconsistenza v1.0
psoriasi.ipogranulosi: "si"           // string
micosi_fungoide.cd30_positivi: true   // boolean
```

**Dopo:** Coerenza - array dove necessario, boolean per flag, string per valori

---

### 7. **Nuovi Campi nello State**
```javascript
edema_dermico: '',
palisading_necrosi_mucina: false,
necrosi_collagenosa: '',
mucina_dermica: '',
microvescicole: false,
corpi_civatte: false
```

---

### 8. **UI/UX Miglioramenti**

#### Alert Red Flags
Sezione gialla separata nei risultati con:
- Lista dei flag attivati
- Spiegazione: "Questi pattern forti suggeriscono specifici workup"

#### Disclaimer Potenziato
```
💡 Nota importante: Diagnosi differenziale pattern-based.
La diagnosi definitiva richiede SEMPRE correlazione clinico-patologica.
Strumento di supporto al ragionamento, non sostitutivo.
In caso di dubbio, consultare esperti.
```

---

## 📊 Impatto Clinico Previsto

### Scenario: Paziente con biopsia spongotica + moderata esocitosi

| Version | Diagnosi Top-3 | Problema | Miglioramento |
|---------|----------------|---------|---------------|
| **v1.0** | DA 95%, Atop 85%, Eczema 45% | Difficile distinguere |  - |
| **v1.1** | DA 90%, Atop 87%, Eczema 55%** | Soft match tollera variazioni, threshold esclude rumore | ✅ |

*Score relativo, scopo esemplificativo

### Scenario: Pattern bandiforme + necrosi keratinocitaria

| Version | Risultato |
|---------|-----------|
| **v1.0** | Lichen OK, ma non evidenzia rischio GVHD |
| **v1.1** | Red flag attivato: "Infiltrato a banda → Consider GVHD" |  ✅ |

---

## 🔧 Testing Consigliato

### Test 1: Dermatite allergica acuta
- Pattern: Spongotico
- Spongiosi: Marcata
- Esocitosi: Presente
- Eosinofili: Abbondanti
- **Atteso:** DA ~95%, Atop ~75%

### Test 2: Lichen planus
- Pattern: Interfaccia lichenoide
- Infiltrato: Banda lichenoide
- Necrosi: Presente
- Corpi civatte: ✓ (checkbox)
- **Atteso:** LP ~95%, red flag attivato

### Test 3: Granuloma anulare
- Pattern: Granulomatoso (NUOVO)
- Palisading: ✓ (checkbox)
- **Atteso:** Granuloma anulare ~85%

### Test 4: Psoriasi con Munro
- Pattern: Psoriasiforme
- Spongiosi: Lieve
- Neutrofili: Abbondanti
- Microascessi Munro: ✓
- **Atteso:** Psoriasi ~95%, red flag: "Psoriasi"

---

## 📝 Note per l'Uso

1. **Red flags non sono esclusioni**, solo indicatori forti—mantengono il tool inclusivo
2. **Threshold 50%** riduce risultati spurii ma rimane clinicamente ragionevole
3. **Soft matching** rende il sistema meno fragile su piccole variazioni
4. **Granuloma anulare** colma un gap diagnostico frequente
5. **Disclaimer potenziato** sottolinea che è strumento, non sostituto

---

## 🚀 Prossimi Step (Future Versions)

- [ ] Integrazione dati clinici (sede, durata, prurito) per rifiniture
- [ ] Sezione "why this diagnosis" per ogni risultato
- [ ] Database bibliografico espandibile
- [ ] Versione mobile-first responsive (già Tailwind-ready)
- [ ] Quiz integration (come da tuo schema dashboard)
- [ ] Export referto arricchito con IHC panel predefiniti

---

## 🎓 Educational Value

Questo tool adesso insegna:
1. **Pattern recognition sistematico** (Ackerman-style)
2. **Discriminant features** (cosa distingue le entità)
3. **Workup decisionale** (quale IHC per quale sospetto)
4. **Humility** (disclaimer forte, mai certezza assoluta)

Perfetto per residents e colleghi giovani.

---

---

## 🆕 AGGIORNAMENTO v1.2: LESIONI BOLLOSE

### Diagnosi aggiunte

1. **Pemfigo volgare** (Bolloso Intraepidermico)
   - Pattern: intraepidermico (acantolisi)
   - Criteri: bolle intraepidermiche + perdita aderenze cheratinocitarie
   - IHC: Desmogleina 3 ± Desmogleina 1 (se mucosa)
   - Sierologia: Anticorpi anti-desmogleina (GOLD STANDARD)
   - Red flag: **IHC OBBLIGATORIA**

2. **Dermatite erpetiforme** (Bolloso Subcorneo)
   - Pattern: subcorneo con neutrofili
   - Criteri: pustole subcornee + infiltrato neutrofilo + spongiosi lieve
   - H&E: supportivo ma aspecifico
   - **IF: IgA LINEARE giunzione dermo-epidermica (DIAGNOSTICO)**
   - Clinica: Lesioni vescicolari pruriginose, associata a celiachia
   - Red flag: **IF OBBLIGATORIA**

3. **Pemfigoide bolloso** (Bolloso Subepidermico)
   - Pattern: subepidermico, epidermide intatta sopra
   - Criteri: bolle subepidermiche + infiltrato eosinofilo/neutrofilo
   - H&E: supportivo, infiltrato alla giunzione
   - **IF: IgG + C3 LINEARI sulla membrana basale (GOLD STANDARD)**
   - Clinica: Bolle tense, clinicamente distinguibile da pemfigo
   - Red flag: **IF OBBLIGATORIA**

### Cambiamenti

- **Step 1:** Aggiunti pattern "intraepidermico (acantolisi)" e "subepidermico bolloso"
- **Step 3:** Nuovi checkbox rossi per:
  - Acantolisi → Pemfigo
  - Bolle intraepidermiche → Pemfigo
  - Pustole subcornee + neutrofili → DHe
- **Red flags:** 2 nuovi flag per identificare lesioni bollose con workup obbligatorio
- **State:** 4 nuovi campi (acantolisi, bolle_intraepidermiche, bolle_subepidermiche, infiltrato_neutrofili_pustole)

### Testing Lesioni Bollose

**Test: Pemfigo volgare**
- Pattern: Intraepidermico
- Acantolisi: ✓
- Bolle intraepidermiche: ✓
- Atteso: Pemfigo ~95%, red flag "Pemfigo - IHC MANDATORIA"

**Test: Dermatite erpetiforme**
- Pattern: Subcorneo
- Infiltrato neutrofili pustole: ✓
- Spongiosi: Lieve o moderata (non marcata!)
- Atteso: DHe ~85-90%, red flag "DHe - IF MANDATORIA"

**Test: Pemfigoide bolloso**
- Pattern: Subepidermico bolloso
- Bolle subepidermiche: ✓
- Eosinofili: Presenti o abbondanti
- Atteso: Pemfigoide ~90%, red flag "Pemfigoide - IF MANDATORIA"

### Note Cliniche

- Pemfigo: **Sierologia è diagnostica** (anticorpi anti-desmogleina)—IHC conferma ma non è gold standard
- Pemfigoide: **IF è gold standard** (IgG + C3 lineari)—H&E è supportivo, non diagnostico
- DHe: **IF è gold standard** (IgA lineari)—H&E può essere vago, ma granuli IgA lineari sono patognomonici
- Entrambi hanno associazioni importanti (DHe ↔ celiachia, Pemfigoide ↔ malignità in anziani)
- **Differenza chiave H&E:**
  - Pemfigo: **DENTRO** l'epidermide (intraepidermico)
  - Pemfigoide: **SOTTO** l'epidermide (subepidermico, epidermide intatta sopra)

---
