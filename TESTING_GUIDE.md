# Testing Guide: v1.2 vs v1.3 Verification

## 🎯 Obiettivo
Verificare che il refactoring mantiene **100% funzionalità identica** con miglioramenti performance.

---

## 🧪 Test Suite Completo

### 1. FUNCTIONAL TESTS (Risultati identici)

#### Test 1.1: Dermatite Allergica da Contatto Classica
**Input:**
```
Step 1: Pattern = "spongotico"
Step 2:
  - Spongiosi = "marcata"
  - Esocitosi = "presente"
  - Acantosi = "assente"
  - Paracheratosi = "assente"
Step 3:
  - Distribuzione infiltrato = "perivascolare_superficiale"
  - Eosinofili = "abbondanti"
  - Neutrofili = "assenti"
Step 4:
  - Edema dermico = "marcato"
  - Vasculite = "no"
```

**Expected Output (both versions):**
```
1. Dermatite allergica da contatto ≥ 90%
2. Dermatite atopica ~75-80%
Red flags: "Dermatite da contatto" attivato
```

**Verification:**
- [ ] v1.2 score: _____
- [ ] v1.3 score: _____
- [ ] Scores match: YES / NO
- [ ] Red flags match: YES / NO

---

#### Test 1.2: Psoriasi con Microascessi di Munro
**Input:**
```
Step 1: Pattern = "psoriasiforme"
Step 2:
  - Spongiosi = "lieve"
  - Acantosi = "marcata"
  - Paracheratosi = "marcata"
  - Ipogranulosi = "si"
Step 3:
  - Neutrofili = "abbondanti"
Step 4:
  - Microascessi Munro = ✓ (checked)
```

**Expected Output:**
```
1. Psoriasi vulgaris ≥ 95%
Red flags: "Psoriasi" attivato
```

**Verification:**
- [ ] v1.2 score: _____
- [ ] v1.3 score: _____
- [ ] Microascessi red flag: YES / NO (both)

---

#### Test 1.3: Lichen Planus
**Input:**
```
Step 1: Pattern = "interfaccia_lichenoide"
Step 2:
  - Vacuolizzazione basale = "presente"
  - Necrosi cheratinociti = "presente"
  - Ipergranulosi = "si"
Step 3:
  - Distribuzione infiltrato = "banda_lichenoide"
Step 4:
  - Corpi di Civatte = ✓
```

**Expected Output:**
```
1. Lichen planus ≥ 90%
Red flags: "Lichen planus o GVHD" + "Lichen planus" (2 flags)
```

**Verification:**
- [ ] v1.2 score: _____
- [ ] v1.3 score: _____
- [ ] Both red flags: YES / NO

---

#### Test 1.4: Micosi Fungoide Early (Linfoma)
**Input:**
```
Step 1: Pattern = "spongotico"
Step 2:
  - Spongiosi = "moderata"
Step 3:
  - Distribuzione infiltrato = "perivascolare_superficiale"
  - Linfociti atipici = "presenti"
  - Epidermotropismo = "presente"
  - Alone chiaro = ✓
```

**Expected Output:**
```
1. Micosi fungoide (early) ≥ 85%
⚠️ SOSPETTO LINFOMA alert
Red flags: "Linfoma cutaneo" attivato
IHC: CD3, CD4, CD7, etc.
```

**Verification:**
- [ ] v1.2 lymphoma alert: YES / NO
- [ ] v1.3 lymphoma alert: YES / NO
- [ ] Red flag: YES / NO (both)
- [ ] IHC panel shown: YES / NO (both)

---

#### Test 1.5: Granuloma Anulare
**Input:**
```
Step 1: Pattern = "granulomatoso"
Step 3:
  - Distribuzione infiltrato = "derma_medio_profondo"
Step 4:
  - Palisading + necrosi mucinosa = ✓
```

**Expected Output:**
```
1. Granuloma anulare ≥ 85%
Red flags: "Granuloma anulare" attivato
```

**Verification:**
- [ ] v1.2 score: _____
- [ ] v1.3 score: _____
- [ ] Pattern granulomatoso works: YES / NO

---

#### Test 1.6: Pemfigo Volgare (Bolloso)
**Input:**
```
Step 1: Pattern = "intraepidermico"
Step 2:
  - Necrosi cheratinociti = "presente"
Step 4:
  - Acantolisi = ✓
  - Bolle intraepidermiche = ✓
```

**Expected Output:**
```
1. Pemfigo volgare ≥ 90%
Red flags: "Pemfigo volgare - IHC MANDATORIA"
IHC: Desmogleina 3
Sierologia: anticorpi anti-desmogleina
```

