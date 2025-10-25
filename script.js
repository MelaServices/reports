document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard Caricata e Pronta.');

    let cf12ChartInstance, cf24ChartInstance;

    const inputs = document.querySelectorAll('#params-form input');
    inputs.forEach(input => {
        input.addEventListener('change', updateDashboard);
    });

    const formatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
    const percentFormatter = new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1 });

    function getParams() {
        const params = {};
        inputs.forEach(input => {
            params[input.id] = parseFloat(input.value);
        });
        return params;
    }

    // --- FUNZIONI DI CALCOLO ---

    function calculatePnl(params, regime) {
        const pnlData = { headers: ['Voce'], rows: {} };
        const rampUpCoeff = (mese) => {
            if (mese <= 2) return 0.3;
            if (mese <= 9) return 0.6;
            return 1.0;
        };

        const items = ['Ricavi Totali', 'COGS Totali', 'Margine di Contribuzione', 'OPEX Totali', 'EBITDA', 'EBITDA Margin %'];
        items.forEach(item => pnlData.rows[item] = [{value: item}]);

        for (let mese = 1; mese <= 12; mese++) {
            pnlData.headers.push(`Mese ${mese}`);
            const coeff = rampUpCoeff(mese);

            const ricavi = regime.ricavi_totali_100 * coeff;
            const cogs = regime.cogs_totali_100 * coeff;
            const margine = ricavi - cogs;
            const opex = regime.opex_fisso_100 + (regime.commissione_delivery_100 * coeff);
            const ebitda = margine - opex;
            const ebitdaMargin = ricavi === 0 ? 0 : ebitda / ricavi;

            pnlData.rows['Ricavi Totali'].push({ value: ricavi, description: 'Ricavi a regime × coeff. ramp-up', formula: `${formatter.format(regime.ricavi_totali_100)} × ${percentFormatter.format(coeff)}` });
            pnlData.rows['COGS Totali'].push({ value: cogs, description: 'COGS a regime × coeff. ramp-up', formula: `${formatter.format(regime.cogs_totali_100)} × ${percentFormatter.format(coeff)}` });
            pnlData.rows['Margine di Contribuzione'].push({ value: margine, description: 'Ricavi - COGS', formula: `${formatter.format(ricavi)} - ${formatter.format(cogs)}` });
            pnlData.rows['OPEX Totali'].push({ value: opex, description: 'OPEX fissi + commissioni delivery con ramp-up', formula: `${formatter.format(regime.opex_fisso_100)} + (${formatter.format(regime.commissione_delivery_100)} × ${percentFormatter.format(coeff)})` });
            pnlData.rows['EBITDA'].push({ value: ebitda, description: 'Margine di Contribuzione - OPEX', formula: `${formatter.format(margine)} - ${formatter.format(opex)}` });
            pnlData.rows['EBITDA Margin %'].push({ value: ebitdaMargin, type: 'percent', description: 'EBITDA / Ricavi Totali', formula: `${formatter.format(ebitda)} / ${formatter.format(ricavi)}` });
        }
        return pnlData;
    }

    function calculateFinancials(params) {
        const ricavi_piatti_delivery_100 = params.piatti_delivery * params.giorni_lavorativi * params.prezzo_piatto;
        const ricavi_totali_100 = (params.piatti_store + params.piatti_delivery) * params.giorni_lavorativi * params.prezzo_piatto + 
                                  params.bibite * params.giorni_lavorativi * params.prezzo_bibita + 
                                  params.acqua * params.giorni_lavorativi * params.prezzo_acqua;

        const cogs_totali_100 = ((params.piatti_store + params.piatti_delivery) * params.giorni_lavorativi * params.costo_piatto) + 
                                (params.bibite * params.giorni_lavorativi * params.costo_bibita) + 
                                (params.acqua * params.giorni_lavorativi * params.costo_acqua);

        const opex_fisso_100 = params.affitto + (params.numero_addetti * params.costo_addetto) + params.trasporti + params.utenze + params.marketing + params.assicurazioni + (params.affitto * 12 * params.fideiussione_costo_annuo / 12);
        const commissione_delivery_100 = ricavi_piatti_delivery_100 * params.commissione_delivery;
        const opex_totali_100 = opex_fisso_100 + commissione_delivery_100;

        const regime = { ricavi_totali_100, cogs_totali_100, opex_totali_100, opex_fisso_100, commissione_delivery_100 };
        const pnl = calculatePnl(params, regime);

        const ebitda_annuale_medio = pnl.rows['EBITDA'].slice(1).reduce((acc, cell) => acc + cell.value, 0) / 12;

        const capex_fisso = 83695;
        const capitale_operativo = opex_totali_100 * params.mesi_opex_capitale;
        const investimento_totale_singolo_pdv = capex_fisso + capitale_operativo;

        const payback_period = ebitda_annuale_medio > 0 ? investimento_totale_singolo_pdv / ebitda_annuale_medio : 0;
        const roi_anno_1 = investimento_totale_singolo_pdv > 0 ? (ebitda_annuale_medio * 12) / investimento_totale_singolo_pdv : 0;

        return {
            regime,
            pnl,
            investimento: { capex_fisso, capitale_operativo, investimento_totale_singolo_pdv },
            roi: { ebitda_annuale_medio, payback_period, roi_anno_1 }
        };
    }

    function calculateCf12(pnlData, investimento) {
        const cf12Data = { headers: ['Voce'], rows: {} };
        const items = ['Ricavi', 'COGS', 'OPEX', 'Investimento', 'Cash Flow Mensile', 'Cash Flow Cumulativo'];
        items.forEach(item => cf12Data.rows[item] = [{value: item}]);

        let cumulativeCf = 0;
        for (let mese = 1; mese <= 12; mese++) {
            cf12Data.headers.push(`Mese ${mese}`);
            const ricavi = pnlData.rows['Ricavi Totali'][mese].value;
            const cogs = pnlData.rows['COGS Totali'][mese].value;
            const opex = pnlData.rows['OPEX Totali'][mese].value;
            const investimentoVal = (mese === 1) ? investimento.investimento_totale_singolo_pdv : 0;

            const cfMensile = ricavi - cogs - opex - investimentoVal;
            cumulativeCf += cfMensile;

            cf12Data.rows['Ricavi'].push({ value: ricavi, description: 'Da P&L Mensile'});
            cf12Data.rows['COGS'].push({ value: cogs, description: 'Da P&L Mensile'});
            cf12Data.rows['OPEX'].push({ value: opex, description: 'Da P&L Mensile'});
            cf12Data.rows['Investimento'].push({ value: -investimentoVal, description: 'Costo di avvio del PdV (solo Mese 1)', formula: formatter.format(-investimentoVal) });
            cf12Data.rows['Cash Flow Mensile'].push({ value: cfMensile, description: 'Ricavi - (COGS + OPEX + Investimento)', formula: `${formatter.format(ricavi)} - (${formatter.format(cogs)} + ...)` });
            cf12Data.rows['Cash Flow Cumulativo'].push({ value: cumulativeCf, description: 'CF Cumulativo precedente + CF Mensile corrente', formula: `${formatter.format(cumulativeCf - cfMensile)} + ${formatter.format(cfMensile)}` });
        }
        return cf12Data;
    }

    function calculateCf24(params, regime, investimento) {
        const cf24Data = { headers: ['Voce'], rows: {} };
        const aperture_pdv = [1, 13, 15, 17, 19];
        const getRampUpCoefficient = (mese_corrente, mese_apertura) => {
            if (mese_corrente < mese_apertura) return 0;
            const mesi_attivo = mese_corrente - mese_apertura + 1;
            if (mesi_attivo <= 2) return 0.3;
            if (mesi_attivo <= 9) return 0.6;
            return 1.0;
        };

        const consolidated = { ricavi: Array(24).fill(0), cogs: Array(24).fill(0), opex: Array(24).fill(0), investimenti: Array(24).fill(0), cf_mensile: Array(24).fill(0), cf_cumulativo: Array(24).fill(0) };

        for (let mese = 1; mese <= 24; mese++) {
            cf24Data.headers.push(`M${mese}`);
            let investimenti_mese_consolidato = 0;
            aperture_pdv.forEach(mese_apertura => {
                if (mese === mese_apertura) investimenti_mese_consolidato += investimento.investimento_totale_singolo_pdv;
                const coeff = getRampUpCoefficient(mese, mese_apertura);
                if (coeff > 0) {
                    consolidated.ricavi[mese - 1] += regime.ricavi_totali_100 * coeff;
                    consolidated.cogs[mese - 1] += regime.cogs_totali_100 * coeff;
                    consolidated.opex[mese - 1] += regime.opex_fisso_100 + (regime.commissione_delivery_100 * coeff);
                }
            });
            consolidated.investimenti[mese - 1] = investimenti_mese_consolidato;
        }

        let cumulativeCf = 0;
        for (let mese = 1; mese <= 24; mese++) {
            const cf_mese = consolidated.ricavi[mese - 1] - consolidated.cogs[mese - 1] - consolidated.opex[mese - 1] - consolidated.investimenti[mese - 1];
            cumulativeCf += cf_mese;
            consolidated.cf_mensile[mese - 1] = cf_mese;
            consolidated.cf_cumulativo[mese - 1] = cumulativeCf;
        }
        
        cf24Data.rows['Investimenti Totali'] = [{value: 'Investimenti Totali'}, ...consolidated.investimenti.map(v => ({value: -v, description: 'Investimento per nuove aperture nel mese'}))];
        cf24Data.rows['Ricavi Totali'] = [{value: 'Ricavi Totali'}, ...consolidated.ricavi.map(v => ({value: v, description: 'Ricavi consolidati di tutti i PdV attivi'}))];
        cf24Data.rows['COGS Totali'] = [{value: 'COGS Totali'}, ...consolidated.cogs.map(v => ({value: v, description: 'COGS consolidati di tutti i PdV attivi'}))];
        cf24Data.rows['OPEX Totali'] = [{value: 'OPEX Totali'}, ...consolidated.opex.map(v => ({value: v, description: 'OPEX consolidati di tutti i PdV attivi'}))];
        cf24Data.rows['Cash Flow Mensile'] = [{value: 'Cash Flow Mensile'}, ...consolidated.cf_mensile.map(v => ({value: v, description: 'Flusso di cassa netto del mese'}))];
        cf24Data.rows['Cash Flow Cumulativo'] = [{value: 'Cash Flow Cumulativo'}, ...consolidated.cf_cumulativo.map(v => ({value: v, description: 'Flusso di cassa cumulativo progressivo'}))];

        return cf24Data;
    }

    // --- FUNZIONI DI VISUALIZZAZIONE ---

    function renderTable(containerId, data, isTotalRow) {
        const container = document.getElementById(containerId);
        let tableHtml = '<thead><tr>';
        data.headers.forEach(h => tableHtml += `<th>${h}</th>`);
        tableHtml += '</tr></thead><tbody>';

        for (const key in data.rows) {
            const isTotal = isTotalRow && isTotalRow(key);
            tableHtml += `<tr class="${isTotal ? 'total-row' : ''}">`;
            data.rows[key].forEach((cell, index) => {
                const description = cell.description ? `Descrizione: ${cell.description}` : '';
                const formula = cell.formula ? `\nFormula: ${cell.formula}`: '';
                const title = (description || formula) ? `title="${description}${formula}"` : '';
                
                if (index === 0) {
                    tableHtml += `<td>${cell.value}</td>`;
                } else {
                    let formattedValue;
                    let valueClass = '';

                    // Formattazione condizionale per il cash flow cumulativo
                    if (key === 'Cash Flow Cumulativo') {
                        if (cell.value >= 0) {
                            valueClass = 'positive-value';
                        } else {
                            valueClass = 'negative-value';
                        }
                    }

                    if (cell.type === 'percent') {
                        formattedValue = percentFormatter.format(cell.value);
                    } else {
                        formattedValue = formatter.format(cell.value);
                    }
                    tableHtml += `<td class="${valueClass}" ${title}>${formattedValue}</td>`;
                }
            });
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody>';
        container.innerHTML = tableHtml;
    }

    function renderSummary(financials) {
        const container = document.getElementById('summary-results');
        const inv = financials.investimento;
        container.innerHTML = `
            <h3>Analisi Investimento per Singolo Punto Vendita</h3>
            <p title="Somma dei costi di startup (allestimento, attrezzature, etc.)"><strong>CAPEX Fisso:</strong> ${formatter.format(inv.capex_fisso)}</p>
            <p title="Costi operativi a regime per 3 mesi. Formula: OPEX Mensile a Regime * 3"><strong>Capitale Operativo Iniziale:</strong> ${formatter.format(inv.capitale_operativo)}</p>
            <h4 title="Somma di CAPEX Fisso e Capitale Operativo Iniziale"><strong>Investimento Totale per PdV:</strong> ${formatter.format(inv.investimento_totale_singolo_pdv)}</h4>
        `;
    }

    function renderRoi(roi, investimento) {
        const container = document.getElementById('roi-analysis');
        container.innerHTML = `
            <h3>Analisi Ritorno sull'Investimento (Singolo PdV)</h3>
            <p title="Mesi necessari per recuperare l'investimento totale. Formula: Investimento Totale / EBITDA Mensile Medio"><strong>Payback Period:</strong> ${roi.payback_period.toFixed(1)} mesi</p>
            <p title="Ritorno percentuale sul capitale investito nel primo anno. Formula: (EBITDA Annuale / Investimento Totale) * 100"><strong>ROI a 1 Anno:</strong> ${percentFormatter.format(roi.roi_anno_1)}</p>
        `;
    }

    function renderCharts(cf12Data, cf24Data) {
        if (cf12ChartInstance) cf12ChartInstance.destroy();
        if (cf24ChartInstance) cf24ChartInstance.destroy();

        const cf12Ctx = document.getElementById('cf12-chart').getContext('2d');
        cf12ChartInstance = new Chart(cf12Ctx, { type: 'line', data: { labels: cf12Data.headers.slice(1), datasets: [{ label: 'Cash Flow Cumulativo 12 Mesi', data: cf12Data.rows['Cash Flow Cumulativo'].slice(1).map(c => c.value), borderColor: '#7A9B5C', backgroundColor: 'rgba(122, 155, 92, 0.1)', fill: true, tension: 0.1 }] } });

        const cf24Ctx = document.getElementById('cf24-chart').getContext('2d');
        cf24ChartInstance = new Chart(cf24Ctx, { type: 'line', data: { labels: cf24Data.headers.slice(1), datasets: [{ label: 'Cash Flow Cumulativo 24 Mesi', data: cf24Data.rows['Cash Flow Cumulativo'].slice(1).map(c => c.value), borderColor: '#B83A38', backgroundColor: 'rgba(184, 58, 56, 0.1)', fill: true, tension: 0.1 }] } });
    }

    function updateDashboard() {
        const params = getParams();
        const financials = calculateFinancials(params);
        
        renderSummary(financials);
        renderRoi(financials.roi, financials.investimento);

        renderTable('pnl-table', financials.pnl, key => key.includes('EBITDA'));

        const cf12Data = calculateCf12(financials.pnl, financials.investimento);
        renderTable('cf12-table', cf12Data, key => key.includes('Cumulativo'));

        const cf24Data = calculateCf24(params, financials.regime, financials.investimento);
        renderTable('cf24-table', cf24Data, key => key.includes('Cumulativo'));

        renderCharts(cf12Data, cf24Data);
    }

    updateDashboard();
});
