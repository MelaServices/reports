L'utente preferisce che lavori sull'app web (index.html e file collegati) come impostazione predefinita, ignorando i file Excel se non diversamente specificato.

## Business Logic (Estratta il 2025-11-05)

Questa sezione riassume la logica di business del progetto "Italian Corner" come derivata dall'analisi del file `Business_Plan_Italian_Corner.xlsx` e dal confronto con `index.html`.

### 1. CAPEX (Costi di Investimento Iniziale per 1 Punto Vendita)

Il costo totale per l'apertura di un nuovo punto vendita è di **€83.695**.

| Voce di Costo | Importo |
| :--- | :--- |
| Allestimento e ristrutturazione | €25.000 |
| Attrezzature cucina | €8.000 |
| Cassa automatica | €21.695 |
| Arredi e insegne | €10.000 |
| Costi burocratici e legali | €4.000 |
| Budget Marketing di Lancio | €15.000 |
| **Totale CAPEX** | **€83.695** |

### 2. OPEX (Costi Operativi Mensili per 1 Punto Vendita)

I costi operativi mensili di base identificati nel file Excel ammontano a **€13.300**.

| Voce di Costo | Importo (da Excel) |
| :--- | :--- |
| Affitto locale | €3.000 |
| Personale (2 addetti x €3.400) | €6.800 |
| Trasporti e logistica | €800 |
| Utenze | €700 |
| Leasing attrezzature | €1.500 |
| Marketing ricorrente | €500 |
| Assicurazioni e varie | €0 |
| **Totale OPEX (da Excel)** | **€13.300** |

### 3. Parametri di Vendita (Base)

| Prodotto | Prezzo Vendita | Costo Unitario |
| :--- | :--- | :--- |
| Piatto pronto | €8.00 | €3.50 |
| Bibita | €2.50 | €0.60 |
| Acqua | €1.00 | €0.15 |

### 4. Incoerenze e Note (`Excel` vs. `index.html`)

L'applicazione web `index.html` funge da simulatore e presenta alcuni valori predefiniti diversi dal file Excel originale. Questo suggerisce che l'app web potrebbe essere utilizzata per testare scenari diversi.

*   **Marketing Ricorrente:**
    *   `Excel`: €500/mese
    *   `index.html`: **€1.500/mese**
*   **Assicurazioni e varie:**
    *   `Excel`: €0/mese
    *   `index.html`: **€500/mese**
*   **Commissione Delivery:**
    *   `Excel`: Non specificata
    *   `index.html`: **28%**
*   **Giorni Lavorativi Mese:**
    *   `Excel`: Valore non chiaro (0.28)
    *   `index.html`: **30 giorni** (usato per i calcoli)

**Conclusione:** L'app web (`index.html` e `script.js`) è lo strumento di lavoro principale e più aggiornato per le simulazioni. I dati del file Excel rappresentano un modello di base.