**Verification:**
- [ ] v1.2 score: _____
- [ ] v1.3 score: _____
- [ ] IHC mandatory flag: YES / NO
- [ ] Sierologia shown: YES / NO

---

### 2. UI/UX TESTS (Identical behavior)

#### Test 2.1: Navigation
- [ ] Step 1→2→3→4 works fluidly (both versions)
- [ ] Back buttons work (both versions)
- [ ] Step indicator updates correctly (both versions)
- [ ] Can't proceed from Step 1 without selecting pattern (both)

#### Test 2.2: Form Interactions
- [ ] All selects have "Seleziona..." placeholder (both)
- [ ] All selects populate correctly (both)
- [ ] Checkboxes toggle correctly (both)
- [ ] Text inputs accept text (both)

#### Test 2.3: Reset Functionality
- [ ] Reset button shows confirm dialog (both)
- [ ] After reset, all fields cleared (both)
- [ ] After reset, back to Step 1 (both)

#### Test 2.4: Results View
- [ ] "Genera Diagnosi" shows results (both)
- [ ] Can return to form with "← Modifica" (both)
- [ ] Export button generates .txt file (both)
- [ ] Export filename includes timestamp (both)

---

### 3. PERFORMANCE TESTS (v1.3 should be faster)

#### Test 3.1: Re-render Count
**Tool:** React DevTools Profiler

**Steps:**
1. Open DevTools → Profiler
2. Start recording
3. Change "Spongiosi" from "assente" to "marcata"
4. Stop recording

**Expected:**
- v1.2: ~15-20 component re-renders
- v1.3: ~3-6 component re-renders (memo working)

**Results:**
- [ ] v1.2 re-renders: _____
- [ ] v1.3 re-renders: _____
- [ ] v1.3 < v1.2: YES / NO

---

#### Test 3.2: Time to Interactive
**Tool:** Lighthouse / DevTools Performance

**Steps:**
1. Clear cache
2. Hard reload page
3. Measure TTI (Time to Interactive)

**Expected:**
- v1.2: ~150-200ms
- v1.3: ~100-150ms

**Results:**
- [ ] v1.2 TTI: _____
- [ ] v1.3 TTI: _____
- [ ] v1.3 faster: YES / NO

---

#### Test 3.3: Calculation Speed
**Manual timing:**

**Steps:**
1. Fill all fields (same data both versions)
2. Click "Genera Diagnosi"
3. Time from click to results shown

**Expected:**
- v1.2: ~50-80ms
- v1.3: ~30-50ms

**Results:**
- [ ] v1.2 calc time: _____
- [ ] v1.3 calc time: _____
- [ ] v1.3 faster: YES / NO

---

### 4. EDGE CASES

#### Test 4.1: No Pattern Selected
- [ ] v1.2: "Avanti" button disabled on Step 1: YES / NO
- [ ] v1.3: "Avanti" button disabled on Step 1: YES / NO

#### Test 4.2: Minimal Input
**Input:** Only pattern selected, rest empty

**Expected:** Low-confidence diagnoses or "Nessuna diagnosi"

- [ ] v1.2 result: _____
- [ ] v1.3 result: _____
- [ ] Match: YES / NO

#### Test 4.3: All Fields Filled
**Input:** Every single field with data

**Expected:** High-confidence diagnosis(es)

- [ ] v1.2 top diagnosis: _____
- [ ] v1.3 top diagnosis: _____
- [ ] Scores match: YES / NO

#### Test 4.4: Conflicting Data
**Input:**
```
Pattern = "spongotico"
BUT
Acantosi = "marcata" (conflicting)
Paracheratosi = "marcata" (conflicting)
```

**Expected:** Mixed results, no single high score

- [ ] v1.2 behavior: _____
- [ ] v1.3 behavior: _____
- [ ] Both handle gracefully: YES / NO

---

### 5. EXPORT TESTS

#### Test 5.1: Export Content
**Steps:**
1. Complete diagnosis
2. Click "💾 Esporta"
3. Open .txt file

**Verify (both versions):**
- [ ] Date present
- [ ] Pattern listed
- [ ] Epidermide section present
- [ ] Derma section present
- [ ] Diagnosi differenziale list
- [ ] If lymphoma: "⚠️ SOSPETTO LINFOMA"
- [ ] Formatting consistent

#### Test 5.2: Export Filename
**Expected format:** `referto_dermpath_[timestamp].txt`

- [ ] v1.2 filename correct: YES / NO
- [ ] v1.3 filename correct: YES / NO

---

### 6. BROWSER COMPATIBILITY

Test both versions on:

