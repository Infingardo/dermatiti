// Configurazione parametri con pesi differenziati
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
  },
  // Nuovo parametro: Sede della lesione
  sede: {
    options: [
      { value: 0, text: "0 - Non specificata" },
      { value: 1, text: "1 - Testa/Collo" },
      { value: 2, text: "2 - Tronco" },
      { value: 3, text: "3 - Arti" }
    ],
    peso: 0,       // Non influisce sul calcolo numerico
    scoring: false // Flag per escluderlo dal punteggio
  }
};

// Patterns specifici per le diagnosi (inclusa la sede come filtro)
const patternDiagnosi = {
  "Dermatite seborroica": {
    paracheratosi: [1, 2, 3],
    spongiosi: [0, 1],
    neutrofili: [0, 1],
    distribuzione: [1, 2],
    sede: [1]  // Tipica per Testa/Collo
  },
  "Dermatite atopica": {
    spongiosi: [1, 2, 3],
    esocitosi: [1, 2],
    infiltrato: [1, 2],
    prurito: [2, 3],
    sede: [2, 3]  // Tipica per Tronco o Arti
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

// Funzione per generare dinamicamente i selettori
function creaParametri() {
  try {
    const container = document.getElementById('params');
    container.innerHTML = ''; // Pulizia prima di ricreare

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

      // Mostra il moltiplicatore solo se il peso è diverso da 0
      if (parametriConfig[parametro].peso !== 0) {
        const pesoInfo = document.createElement('span');
        pesoInfo.className = 'peso-info';
        pesoInfo.textContent = `×${parametriConfig[parametro].peso}`;
        groupDiv.appendChild(pesoInfo);
      }

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
  } catch (error) {
    console.error("Errore in creaParametri:", error);
    alert("Si è verificato un errore nell'inizializzazione dei parametri: " + error.message);
  }
}

// Funzione per calcolare il punteggio totale
function calcolaPunteggio() {
  try {
    const ids = Object.keys(parametriConfig);
    let totale = 0;
    let punteggiSingoli = {};

    ids.forEach(id => {
      const inputValue = document.getElementById(id).value;
      let val = parseInt(inputValue, 10);
      if (isNaN(val) || val < 0 || val > 3) {
        alert(`⚠️ Valore non valido per ${capitalizeFirstLetter(id)}. Deve essere un numero tra 0 e 3. Impostato a 0.`);
        val = 0;
        document.getElementById(id).value = 0;
      }
      if (parametriConfig[id].scoring === false) {
        // Registra il valore per report e pattern matching, senza incidere sul punteggio
        punteggiSingoli[id] = { 
          valore: val, 
          peso: parametriConfig[id].peso,
          pesato: 0  
        };
        return;
      }
      const pesoPunti = val * parametriConfig[id].peso;
      totale += pesoPunti;
      punteggiSingoli[id] = { 
        valore: val, 
        peso: parametriConfig[id].peso,
        pesato: pesoPunti 
      };
    });

    // Arrotonda il punteggio totale a una cifra decimale
    totale = Math.round(totale * 10) / 10;
    
    // Calcola il punteggio massimo escludendo i parametri non scoring
    let maxPossibile = 0;
    ids.forEach(id => {
      if (parametriConfig[id].scoring === false) return;
      maxPossibile += 3 * parametriConfig[id].peso;
    });
    
    const percentuale = (totale / maxPossibile) * 100;
    
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
    
    mostraDiagnosi(categoria, punteggiSingoli);
    creaGraficoRadar(punteggiSingoli);
  } catch (error) {
    console.error("Errore in calcolaPunteggio:", error);
    alert("Si è verificato un errore nel calcolo del punteggio: " + error.message);
  }
}

// Mostra diagnosi basate sul punteggio e sui pattern specifici, con "sede" a doppio peso
function mostraDiagnosi(categoria, punteggiSingoli) {
  try {
    const diagnosiGeneriche = {
      "Basso": ["Dermatite seborroica lieve", "Dermatite atopica lieve", "Pitiriasi rosea"],
      "Medio": ["Eczema da contatto", "Eritema polimorfo", "Lichen planus attivo"],
      "Alto": ["Pemfigo", "Sindrome di Behçet", "Micosi fungoide"],
      "Molto Alto": ["Scleredema", "Scleromixedema", "Dermatite bollosa autoimmune severa"]
    };
  
    const diagnosiListEl = document.getElementById('diagnosi-list');
    diagnosiListEl.innerHTML = "";
    
    // Diagnosi generiche in base al punteggio totale
    const genericheTitolo = document.createElement('h4');
    genericheTitolo.textContent = 'In base al punteggio totale:';
    diagnosiListEl.appendChild(genericheTitolo);
    
    diagnosiGeneriche[categoria].forEach(d => {
      const li = document.createElement('li');
      li.textContent = d;
      diagnosiListEl.appendChild(li);
    });
    
    // Pattern matching, assegnando un peso doppio al criterio "sede"
    const patternTitolo = document.createElement('h4');
    patternTitolo.textContent = 'In base ai pattern specifici:';
    diagnosiListEl.appendChild(patternTitolo);
    
    const risultatiPattern = [];
    
    for (const nomeDiagnosi in patternDiagnosi) {
      let matchCount = 0;
      let totalCriteria = 0;
      
      for (const criterio in patternDiagnosi[nomeDiagnosi]) {
        let weight = (criterio === 'sede') ? 2 : 1;
        totalCriteria += weight;
        const valoreAttuale = parseInt(document.getElementById(criterio).value, 10);
        if (patternDiagnosi[nomeDiagnosi][criterio].includes(valoreAttuale)) {
          matchCount += weight;
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
  
    // Crea tabella con i dettagli dei punteggi
    creaTabellaPunteggi(punteggiSingoli);
  } catch (error) {
    console.error("Errore in mostraDiagnosi:", error);
    alert("Si è verificato un errore nella visualizzazione delle diagnosi: " + error.message);
  }
}

// Crea tabella di dettaglio punteggi usando template literals per maggiore concisione
function creaTabellaPunteggi(punteggiSingoli) {
  try {
    const dettagliDiv = document.getElementById('punteggi-dettagli');
    const rows = Object.entries(punteggiSingoli)
      .map(([parametro, dettagli]) => `
        <tr>
          <td>${capitalizeFirstLetter(parametro)}</td>
          <td>${dettagli.valore}</td>
          <td>${dettagli.peso}</td>
          <td>${dettagli.pesato.toFixed(1)}</td>
        </tr>
      `)
      .join('');
  
    dettagliDiv.innerHTML = `
      <table class="punteggi-tabella">
        <thead>
          <tr>
            <th>Parametro</th>
            <th>Valore</th>
            <th>Peso</th>
            <th>Punteggio Pesato</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Errore in creaTabellaPunteggi:", error);
    alert("Si è verificato un errore nella creazione della tabella: " + error.message);
  }
}

// Crea un grafico radar con opzioni responsive e colori accattivanti
function creaGraficoRadar(punteggiSingoli) {
  try {
    if (typeof Chart === 'undefined') {
      console.error("Chart.js non è caricato. Assicurarsi di includere la libreria.");
      return;
    }
  
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
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // colore caldo e vivace
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
          labels: {
            fontColor: '#333',
            fontSize: 12
          }
        },
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scale: {
          ticks: {
            beginAtZero: true,
            max: 3,
            stepSize: 1,
            backdropColor: 'rgba(255,255,255,0)'
          }
        }
      }
    });
  } catch (error) {
    console.error("Errore in creaGraficoRadar:", error);
    alert("Si è verificato un errore nella creazione del grafico: " + error.message);
  }
}

// Genera un report in HTML e apre una nuova finestra per stampare in PDF
function generaReport() {
  try {
    if (!window.radarChart) {
      alert("Calcola prima il punteggio per generare il report.");
      return;
    }
  
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
    
    if (reportWindow) {
      reportWindow.onload = function() {
        setTimeout(function() {
          reportWindow.print();
        }, 2000); // 2 secondi di ritardo per garantire il caricamento completo
      };
    } else {
      alert("Il browser ha bloccato l'apertura della finestra. Controlla le impostazioni di popup.");
    }
  } catch (error) {
    console.error("Errore nella generazione del report:", error);
    alert("Si è verificato un errore nella generazione del report: " + error.message);
  }
}

// Salva i dati in localStorage con gestione delle eccezioni e feedback visivo
function salvaDati() {
  try {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage non è supportato in questo browser');
    }
    const ids = Object.keys(parametriConfig);
    let datiSalvati = {};
    
    ids.forEach(id => {
      datiSalvati[id] = document.getElementById(id).value;
    });
    
    datiSalvati.note = document.getElementById('note-cliniche').value;
    localStorage.setItem('dermatiti_diagnosi_dati', JSON.stringify(datiSalvati));
    alert('Dati salvati con successo!');
  } catch (error) {
    console.error("Errore nel salvataggio dei dati:", error);
    alert("Si è verificato un errore nel salvataggio dei dati: " + error.message);
  }
}

// Carica i dati da localStorage con gestione delle eccezioni
function caricaDati() {
  try {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage non è supportato in questo browser');
    }
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
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
    alert("Si è verificato un errore nel caricamento dei dati: " + error.message);
  }
}

// Reset dei valori
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

// Gestione del cambio di tab con evidenziazione
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

// Helper per capitalizzare la prima lettera
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Inizializza i parametri al caricamento della pagina
window.onload = function() {
  try {
    creaParametri();
    if (localStorage && localStorage.getItem('dermatiti_diagnosi_dati')) {
      if (confirm('Ci sono dati salvati in precedenza. Vuoi caricarli?')) {
        caricaDati();
      }
    }
  } catch (error) {
    console.error("Errore nell'inizializzazione:", error);
    alert("Si è verificato un errore nell'inizializzazione dell'applicazione: " + error.message);
  }
};
