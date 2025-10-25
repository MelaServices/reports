#!/usr/bin/env python3
# -*- coding: utf-8 -*-"""Script di validazione finale per il calcolo del fabbisogno finanziario."""

import numpy as np

def valida_modello():
    print("="*80)
    print("VALIDAZIONE FINALE DEL MODELLO FINANZIARIO (Logica Semplificata)")
    print("="*80)

    # --- 1. ESTRAZIONE PARAMETRI DAL MODELLO --- 
    params = {
        'piatti_store': 250, 'piatti_delivery': 120, 'bibite': 150, 'acqua': 250,
        'prezzo_piatto': 7.27, 'prezzo_bibita': 2.27, 'prezzo_acqua': 0.91,
        'costo_piatto': 3.50, 'costo_bibita': 0.60, 'costo_acqua': 0.15,
        'giorni_lavorativi': 30, 'commissione_delivery': 0.28,
        'affitto': 3000, 'personale': 6800, 'trasporti': 800, 'utenze': 700,
        'marketing': 1500, 'assicurazioni': 500, 'fideiussione_mensile': 45,
        'capex_fisso': 83695
    }

    # --- 2. CALCOLO VALORI A REGIME (100% Capacità) --- 
    ricavi_piatti_delivery_100 = params['piatti_delivery'] * params['giorni_lavorativi'] * params['prezzo_piatto']
    ricavi_totali_100 = (params['piatti_store'] + params['piatti_delivery']) * params['giorni_lavorativi'] * params['prezzo_piatto'] + \
                        params['bibite'] * params['giorni_lavorativi'] * params['prezzo_bibita'] + \
                        params['acqua'] * params['giorni_lavorativi'] * params['prezzo_acqua']

    cogs_totali_100 = ((params['piatti_store'] + params['piatti_delivery']) * params['giorni_lavorativi'] * params['costo_piatto']) + \
                      (params['bibite'] * params['giorni_lavorativi'] * params['costo_bibita']) + \
                      (params['acqua'] * params['giorni_lavorativi'] * params['costo_acqua'])

    opex_fisso_100 = sum([params[k] for k in ['affitto', 'personale', 'trasporti', 'utenze', 'marketing', 'assicurazioni', 'fideiussione_mensile']])
    commissione_delivery_100 = ricavi_piatti_delivery_100 * params['commissione_delivery']
    opex_totali_100 = opex_fisso_100 + commissione_delivery_100

    # --- 3. CALCOLO INVESTIMENTO INIZIALE (Logica Semplificata) --- 
    capitale_operativo = opex_totali_100 * 3
    investimento_totale_singolo_pdv = params['capex_fisso'] + capitale_operativo

    print("--- CALCOLO INVESTIMENTO SINGOLO PdV (Logica Semplificata) ---")
    print(f"CAPEX Fisso: € {params['capex_fisso']:,.0f}")
    print(f"Capitale Operativo Iniziale (3 mesi di OPEX a regime): € {capitale_operativo:,.0f}")
    print("-"*60)
    print(f"INVESTIMENTO TOTALE CALCOLATO PER PdV: € {investimento_totale_singolo_pdv:,.0f}")
    print("-"*60)

    # --- 4. SIMULAZIONE 24 MESI MULTI-STORE --- 
    aperture_pdv = [1, 13, 15, 17, 19]
    cash_flow_mensile_consolidato = np.zeros(24)

    def get_rampup_coefficient(mese_corrente, mese_apertura):
        if mese_corrente < mese_apertura: return 0
        mesi_attivo = mese_corrente - mese_apertura + 1
        if mesi_attivo <= 2: return 0.30
        elif mesi_attivo <= 9: return 0.60
        else: return 1.0

    for mese in range(1, 25):
        ricavi_mese_consolidato, cogs_mese_consolidato, opex_mese_consolidato, investimenti_mese_consolidato = 0, 0, 0, 0
        for i, mese_apertura in enumerate(aperture_pdv):
            coeff = get_rampup_coefficient(mese, mese_apertura)
            if coeff > 0:
                ricavi_mese_consolidato += ricavi_totali_100 * coeff
                cogs_mese_consolidato += cogs_totali_100 * coeff
                opex_mese_consolidato += opex_fisso_100 + (commissione_delivery_100 * coeff)
            if mese == mese_apertura:
                investimenti_mese_consolidato += investimento_totale_singolo_pdv
        
        cf_mese = ricavi_mese_consolidato - cogs_mese_consolidato - opex_mese_consolidato - investimenti_mese_consolidato
        cash_flow_mensile_consolidato[mese-1] = cf_mese

    cash_flow_cumulativo = np.cumsum(cash_flow_mensile_consolidato)
    min_cf_cumulativo = np.min(cash_flow_cumulativo)
    mese_min_cf = np.argmin(cash_flow_cumulativo) + 1

    # --- 5. RISULTATI DELLA VALIDAZIONE --- 
    print("\n" + "="*80)
    print("✅ RISULTATO FINALE DELLA VALIDAZIONE (Logica Semplificata)")
    print("="*80)
    print(f"\n🎯 MASSIMO FABBISOGNO FINANZIARIO (Punto di Minimo del CF Cumulativo):")
    print(f"   Valore Calcolato: € {abs(min_cf_cumulativo):,.0f}")
    print(f"   Mese del Fabbisogno: Mese {mese_min_cf}")
    print(f"\n💰 POSIZIONE DI CASSA FINALE (dopo 24 mesi):")
    print(f"   Valore Calcolato: € {cash_flow_cumulativo[-1]:,.0f}")
    print("\nQuesto è il valore finale e corretto, basato sulla tua regola di 3 mesi di OPEX come capitale operativo.")
    print("="*80)

if __name__ == "__main__":
    valida_modello()