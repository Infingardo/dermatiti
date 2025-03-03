// =======================
// 1. CONFIGURAZIONE PARAMETRI
// =======================
const parametriConfig = {
  spongiosi: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Diffusa" }
    ],
    peso: 1.5
  },
  esocitosi: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Imponente" }
    ],
    peso: 1.2
  },
  infiltrato: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Perivascolare superficiale" },
      { value: 2, text: "2 - Perivascolare superficiale e profondo" },
      { value: 3, text: "3 - A banda lichenoide (con o senza vacuoli), interstiziale, o follicolare" }
    ],
    peso: 1.5
  },
  eosinofili: {
    options: [
      { value: 0, text: "0 - Assenti" },
      { value: 1, text: "1 - Rari" },
      { value: 2, text: "2 - Presenti" },
      { value: 3, text: "3 - Abbondanti" }
    ],
    peso: 1.3
  },
  neutrofili: {
    options: [
      { value: 0, text: "0 - Assenti" },
      { value: 1, text: "1 - Rari" },
      { value: 2, text: "2 - Presenti" },
      { value: 3, text: "3 - Abbondanti (anche in microascessi)" }
    ],
    peso: 1.4
  },
  paracheratosi: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve (focale)" },
      { value: 2, text: "2 - Moderata (a lamelle)" },
      { value: 3, text: "3 - Marcata" }
    ],
    peso: 1.2
  },
  acantosi: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Marcata, iperplasia psoriasiforme" }
    ],
    peso: 1.1
  },
  atrofia: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Marcata" }
    ],
    peso: 1.0
  },
  pigmento: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Marcata (incontinentia pigmenti)" }
    ],
    peso: 0.8
  },
  mucina: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Marcata" }
    ],
    peso: 0.9
  },
  ulcerazione: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve (erosioni superficiali)" },
      { value: 2, text: "2 - Moderata" },
      { value: 3, text: "3 - Ulcere profonde" }
    ],
    peso: 1.4
  },
  distribuzione: {
    options: [
      { value: 0, text: "0 - Lesione singola" },
      { value: 1, text: "1 - Lesioni multiple in una singola area" },
      { value: 2, text: "2 - Lesioni multiple in più aree" },
      { value: 3, text: "3 - Lesioni diffuse su tutto il corpo" }
    ],
    peso: 1.1
  },
  prurito: {
    options: [
      { value: 0, text: "0 - Assente" },
      { value: 1, text: "1 - Lieve" },
      { value: 2, text: "2 - Moderato" },
      { value: 3, text: "3 - Intenso" }
    ],
    peso: 1.0
  },
  velocita: {
    options: [
      { value: 0, text: "0 - Lenta e progressiva" },
      { value: 1, text: "1 - Subacuta" },
      { value: 2, text: "2 - Acuta" },
      { value: 3, text: "3 - Molto rapida (ore o pochi giorni)" }
    ],
    peso: 1.2
  }
};

// =======================
// 2. PATTERN DIAGNOSI ESISTENTI
// =======================
const patternDiagnosi = {
  "Dermatite seborroica": {
    paracheratosi: [1, 2, 3],
    spongiosi: [0, 1],
    neutrofili: [0, 1],
    distribuzione: [1, 2]
  },
  "Dermatite atopica": {
    spongiosi: [1, 2, 3],
    esocitosi: [1, 2],
    infiltrato: [1, 2],
    prurito: [2, 3]
  },
  "Psoriasi": {
    paracheratosi: [2, 3],
    acantosi: [2, 3],
    neutrofili: [2, 3],
    spongiosi: [0, 1]
  },
  "Eczema da contatto": {
    spongiosi: [2, 3],
    esocitosi: [2, 3],
    infiltrato: [1, 2],
    prurito: [2, 3]
  },
  "Lichen planus": {
    infiltrato: [3],
    acantosi: [1, 2],
    pigmento: [2, 3],
    prurito: [1, 2, 3]
  },
  "Pemfigo": {
    esocitosi: [3],
    infiltrato: [2, 3],
    neutrofili: [2, 3],
    ulcerazione: [2, 3]
  },
  "Micosi fungoide": {
    infiltrato: [2, 3],
    esocitosi: [2, 3],
    acantosi: [1, 2],
    distribuzione: [2, 3]
  }
};

