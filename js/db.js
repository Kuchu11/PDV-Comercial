function obterDadosDoBanco(chaveArmazenamento) {
    const dadosTexto = localStorage.getItem(chaveArmazenamento);
    return dadosTexto ? JSON.parse(dadosTexto) : [];
}

function salvarDadosNoBanco(chaveArmazenamento, dadosParaSalvar) {
    localStorage.setItem(chaveArmazenamento, JSON.stringify(dadosParaSalvar));
}