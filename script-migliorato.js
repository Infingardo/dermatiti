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
    sede: {
        options: [
            { value: 0, text: "0 - Non specificata" },
            { value: 1, text: "1 - Testa/Collo" },
            { value: 2, text: "2 - Tronco" },
            { value: 3, text: "3 - Arti" }
        ],
        peso: 0, // Non influisce sul calcolo numerico
        scoring: false // Flag per escluderlo dal punteggio
    }
};

// Converti parametriConfig in un array per una iterazione più efficiente
const parametriArray = Object.entries(parametriConfig).map(([id, config]) => ({
    id: id,
    ...config
}));

// Patterns specifici per le diagnosi (inclusa la sede come filtro)
const patternDiagnosi = {
    "Dermatite seborroica": {
        paracheratosi: [1, 2, 3],
        spongiosi: [0, 1],
        neutrofili: [0, 1],
        distribuzione: [1, 2],
        sede: [1] // Tipica per Testa/Collo
    },
    "Dermatite atopica": {
        spongiosi: [1, 2, 3],
        esocitosi: [1, 2],
        infiltrato: [1, 2],
        prurito: [2, 3],
        sede: [2, 3] // Tipica per Tronco o Arti
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
    const container = document.getElementById('params');
    container.innerHTML = ''; // Pulizia prima di ricreare
    const grid = document.createElement('div');
    grid.className = "param-grid";
    container.appendChild(grid);

    parametriArray.forEach(parametro => {
        const groupDiv = document.createElement('div');
        groupDiv.className = "param-group";

        const label = document.createElement('label');
        label.htmlFor = parametro.id;
        label.textContent = capitalizeFirstLetter(parametro.id) + ": ";
        label.title = `Peso: ${parametro.peso}`;
        groupDiv.appendChild(label);

        const select = document.createElement('select');
        select.id = parametro.id;
        select.name = parametro.id;

        parametro.options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt.value;
            optionEl.textContent = opt.text;
            select.appendChild(optionEl);
        });

        groupDiv.appendChild(select);

        if (parametro.peso !== 0) {
            const pesoInfo = document.createElement('span');
            pesoInfo.className = 'peso-info';
            pesoInfo.textContent = `×${parametro.peso}`;
            groupDiv.appendChild(pesoInfo);
        }

        grid.appendChild(groupDiv);
    });

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

// Funzione per calcolare il punteggio totale
function calcolaPunteggio() {
    // Ottieni i valori dei parametri dal DOM una sola volta
    const valoriParametri = {};
    parametriArray.forEach(parametro => {
        valoriParametri[parametro.id] = parseInt(document.getElementById(parametro.id).value, 10);
    });

    let totale = 0;
    let punteggiSingoli = {};

    parametriArray.forEach(parametro => {
        const val = valoriParametri[parametro.id]; // Usa i valori prelevati

        if (parametro.scoring === false) {
            punteggiSingoli[parametro.id] = {
                valore: val,
                peso: parametro.peso,
                pesato: 0
            };
            return;
        }

        const pesoPunti = val * parametro.peso;
        totale += pesoPunti;
        punteggiSingoli[parametro.id] = {
            valore: val,
            peso: parametro.peso,
            pesato: pesoPunti
        };
    });

    totale = Math.round(totale * 10) / 10;

    let maxPossibile = 0;
    parametriArray.forEach(parametro => {
        if (parametro.scoring === false) return;
        maxPossibile += 3 * parametro.peso;
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
}

// Funzione per calcolare il peso del criterio (doppio per "sede")
function calcolaPesoCriterio(criterio) {
    return (criterio === 'sede') ? 2 : 1;
}

// Mostra diagnosi basate sul punteggio e sui pattern specifici, con "sede" a doppio peso
function mostraDiagnosi(categoria, punteggiSingoli) {
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
            const peso = calcolaPesoCriterio(criterio);
            totalCriteria += peso;

            const valoreAttuale = punteggiSingoli[criterio].valore;  // Usa i valori già calcolati
            if (patternDiagnosi[nomeDiagnosi][criterio].includes(valoreAttuale)) {
                matchCount += peso;
            }
        }

        const percentualeMatch = (matchCount / totalCriteria) * 100;
        risultatiPattern.push({
            diagnosi: nomeDiagnosi,
            percentuale: percentualeMatch
        });
    }

    risultatiPattern.sort((a, b) => b.percentuale - a.percentuale);

    // Filtra le diagnosi con almeno il 60% di corrispondenza
    const diagnosiCorrispondenti = risultatiPattern.filter(r => r.percentuale >= 60);

    if (diagnosiCorrispondenti.length > 0) {
        diagnosiCorrispondenti.forEach(result => {
            const li = document.createElement('li');
            li.innerHTML = `
                **${result.diagnosi}**: corrispondenza ${Math.round(result.percentuale)}%`;
            diagnosiListEl.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "Nessuna corrispondenza specifica trovata";
        diagnosiListEl.appendChild(li);
    }
}

// Crea tabella di dettaglio punteggi
function creaTabellaPunteggi(punteggiSingoli) {
    const dettagliDiv = document.getElementById('punteggi-dettagli');
    dettagliDiv.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'punteggi-tabella';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Parametro', 'Valore', 'Peso', 'Punteggio Pesato'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

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

// Crea un grafico radar
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
                pointBorderColor: '#fff',
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
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

// Genera un report in HTML e apre una nuova finestra per stampare in PDF
function generaReport() {
    const note = document.getElementById('note-cliniche').value;
    const punteggio = document.getElementById('punteggio-totale').textContent;
    const diagnosi = document.getElementById('diagnosi-list').innerHTML;
    const chartImg = document.getElementById('radar-chart').toDataURL('image/png');
    const tableHtml = document.getElementById('punteggi-dettagli').innerHTML;

    const reportTemplate = `
        ${punteggio}

        ${note || 'Nessuna nota inserita'}

        ${diagnosi}

        ${tableHtml}

    `;

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportTemplate);
}

// Funzioni di utilità
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function () {
    creaParametri(); // Genera dinamicamente i parametri
    const calcolaButton = document.getElementById('calcola-button');
    calcolaButton.addEventListener('click', calcolaPunteggio); // Aggiungi l'event listener

    const generaReportButton = document.getElementById('genera-report');
    generaReportButton.addEventListener('click', generaReport);
});
