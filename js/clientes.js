document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputNome = document.getElementById('name');
    const inputTelefone = document.getElementById('phone');
    const inputEndereco = document.getElementById('address');

    renderizarClientes('clientes');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = inputNome.value.trim();
        const telefone = inputTelefone.value.trim();
        const endereco = inputEndereco.value.trim();

        if (!nome || !telefone) {
            alert('Por favor, preencha pelo menos o nome e o telefone.');
            return;
        }

        const novoCliente = {
            id: Date.now(),
            name: nome,
            phone: telefone,
            address: endereco
        };

        const clientes = obterDadosDoBanco('clientes');
        clientes.push(novoCliente);
        salvarDadosNoBanco('clientes', clientes);

        form.reset();
        renderizarClientes('clientes');
    });
});

function renderizarClientes(chaveArmazenamento) {
    const listaContainer = document.querySelector('.grid.gap-4');
    const contador = document.querySelector('.bg-surface-container-high.px-4.py-1');

    if (!listaContainer || !contador) return;

    const clientes = obterDadosDoBanco(chaveArmazenamento);

    contador.innerText = `${clientes.length} Clientes`;
    listaContainer.innerHTML = '';

    clientes.forEach(cliente => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between p-4 min-h-[80px] bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary transition-colors group';

        itemDiv.innerHTML = `
            <div class="flex flex-col">
                <span class="font-headline-md text-headline-md text-on-surface">${cliente.name}</span>
                <div class="flex items-center gap-2 text-on-surface-variant mt-1">
                    <span class="material-symbols-outlined text-[18px]">call</span>
                    <span class="font-body-md text-body-md">${cliente.phone}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="excluirCliente('clientes', ${cliente.id})" aria-label="Excluir" class="w-12 h-12 flex items-center justify-center bg-surface-container-highest rounded-lg active:scale-90 transition-transform hover:text-error">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        listaContainer.appendChild(itemDiv);
    });
}

window.excluirCliente = function(chaveArmazenamento, id) {
    if (confirm('Deseja realmente excluir este cliente?')) {
        let clientes = obterDadosDoBanco(chaveArmazenamento);
        clientes = clientes.filter(c => c.id !== id);
        salvarDadosNoBanco(chaveArmazenamento, clientes);
        renderizarClientes(chaveArmazenamento);
    }
}