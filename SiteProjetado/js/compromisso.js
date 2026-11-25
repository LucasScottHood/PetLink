/* Componente COMPROMISSO: agendar, aceitar e cancelar. */
const Compromisso = {
  CHAVE: "petlink_compromisso",

  atual() {
    return Dados.ler(this.CHAVE, null);
  },

  agendar(pet, data, horario) {
    const hoje = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD
    if (!pet) return "Escolha um pet no catálogo primeiro.";
    if (!data) return "Escolha uma data.";
    if (data < hoje) return "A data precisa ser hoje ou futura.";
    Dados.gravar(this.CHAVE, { pet, data, horario, status: "pendente" });
    return "";
  },

  mudarStatus(status) {
    const c = this.atual();
    if (!c) return;
    c.status = status;
    Dados.gravar(this.CHAVE, c);
  }
};

// Página "Agendar compromisso"
const formCompromisso = document.getElementById("formCompromisso");
if (formCompromisso) {
  const codigo = new URLSearchParams(window.location.search).get("pet");
  const pet = Catalogo.buscar(codigo);
  document.getElementById("nomePet").textContent = pet ? Catalogo.descricao(pet) : "Pet não encontrado";
  document.getElementById("data").min = new Date().toLocaleDateString("sv-SE");

  formCompromisso.addEventListener("submit", (e) => {
    e.preventDefault();
    const erro = Compromisso.agendar(
      pet ? Catalogo.descricao(pet) : "",
      document.getElementById("data").value,
      document.getElementById("horario").value
    );
    if (erro) document.getElementById("erro").textContent = erro;
    else window.location.href = "confirmacao.html";
  });
}

// Página "Confirmação"
const resumo = document.getElementById("resumo");
if (resumo) {
  const c = Compromisso.atual();
  if (!c) {
    resumo.textContent = "Nenhum compromisso agendado.";
  } else {
    const dataBR = c.data.split("-").reverse().join("/");
    [
      ["Pet: ", c.pet],
      ["Data: ", dataBR + " às " + c.horario],
      ["Situação: ", c.status]
    ].forEach(([rotulo, valor]) => {
      const p = document.createElement("p");
      const forte = document.createElement("strong");
      forte.textContent = valor;
      p.append(rotulo, forte);
      resumo.appendChild(p);
    });
  }

  // Aceitar = fim do fluxo (fica na tela mostrando "aceito")
  document.getElementById("aceitar").addEventListener("click", (e) => {
    e.preventDefault();
    Compromisso.mudarStatus("aceito");
    window.location.reload();
  });
  // Cancelar = volta à página principal de Pets (como no diagrama)
  document.getElementById("cancelar").addEventListener("click", (e) => {
    e.preventDefault();
    Compromisso.mudarStatus("cancelado");
    window.location.href = "catalogo.html";
  });
}
