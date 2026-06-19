# 🛒 PDV Comercial — Depósito São Jerônimo

<div align="center">
  <!-- Botão Direto para os Prints no LinkedIn -->
  <a href="https://www.linkedin.com/in/wesley-campelo-640441385/details/projects/" target="_blank">
    <img src="https://img.shields.io/badge/Acesse_as_Telas_do_Sistema-Clique_Aqui-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Ver Telas no LinkedIn" />
  </a>
</div>

<br>

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</div>

<br>

O **PDV Comercial - Depósito São Jerônimo** é uma aplicação mobile full-stack projetada e implementada sob medida para automatizar o gerenciamento diário de caixa, controle de vendas rápidas e fluxo de clientes locais. Desenvolvido para rodar de forma nativa e leve diretamente em tablets de atendimento, o sistema otimiza a operação de balcão eliminando burocracias e dependências de navegadores web.

---

## 🛠️ Tecnologias e Arquitetura do Ecossistema

O software foi construído unindo a agilidade das tecnologias web com o poder de empacotamento nativo mobile, garantindo excelente performance em dispositivos touchscreen:

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Linguagem Base** | **JavaScript (ES6+)** | Responsável por toda a lógica de negócios, manipulação dinâmica do carrinho e regras fiscais locais. |
| **Runtime Mobile** | **Capacitor BY ionic** | Motor multiplataforma que encapsula a aplicação web e fornece acesso nativo aos recursos e APIs do sistema operacional Android. |
| **Plataforma Alvo** | **Android SDK** | Ambiente nativo de compilação utilizado para gerar os pacotes otimizados para o tablet de atendimento. |
| **Estrutura Visual** | **HTML5 & CSS3** | Arquitetura de marcação estruturada e estilização modular para interfaces comerciais de alta frequência. |

---

## 🎨 Design e UI/UX: Domínio com Stitch

A interface visual do sistema foi projetada para oferecer uma experiência de alta velocidade e foco total na usabilidade do operador de caixa.

> 💡 **Destaque de Engenharia Visual:** 
> Todo o design foi concebido com domínio técnico no **Stitch**, permitindo uma adaptação dinâmica entre telas convencionais e o formato touch do tablet. O grande trunfo está no uso de componentes modulares, como o carrinho colapsável (`toggleCart()`), que expande ou recolhe com um toque para otimizar ao máximo a área útil da tela do dispositivo no balcão.

---

## ⚙️ Engenharia de Distribuição (Compilação Nativa)

Um dos grandes diferenciais técnicos deste projeto está na engenharia de build para dispositivos móveis, transpondo barreiras tradicionais de ambiente:

* **Sincronização Eficiente:** Utilização de fluxos automatizados com `npx cap sync` para espelhar em tempo real as atualizações de software diretamente no ambiente nativo.
* **Build Isolada:** Configuração bem-sucedida de compilação em ambiente Windows através do utilitário `gradlew.bat`, empacotando os binários e gerando o arquivo autônomo final pronto para instalação (**`.apk`**).
* **Pronto para Automação:** Fluxo interno estruturado de forma nativa para disparar os comandos de impressão de recibos, pronto para pareamento com micro-impressoras térmicas de bobina.

---

<p align="center">Desenvolvido por <strong>Wesley</strong> 🚀</p>