// =======================
// 3. NUOVE REGOLE DI BRANCHING
//    (Condizioni specifiche extra)
// =======================
const branchingRules = [
  {
    descrizione: "Spongiosi ≥2 e Eosinofili ≥2",
    condition: (vals) => vals.spongiosi >= 2 && vals.eosinofili >= 2,
    diagnoses: ["Dermatite Atopica (fase attiva)", "Eczema da Contatto (molto probabile)"]
  },
  {
    descrizione: "Neutrofili ≥3 e Paracheratosi ≥2",
    condition: (vals) => vals.neutrofili >= 3 && vals.paracheratosi >= 2,
    diagnoses: ["Psoriasi (possibile) - valutare PAS per escludere Tinea"]
  },
  {
    descrizione: "Infiltrato a banda (lichenoide =3) ed Eosinofili=0",
    condition: (vals) => vals.infiltrato === 3 && vals.eosinofili === 0,
    diagnoses: ["Lichen Planus classico"]
  },
  {
    descrizione: "Spongiosi ≥2 e velocità=3 (Molto rapida)",
    condition: (vals) => vals.spongiosi >= 2 && vals.velocita === 3,
    diagnoses: ["Eritema multiforme (valutare cause infettive o farmaci)"]
  },
  {
    descrizione: "Mucina≥2 e Atrofia≥2",
    condition: (vals) => vals.mucina >=2 && vals.atrofia >=2,
    diagnoses: ["Lupus eritematoso cutaneo (valutare immunofluorescenza)"]
  }
];

// =======================
// 4. CREAZIONE DINAMICA DEI PARAMETRI
// =======================
function creaParametri() {
  const container = document.getElementById('params');
  container.innerHTML = ''; // pulisce prima di ricreare

  const grid = document.createElement('div');
  grid.className = "param-grid";
  container.appendChild(grid);

  for (let parametro in parametriConfig) {
    const groupDiv = document.createElement('div');
    groupDiv.className = "param-group";

    const label = document.createElement('label');
    label.htmlFor = parametro;
    label.textContent = capitalizeFirstLetter(parametro) + ": ";
    label.title = `Peso: ${parametriConfig[parametro].peso}`;
    groupDiv.appendChild(label);

    const select = document.createElement('select');
    select.id = parametro;
    select.name = parametro;
    
    parametriConfig[parametro].options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.text;
      select.appendChild(optionEl);
    });
    
    groupDiv.appendChild(select);
    
    const pesoInfo = document.createElement('span');
    pesoInfo.className = 'peso-info';
    pesoInfo.textContent = `×${parametriConfig[parametro].peso}`;
    groupDiv.appendChild(pesoInfo);

    grid.appendChild(groupDiv);
  }

  // Sezione Note Cliniche
  const noteSection = document.createElement('div');
  noteSection.className = 'note-section';

  const noteLabel = document.createElement('label');
  noteLabel.htmlFor = 'note-cliniche';
  noteLabel.textContent = 'Note Cliniche:';
  noteSection.appendChild(noteLabel);

  const noteTextarea = document.createElement('textarea');
  noteTextarea.id = 'note-cliniche';
  noteTextarea.placeholder = 'Inserisci dettagli clinici rilevanti...';
  noteSection.appendChild(noteTextarea);

  container.appendChild(noteSection);
}

