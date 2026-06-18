let carrinho = [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarVitrineProdutos('produtos');
    renderizarCarrinho();

    const inputPesquisa = document.querySelector('input[placeholder="Pesquisar produto..."]');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            filtrarVitrineProdutos('produtos', termo);
        });
    }
});

function renderizarVitrineProdutos(chaveArmazenamento) {
    const gridContainer = document.querySelector('.grid-cols-2');
    if (!gridContainer) return;

    const produtos = obterDadosDoBanco(chaveArmazenamento);

    produtos.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    gridContainer.innerHTML = '';

    produtos.forEach(produto => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'bg-surface-container-high border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[160px] active:bg-primary-container transition-all duration-100 group cursor-pointer';
        cardDiv.setAttribute('onclick', `adicionarAoCarrinho('${produto.name}', ${produto.price})`);

        cardDiv.innerHTML = `
            <div class="flex flex-col gap-1">
                <span class="font-headline-md text-headline-md text-white group-active:text-primary-fixed leading-tight">${produto.name}</span>
            </div>
            <div class="flex justify-between items-end">
                <span class="font-headline-lg text-headline-lg font-bold text-white">R$ ${produto.price.toFixed(2).replace('.', ',')}</span>
                <div class="w-[56px] h-[56px] bg-primary text-on-primary flex items-center justify-center rounded-xl shadow-lg">
                    <span class="material-symbols-outlined" style="font-size: 32px; font-weight: 700;">add</span>
                </div>
            </div>
        `;
        gridContainer.appendChild(cardDiv);
    });
}

function filtrarVitrineProdutos(chaveArmazenamento, termoPesquisa) {
    const gridContainer = document.querySelector('.grid-cols-2');
    if (!gridContainer) return;

    const produtos = obterDadosDoBanco(chaveArmazenamento);
    produtos.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    gridContainer.innerHTML = '';

    const filtrados = produtos.filter(p => p.name.toLowerCase().includes(termoPesquisa));

    filtrados.forEach(produto => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'bg-surface-container-high border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[160px] active:bg-primary-container transition-all duration-100 group cursor-pointer';
        cardDiv.setAttribute('onclick', `adicionarAoCarrinho('${produto.name}', ${produto.price})`);

        cardDiv.innerHTML = `
            <div class="flex flex-col gap-1">
                <span class="font-headline-md text-headline-md text-white group-active:text-primary-fixed leading-tight">${produto.name}</span>
            </div>
            <div class="flex justify-between items-end">
                <span class="font-headline-lg text-headline-lg font-bold text-white">R$ ${produto.price.toFixed(2).replace('.', ',')}</span>
                <div class="w-[56px] h-[56px] bg-primary text-on-primary flex items-center justify-center rounded-xl shadow-lg">
                    <span class="material-symbols-outlined" style="font-size: 32px; font-weight: 700;">add</span>
                </div>
            </div>
        `;
        gridContainer.appendChild(cardDiv);
    });
}

window.adicionarAoCarrinho = function(nomeItem, precoItem) {
    const itemExistente = carrinho.find(item => item.name === nomeItem);

    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrinho.push({ name: nomeItem, price: precoItem, quantity: 1 });
    }
    renderizarCarrinho();
}

window.alterarQuantidadeCarrinho = function(nomeItem, delta) {
    const item = carrinho.find(i => i.name === nomeItem);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        carrinho = carrinho.filter(i => i.name !== nomeItem);
    }
    renderizarCarrinho();
}

window.editarPrecoCarrinho = function(nomeItem) {
    const novoPrecoTexto = prompt(`Digite o novo preço manual para ${nomeItem}:`);
    if (novoPrecoTexto === null) return;

    const novoPreco = parseFloat(novoPrecoTexto.replace(',', '.'));
    if (isNaN(novoPreco) || novoPreco < 0) {
        alert('Preço inválido.');
        return;
    }

    const item = carrinho.find(i => i.name === nomeItem);
    if (item) {
        item.price = novoPreco;
        renderizarCarrinho();
    }
}

