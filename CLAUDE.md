# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Italian Corner Business Plan Generator** - A Python-based financial modeling toolkit for creating and analyzing business plans for an Italian food retail concept. The project generates comprehensive Excel workbooks with fully dynamic, formula-based financial models including P&L statements, cash flow projections, ROI analysis, and multi-store expansion scenarios.

## Core Architecture

### Main Generator (`crea_bp.py` - 1408 lines)
The primary script that generates the complete Business Plan Excel workbook (`Business_Plan_Italian_Corner.xlsx`). This is a sophisticated Excel generator that creates multiple interconnected worksheets using openpyxl formulas rather than hard-coded values.

**Key worksheets generated:**
- **Parametri**: Master control dashboard where all business assumptions are defined (volumes, prices, costs, operational parameters)
- **P&L Mensile**: 12-month profit & loss statement with ramp-up applied (30%/60%/100% capacity by month)
- **Investimento & ROI**: CAPEX breakdown, total investment calculation, payback period, and ROI metrics
- **Analisi Scenari**: Scenario comparison (base, pessimistic, optimistic) for key metrics
- **Cash Flow 12 Mesi**: 12-month single-store cash flow projection with ramp-up applied
- **Cash Flow 24 Mesi Multi-Store**: Multi-period cash flow projections for 5-store expansion scenario showing consolidated cash flows, individual store details, and KPIs
- **Executive Summary**: High-level overview with key metrics and recommendations

**Design principle**: All worksheets reference the Parametri sheet through Excel formulas, making the entire business plan dynamically recalculate when assumptions change.

### Analysis Scripts

**`analizza_excel.py` (185 lines)**: Comprehensive business plan analyzer
- Loads and inspects all worksheets in the generated Excel file
- Reports on formulas vs values, sheet dimensions, and data structure
- Extracts and displays key metrics from Parametri, P&L, and ROI sheets
- Useful for validating the generated workbook structure

**`analizza_fabbisogno.py` (143 lines)**: Financial requirement analyzer for multi-store expansion
- Analyzes the "Cash Flow 24 Mesi Multi-Store" sheet
- Identifies the maximum funding requirement (peak negative cash flow)
- Calculates break-even timing and demonstrates that sequential store openings require less upfront capital than simultaneous openings
- Provides quarterly cash flow analysis

**`verifica_cf24.py` (149 lines)**: Cash flow validation tool
- Verifies the structure and calculations in the multi-store cash flow sheet
- Displays store opening parameters, consolidated cash flows, individual store details, and multi-store KPIs
- Helps debug and validate the complex multi-period, multi-entity cash flow model

## Technology Stack

- **Python 3.11+** (developed with 3.11.3)
- **openpyxl**: Core library for Excel file manipulation
  - Creates workbooks with formulas (not just values)
  - Applies styling (fonts, fills, borders, alignments)
  - Supports both formula reading (`data_only=False`) and evaluated value reading (`data_only=True`)

## Common Commands

### Generate the Business Plan
```bash
python3 crea_bp.py
```
Creates/overwrites `Business_Plan_Italian_Corner.xlsx` with a complete, formula-driven business plan model.

### Analyze the Generated Business Plan
```bash
python3 analizza_excel.py
```
Displays detailed information about all worksheets, parameters, and calculated metrics.

### Analyze Financial Requirements
```bash
python3 analizza_fabbisogno.py
```
Shows the actual capital needed for multi-store expansion, identifying the peak funding requirement and break-even point.

### Verify Multi-Store Cash Flow
```bash
python3 verifica_cf24.py
```
Validates the structure and sample values from the 24-month multi-store cash flow projection.

## Development Workflow

When modifying the business plan generator:

1. **Edit business assumptions**: Modify the `params_data` structure in `crea_bp.py` (starts around line 54)
2. **Adjust worksheet formulas**: Locate the relevant worksheet creation section (P&L, ROI, Cash Flow)
3. **Regenerate**: Run `python3 crea_bp.py`
4. **Validate**: Run `python3 analizza_excel.py` to verify structure
5. **Test specific features**: Use `verifica_cf24.py` or `analizza_fabbisogno.py` as needed

## Key Implementation Details

### Excel Formula Usage
The generator extensively uses Excel formulas as strings (e.g., `"=B20*B19"`, `"=IFERROR((B11-C11)/B11,0)"`) which are written to cells. This creates a live Excel model where changing parameters automatically updates all dependent calculations.

### Reading Excel Files
Scripts use two approaches:
- `data_only=False`: Read formulas as they are stored
- `data_only=True`: Read calculated/evaluated values (useful for displaying results)

### Styling System
Common styles are defined once (title_font, header_font, etc.) and applied consistently via the `apply_style()` helper function to maintain visual consistency across all worksheets.

### Revenue Ramp-Up Model (CRITICAL)

**ALL financial projections in this business plan use a realistic ramp-up model** reflecting the time needed for a new store to reach full operational capacity. This is NOT a simplistic "100% from day 1" model.

#### Ramp-Up Coefficients

Every new store follows this proven ramp-up curve:

- **Months 1-2 from opening** (~0-60 days): **30% of full capacity**
  - Initial phase: brand awareness building, limited customer base
  - Staff training period, operational fine-tuning
  - Lower foot traffic, menu optimization in progress

- **Months 3-9 from opening** (~61-270 days): **60% of full capacity**
  - Growth phase: established local presence, increasing customer loyalty
  - Optimized operations, word-of-mouth effect taking hold
  - Repeat customers becoming regular, online presence growing

- **Month 10+ from opening** (~271+ days): **100% of full capacity**
  - Mature phase: full operational capacity
  - Established customer base, optimized processes
  - Peak efficiency in operations and marketing