// =======================
// 5. CALCOLO DEL PUNTEGGIO
// =======================
function calcolaPunteggio() {
  const ids = Object.keys(parametriConfig);
  let totale = 0;
  let punteggiSingoli = {};

  ids.forEach(id => {
    const val = parseInt(document.getElementById(id).value, 10);
    const pesoPunti = val * parametriConfig[id].peso;
    totale += pesoPunti;
    punteggiSingoli[id] = { 
      valore: val, 
      peso: parametriConfig[id].peso,
      pesato: pesoPunti 
    };
  });

  // Arrotonda a una cifra decimale
  totale = Math.round(totale * 10) / 10;
  
  // Calcolo punteggio massimo
  let maxPossibile = 0;
  ids.forEach(id => {
    maxPossibile += 3 * parametriConfig[id].peso; // Valore max = 3
  });
  
  // Percentuale
  const percentuale = (totale / maxPossibile) * 100;
  
  // Determina la categoria
  let categoria;
  if (percentuale <= 25) {
    categoria = "Basso";
  } else if (percentuale <= 50) {
    categoria = "Medio";
  } else if (percentuale <= 75) {
    categoria = "Alto";
  } else {
    categoria = "Molto Alto";
  }

  document.getElementById('punteggio-totale').textContent = 
    `Punteggio Totale: ${totale.toFixed(1)} su ${maxPossibile.toFixed(1)} (${Math.round(percentuale)}%, Rischio: ${categoria})`;
  
  document.getElementById('result').style.display = 'block';
  
  // Mostra diagnosi generiche e pattern
  mostraDiagnosi(categoria, punteggiSingoli);
  
  // Applica branching rules
  mostraBranchingRules(punteggiSingoli);
  
  // Crea grafico radar
  creaGraficoRadar(punteggiSingoli);
}

