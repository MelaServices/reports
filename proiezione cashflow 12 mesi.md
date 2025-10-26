# Spiegazione Proiezione Cash Flow 12 Mesi - Italian Corner

## Struttura del Foglio

Il foglio "Proiezione Cash Flow - 12 Mesi" mostra la movimentazione di denaro (liquidità) mese per mese per il primo anno di attività del punto vendita Italian Corner.

---

## SEZIONE 1: ENTRATE (CASH IN)

### Ricavi da vendite
**Cosa rappresenta**: Denaro che entra dalla vendita di piatti, bevande e altri prodotti.

**Valore**: €107.550/mese (costante)
- Riferimento: Preso dal foglio "P&L Mensile", riga dei ricavi totali
- Include: vendite in store, delivery, bibite, acqua

**Formula**: `='P&L Mensile'!D[riga_ricavi]`

### ~~Investimento iniziale~~ (ERRORE - DA RIMUOVERE)
**PROBLEMA IDENTIFICATO**: L'investimento di €190.000 è attualmente inserito come "entrata" nel Mese 1.
- **ERRATO**: Un investimento NON è denaro che entra, ma denaro che ESCE
- **CONSEGUENZA**: Il Cash Flow Mensile del Mese 1 risulta positivo (+€233.770) invece di negativo (-€146.230)

**CORREZIONE NECESSARIA**: L'investimento deve essere spostato nella sezione "USCITE" oppure sottratto direttamente nel calcolo del Cash Flow Mensile.

---

## SEZIONE 2: USCITE (CASH OUT)

### Costi variabili (COGS)
**Cosa rappresenta**: Costo delle materie prime e ingredienti per preparare i piatti.

**Valore**: €42.675/mese (costante)
- Dipende da: Volume di vendita × Costo unitario ingredienti
- Riferimento: Dal foglio "P&L Mensile", riga COGS totali

**Formula**: `='P&L Mensile'!D[riga_cogs]`

### Costi operativi (OPEX)
**Cosa rappresenta**: Tutti i costi fissi mensili per far funzionare il locale.

**Valore**: €21.105/mese (costante)
- Include:
  - Affitto locale: €3.000
  - Personale (2 addetti): €6.800 (€3.400 × 2)
  - Trasporti e logistica: €800
  - Utenze (energia, acqua, web): €700
  - Leasing attrezzature: €2.000
  - Marketing e pubblicità: €1.500
  - Assicurazioni e varie: €500
  - Quote leasing CAPEX: calcolate dal piano investimenti

**Formula**: `='P&L Mensile'!D[riga_opex]`

### Totale Uscite
**Valore**: €63.780/mese
- Calcolo: COGS + OPEX = €42.675 + €21.105

**Formula**: `=[colonna]COGS + [colonna]OPEX`

---

## SEZIONE 3: CASH FLOW ANALYSIS

### Cash Flow Mensile (ATTUALMENTE ERRATO)

**Definizione**: Differenza tra denaro entrato e uscito in quel mese specifico.

**Valore ATTUALE (ERRATO)**:
- Mese 1: €233.770 (SBAGLIATO - include investimento come entrata)
- Mesi 2-12: €43.770

**Valore CORRETTO (dopo fix)**:
- **Mese 1**: €107.550 - €63.780 - €190.000 = **-€146.230** (negativo perché investi)
- **Mesi 2-12**: €107.550 - €63.780 = **+€43.770** (positivo, genera liquidità)

**Formula CORRETTA**:
```
Mese 1: =Ricavi - Totale_Uscite - Investimento_Iniziale
Mesi 2-12: =Ricavi - Totale_Uscite
```

**Interpretazione**:
- **Negativo**: Il business consuma liquidità (devi mettere soldi)
- **Positivo**: Il business genera liquidità (produce profitto)

---

### Cash Flow Cumulativo (ATTUALMENTE ERRATO)

**Definizione**: Somma progressiva di tutti i Cash Flow Mensili dall'inizio dell'attività.