#### Implementation Across Sheets

**1. P&L Mensile (crea_bp.py:245-477)**
- Contains **12 monthly columns** (Mese 1 through Mese 12)
- Each month applies the appropriate ramp-up coefficient to:
  - **Revenues**: All product categories (piatti, bibite, acqua) are multiplied by the coefficient
  - **COGS**: Variable costs scale proportionally with revenues (also multiplied by coefficient)
  - **OPEX**: Fixed costs remain constant (NOT affected by ramp-up)
  - **Commissioni delivery**: Scale with delivery revenues (affected by ramp-up)

**Helper function** `get_rampup_for_month(mese)` (line 246):
```python
def get_rampup_for_month(mese):
    if mese <= 2: return 0.30
    elif mese <= 9: return 0.60
    else: return 1.00
```

**2. Cash Flow 12 Mesi (crea_bp.py:745-863)**
- References the **monthly columns** from P&L Mensile
- Each month (M1-M12) references the corresponding column in P&L
- Formula example: `='P&L Mensile'!B{row}` for month 1, `='P&L Mensile'!C{row}` for month 2, etc.
- **Automatically inherits ramp-up** from P&L without additional logic

**3. Cash Flow 24 Mesi Multi-Store (crea_bp.py:866-1145)**
- Models **5 stores opening sequentially** with different opening months
- Uses `get_rampup_coefficient(mese_corrente, mese_apertura)` function (line 877)
- Calculates ramp-up **dynamically per store per month**:
  - Store 1 opening in M1: M1-M2 at 30%, M3-M9 at 60%, M10+ at 100%
  - Store 2 opening in M13: M13-M14 at 30%, M15-M21 at 60%, M22+ at 100%
  - And so on for stores 3, 4, 5
- Both **revenues AND COGS** are multiplied by the coefficient
- **OPEX remains fixed** from the month of opening

**Formula generation logic**:
```python
coeff = get_rampup_coefficient(mese, mese_apertura)
if coeff > 0:
    ws_cf24.cell(value=f"='P&L Mensile'!D{row_ricavi_tot}*{coeff}")
```

**4. Investimento & ROI (crea_bp.py:506)**
- Uses **AVERAGE** of all 12 months from P&L to calculate EBITDA Mensile Medio
- Formula: `=AVERAGE('P&L Mensile'!B{row_ebitda}:M{row_ebitda})`
- This provides a realistic average that accounts for ramp-up period
- ROI and Payback calculations are based on this averaged EBITDA

#### Critical Formulas

**P&L Mensile - Ricavi Piatti in store (row 5, month 1):**
```excel
=Parametri!B4*Parametri!B28*Parametri!C11*0.30
```
(volume × giorni × prezzo × 30%)

**P&L Mensile - COGS Piatti (row 16, month 1):**
```excel
=(Parametri!B4+Parametri!B5)*Parametri!B28*Parametri!D11*0.30
```
(volume × giorni × costo × 30%)

**Cash Flow 12 Mesi - Ricavi (month 1):**
```excel
='P&L Mensile'!B{row_ricavi_tot}
```
(direct reference to P&L month 1)

**Cash Flow 24 Mesi - Ricavi PdV1 (month 1):**
```excel
='P&L Mensile'!D{row_ricavi_tot}*0.30
```
(references "regime" value and applies 30%)

#### Why This Matters

1. **Realistic projections**: No business reaches 100% capacity on day 1
2. **Accurate cash flow**: Prevents overly optimistic early-month projections
3. **Better planning**: Shows true funding needs during ramp-up period
4. **ROI calculation**: Uses averaged EBITDA, not just peak month
5. **Multi-store expansion**: Each store's ramp-up is independent and correctly tracked

### Multi-Store Expansion Model

The "Cash Flow 24 Mesi Multi-Store" sheet models a **sequential 5-store expansion strategy** over 24 months. This approach demonstrates how cash flow from earlier stores helps fund later openings, significantly reducing total upfront capital requirements.

#### Store Opening Timeline
- **PdV 1**: Month 1 (immediate opening, year 1)
- **PdV 2**: Month 13 (beginning of year 2)
- **PdV 3**: Month 15 (2 months after PdV 2)
- **PdV 4**: Month 17 (2 months after PdV 3)
- **PdV 5**: Month 19 (2 months after PdV 4)

Each store requires a €190,000 initial investment (CAPEX).

#### Revenue Ramp-Up Implementation in Multi-Store

The `get_rampup_coefficient(mese_corrente, mese_apertura)` function (crea_bp.py:877-892) calculates the appropriate coefficient for each store in each month based on how many months have passed since opening. This function is used **exclusively for the Cash Flow 24 Mesi Multi-Store** sheet where multiple stores open at different times.

For single-store projections (P&L Mensile, Cash Flow 12 Mesi), the simpler `get_rampup_for_month(mese)` function is used instead.

#### Key Financial Metrics Tracked
The model consolidates and tracks:
- **Investimenti Totali**: Total CAPEX deployed per month
- **Ricavi Totali**: Aggregated revenues from all active stores (with ramp-up applied)
- **COGS Totali**: Consolidated variable costs
- **OPEX Totali**: Combined operational costs
- **Cash Flow Mensile**: Monthly net cash generation/consumption
- **Cash Flow Cumulativo**: Running total showing when expansion becomes self-funding

#### Critical Insights
1. **Peak funding requirement**: The model identifies the maximum negative cash flow (when you need the most capital)
2. **Break-even timing**: When cumulative cash flow turns positive
3. **Self-funding expansion**: Later stores are partially funded by earlier stores' positive cash flow
4. **Actual capital needed**: Typically ~40-60% less than 5 × €190,000 due to sequential timing