// =======================
// 6. MOSTRA DIAGNOSI PRINCIPALI + PATTERN
// =======================
function mostraDiagnosi(categoria, punteggiSingoli) {
  const diagnosiGeneriche = {
    "Basso": ["Dermatite seborroica lieve", "Dermatite atopica lieve", "Pitiriasi rosea"],
    "Medio": ["Eczema da contatto", "Eritema polimorfo", "Lichen planus attivo"],
    "Alto": ["Pemfigo", "Sindrome di Behçet", "Micosi fungoide"],
    "Molto Alto": ["Scleredema", "Scleromixedema", "Dermatite bollosa autoimmune severa"]
  };

  const diagnosiListEl = document.getElementById('diagnosi-list');
  diagnosiListEl.innerHTML = "";
  
  // Diagnosi generiche
  const genericheTitolo = document.createElement('h4');
  genericheTitolo.textContent = 'In base al punteggio totale:';
  diagnosiListEl.appendChild(genericheTitolo);
  
  diagnosiGeneriche[categoria].forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    diagnosiListEl.appendChild(li);
  });
  
  // Pattern matching
  const patternTitolo = document.createElement('h4');
  patternTitolo.textContent = 'In base ai pattern specifici:';
  diagnosiListEl.appendChild(patternTitolo);
  
  const risultatiPattern = [];
  
  for (const nomeDiagnosi in patternDiagnosi) {
    let matchCount = 0;
    let totalCriteria = 0;
    
    for (const criterio in patternDiagnosi[nomeDiagnosi]) {
      totalCriteria++;
      const valoreAttuale = parseInt(document.getElementById(criterio).value, 10);
      if (patternDiagnosi[nomeDiagnosi][criterio].includes(valoreAttuale)) {
        matchCount++;
      }
    }
    
    const percentualeMatch = (matchCount / totalCriteria) * 100;
    risultatiPattern.push({
      diagnosi: nomeDiagnosi,
      percentuale: percentualeMatch
    });
  }
  
  risultatiPattern.sort((a, b) => b.percentuale - a.percentuale);

  const diagnosiCorrispondenti = risultatiPattern.filter(r => r.percentuale >= 60);

  if (diagnosiCorrispondenti.length > 0) {
    diagnosiCorrispondenti.forEach(result => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${result.diagnosi}</strong>: corrispondenza ${Math.round(result.percentuale)}%`;
      diagnosiListEl.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = "Nessuna corrispondenza specifica trovata";
    diagnosiListEl.appendChild(li);
  }

  creaTabellaPunteggi(punteggiSingoli);
}

// =======================
// 7. MOSTRA REGOLE DI BRANCHING
// =======================
function mostraBranchingRules(punteggiSingoli) {
  // Crea o sostituisci un ul dedicato
  const existingUl = document.getElementById('branching-extra');
  if (existingUl) {
    existingUl.remove();
  }

  const branchingUl = document.createElement('ul');
  branchingUl.id = 'branching-extra';

  let anyMatch = false;

  branchingRules.forEach(rule => {
    if (rule.condition(getValsFromPunteggi(punteggiSingoli))) {
      anyMatch = true;
      const li = document.createElement('li');
      li.innerHTML = `<strong>${rule.descrizione}:</strong> ${rule.diagnoses.join(", ")}`;
      branchingUl.appendChild(li);
    }
  });

  const diagnosiListEl = document.getElementById('diagnosi-list');

  const branchingTitolo = document.createElement('h4');
  branchingTitolo.textContent = "Branching Extra:";

  diagnosiListEl.appendChild(branchingTitolo);

  if (!anyMatch) {
    const liNo = document.createElement('li');
    liNo.textContent = "Nessuna regola speciale soddisfatta.";
    branchingUl.appendChild(liNo);
  }

  diagnosiListEl.appendChild(branchingUl);
}

// Helper per convertire punteggiSingoli in un object { spongiosi: 2, eosinofili: 3, ... }
function getValsFromPunteggi(punteggiSingoli) {
  const result = {};
  for (let k in punteggiSingoli) {
    result[k] = punteggiSingoli[k].valore;
  }
  return result;
}

// =======================
// 8. TABELLA PUNTEGGI
// =======================
function creaTabellaPunteggi(punteggiSingoli) {
  const dettagliDiv = document.getElementById('punteggi-dettagli');
  dettagliDiv.innerHTML = '';
  
  const table = document.createElement('table');
  table.className = 'punteggi-tabella';
  
  // intestazione
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Parametro', 'Valore', 'Peso', 'Punteggio Pesato'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // corpo
  const tbody = document.createElement('tbody');
  for (const parametro in punteggiSingoli) {
    const row = document.createElement('tr');
    
    const paramCell = document.createElement('td');
    paramCell.textContent = capitalizeFirstLetter(parametro);
    row.appendChild(paramCell);
    
    const valCell = document.createElement('td');
    valCell.textContent = punteggiSingoli[parametro].valore;
    row.appendChild(valCell);
    
    const pesoCell = document.createElement('td');
    pesoCell.textContent = punteggiSingoli[parametro].peso;
    row.appendChild(pesoCell);
    
    const scoreCell = document.createElement('td');
    scoreCell.textContent = punteggiSingoli[parametro].pesato.toFixed(1);
    row.appendChild(scoreCell);
    
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  dettagliDiv.appendChild(table);
}

// =======================
// 9. GRAFICO RADAR
// =======================
function creaGraficoRadar(punteggiSingoli) {
  const ctx = document.getElementById('radar-chart').getContext('2d');
  
  if (window.radarChart) {
    window.radarChart.destroy();
  }
  
  const labels = Object.keys(punteggiSingoli).map(k => capitalizeFirstLetter(k));
  const data = Object.values(punteggiSingoli).map(v => v.valore);
  
  window.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Valori Parametri',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff'
      }]
    },
    options: {
      elements: {
        line: { borderWidth: 3 }
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 3,
          stepSize: 1
        }
      }
    }
  });
}

// =======================
// 10. GENERA REPORT PDF
// =======================
function generaReport() {
  const note = document.getElementById('note-cliniche').value;
  const punteggio = document.getElementById('punteggio-totale').textContent;
  const diagnosi = document.getElementById('diagnosi-list').innerHTML;
  const chartImg = document.getElementById('radar-chart').toDataURL('image/png');
  const tableHtml = document.getElementById('punteggi-dettagli').innerHTML;
  
  const reportTemplate = `
    <html>
    <head>
      <title>Report Diagnostico Dermatiti</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .report-section { margin-bottom: 20px; }
        .timestamp { color: #666; font-size: 0.9em; }
        .chart-container { margin: 20px 0; text-align: center; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Report Diagnostico Dermatiti</h1>
      <div class="timestamp">Generato il: ${new Date().toLocaleString()}</div>
      
      <div class="report-section">
        <h2>Punteggio</h2>
        <p>${punteggio}</p>
      </div>
      
      <div class="report-section">
        <h2>Note Cliniche</h2>
        <p>${note || 'Nessuna nota inserita'}</p>
      </div>
      
      <div class="report-section">
        <h2>Possibili Diagnosi</h2>
        <ul>${diagnosi}</ul>
      </div>
      
      <div class="chart-container">
        <h2>Grafico dei Parametri</h2>
        <img src="${chartImg}" width="400" alt="Grafico Radar Parametri">
      </div>
      
      <div class="report-section">
        <h2>Dettagli dei Parametri</h2>
        ${tableHtml}
      </div>
      
      <div class="report-section disclaimer">
        <p><strong>Avvertenza:</strong> Questo report è generato automaticamente come ausilio diagnostico.
        La diagnosi definitiva deve essere confermata da un dermatologo.</p>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([reportTemplate], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const reportWindow = window.open(url, '_blank');
  
  reportWindow.onload = function() {
    setTimeout(function() {
      reportWindow.print();
    }, 1000);
  };
}

// =======================
// 11. SALVATAGGIO E CARICAMENTO DATI
// =======================
function salvaDati() {
  const ids = Object.keys(parametriConfig);
  let datiSalvati = {};
  
  ids.forEach(id => {
    datiSalvati[id] = document.getElementById(id).value;
  });
  
  datiSalvati.note = document.getElementById('note-cliniche').value;
  
  localStorage.setItem('dermatiti_diagnosi_dati', JSON.stringify(datiSalvati));
  alert('Dati salvati con successo!');
}

function caricaDati() {
  const datiSalvatiString = localStorage.getItem('dermatiti_diagnosi_dati');
  if (!datiSalvatiString) {
    alert('Nessun dato salvato in precedenza.');
    return;
  }
  
  const datiSalvati = JSON.parse(datiSalvatiString);
  
  for (const id in datiSalvati) {
    if (id === 'note') {
      document.getElementById('note-cliniche').value = datiSalvati[id];
    } else if (document.getElementById(id)) {
      document.getElementById(id).value = datiSalvati[id];
    }
  }
  
  alert('Dati caricati con successo!');
}

// =======================
// 12. RESET FORM
// =======================
function resetForm() {
  if (confirm('Sei sicuro di voler ripristinare tutti i valori?')) {
    const ids = Object.keys(parametriConfig);
    ids.forEach(id => {
      document.getElementById(id).value = 0;
    });
    document.getElementById('note-cliniche').value = '';
    document.getElementById('result').style.display = 'none';
  }
}

// =======================
// 13. TAB SWITCHING
// =======================
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(b => b.classList.remove('active'));
  // Attiva solo il bottone corrispondente
  // Trova quello che matcha tabId e aggiungi la classe "active"
  // (Per semplicità potresti fare un matching se i due ID coincidono, 
  //  ma qui potresti dover mappare tabId -> bottone)
}

// =======================
// 14. HELPER
// =======================
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =======================
// 15. ONLOAD
// =======================
window.onload = function() {
  creaParametri();
  
  // Se ci sono dati salvati, chiedi se caricarli
  if (localStorage.getItem('dermatiti_diagnosi_dati')) {
    if (confirm('Ci sono dati salvati in precedenza. Vuoi caricarli?')) {
      caricaDati();
    }
  }
};
