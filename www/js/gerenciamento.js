let impressoraConectadaMac = localStorage.getItem('impressora_mac') || null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputNome = document.getElementById('product_name');
    const inputPreco = document.getElementById('product_price');

    renderizarProdutos('produtos');
    verificarConexaoAtual();

    if (form) {
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

            const produtos = window.obterDadosDoBanco('produtos');
            produtos.push(novoProduto);
            window.salvarDadosNoBanco('produtos', produtos);

            form.reset();
            renderizarProdutos('produtos');
        });
    }
});

function renderizarProdutos(chaveArmazenamento) {
    const listaContainer = document.querySelector('.overflow-y-auto');
    const contador = document.querySelector('.text-on-surface-variant.font-label-md');
    
    if (!listaContainer || !contador) return;

    const produtos = window.obterDadosDoBanco(chaveArmazenamento);
    
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
        let produtos = window.obterDadosDoBanco(chaveArmazenamento);
        produtos = produtos.filter(p => p.id !== id);
        window.salvarDadosNoBanco(chaveArmazenamento, produtos);
        renderizarProdutos(chaveArmazenamento);
    }
}

function verificarConexaoAtual() {
    const statusDiv = document.getElementById('status-impressao');
    if (!statusDiv) return;

    if (typeof bluetoothSerial === 'undefined') {
        statusDiv.innerText = "Status: Bluetooth indisponível (Rode no Celular)";
        return;
    }

    bluetoothSerial.isConnected(
        () => { statusDiv.innerText = "Status: Conectada perfeitamente"; },
        () => { statusDiv.innerText = "Status: Desconectada"; }
    );
}

window.buscarImpressoras = function() {
    const statusDiv = document.getElementById('status-impressao');
    const select = document.getElementById('select-impressoras');
    const btnConectar = document.getElementById('btn-conectar-impressora');

    if (typeof bluetoothSerial === 'undefined') {
        alert("O Bluetooth nativo só funciona rodando dentro do celular!");
        return;
    }

    if (statusDiv) statusDiv.innerText = "Status: Ativando Bluetooth e checando permissões...";

   
    bluetoothSerial.enable(() => {
        
        if (statusDiv) statusDiv.innerText = "Status: Buscando dispositivos pareados...";

        
        bluetoothSerial.list((dispositivos) => {
            if (!select || !btnConectar) return;

            select.innerHTML = '';
            
            if (dispositivos.length === 0) {
                if (statusDiv) statusDiv.innerText = "Status: Nenhuma impressora pareada encontrada no Android.";
                alert("Nenhum dispositivo pareado encontrado. Lembre-se de parear a RP Printer nas configurações de Bluetooth do seu celular primeiro!");
                return;
            }

            dispositivos.forEach(disp => {
                const option = document.createElement('option');
                option.value = disp.id; // Endereço MAC
                option.innerText = disp.name ? `${disp.name} (${disp.id})` : disp.id;
                select.appendChild(option);
            });

            select.classList.remove('hidden');
            btnConectar.classList.remove('hidden');
            if (statusDiv) statusDiv.innerText = "Status: Selecione a sua impressora abaixo.";
        }, (erro) => {
            alert("Erro ao listar dispositivos: " + erro);
        });

    }, (erro) => {
        if (statusDiv) statusDiv.innerText = "Status: Permissão negada pelo usuário.";
        alert("Para imprimir, você precisa aceitar a permissão de Bluetooth no celular! Erro: " + erro);
    });
}

window.conectarImpressora = function() {
    const select = document.getElementById('select-impressoras');
    const statusDiv = document.getElementById('status-impressao');
    if (!select || !select.value) return;

    const macAddress = select.value;
    if (statusDiv) statusDiv.innerText = "Status: Conectando...";

    bluetoothSerial.connect(macAddress, () => {
        localStorage.setItem('impressora_mac', macAddress);
        impressoraConectadaMac = macAddress;
        if (statusDiv) statusDiv.innerText = "Status: Conectada com sucesso!";
        alert("Impressora conectada perfeitamente!");
    }, (erro) => {
        if (statusDiv) statusDiv.innerText = "Status: Erro na conexão.";
        alert("Falha ao conectar: " + erro);
    });
}

window.desconectarImpressora = function() {
    const statusDiv = document.getElementById('status-impressao');
    
    if (typeof bluetoothSerial === 'undefined') return;

    bluetoothSerial.disconnect(() => {
        localStorage.removeItem('impressora_mac');
        impressoraConectadaMac = null;
        if (statusDiv) statusDiv.innerText = "Status: Desconectada";
        alert("Impressora desconectada.");
    });
}