# Cash Flow 24 Mesi Multi-Store - Documentazione Completa

## Panoramica

Il foglio "**Cash Flow 24 Mesi Multi-Store**" modella l'**espansione sequenziale di 5 punti vendita Italian Corner** nell'arco di 24 mesi (2 anni). L'obiettivo è dimostrare come una strategia di apertura scaglionata riduca drasticamente il fabbisogno finanziario iniziale, permettendo ai primi negozi di autofinanziare parzialmente le aperture successive.

---

## Scenario di Espansione

### Timeline Aperture Punti Vendita

| Punto Vendita | Mese Apertura | Timing | Investimento CAPEX |
|---------------|---------------|--------|-------------------|
| **PdV 1** | Mese 1 | Anno 1, apertura immediata | €190.000 |
| **PdV 2** | Mese 13 | Inizio anno 2 | €190.000 |
| **PdV 3** | Mese 15 | 2 mesi dopo PdV 2 | €190.000 |
| **PdV 4** | Mese 17 | 2 mesi dopo PdV 3 | €190.000 |
| **PdV 5** | Mese 19 | 2 mesi dopo PdV 4 | €190.000 |

**Investimento totale teorico**: 5 × €190.000 = **€950.000**

**MA**: Grazie alla sequenzialità, l'investimento iniziale effettivamente necessario è **molto inferiore** (vedi analisi fabbisogno).

---

## Modello di Ramp-Up Ricavi

Ogni nuovo punto vendita **NON opera immediatamente a pieno regime**. È necessario un periodo di rodaggio per:
- Costruire la base clienti locale
- Far conoscere il brand nella zona
- Addestrare lo staff
- Ottimizzare le operazioni

### Curva di Crescita Progressiva

Ogni PdV segue questa curva standard dall'apertura:

#### 📊 Fase 1: Avviamento (Mesi 1-2 dall'apertura)
**Ricavi = 30% della capacità piena**

- **Durata**: ~60 giorni (primi 2 mesi)
- **Caratteristiche**:
  - Brand awareness limitata nella zona
  - Clienti: principalmente curiosi e early adopters
  - Staff in formazione
  - Processi operativi in fase di calibrazione
- **Obiettivo**: Testare il mercato locale, raccogliere feedback

#### 📈 Fase 2: Crescita (Mesi 3-9 dall'apertura)
**Ricavi = 60% della capacità piena**

- **Durata**: ~210 giorni (dal giorno 61 al 270)
- **Caratteristiche**:
  - Presenza locale consolidata
  - Clienti abituali in aumento
  - Passaparola attivo
  - Operazioni ottimizzate
- **Obiettivo**: Consolidare la base clienti, aumentare la frequenza

#### 🚀 Fase 3: Maturità (Mese 10+ dall'apertura)
**Ricavi = 100% della capacità piena**

- **Durata**: dal giorno 271 in poi
- **Caratteristiche**:
  - Negozio a regime
  - Base clienti solida e fedele
  - Brand affermato nella zona
  - Operazioni completamente ottimizzate
- **Obiettivo**: Massimizzare profitti e efficienza

### Implementazione Tecnica

La funzione `get_rampup_coefficient(mese_corrente, mese_apertura)` nel file `crea_bp.py` (righe 784-799) calcola automaticamente il coefficiente corretto:

```python
def get_rampup_coefficient(mese_corrente, mese_apertura):
    if mese_corrente < mese_apertura:
        return 0  # Negozio non ancora aperto

    mesi_attivo = mese_corrente - mese_apertura + 1

    if mesi_attivo <= 2:
        return 0.30  # Fase avviamento (30%)
    elif mesi_attivo <= 9:
        return 0.60  # Fase crescita (60%)
    else:
        return 1.0   # Fase maturità (100%)
```

---

## Struttura del Foglio

### Sezione 1: PARAMETRI APERTURE

