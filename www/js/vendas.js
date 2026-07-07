let carrinho = JSON.parse(localStorage.getItem('carrinho_ativo_edicao')) || [];
localStorage.removeItem('carrinho_ativo_edicao');

document.addEventListener('DOMContentLoaded', () => {
    const inputPesquisa = document.getElementById('input-pesquisa');
    if (inputPesquisa) {
        inputPesquisa.value = ''; 
    }

    renderizarVitrineProdutos('produtos');
    renderizarSugestoesPesquisa('produtos');
    renderizarSeletorClientes('clientes');
    renderizarCarrinho();

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            filtrarVitrineProdutos('produtos', termo);
        });
        
        inputPesquisa.addEventListener('change', (e) => {
            const produtos = window.obterDadosDoBanco('produtos');
            const encontrado = produtos.find(p => p.name.toUpperCase() === e.target.value.toUpperCase());
            if (encontrado) {
                window.adicionarAoCarrinho(encontrado.name, encontrado.price);
                e.target.value = '';
                filtrarVitrineProdutos('produtos', '');
            }
        });
    }

    const seletorClientes = document.getElementById('client-select');
    if (seletorClientes) {
        seletorClientes.addEventListener('change', (e) => {
            const cabecalhoCarrinho = document.getElementById('cart-customer-header');
            if (cabecalhoCarrinho) {
                cabecalhoCarrinho.innerText = `Carrinho de: ${e.target.value}`;
            }
        });
    }
});

