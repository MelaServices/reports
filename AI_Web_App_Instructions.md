# Istruzioni Dettagliate per la Creazione di una Web App "Italian Corner - Business Plan Dashboard"

## 1. Introduzione

Questo documento fornisce istruzioni complete e dettagliate per un sistema AI al fine di replicare una web application esistente per l'analisi di business plan. L'obiettivo è generare una web app frontend funzionale, stilisticamente coerente e interattiva, che rispecchi esattamente il comportamento e l'aspetto della dashboard originale.

## 2. Tecnologie Richieste

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+).
*   **Librerie JavaScript:** Chart.js (per la generazione dei grafici).

## 3. Struttura del Progetto

Il sistema AI dovrà creare i seguenti file nella directory radice del progetto:

*   `index.html`: La pagina principale della dashboard.
*   `style.css`: Il foglio di stile per l'intera applicazione.
*   `script.js`: Il file JavaScript contenente tutta la logica di calcolo e l'interattività.
*   `logo ITALIAN LIFE STYLE.png`: Il logo aziendale (questo file sarà fornito e dovrà essere incluso nell'header).

## 4. Specifiche Funzionali Dettagliate

### 4.1. Layout Generale (`index.html`, `style.css`)

*   **Header:**
    *   Deve contenere il logo aziendale: `<img src="logo ITALIAN LIFE STYLE.png" alt="Italian Corner Logo" id="logo">`.
    *   Il logo deve avere `max-height: 50px;`.
    *   Un titolo principale: `<h1>Italian Corner - Business Plan Dashboard</h1>`.
    *   Un link di navigazione: `<a href="presentazione.html" class="button">La Visione</a>`.
    *   Stile dell'header: `background-color: #7A9B5C; color: white; padding: 1rem; text-align: center;`.
*   **Contenuto Principale (`<main>`):**
    *   Deve utilizzare un layout a due colonne (`display: flex` in CSS).
    *   **Colonna Sinistra (`#controls`):** Dedicata all'input dei parametri.
        *   Stile: `width: 30%; padding: 1rem; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-right: 1rem;`.
    *   **Colonna Destra (`#results`):** Dedicata alla visualizzazione dei risultati.
        *   Stile: `width: 70%; padding: 1rem; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);`.
*   **Stile Generale del Body:**
    *   `font-family: Arial, sans-serif;`
    *   `margin: 0;`
    *   `background-color: #f4f4f4;`
    *   `color: #333;`

### 4.2. Sezione Input (`#controls`)

*   **Titolo:** `<h2>Parametri</h2>`.
*   **Form (`#params-form`):**
    *   Organizzato con `fieldset` per raggruppare i parametri correlati, ciascuno con una `legend`.
    *   Ogni parametro è un `input type="number"` all'interno di un `div.form-group` con una `label` associata.
    *   Stile `input`: `width: 95%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;`.

*   **Valori di Default e Specifiche per Campo:**

    *   **Volumi di Vendita (media giornaliera)**
        *   `piatti_store`: `id="piatti_store" value="250"`
        *   `piatti_delivery`: `id="piatti_delivery" value="120"`
        *   `bibite`: `id="bibite" value="150"`
        *   `acqua`: `id="acqua" value="250"`
    *   **Prezzi e Costi Unitari (€)**
        *   `prezzo_piatto`: `id="prezzo_piatto" step="0.01" value="7.27"`
        *   `costo_piatto`: `id="costo_piatto" step="0.01" value="3.50"`
        *   `prezzo_bibita`: `id="prezzo_bibita" step="0.01" value="2.27"`
        *   `costo_bibita`: `id="costo_bibita" step="0.01" value="0.60"`
        *   `prezzo_acqua`: `id="prezzo_acqua" step="0.01" value="0.91"`
        *   `costo_acqua`: `id="costo_acqua" step="0.01" value="0.15"`
    *   **Costi Operativi (OPEX Mensili in €)**
        *   `affitto`: `id="affitto" value="3000"`
        *   `numero_addetti`: `id="numero_addetti" value="2"`
        *   `costo_addetto`: `id="costo_addetto" value="3400"`
        *   `trasporti`: `id="trasporti" value="800"`
        *   `utenze`: `id="utenze" value="700"`
        *   `marketing`: `id="marketing" value="1500"`
        *   `assicurazioni`: `id="assicurazioni" value="500"`
        *   `fideiussione_costo_annuo`: `id="fideiussione_costo_annuo" step="0.001" value="0.015"`
    *   **Parametri Generali e Finanziari**
        *   `giorni_lavorativi`: `id="giorni_lavorativi" value="30"`
        *   `commissione_delivery`: `id="commissione_delivery" step="0.01" value="0.28"`
        *   `mesi_opex_capitale`: `id="mesi_opex_capitale" value="3"`

### 4.3. Sezione Output (`#results`)

*   **Titolo:** `<h2>Risultati</h2>`.
*   **Riepilogo Investimento (`#summary-results`):**
    *   Titolo: `<h3>Analisi Investimento per Singolo Punto Vendita</h3>`.
    *   Visualizza: **CAPEX Fisso**, **Capitale Operativo Iniziale**, **Investimento Totale per PdV**.
    *   Ogni voce deve avere un attributo `title` con la descrizione (es. `title="Somma dei costi di startup (allestimento, attrezzature, etc.)"`).
*   **Analisi ROI (`#roi-analysis`):**
    *   Titolo: `<h3>Analisi Ritorno sull'Investimento (Singolo PdV)</h3>`.
    *   Visualizza: **Payback Period** (in mesi, con una cifra decimale) e **ROI a 1 Anno** (in percentuale).
    *   Ogni voce deve avere un attributo `title` con la descrizione e la formula (es. `title="Mesi necessari per recuperare l'investimento totale. Formula: Investimento Totale / EBITDA Mensile Medio"`).
*   **Tabelle:**
    *   `<h3>Profit & Loss Mensile (Primi 12 Mesi con Ramp-Up)</h3>` con `div.table-container` e `table id="pnl-table"`.
    *   `<h3>Cash Flow 12 Mesi (Singolo PdV)</h3>` con `div.table-container` e `table id="cf12-table"`.
    *   `<h3>Cash Flow 24 Mesi (Espansione 5 PdV)</h3>` con `div.table-container` e `table id="cf24-table"`.
    *   **Struttura delle Tabelle:** Tutte le tabelle devono avere `<thead>` con i mesi (o Mese 1, Mese 2, ecc.) e `<tbody>` con le voci di calcolo.
    *   **Stile delle Tabelle (`style.css`):**
        *   `table`: `width: 100%; border-collapse: collapse; font-size: 1rem;`.
        *   `thead th`: `background-color: #E8DCC8; color: #4A4138; padding: 0.75rem; text-align: left;`.
        *   `tbody td, thead th`: `border: 1px solid #ddd; padding: 0.75rem;`.
        *   `tbody tr:nth-child(even)`: `background-color: #f9f9f9;`.
        *   `total-row td`: `font-weight: bold; background-color: #B83A38 !important; color: white;`.
        *   `positive-value`: `background-color: #28a745 !important; color: white !important; font-weight: bold;`.
        *   `negative-value`: `background-color: #dc3545 !important; color: white !important; font-weight: bold;`.
        *   Le celle numeriche devono avere un attributo `title` con la descrizione e la formula del calcolo (se disponibile).
*   **Grafici (Chart.js):**
    *   `div.chart-container` con `canvas id="cf12-chart"` per il "Cash Flow Cumulativo 12 Mesi".
    *   `div.chart-container` con `canvas id="cf24-chart"` per il "Cash Flow Cumulativo 24 Mesi".
    *   **Configurazione Grafici:**
        *   Tipo: `line`.
        *   Colori:
            *   `cf12-chart`: `borderColor: '#7A9B5C'`, `backgroundColor: 'rgba(122, 155, 92, 0.1)'`.
            *   `cf24-chart`: `borderColor: '#B83A38'`, `backgroundColor: 'rgba(184, 58, 56, 0.1)'`.
        *   `fill: true`, `tension: 0.1`.

### 4.4. Logica di Calcolo e Interattività (`script.js`)

*   **Interattività:** La dashboard deve aggiornarsi in tempo reale. Ogni modifica a un campo `input` nel form (`#params-form`) deve scatenare un ricalcolo e un aggiornamento di tutte le sezioni di output.
*   **Funzioni di Utilità:**
    *   `formatter`: `new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });`
    *   `percentFormatter`: `new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1 });`
    *   `getParams()`: Funzione per raccogliere i valori numerici da tutti gli input del form.
*   **Funzioni di Calcolo:**
    *   `calculatePnl(params, regime)`:
        *   Calcola il Profit & Loss mensile per 12 mesi.
        *   Applica un coefficiente di ramp-up (`rampUpCoeff`) ai ricavi, COGS e commissioni delivery:
            *   `rampUpCoeff(mese)`: `if (mese <= 2) return 0.3; if (mese <= 9) return 0.6; return 1.0;`
        *   Calcola Ricavi Totali, COGS Totali, Margine di Contribuzione, OPEX Totali, EBITDA, EBITDA Margin %.
        *   Popola un oggetto `pnlData` con `headers` e `rows`, includendo `value`, `description` e `formula` per ogni cella.
    *   `calculateFinancials(params)`:
        *   Calcola i ricavi, COGS e OPEX a regime (100%).
        *   `ricavi_piatti_delivery_100 = params.piatti_delivery * params.giorni_lavorativi * params.prezzo_piatto;`
        *   `ricavi_totali_100 = (params.piatti_store + params.piatti_delivery) * params.giorni_lavorativi * params.prezzo_piatto + params.bibite * params.giorni_lavorativi * params.prezzo_bibita + params.acqua * params.giorni_lavorativi * params.prezzo_acqua;`
        *   `cogs_totali_100 = ((params.piatti_store + params.piatti_delivery) * params.giorni_lavorativi * params.costo_piatto) + (params.bibite * params.giorni_lavorativi * params.costo_bibita) + (params.acqua * params.giorni_lavorativi * params.costo_acqua);`
        *   `opex_fisso_100 = params.affitto + (params.numero_addetti * params.costo_addetto) + params.trasporti + params.utenze + params.marketing + params.assicurazioni + (params.affitto * 12 * params.fideiussione_costo_annuo / 12);`
        *   `commissione_delivery_100 = ricavi_piatti_delivery_100 * params.commissione_delivery;`
        *   `opex_totali_100 = opex_fisso_100 + commissione_delivery_100;`
        *   Definisce `capex_fisso = 83695;`.
        *   Calcola `capitale_operativo = opex_totali_100 * params.mesi_opex_capitale;`.
        *   Calcola `investimento_totale_singolo_pdv = capex_fisso + capitale_operativo;`.
        *   Calcola `payback_period` e `roi_anno_1`.
        *   Restituisce un oggetto contenente `regime`, `pnl`, `investimento` e `roi`.
    *   `calculateCf12(pnlData, investimento)`:
        *   Calcola il Cash Flow Mensile e Cumulativo per 12 mesi per un singolo punto vendita.
        *   Include l'investimento iniziale solo nel Mese 1.
    *   `calculateCf24(params, regime, investimento)`:
        *   Calcola il Cash Flow Mensile e Cumulativo per 24 mesi, simulando l'espansione con 5 punti vendita.
        *   `aperture_pdv = [1, 13, 15, 17, 19];` (mesi di apertura dei nuovi PdV).
        *   `getRampUpCoefficient(mese_corrente, mese_apertura)`: Logica di ramp-up specifica per ogni PdV.
        *   Consolida ricavi, COGS, OPEX e investimenti per tutti i PdV attivi.
*   **Funzioni di Visualizzazione:**
    *   `renderTable(containerId, data, isTotalRow)`:
        *   Genera dinamicamente tabelle HTML nel `containerId` specificato.
        *   Applica le classi CSS `.positive-value`, `.negative-value`, `.total-row` e gli attributi `title` come specificato nella sezione 4.3.
        *   Formattazione condizionale per `Cash Flow Cumulativo`.
    *   `renderSummary(financials)`: Popola la sezione `#summary-results`.
    *   `renderRoi(roi, investimento)`: Popola la sezione `#roi-analysis`.
    *   `renderCharts(cf12Data, cf24Data)`:
        *   Inizializza o aggiorna i grafici Chart.js per CF12 e CF24.
        *   Distrugge le istanze precedenti dei grafici prima di crearne di nuove.
    *   `updateDashboard()`: Funzione principale che viene chiamata al caricamento della pagina e ad ogni modifica degli input. Orchesta l'esecuzione delle funzioni di calcolo e di rendering.

## 5. Istruzioni per l'AI

"Crea una web application frontend completa, composta dai file `index.html`, `style.css` e `script.js`, che replichi la funzionalità di una dashboard di business plan. Segui scrupolosamente tutte le specifiche funzionali, i valori di default per gli input, la logica di calcolo e gli stili CSS forniti in questo documento. Assicurati che l'applicazione sia interattiva, con i risultati che si aggiornano in tempo reale ad ogni modifica degli input. Utilizza la libreria Chart.js per la generazione dei grafici. Includi il logo `logo ITALIAN LIFE STYLE.png` nell'header della pagina `index.html`."