#### Chrome/Edge
- [ ] v1.2 works: YES / NO
- [ ] v1.3 works: YES / NO

#### Firefox
- [ ] v1.2 works: YES / NO
- [ ] v1.3 works: YES / NO

#### Safari
- [ ] v1.2 works: YES / NO
- [ ] v1.3 works: YES / NO

#### Mobile (Chrome Android/Safari iOS)
- [ ] v1.2 responsive: YES / NO
- [ ] v1.3 responsive: YES / NO

---

### 7. CONSOLE CHECKS

Open DevTools Console:

#### v1.2
- [ ] No errors: YES / NO
- [ ] No warnings: YES / NO

#### v1.3
- [ ] No errors: YES / NO
- [ ] No warnings: YES / NO
- [ ] No "missing key" warnings: YES / NO

---

## 📊 Test Results Summary

```
┌──────────────────────────────────────────────────┐
│ Test Category         │ v1.2 Pass │ v1.3 Pass   │
├──────────────────────────────────────────────────┤
│ Functional (6 tests)  │   ___/6   │   ___/6     │
│ UI/UX (4 tests)       │   ___/4   │   ___/4     │
│ Performance (3)       │   ___/3   │   ___/3     │
│ Edge Cases (4)        │   ___/4   │   ___/4     │
│ Export (2)            │   ___/2   │   ___/2     │
│ Browser (4)           │   ___/4   │   ___/4     │
│ Console (2)           │   ___/2   │   ___/2     │
├──────────────────────────────────────────────────┤
│ TOTAL                 │  ___/25   │  ___/25     │
└──────────────────────────────────────────────────┘
```

**Expected:**
- v1.2: 25/25 ✅
- v1.3: 25/25 ✅ (with better performance scores)

---

## 🐛 Known Issues / Notes

### Potential Differences (OK):
1. **Dev console memo warnings** (v1.3): Expected, not a bug
2. **Render count** (v1.3 << v1.2): Expected, this is a feature
3. **File size** (v1.3 slightly larger): Expected, +6KB for structure

### Red Flags to Investigate:
- ❌ Different diagnosis scores (>2% variance)
- ❌ Different red flags activation
- ❌ UI/UX behavior mismatch
- ❌ Export content differences
- ❌ Console errors/warnings in production

---

## 🔬 Advanced Performance Testing (Optional)

### Memory Profiling

**Chrome DevTools → Memory → Take Heap Snapshot**

1. Load page
2. Take snapshot (baseline)
3. Fill all fields
4. Take snapshot (after input)
5. Generate diagnoses
6. Take snapshot (after calculation)

**Compare:**
- v1.2 total heap: _____
- v1.3 total heap: _____
- v1.3 should be ~20-30% smaller

---

### React DevTools Profiler (Deep Dive)

**Flamegraph Analysis:**

1. Start profiling
2. Complete full workflow (Step 1→4, generate)
3. Stop profiling
4. Analyze flamegraph

**v1.2 expected:**
- Wide, deep flamegraph (many nested re-renders)
- DermPathDiagnostic dominates

**v1.3 expected:**
- Narrower flamegraph (fewer components rendering)
- More "skipped by memo" (grey bars)

**Screenshot comparison recommended.**

---

## ✅ Sign-Off Checklist

Before deploying v1.3:

- [ ] All functional tests pass (25/25)
- [ ] Performance improvement verified (re-renders, TTI)
- [ ] Export identical between versions
- [ ] No console errors/warnings
- [ ] Tested on primary browser (Chrome)
- [ ] Tested on mobile
- [ ] Code reviewed (structure makes sense)
- [ ] README/changelog updated

**Approved by:** ____________  
**Date:** ____________  
**Version deployed:** v1.3 / v1.2 (circle one)

---

## 🎓 Educational Note

Questo test suite dimostra:
- **Regression testing**: verificare che refactoring non rompa funzionalità
- **Performance benchmarking**: quantificare miglioramenti
- **A/B comparison**: metodologia scientifica
- **Production readiness**: checklist completa prima deploy

**Usalo come template per futuri refactoring!**

---

## 📝 Quick Test Script (5 min sanity check)

```bash
# Minimal smoke test
1. Open index.html (v1.2)
2. Pattern: spongotico → Spongiosi: marcata → Esocitosi: presente → Eosinofili: abbondanti
3. Genera Diagnosi
4. Note top result: _______________

5. Open index_refactored.html (v1.3)
6. Repeat exact same steps
7. Note top result: _______________

8. Compare: Match? YES / NO

If YES → v1.3 probably OK for deploy
If NO → Debug before deploy
```

---

**Test responsibly. Clinical tool = zero tolerance for errors.**