function renderizarVitrineProdutos(chaveArmazenamento) {
    const gridContainer = document.getElementById('produtos-vitrine') || document.querySelector('.grid-cols-2');
    if (!gridContainer) return;

    const produtos = window.obterDadosDoBanco(chaveArmazenamento);
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
    const gridContainer = document.getElementById('produtos-vitrine') || document.querySelector('.grid-cols-2');
    if (!gridContainer) return;

    const produtos = window.obterDadosDoBanco(chaveArmazenamento);
    gridContainer.innerHTML = '';

    const filtrados = produtos.filter(p => p.name.toLowerCase().includes(termoPesquisa.toLowerCase()));

    if (filtrados.length === 0) {
        gridContainer.innerHTML = '<p class="text-on-surface-variant col-span-2 text-center py-4">Nenhum produto encontrado.</p>';
        return;
    }

    filtrados.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

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

function renderizarSeletorClientes(chaveArmazenamento) {
    const seletor = document.getElementById('client-select');
    if (!seletor) return;

    const clientes = window.obterDadosDoBanco(chaveArmazenamento);
    seletor.innerHTML = `
        <option value="CONSUMIDOR">CONSUMIDOR</option>
        <option value="CHURRASCARIA BELÉM">CHURRASCARIA BELÉM</option>
    `;

    clientes.forEach(cliente => {
        if (cliente.name.toUpperCase() !== 'CHURRASCARIA BELÉM') {
            const option = document.createElement('option');
            option.value = cliente.name.toUpperCase();
            option.innerText = cliente.name.toUpperCase();
            seletor.appendChild(option);
        }
    });
}

window.adicionarAoCarrinho = function(nomeItem, precoItem) {
    let itemExistente = null;
    if (precoItem > 0) {
        itemExistente = carrinho.find(item => item.name === nomeItem && item.price === precoItem);
    }

    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrinho.push({ 
            idCarrinho: `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: nomeItem, 
            price: precoItem, 
            quantity: 1
        });
    }
    renderizarCarrinho();
}

window.alterarQuantidadeCarrinho = function(idLinha, delta) {
    const item = carrinho.find(i => i.idCarrinho === idLinha);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        carrinho = Math.filter ? carrinho.filter(i => i.idCarrinho !== idLinha) : carrinho.filter(i => i.idCarrinho !== idLinha);
    }
    renderizarCarrinho();
}

window.editarPrecoCarrinho = function(idLinha) {
    const item = carrinho.find(i => i.idCarrinho === idLinha);
    if (!item) return;

    const containerPai = document.querySelector(`[data-id="${idLinha}"]`);
    if (containerPai) {
        const exibicaoPreco = containerPai.querySelector('.price-display');
        const inputContainer = containerPai.querySelector('.edit-input-container');
        
        if (exibicaoPreco && inputContainer) {
            exibicaoPreco.classList.add('hidden');
            inputContainer.classList.remove('hidden');
            const inputElement = inputContainer.querySelector('input');
            if (inputElement) {
                inputElement.focus();
                inputElement.select();
            }
            return;
        }
    }

    const novoPrecoTexto = prompt(`Digite o novo preço manual para ${item.name}:`);
    if (novoPrecoTexto === null) return;

    const novoPreco = parseFloat(novoPrecoTexto.replace(',', '.'));
    if (isNaN(novoPreco) || novoPreco < 0) {
        alert('Preço inválido.');
        return;
    }

    item.price = novoPreco;
    renderizarCarrinho();
}

window.salvarPrecoDigitado = function(idLinha, elementoInput) {
    const item = carrinho.find(i => i.idCarrinho === idLinha);
    if (!item) return;

    const novoPreco = parseFloat(elementoInput.value);
    if (!isNaN(novoPreco) && novoPreco >= 0) {
        item.price = novoPreco;
    }
    renderizarCarrinho();
}

window.verificarTeclaPreco = function(e, idLinha, elementoInput) {
    if (e.key === 'Enter') {
        window.salvarPrecoDigitado(idLinha, elementoInput);
    }
}

window.removerItemCarrinho = function(idLinha) {
    carrinho = carrinho.filter(i => i.idCarrinho !== idLinha);
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
        itemDiv.setAttribute('data-id', item.idCarrinho);
        itemDiv.innerHTML = `
            <div class="flex flex-col flex-1 min-w-0 pr-2">
                <span class="font-label-bold text-white text-lg truncate">${item.name}</span>
                <div class="price-display flex items-center gap-1">
                    <span class="font-body-md text-primary">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="edit-input-container hidden mt-1">
                    <input type="number" inputmode="decimal" step="0.01" value="${item.price.toFixed(2)}" class="w-24 p-1 bg-surface-container border border-primary rounded text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary" onblur="window.salvarPrecoDigitado('${item.idCarrinho}', this)" onkeydown="window.verificarTeclaPreco(event, '${item.idCarrinho}', this)">
                </div>
            </div>
            <div class="flex items-center gap-2 settlement-actions">
                <button onclick="window.editarPrecoCarrinho('${item.idCarrinho}')" class="w-[48px] h-[48px] flex items-center justify-center bg-primary-container text-primary rounded-lg active:scale-95">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <div class="flex items-center bg-surface-container border border-outline rounded-lg mx-1 h-[48px]">
                    <button onclick="alterarQuantidadeCarrinho('${item.idCarrinho}', -1)" class="w-[40px] h-full text-white text-xl font-bold">-</button>
                    <span class="w-[30px] text-center font-bold text-white">${item.quantity}</span>
                    <button onclick="alterarQuantidadeCarrinho('${item.idCarrinho}', 1)" class="w-[40px] h-full text-white text-xl font-bold">+</button>
                </div>
                <button onclick="removerItemCarrinho('${item.idCarrinho}')" class="w-[48px] h-[48px] flex items-center justify-center bg-error-container text-error rounded-lg active:scale-95">
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

    const clienteNome = document.getElementById('client-select').value;
    const observacaoInput = prompt("Deseja adicionar alguma observação ou itens faltantes neste recibo? (Se não, deixe em branco):", "");

    if (observacaoInput === null) {
        return; 
    }

    const modal = document.getElementById('receipt-modal');
    const receiptItems = document.getElementById('receipt-items');
    const receiptTotal = document.getElementById('receipt-total');
    const receiptClient = document.getElementById('receipt-client');
    const receiptDate = document.getElementById('receipt-date');
    const receiptOrderId = document.getElementById('receipt-order-id');

    const receiptObsContainer = document.getElementById('receipt-obs-container');
    const receiptObsText = document.getElementById('receipt-obs-text');
    const receiptCanhotoContainer = document.getElementById('receipt-canhoto-container');
    const canhotoOrderId = document.getElementById('canhoto-order-id');
    const canhotoClient = document.getElementById('canhoto-client');
    const canhotoDate = document.getElementById('canhoto-date');
    const canhotoTotal = document.getElementById('canhoto-total');

    if (!modal || !receiptItems || !receiptTotal || !receiptClient || !receiptDate || !receiptOrderId) return;

    if (receiptObsContainer) receiptObsContainer.classList.add('hidden');
    if (receiptCanhotoContainer) receiptCanhotoContainer.classList.add('hidden');

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

        const precoUnitario = item.price;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-1">${item.name.toUpperCase()} (R$ ${precoUnitario.toFixed(2).replace('.', ',')})</td>
            <td class="text-center py-1">${item.quantity}</td>
            <td class="text-right py-1">R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
        `;
        receiptItems.appendChild(row);
    });

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const numeroPedido = Math.floor(1000 + Math.random() * 9000);

    receiptTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    receiptClient.innerText = `CLIENTE: ${clienteNome}`;
    receiptOrderId.innerText = `PEDIDO No: ${numeroPedido}`;
    receiptDate.innerText = `${dataAtual} - ${horaAtual}`;

    if (observacaoInput && observacaoInput.trim() !== "" && receiptObsContainer && receiptObsText) {
        receiptObsText.innerText = observacaoInput.toUpperCase();
        receiptObsContainer.classList.remove('hidden');
    }

    if (clienteNome === 'CHURRASCARIA BELÉM' && receiptCanhotoContainer) {
        if (canhotoOrderId) canhotoOrderId.innerText = `PEDIDO No: ${numeroPedido}`;
        if (canhotoClient) canhotoClient.innerText = `CLIENTE: ${clienteNome}`;
        if (canhotoDate) canhotoDate.innerText = `${dataAtual} - ${horaAtual}`;
        if (canhotoTotal) canhotoTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        receiptCanhotoContainer.classList.remove('hidden');
    }

    const novaVenda = {
        id: Date.now(),
        idPedido: numeroPedido,
        client: clienteNome,
        date: dataAtual,
        time: horaAtual,
        total: total,
        items: itensVendidos,
        observacao: observacaoInput
    };

    const historico = window.obterDadosDoBanco('historico');
    historico.unshift(novaVenda);
    window.salvarDadosNoBanco('historico', historico);

    modal.classList.remove('hidden');
}

window.closeReceipt = function() {
    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    limparCarrinhoCompleto();
}

function renderizarSugestoesPesquisa(chaveArmazenamento) {
    const datalist = document.getElementById('produtos-sugestoes');
    if (!datalist) return;

    const produtos = window.obterDadosDoBanco(chaveArmazenamento);
    datalist.innerHTML = '';

    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.name;
        datalist.appendChild(option);
    });
}

window.imprimirReciboBluetooth = function() {
    if (typeof bluetoothSerial === 'undefined') {
        alert("O Bluetooth nativo só funciona rodando dentro do celular!");
        return;
    }

    bluetoothSerial.isConnected(() => {
        let clienteNomeRaw = document.getElementById('client-select').value.toUpperCase();
        const numeroPedido = document.getElementById('receipt-order-id').innerText;
        const dataHora = document.getElementById('receipt-date').innerText;
        const valorTotalText = document.getElementById('receipt-total').innerText;
        let observacaoTextRaw = document.getElementById('receipt-obs-text')?.innerText || "";

        const removerAcentos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const clienteNome = removerAcentos(clienteNomeRaw);
        const observacaoText = removerAcentos(observacaoTextRaw);

        let textoFatura = "";
        
        textoFatura += "            DEPOSITO SAO JERONIMO            \n";
        textoFatura += "          Rua Sao Jeronimo, 1831            \n";
        textoFatura += "       Conj. Metropolitano-(85)99671-3293    \n";
        textoFatura += "------------------------------------------------\n";
        textoFatura += "            DOCUMENTO NAO-FISCAL                \n";
        textoFatura += "------------------------------------------------\n";
        textoFatura += `${numeroPedido}\n`;
        textoFatura += `DATA: ${dataHora}\n`;
        textoFatura += `CLIENTE: ${clienteNome}\n`; 
        textoFatura += "------------------------------------------------\n";
        textoFatura += "ITEM                            QTD        TOTAL\n"; 
        textoFatura += "------------------------------------------------\n";

        carrinho.forEach(item => {
            let nomeProdutoLimpo = removerAcentos(item.name.toUpperCase());
            let nomeItem = `${nomeProdutoLimpo} (UN: R$ ${(item.price).toFixed(2).replace('.', ',')})`.substring(0, 30);
            let qtdItem = item.quantity.toString();
            let subtotal = "R$ " + (item.price * item.quantity).toFixed(2).replace('.', ',');

            let parteNome = nomeItem.padEnd(31, ' ');
            let parteQtd = qtdItem.padEnd(6, ' ');
            let partePreco = subtotal.padStart(11, ' ');

            textoFatura += `${parteNome}${parteQtd}${partePreco}\n`;
        });

        textoFatura += "------------------------------------------------\n";
        if (observacaoText !== "") {
            textoFatura += `OBSERVACAO:\n${observacaoText.toUpperCase()}\n`;
            textoFatura += "------------------------------------------------\n";
        }
        
        let labelTotal = "VALOR TOTAL:";
        let valorPreco = valorTotalText.padStart(36, ' ');
        textoFatura += `${labelTotal}${valorPreco}\n\n`;
        
        textoFatura += "         Obrigado pela preferencia!         \n\n\n";

        if (clienteNome.includes('CHURRASCARIA')) {
            textoFatura += "================================================\n\n";
            textoFatura += "                RECIBO DE ENTREGA                \n";
            textoFatura += "              DEPOSITO SAO JERONIMO              \n";
            textoFatura += "------------------------------------------------\n";
            textoFatura += `${numeroPedido}\n`;
            textoFatura += `CLIENTE: ${clienteNome}\n`;
            textoFatura += `DATA: ${dataHora}\n`;
            textoFatura += "------------------------------------------------\n";
            
            let labelConf = "VALOR CONFIRMADO:";
            let valorConf = valorTotalText.padStart(31, ' ');
            textoFatura += `${labelConf}${valorConf}\n\n`;

            if (observacaoText !== "") {
                textoFatura += `OBSERVACAO:\n${observacaoText.toUpperCase()}\n`;
                textoFatura += "------------------------------------------------\n\n";
            }
            
            textoFatura += "Assinatura:\n\n";
            textoFatura += "________________________________________________\n";
            
            let espacosMargem = Math.max(0, Math.floor((48 - clienteNome.length) / 2));
            textoFatura += " ".repeat(espacosMargem) + clienteNome + "\n";
        }

        textoFatura += "\n\n\n\n\n";

        bluetoothSerial.write(textoFatura, () => {
            console.log("Recibo impresso em 48 colunas com sucesso!");
        }, (erro) => {
            alert("Erro ao enviar texto para impressora: " + erro);
        });

    }, () => {
        alert("A impressora foi desconectada. Vá em Gerenciamento para reconectar.");
    });
}

window.imprimirPedidoAntigo = function(idVenda) {
    if (typeof bluetoothSerial === 'undefined') {
        alert("O Bluetooth nativo só funciona rodando dentro do celular!");
        return;
    }

    bluetoothSerial.isConnected(() => {
        const historico = window.obterDadosDoBanco('historico');
        const venda = historico.find(v => v.id === idVenda);

        if (!venda) {
            alert("Venda não encontrada no histórico.");
            return;
        }

        const removerAcentos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const clienteNome = removerAcentos(venda.client.toUpperCase());
        const observacaoText = venda.observacao ? removerAcentos(venda.observacao.toUpperCase()) : "";
        const numeroPedido = `PEDIDO No: ${venda.idPedido}`;
        const dataHora = `${venda.date} - ${venda.time}`;
        const valorTotalText = `R$ ${venda.total.toFixed(2).replace('.', ',')}`;

        let textoFatura = "";
        
        textoFatura += "            DEPOSITO SAO JERONIMO            \n";
        textoFatura += "          Rua Sao Jeronimo, 1831            \n";
        textoFatura += "       Conj. Metropolitano-(85)99671-3293    \n";
        textoFatura += "------------------------------------------------\n";
        textoFatura += "          REIMPRESSAO - SEGUNDA VIA             \n";
        textoFatura += "------------------------------------------------\n";
        textoFatura += `${numeroPedido}\n`;
        textoFatura += `DATA: ${dataHora}\n`;
        textoFatura += `CLIENTE: ${clienteNome}\n`; 
        textoFatura += "------------------------------------------------\n";
        textoFatura += "ITEM                            QTD        TOTAL\n"; 
        textoFatura += "------------------------------------------------\n";

        venda.items.forEach(item => {
            let nomeProdutoLimpo = removerAcentos(item.name.toUpperCase());
            let nomeItem = `${nomeProdutoLimpo} (UN: R$ ${(item.subtotal / item.quantity).toFixed(2).replace('.', ',')})`.substring(0, 30);
            let qtdItem = item.quantity.toString();
            let subtotal = "R$ " + item.subtotal.toFixed(2).replace('.', ',');

            let parteNome = nomeItem.padEnd(31, ' ');
            let parteQtd = qtdItem.padEnd(6, ' ');
            let partePreco = subtotal.padStart(11, ' ');

            textoFatura += `${parteNome}${parteQtd}${partePreco}\n`;
        });

        textoFatura += "------------------------------------------------\n";
        if (observacaoText !== "") {
            textoFatura += `OBSERVACAO:\n${observacaoText}\n`;
            textoFatura += "------------------------------------------------\n";
        }
        
        let labelTotal = "VALOR TOTAL:";
        let valorPreco = valorTotalText.padStart(36, ' ');
        textoFatura += `${labelTotal}${valorPreco}\n\n`;
        
        textoFatura += "         Obrigado pela preferencia!         \n\n\n";

        if (clienteNome.includes('CHURRASCARIA')) {
            textoFatura += "================================================\n\n";
            textoFatura += "                RECIBO DE ENTREGA                \n";
            textoFatura += "              DEPOSITO SAO JERONIMO              \n";
            textoFatura += "------------------------------------------------\n";
            textoFatura += `${numeroPedido}\n`;
            textoFatura += `CLIENTE: ${clienteNome}\n`;
            textoFatura += `DATA: ${dataHora}\n`;
            textoFatura += "------------------------------------------------\n";
            
            let labelConf = "VALOR CONFIRMADO:";
            let valorConf = valorTotalText.padStart(31, ' ');
            textoFatura += `${labelConf}${valorConf}\n\n`;

            if (observacaoText !== "") {
                textoFatura += `OBSERVACAO:\n${observacaoText}\n`;
                textoFatura += "------------------------------------------------\n\n";
            }
            
            textoFatura += "Assinatura:\n\n";
            textoFatura += "________________________________________________\n";
            
            let espacosMargem = Math.max(0, Math.floor((48 - clienteNome.length) / 2));
            textoFatura += " ".repeat(espacosMargem) + clienteNome + "\n";
        }

        textoFatura += "\n\n\n\n\n";

        bluetoothSerial.write(textoFatura, () => {
            console.log("Pedido antigo reimpresso com sucesso!");
        }, (erro) => {
            alert("Erro ao enviar texto para impressora: " + erro);
        });

    }, () => {
        alert("A impressora está desconectada. Conecte-a na aba Gerenciamento antes de imprimir.");
    });
}