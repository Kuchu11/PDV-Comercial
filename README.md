# 🛒 PDV Comercial - Depósito São Jerônimo

Sistema de Ponto de Venda (PDV) completo e responsivo projetado para automatizar o gerenciamento diário de caixa, controle de vendas, histórico e fluxo de clientes.

---

## 📱 Aplicativo Mobile Nativo (Android)

O sistema foi transformado em um aplicativo nativo para Android utilizando o ecossistema **Capacitor**. 

* **Operação em Tablet:** O app foi compilado com sucesso e instalado diretamente no tablet de atendimento do depósito.
* **Performance:** Execução leve e fluida diretamente no dispositivo móvel, eliminando a dependência de um navegador web aberto.
* **Pronto para Automação:** Fluxo de fechamento de vendas preparado para acionar os comandos de impressão de cupons e recibos.

---

## 📐 Design e Uso Inteligente de Telas (Stitch)

A interface foi projetada utilizando conceitos modernos de design responsivo e fluidez (Stitch), focando na usabilidade do operador de caixa:

* **Adaptação Dinâmica:** O layout se ajusta automaticamente entre a visualização de desktop e o formato touch do tablet no balcão.
* **Carrinho Colapsável (`toggleCart()`):** Gerenciamento inteligente de espaço em telas menores. O painel lateral de itens pode ser expandido ou recolhido dinamicamente com um toque, otimizando a área útil da tela durante o atendimento.
* **Componentes Modulares:** Telas dedicadas e limpas para cada etapa do negócio:
  * **Vendas:** Interface ágil para inserção e baixa de produtos no caixa.
  * **Clientes:** Cadastro e consulta rápida de compradores.
  * **Gerenciamento e Histórico:** Painel para acompanhamento das movimentações e fechamento diário.
