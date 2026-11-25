/* Componente DADOS: único lugar que lê e grava no navegador (localStorage). */
const Dados = {
  ler(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : padrao;
    } catch (e) {
      return padrao;
    }
  },
  gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  },
  apagar(chave) {
    localStorage.removeItem(chave);
  }
};
