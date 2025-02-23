const parametriConfig = {
  spongiosi: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Diffusa" }
  ],
  esocitosi: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Imponente" }
  ],
  infiltrato: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Perivascolare superficiale" },
    { value: 2, text: "2 - Perivascolare superficiale e profondo" },
    { value: 3, text: "3 - A banda lichenoide (con o senza vacuoli), interstiziale, o follicolare" }
  ],
  eosinofili: [
    { value: 0, text: "0 - Assenti" },
    { value: 1, text: "1 - Rari" },
    { value: 2, text: "2 - Presenti" },
    { value: 3, text: "3 - Abbondanti" }
  ],
  neutrofili: [
    { value: 0, text: "0 - Assenti" },
    { value: 1, text: "1 - Rari" },
    { value: 2, text: "2 - Presenti" },
    { value: 3, text: "3 - Abbondanti (anche in microascessi)" }
  ],
  paracheratosi: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve (focale)" },
    { value: 2, text: "2 - Moderata (a lamelle)" },
    { value: 3, text: "3 - Marcata" }
  ],
  acantosi: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Marcata, iperplasia psoriasiforme" }
  ],
  atrofia: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Marcata" }
  ],
  pigmento: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Marcata (incontinentia pigmenti)" }
  ],
  mucina: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Marcata" }
  ],
  ulcerazione: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve (erosioni superficiali)" },
    { value: 2, text: "2 - Moderata" },
    { value: 3, text: "3 - Ulcere profonde" }
  ],
  distribuzione: [
    { value: 0, text: "0 - Lesione singola" },
    { value: 1, text: "1 - Lesioni multiple in una singola area" },
    { value: 2, text: "2 - Lesioni multiple in più aree" },
    { value: 3, text: "3 - Lesioni diffuse su tutto il corpo" }
  ],
  prurito: [
    { value: 0, text: "0 - Assente" },
    { value: 1, text: "1 - Lieve" },
    { value: 2, text: "2 - Moderato" },
    { value: 3, text: "3 - Intenso" }
  ],
  velocita: [
    { value: 0, text: "0 - Lenta e progressiva" },
    { value: 1, text: "1 - Subacuta" },
    { value: 2, text: "2 - Acuta" },
    { value: 3, text: "3 - Molto rapida (ore o pochi giorni)" }
  ]
};

// Funzione per generare dinamicamente i selettori
function creaParametri() {
  const container = document.getElementById('params');

  for (let parametro in parametriConfig) {
    const groupDiv = document.createElement('div');
    groupDiv.className = "param-group";

    const label = document.createElement('label');
    label.textContent = parametro + ": ";
    groupDiv.appendChild(label);

    const select = document.createElement('select');
    select.id = parametro;
    parametriConfig[parametro].forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.text;
      select.appendChild(optionEl);
    });
    groupDiv.appendChild(select);

    container.appendChild(groupDiv);
  }
}

// Funzione per calcolare il punteggio totale
function calcolaPunteggio() {
  const ids = Object.keys(parametriConfig);
  let totale = 0;

  ids.forEach(id => {
    const val = parseInt(document.getElementById(id).value, 10);
    totale += val;
  });

  const categoria = totale <= 15 ? "Basso" : totale <= 30 ? "Medio" : totale <= 42 ? "Alto" : "Molto Alto";

  document.getElementById('punteggio-totale').textContent = `Punteggio Totale: ${totale} (${categoria})`;
  document.getElementById('result').style.display = 'block';

  mostraDiagnosi(categoria);
}

// Funzione per mostrare le diagnosi basate sul punteggio
function mostraDiagnosi(categoria) {
  const diagnosi = {
    "Basso": ["Dermatite seborroica lieve", "Dermatite atopica lieve", "Pitiriasi rosea"],
    "Medio": ["Eczema da contatto", "Eritema polimorfo", "Lichen planus attivo"],
    "Alto": ["Pemfigo", "Sindrome di Behçet", "Micosi fungoide"],
    "Molto Alto": ["Scleredema", "Scleromixedema", "Dermatite bollosa autoimmune severa"]
  };

  const diagnosiListEl = document.getElementById('diagnosi-list');
  diagnosiListEl.innerHTML = "";
  
  diagnosi[categoria].forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    diagnosiListEl.appendChild(li);
  });
}

// Inizializza i parametri quando la pagina è pronta
window.onload = function() {
  creaParametri();
};
