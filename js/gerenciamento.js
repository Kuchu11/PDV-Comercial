document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputNome = document.getElementById('product_name');
    const inputPreco = document.getElementById('product_price');

    renderizarProdutos('produtos');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = inputNome.value.trim();
        const preco = parseFloat(inputPreco.value);

        if (!nome || isNaN(preco)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const novoProduto = {
            id: Date.now(),
            name: nome,
            price: preco
        };

        const produtos = obterDadosDoBanco('produtos');
        produtos.push(novoProduto);
        salvarDadosNoBanco('produtos', produtos);

        form.reset();
        renderizarProdutos('produtos');
    });
});

function renderizarProdutos(chaveArmazenamento) {
    const listaContainer = document.querySelector('.overflow-y-auto');
    const contador = document.querySelector('.text-on-surface-variant.font-label-md');
    
    if (!listaContainer || !contador) return;

    const produtos = obterDadosDoBanco(chaveArmazenamento);
    
    contador.innerText = `${produtos.length} itens`;
    listaContainer.innerHTML = '';

    produtos.forEach(produto => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-surface-container-high p-4 rounded-lg flex items-center justify-between border border-transparent hover:border-primary transition-colors';
        
        itemDiv.innerHTML = `
            <div class="flex flex-col">
                <span class="font-body-lg text-body-lg text-on-surface font-bold">${produto.name}</span>
                <span class="text-primary font-headline-md text-headline-md">R$ ${produto.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="excluirProduto('produtos', ${produto.id})" aria-label="Excluir" class="w-touch-target-lg h-touch-target-lg rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-error hover:text-on-error transition-all active:scale-90">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        listaContainer.appendChild(itemDiv);
    });
}

window.excluirProduto = function(chaveArmazenamento, id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        let produtos = obterDadosDoBanco(chaveArmazenamento);
        produtos = produtos.filter(p => p.id !== id);
        salvarDadosNoBanco(chaveArmazenamento, produtos);
        renderizarProdutos(chaveArmazenamento);
    }
}