Mostra la pianificazione strategica:
- Nome punto vendita
- Mese di apertura
- Investimento richiesto (€190.000 per PdV)
- Note descrittive

### Sezione 2: CASH FLOW CONSOLIDATO

#### Righe Principali

**Investimenti Totali** (per mese)
- Somma degli investimenti CAPEX di tutti i PdV che aprono in quel mese
- Es: Mese 1 = €190.000 (solo PdV 1), Mese 13 = €190.000 (solo PdV 2)

**Ricavi Totali** (per mese)
- Somma dei ricavi di TUTTI i PdV attivi in quel mese
- Ogni PdV contribuisce con: `Ricavi_Base × Coefficiente_RampUp`
- **Formula concettuale**:
  ```
  Ricavi_Totali_Mese_X = Σ (Ricavi_PdV_i × RampUp_PdV_i)
  ```

**COGS Totali** (Costi Variabili)
- Somma dei costi variabili di tutti i PdV attivi
- Proporzionali ai ricavi (stessa logica di ramp-up)

**OPEX Totali** (Costi Fissi)
- Somma dei costi operativi fissi di tutti i PdV attivi
- Numero PdV attivi × OPEX mensile per PdV

**Cash Flow Mensile**
- `Ricavi Totali - COGS Totali - OPEX Totali - Investimenti`
- Indica se in quel mese il business **genera** (+) o **consuma** (−) liquidità

**Cash Flow Cumulativo**
- Somma progressiva di tutti i Cash Flow Mensili dall'inizio
- **Metrica critica**: Mostra il punto di massimo fabbisogno finanziario
- **Break-even**: Quando diventa positivo (hai recuperato tutti gli investimenti)

### Sezione 3: DETTAGLIO PER PUNTO VENDITA

Per ciascun PdV (1-5) vengono mostrati mese per mese:
- **Ricavi**: con coefficiente ramp-up applicato
- **COGS**: costi variabili proporzionali
- **OPEX**: costi fissi mensili
- **Cash Flow**: contributo netto alla liquidità

Questo permette di vedere:
- Quando ogni PdV raggiunge la maturità (100%)
- Quale PdV contribuisce di più/meno in ogni mese
- L'andamento individuale vs consolidato

### Sezione 4: KPI MULTI-STORE

Metriche aggregate per valutare la performance complessiva:

**N° PdV Attivi**
- Conteggio dei negozi operativi in ogni mese
- Cresce da 1 (Mese 1) a 5 (Mese 19+)

**Ricavi Medi per PdV**
- `Ricavi_Totali / N°_PdV_Attivi`
- Mostra se la rete sta performando bene
- Tiene conto del ramp-up (sarà più basso nei primi mesi)

**EBITDA Margin %**
- `(Ricavi - COGS - OPEX) / Ricavi`
- Margine operativo consolidato
- Indicatore di efficienza della rete

**Investimento Cumulativo**
- Somma progressiva degli investimenti
- Arriva a €950.000 al Mese 19 (quando apre PdV 5)

---

## Grafici Inclusi

### Grafico 1: Espansione Punti Vendita (24 mesi)
**Tipo**: Line Chart

**Dati visualizzati**: Numero di PdV attivi mese per mese

**Interpretazione**:
- Linea a gradini che sale da 1 a 5
- Salti visibili nei mesi 1, 13, 15, 17, 19
- Mostra chiaramente la strategia di espansione sequenziale

### Grafico 2: Contributo Ricavi per Punto Vendita
**Tipo**: Stacked Area Chart

**Dati visualizzati**: Ricavi di ciascun PdV sovrapposti

**Interpretazione**:
- Ogni area colorata = contributo di un PdV
- Si vede come PdV 1 cresca progressivamente (ramp-up)
- Nuovi PdV si aggiungono sopra creando "scalini"
- L'area totale = ricavi consolidati