**Valore ATTUALE (ERRATO)**:
- Mese 1: €233.770
- Mese 12: €715.240

**Valore CORRETTO (dopo fix)**:
- **Mese 1**: -€146.230 (hai speso l'investimento iniziale)
- **Mese 2**: -€146.230 + €43.770 = -€102.460
- **Mese 3**: -€102.460 + €43.770 = -€58.690
- **Mese 4**: -€58.690 + €43.770 = -€14.920 (quasi break-even!)
- **Mese 5**: -€14.920 + €43.770 = **+€28.850** ✅ **BREAK-EVEN RAGGIUNTO**
- **Mese 12**: +€28.850 + (7 × €43.770) = **+€335.240**

**Formula CORRETTA**:
```
Mese 1: =CF_Mensile_Mese_1
Mese N: =CF_Cumulativo_Mese_(N-1) + CF_Mensile_Mese_N
```

**Interpretazione**:
- **Negativo**: Hai ancora "in rosso" rispetto all'investimento iniziale
- **Zero**: Hai recuperato esattamente l'investimento (break-even point)
- **Positivo**: Hai recuperato l'investimento e stai guadagnando

---

## BREAK-EVEN POINT

**Definizione**: Il mese in cui il Cash Flow Cumulativo diventa positivo (> €0).

**Attuale (ERRATO)**: Mese 1 (€233.770) - tecnicamente già positivo ma sbagliato!

**Corretto (dopo fix)**: **Mese 5**
- A quel punto hai recuperato l'investimento iniziale di €190.000
- Da lì in poi ogni mese generi €43.770 di liquidità netta

---

## FORMULA DI RIEPILOGO

### Cash Flow Mensile Corretto:
```
Mese 1 = Ricavi - COGS - OPEX - Investimento
       = €107.550 - €42.675 - €21.105 - €190.000
       = -€146.230 ❌ (negativo = esci soldi)

Mesi 2-12 = Ricavi - COGS - OPEX
          = €107.550 - €42.675 - €21.105
          = +€43.770 ✅ (positivo = generi cassa)
```

### Cash Flow Cumulativo Corretto:
```
Mese 1:  -€146.230
Mese 2:  -€102.460 (-€146.230 + €43.770)
Mese 3:  -€58.690
Mese 4:  -€14.920
Mese 5:  +€28.850 ← BREAK-EVEN! 🎉
Mese 12: +€335.240
```

---

## GRAFICO (ATTUALMENTE VUOTO - DA FIXARE)

Il grafico "Andamento Cash Flow Cumulativo (12 mesi)" dovrebbe mostrare:
- **Asse X**: Mesi da 1 a 12
- **Asse Y**: Valore in Euro del Cash Flow Cumulativo
- **Curva**:
  - Parte da -€146.230 (Mese 1, negativo)
  - Scende fino al punto più basso
  - Risale progressivamente
  - Incrocia l'asse X (zero) al Mese 5 (break-even)
  - Continua a salire fino a +€335.240 (Mese 12)

**Problema attuale**: Il grafico mostra solo la leggenda (Serie1-12) ma nessun dato.
**Causa**: Probabilmente il riferimento dati nel codice del grafico punta a celle sbagliate o la serie è configurata male.

---

## CONCLUSIONE

### Cosa dice il Cash Flow corretto:
1. **Investi €190.000** all'inizio (Mese 1)
2. **Ogni mese generi €43.770** di liquidità operativa (dopo Mese 1)
3. **Recuperi l'investimento in 5 mesi** (break-even al Mese 5)
4. **Dopo 12 mesi hai €335.240** di liquidità cumulativa
5. **ROI a 12 mesi**: (€335.240 / €190.000) = **176%** 🚀

### Differenza con P&L:
- **P&L (Conto Economico)**: Mostra PROFITTI (ricavi - costi), competenza economica
- **Cash Flow**: Mostra LIQUIDITÀ (soldi che entrano/escono), competenza finanziaria
- Il Cash Flow include l'investimento iniziale CAPEX, il P&L no (solo ammortamenti)
