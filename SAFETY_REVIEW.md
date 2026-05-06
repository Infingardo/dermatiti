# DermPath single-file prototype — safety review

Scope: `index.html` as a single-file dermatopathology diagnostic support prototype. This review intentionally does **not** add diagnoses; it explains what to fix first and how to verify that the prototype remains clinically conservative.


## Cosa fare adesso

Se non è chiaro come usare questa revisione, segui questo ordine:

1. **Non aggiungere nuove diagnosi finché i P0/P1 sono stabili.** Prima verifica che il prototipo non proponga diagnosi quando i dati sono insufficienti o il pattern non è implementato.
2. **Usa i P0 come checklist di accettazione.** Un caso deve passare solo se i required sono presenti/coerenti, i campi nascosti non influenzano il punteggio e le checkbox non selezionate non diventano falsi negativi.
3. **Per un pattern non implementato, fermati.** Il comportamento corretto è mostrare il limite del prototipo, non una diagnosi alternativa generata da criteri non specifici.
4. **Prima del prossimo sviluppo, separa il motore in funzioni testabili.** Solo dopo conviene ampliare il catalogo diagnostico.

### Checklist minima per revisionare una patch

- [ ] Il risultato non viene chiamato “probabilità”.
- [ ] I required mancanti o contrari bloccano la diagnosi proponibile.
- [ ] Le red flag non sono solo testo: devono penalizzare o bloccare diagnosi incompatibili.
- [ ] I campi dipendenti nascosti vengono cancellati o ignorati.
- [ ] I pattern non implementati non mostrano diagnosi “da considerare”.
- [ ] Ogni modifica al motore ha almeno un test/smoke test con input e output atteso.

## Prioritized issues and minimal patches

### P0 — Optional checkbox clues were scored as documented negatives

**Problem.** Boolean minor criteria such as `saw_toothing`, `assottigliamento_soprapapillare`, and `capillari_dilatati_papille` are rendered as plain checkboxes. A default unchecked value (`false`) was treated as an answered, non-matching criterion. Clinically, an unchecked optional clue in this UI is ambiguous: it may mean “not assessed,” not necessarily “absent.” This could dilute compatibility and completeness, creating overconfident-looking negative evidence from missing documentation.

**Minimal patch.** Treat checkbox-only positive criteria (`expected === true` and `actual === false`) as unanswered/missing during criterion scoring, and clarify this behavior in the epidermis step.

### P0 — Stale hidden MF-dependent fields could continue influencing scores

**Problem.** `spongiosi_proporzionata` was hidden unless epidermotropism was present/marcato, but previously entered values could persist after changing epidermotropism to absent/blank. `alone_chiaro` was also available independent of epidermotropism. This allowed hidden or semantically invalid observations to continue contributing to MF-related scoring or red-flag behavior.

**Minimal patch.** When epidermotropism is changed to absent/blank, clear `spongiosi_proporzionata` and `alone_chiaro`; only display both fields when epidermotropism is present/marcato.

### P1 — Unsupported patterns could still show inertia-driven “considered” diagnoses

**Problem.** The app warned that a selected pattern was recognized but not implemented, yet unrelated minor criteria could still populate the “diagnoses to consider, not closable” section. For unsupported pattern modules, this risks implying the prototype has more diagnostic coverage than it does.

**Minimal patch.** If `unsupportedPattern` is true, suppress both proponible diagnoses and “considered” diagnoses.

### P1 — Compatibility score naming remains safer than probability, but should stay prominent

**Problem.** The UI correctly states that percentages are heuristic compatibility, not diagnostic probability. This disclaimer should remain visible because the ranking is a rule-based support aid and does not model pre-test probability, clinical context, sampling quality, ancillary tests, or disease prevalence.

**Minimal patch.** Preserve the interpretive note and avoid changing labels from “compatibilità” to “probabilità.” Future refactoring should separate raw compatibility, safety gates, and final display class more explicitly.

### P2 — Scoring engine mixes evidence collection, gating, penalties, and UI display payload

**Problem.** `scoreDx` currently performs matching, missing-required detection, low-data gating, red-flag exclusion, penalty application, and UI payload assembly in one function. This makes safety-critical changes harder to test.

**Minimal patch.** In a follow-up refactor, split into pure helpers: `collectCriteria`, `evaluateRequired`, `applySafetyGates`, and `formatScoreForUi`. Do this before adding diagnoses.

### P2 — Documentation drift

**Problem.** `README.md` describes a broader v1.9 application and many diagnoses/features that are not implemented in the current single-file prototype. This can mislead users about coverage.

**Minimal patch.** Update README scope/version in a separate documentation-only pass, after deciding whether README should describe the historical project or the current prototype.