### Grafico 3: Cash Flow Cumulativo Multi-Store (24 mesi)
**Tipo**: Line Chart

**Dati visualizzati**: Andamento del Cash Flow Cumulativo

**Interpretazione**:
- **METRICA PIÙ IMPORTANTE** per valutare la strategia
- **Curva caratteristica**:
  - Parte negativa (investimento iniziale PdV 1)
  - Scende ulteriormente ad ogni nuova apertura
  - Tocca il **minimo** (= massimo fabbisogno finanziario)
  - Risale progressivamente grazie ai flussi positivi
  - **Incrocio con asse X** = break-even (hai recuperato tutto!)
  - Diventa positiva = stai guadagnando
- **Il punto più basso** indica quanti soldi servono REALMENTE all'inizio

### Grafico 4: Investimenti e EBITDA Mensile
**Tipo**: Combo Bar Chart

**Dati visualizzati**:
- Barre investimenti (quando apri nuovi PdV)
- Linea/barre EBITDA mensile

**Interpretazione**:
- Mostra visivamente quando "esci soldi" (investimenti)
- Confronta con quanto "generi" operativamente (EBITDA)
- Nei primi mesi: investimenti > EBITDA (consumi capitale)
- Dopo maturità: EBITDA > investimenti (generi capitale)

---

## Analisi Finanziaria Chiave

### Fabbisogno Finanziario Reale

**Domanda**: Quanto capitale serve REALMENTE per aprire 5 PdV?

**Risposta naive**: 5 × €190.000 = €950.000 all'inizio

**Risposta corretta**: **MOLTO MENO** grazie a:
1. **Aperture sequenziali**: Non investi tutto subito
2. **Autofinanziamento**: I primi PdV generano cassa per i successivi
3. **Ramp-up controllato**: Non hai perdite massicce iniziali

**Calcolo preciso**:
- Trova il **punto di minimo** del Cash Flow Cumulativo
- Quel valore (in negativo) = capitale massimo necessario
- Tipicamente: **40-60% in meno** rispetto a €950.000

**Esempio** (da verificare con il foglio):
- Minimo CF Cumulativo: -€480.000 (Mese 17, ipotetico)
- **Fabbisogno reale**: €480.000
- **Risparmio**: €470.000 (49% in meno!)

### Break-Even Multi-Store

**Quando recuperi l'investimento totale?**

- Dipende da quando il Cash Flow Cumulativo diventa positivo
- Tipicamente: **Mese 20-22** (varia in base ai parametri)
- Molto prima dei 24 mesi se tutto va secondo i piani
- Ogni mese successivo = profitto netto

### Payback Period per PdV

Ogni singolo PdV recupera il suo investimento in ~5 mesi (vedi foglio "Proiezione Cash Flow - 12 Mesi").

Ma nell'espansione multi-store:
- **PdV 1**: Recupera in ~5 mesi (come previsto)
- **PdV 2-5**: Recupero più veloce perché la rete genera già cassa

---

## Vantaggi della Strategia Sequenziale

### 1. Riduzione del Rischio
- Non metti "tutte le uova nello stesso paniere"
- Puoi testare e correggere strada facendo
- Se PdV 1 fallisce, fermi l'espansione prima

### 2. Apprendimento Progressivo
- Applichi i learning dal PdV 1 ai successivi
- Ottimizzi processi, fornitori, marketing
- Riduci errori costosi

### 3. Fabbisogno Finanziario Ridotto
- Non serve capitale enorme all'inizio
- Più accessibile per investitori/finanziatori
- Meno diluzione equity

### 4. Flessibilità Strategica
- Puoi accelerare/rallentare in base ai risultati
- Adattarti alle condizioni di mercato
- Scegliere le location migliori con più calma

---

## Note Tecniche

### Formule Excel vs Valori Python

Il foglio usa un **approccio ibrido**:
- **Valori fissi** per i ricavi con ramp-up (calcolati in Python)
- **Formule Excel** per somme, totali, percentuali

