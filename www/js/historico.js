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
    <div class="flex justify-between items-start mb-4">
        <div>
            <span class="text-primary font-bold">PEDIDO No: ${venda.idPedido}</span>
            <p class="text-xs text-on-surface-variant">${venda.date} - ${venda.time}</p>
            <p class="text-sm font-bold text-white mt-1">CLIENTE: ${venda.client.toUpperCase()}</p>
        </div>
        <div class="flex gap-2">
            <button onclick="window.imprimirPedidoAntigo(${venda.id})" class="w-12 h-12 bg-primary-container text-primary rounded-xl flex items-center justify-center active:scale-95">
                <span class="material-symbols-outlined">print</span>
            </button>
            <button onclick="window.excluirVendaHistorico(${venda.id})" class="w-12 h-12 bg-error-container text-error rounded-xl flex items-center justify-center active:scale-95">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
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
window.excluirVendaHistorico = function(idVenda) {
    if (!confirm("Tem certeza que deseja apagar esta venda do histórico?")) return;

    let historico = window.obterDadosDoBanco('historico');
    historico = historico.filter(v => v.id !== idVenda);
    window.salvarDadosNoBanco('historico', historico);
    
    if (typeof renderizarHistorico === 'function') {
        renderizarHistorico();
    } else {
        location.reload();
    }
}