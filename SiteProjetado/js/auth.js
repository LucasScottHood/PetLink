/* Componente AUTENTICAÇÃO: cadastro, login, logout e proteção das páginas.
   Versão de demonstração: as contas ficam guardadas no navegador (sem servidor). */
const Auth = {
  CHAVE: "petlink_usuario",   // e-mail de quem está logado
  CONTAS: "petlink_contas",   // lista de contas cadastradas

  usuario() {
    return Dados.ler(this.CHAVE, null);
  },

  contas() {
    return Dados.ler(this.CONTAS, []);
  },

  // Retorna "" se deu certo, ou a mensagem de erro.
  cadastrar({ email, senha, confirmar, veterinario, crmv }) {
    email = email.trim().toLowerCase();
    crmv = crmv.trim().toUpperCase();

    if (!email.includes("@")) return "Informe um e-mail válido.";
    if (senha.length < 6) return "A senha precisa ter pelo menos 6 caracteres.";
    if (senha !== confirmar) return "As senhas informadas não são iguais.";
    if (veterinario && !/^\d{4,6}\/[A-Z]{2}$/.test(crmv)) {
      return "CRMV inválido. Use o formato 12345/RS.";
    }
    if (this.contas().some((c) => c.email === email)) {
      return "Já existe uma conta com este e-mail.";
    }

    const contas = this.contas();
    contas.push({ email, senha, veterinario, crmv: veterinario ? crmv : "" });
    Dados.gravar(this.CONTAS, contas);
    Dados.gravar(this.CHAVE, email); // depois do cadastro, já entra
    return "";
  },

  entrar(email, senha) {
    email = email.trim().toLowerCase();
    const conta = this.contas().find((c) => c.email === email);
    if (!conta || conta.senha !== senha) return "E-mail ou senha incorretos.";
    Dados.gravar(this.CHAVE, email);
    return "";
  },

  sair() {
    Dados.apagar(this.CHAVE);
    window.location.href = "../index.html";
  },

  // Páginas internas chamam isto: sem login, volta para o início.
  exigirLogin() {
    if (!this.usuario()) window.location.href = "../index.html";
  }
};

const IR_PARA_CATALOGO = "paginas/catalogo.html";

// Botão "Sair" do menu (se existir na página)
const linkSair = document.getElementById("sair");
if (linkSair) {
  linkSair.addEventListener("click", (e) => {
    e.preventDefault();
    Auth.sair();
  });
}

// Formulário de login (index.html)
const formLogin = document.getElementById("formLogin");
if (formLogin) {
  if (Auth.usuario()) window.location.href = IR_PARA_CATALOGO;

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const erro = Auth.entrar(
      document.getElementById("email").value,
      document.getElementById("senha").value
    );
    if (erro) document.getElementById("erro").textContent = erro;
    else window.location.href = IR_PARA_CATALOGO;
  });
}

// Formulário de cadastro de conta (cadastro.html)
const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  const caixaVet = document.getElementById("caixaVet");
  const marcaVet = document.getElementById("veterinario");
  marcaVet.addEventListener("change", () => {
    caixaVet.hidden = !marcaVet.checked;
  });

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const erro = Auth.cadastrar({
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
      confirmar: document.getElementById("confirmar").value,
      veterinario: marcaVet.checked,
      crmv: document.getElementById("crmv").value
    });
    if (erro) document.getElementById("erro").textContent = erro;
    else window.location.href = IR_PARA_CATALOGO;
  });
}