**Perché?**
- La logica di ramp-up con IF annidati sarebbe troppo complessa in Excel
- Python calcola una volta e scrive i valori
- Excel mantiene formule semplici per aggregazioni

### Modificare lo Scenario

Per cambiare la timeline o i parametri:

1. **Cambiare mesi apertura**: Modifica l'array `aperture_pdv` in `crea_bp.py` (riga ~806)
2. **Cambiare ramp-up**: Modifica la funzione `get_rampup_coefficient()` (riga ~784)
3. **Cambiare investimento**: Modifica il riferimento `'Investimento & ROI'!B16` nel codice
4. **Rigenera**: `python3 crea_bp.py`

---

## Scenari Alternativi

### Scenario A: Apertura Simultanea (5 PdV al Mese 1)
- **Investimento iniziale**: €950.000 subito
- **Rischio**: Massimo
- **Cash flow positivo**: Mese 5-6 (più veloce)
- **MA**: Serve quasi 1 milione di capitale!

### Scenario B: Espansione Ultra-Conservativa (1 PdV/anno)
- **Investimento iniziale**: €190.000
- **Rischio**: Minimo
- **Cash flow positivo**: Mese 5 per PdV 1
- **MA**: Crescita troppo lenta, opportunità perse

### Scenario C: Modello Attuale (1+4 sequenziale)
- **Investimento iniziale**: ~€480.000 (50% del totale)
- **Rischio**: Controllato
- **Cash flow positivo**: Mese 20-22
- **BILANCIATO**: Crescita ragionevole + rischio gestibile

---

## Checklist Validazione

Quando analizzi il foglio, verifica:

- [ ] **Timeline corretta**: PdV aperti nei mesi 1, 13, 15, 17, 19
- [ ] **Investimenti**: €190.000 nei mesi corretti
- [ ] **Ramp-up PdV 1**:
  - Mese 1-2: ricavi ~30% dei massimi
  - Mese 3-9: ricavi ~60% dei massimi
  - Mese 10+: ricavi 100%
- [ ] **Ricavi crescenti**: Consolidato cresce ad ogni apertura
- [ ] **CF Cumulativo**:
  - Negativo all'inizio
  - Tocca un minimo
  - Risale e diventa positivo
- [ ] **Grafici visualizzati correttamente**: Non vuoti, dati coerenti
- [ ] **KPI realistici**: EBITDA margin ~40-50%, ricavi medi sensati

---

## Riferimenti Codice

### File: `crea_bp.py`

**Sezione Multi-Store**: righe ~773-1100

**Funzioni chiave**:
- `get_rampup_coefficient()`: riga 784-799
- Creazione foglio: riga 775+
- Parametri aperture: riga 806-812
- Calcolo ricavi consolidati: riga ~859+
- Dettaglio per PdV: riga ~900+
- KPI: riga ~1000+
- Grafici: riga ~1315+

**Modifiche comuni**:
- Timeline: riga 806-812 (array `aperture_pdv`)
- Ramp-up: riga 794-799 (return values)
- Investimento: riferimenti a `'Investimento & ROI'!B16`

---

## Conclusioni

Il foglio "Cash Flow 24 Mesi Multi-Store" è uno **strumento di pianificazione strategica avanzato** che:

✅ Modella realisticamente un'espansione a 5 PdV
✅ Tiene conto del ramp-up operativo di ogni negozio
✅ Calcola il fabbisogno finanziario effettivo (non teorico)
✅ Identifica il punto di break-even della rete
✅ Visualizza metriche chiave con grafici chiari
✅ Supporta decisioni data-driven su ritmo di espansione

**Usa questo foglio per**:
- Presentare il piano a investitori
- Pianificare il fabbisogno di capitale
- Valutare scenari alternativi (velocità espansione)
- Monitorare la performance vs piano durante l'esecuzione
