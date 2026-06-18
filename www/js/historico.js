document.addEventListener('DOMContentLoaded', () => {
    renderizarHistorico('historico');
});

function renderizarHistorico(chaveArmazenamento) {
    const listaContainer = document.querySelector('.flex.flex-col.gap-4');
    if (!listaContainer) return;

    const vendas = obterDadosDoBanco(chaveArmazenamento);
    listaContainer.innerHTML = '';

    if (vendas.length === 0) {
        listaContainer.innerHTML = '<p class="text-center text-on-surface-variant font-body-md py-8">Nenhuma venda realizada ainda.</p>';
        return;
    }

    vendas.forEach(venda => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'bg-surface-container border border-outline-variant p-5 rounded-lg flex flex-col gap-4';

        cardDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <span class="font-label-bold text-label-bold text-outline uppercase tracking-widest block mb-1">Pedido #${venda.idPedido}</span>
                    <h2 class="font-headline-md text-headline-md text-on-surface uppercase">${venda.client}</h2>
                    <div class="flex items-center gap-2 text-on-surface-variant mt-1">
                        <span class="material-symbols-outlined text-sm">schedule</span>
                        <span class="font-body-md text-body-md">${venda.date} - ${venda.time}</span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="font-label-md text-label-md text-on-surface-variant block">TOTAL</span>
                    <span class="font-display-total-mobile text-display-total-mobile text-on-surface font-extrabold">R$ ${venda.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="flex gap-2 mt-2">
                <button onclick="excluirVenda('historico', ${venda.id})" class="flex-1 h-touch-target-lg bg-error-container text-error font-label-bold text-label-bold flex items-center justify-center gap-2 rounded-lg border border-error/20 hover:brightness-110 active:scale-[0.98] transition-all">
                    <span class="material-symbols-outlined">delete</span>
                    EXCLUIR REGISTRO
                </button>
            </div>
        `;
        listaContainer.appendChild(cardDiv);
    });
}

window.excluirVenda = function(chaveArmazenamento, id) {
    if (confirm('Deseja realmente apagar o registro desta venda?')) {
        let vendas = obterDadosDoBanco(chaveArmazenamento);
        vendas = vendas.filter(v => v.id !== id);
        salvarDadosNoBanco(chaveArmazenamento, vendas);
        renderizarHistorico(chaveArmazenamento);
    }
}