window.removerItemCarrinho = function(nomeItem) {
    carrinho = carrinho.filter(i => i.name !== nomeItem);
    renderizarCarrinho();
}

window.limparCarrinhoCompleto = function() {
    carrinho = [];
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const listaCarrinho = document.getElementById('cart-list');
    const totalDisplay = document.getElementById('total-display');
    const totalSummary = document.getElementById('total-summary');
    const resumoItensTexto = document.getElementById('cart-summary-text');
    const botaoFinalizar = document.querySelector('button[onclick="finishSale()"]');

    if (!listaCarrinho || !totalDisplay || !totalSummary || !resumoItensTexto) return;

    listaCarrinho.innerHTML = '';
    let somaTotal = 0;
    let somaItens = 0;

    carrinho.forEach(item => {
        const subtotal = item.price * item.quantity;
        somaTotal += subtotal;
        somaItens += item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between p-3 bg-surface-container-highest rounded-xl border border-outline-variant';

        itemDiv.innerHTML = `
            <div class="flex flex-col">
                <span class="font-label-bold text-white text-lg">${item.name}</span>
                <span class="font-body-md text-primary">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="editarPrecoCarrinho('${item.name}')" class="w-[48px] h-[48px] flex items-center justify-center bg-primary-container text-primary rounded-lg active:scale-95">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <div class="flex items-center bg-surface-container border border-outline rounded-lg mx-1 h-[48px]">
                    <button onclick="alterarQuantidadeCarrinho('${item.name}', -1)" class="w-[40px] h-full text-white text-xl font-bold">-</button>
                    <span class="w-[30px] text-center font-bold text-white">${item.quantity}</span>
                    <button onclick="alterarQuantidadeCarrinho('${item.name}', 1)" class="w-[40px] h-full text-white text-xl font-bold">+</button>
                </div>
                <button onclick="removerItemCarrinho('${item.name}')" class="w-[48px] h-[48px] flex items-center justify-center bg-error-container text-error rounded-lg active:scale-95">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        listaCarrinho.appendChild(itemDiv);
    });

    const totalFormatado = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
    totalDisplay.innerText = totalFormatado;
    totalSummary.innerText = totalFormatado;
    resumoItensTexto.innerText = `Itens: ${somaItens}`;

    if (botaoFinalizar) {
        botaoFinalizar.innerHTML = `<span class="material-symbols-outlined">check_circle</span> FINALIZAR VENDA ${totalFormatado}`;
    }
}
window.finishSale = function() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    const modal = document.getElementById('receipt-modal');
    const receiptItems = document.getElementById('receipt-items');
    const receiptTotal = document.getElementById('receipt-total');
    const receiptClient = document.getElementById('receipt-client');
    const receiptDate = document.getElementById('receipt-date');
    const clientSelect = document.getElementById('client-select');

    if (!modal || !receiptItems || !receiptTotal || !receiptClient || !receiptDate || !clientSelect) return;

    receiptItems.innerHTML = '';
    let total = 0;
    const itensVendidos = [];

    carrinho.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        itensVendidos.push({
            name: item.name,
            quantity: item.quantity,
            subtotal: subtotal
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-1">${item.name.toUpperCase()}</td>
            <td class="text-center py-1">${item.quantity}</td>
            <td class="text-right py-1">R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
        `;
        receiptItems.appendChild(row);
    });

    const clienteNome = clientSelect.value;
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    receiptTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    receiptClient.innerText = `CLIENTE: ${clienteNome}`;
    receiptDate.innerText = dataAtual;

    const novaVenda = {
        id: Date.now(),
        idPedido: Math.floor(1000 + Math.random() * 9000),
        client: clienteNome,
        date: dataAtual,
        time: horaAtual,
        total: total,
        items: itensVendidos
    };

    const historico = obterDadosDoBanco('historico');
    historico.unshift(novaVenda);
    salvarDadosNoBanco('historico', historico);

    modal.classList.remove('hidden');
}