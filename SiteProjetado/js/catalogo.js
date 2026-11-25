/* Componente CATÁLOGO DE PETS: cadastrar pet (código automático) e listar. */
const Catalogo = {
  CHAVE: "petlink_pets",
  ESPECIES: { cao: "Cão", gato: "Gato", ave: "Ave doméstica" },

  // Pets de exemplo, usados só na primeira vez
  INICIAIS: [
    { codigo: "PET-0001", especie: "cao", raca: "Vira-lata caramelo", sexo: "Macho", tamanho: "Médio",
      localizacao: "Rio Grande - RS", alergias: "Nenhuma", doencas: "Nenhuma", dono: "" },
    { codigo: "PET-0002", especie: "gato", raca: "Siamês", sexo: "Fêmea", tamanho: "Pequeno",
      localizacao: "São José do Norte - RS", alergias: "Nenhuma", doencas: "Rinite leve", dono: "" },
    { codigo: "PET-0003", especie: "ave", raca: "Calopsita", sexo: "Macho", tamanho: "Pequeno",
      localizacao: "Pelotas - RS", alergias: "Nenhuma", doencas: "Nenhuma", dono: "" }
  ],

  todos() {
    let pets = Dados.ler(this.CHAVE, null);
    if (!pets) {
      pets = this.INICIAIS;
      Dados.gravar(this.CHAVE, pets);
    }
    return pets;
  },

  buscar(codigo) {
    return this.todos().find((p) => p.codigo === codigo);
  },

  descricao(pet) {
    return this.ESPECIES[pet.especie] + " · " + pet.raca + " (" + pet.codigo + ")";
  },

  // Retorna { erro, pet }. O código é gerado automaticamente.
  cadastrar(dados, dono) {
    const obrigatorios = ["especie", "raca", "sexo", "localizacao", "tamanho"];
    if (obrigatorios.some((campo) => !dados[campo].trim())) {
      return { erro: "Preencha raça, sexo, localização e tamanho." };
    }
    const pets = this.todos();
    const codigo = "PET-" + String(pets.length + 1).padStart(4, "0");
    const pet = { codigo, dono, ...dados };
    pets.push(pet);
    Dados.gravar(this.CHAVE, pets);
    return { erro: "", pet };
  }
};

// Cria um elemento com texto (textContent evita injeção de HTML)
function criar(tag, texto, classe) {
  const el = document.createElement(tag);
  el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

// Página do catálogo
const listaPets = document.getElementById("listaPets");
if (listaPets) {
  Catalogo.todos().forEach((pet) => {
    const caixa = criar("article", "", "caixa");
    caixa.append(
      criar("h3", Catalogo.ESPECIES[pet.especie] + " · " + pet.raca),
      criar("p", "Código: " + pet.codigo),
      criar("p", "Sexo: " + pet.sexo + " · Tamanho: " + pet.tamanho + " · " + pet.localizacao),
      criar("p", "Alergias: " + (pet.alergias || "não informado") + " · Doenças: " + (pet.doencas || "não informado"))
    );

    if (pet.dono && pet.dono === Auth.usuario()) {
      caixa.append(criar("p", "Cadastrado por você"));
    } else {
      const link = criar("a", "Quero me comunicar", "botao");
      link.href = "compromisso.html?pet=" + encodeURIComponent(pet.codigo);
      caixa.append(link);
    }
    listaPets.append(caixa);
  });
}

// Página "Cadastre seu pet"
const formPet = document.getElementById("formPet");
if (formPet) {
  formPet.addEventListener("submit", (e) => {
    e.preventDefault();
    const valor = (id) => document.getElementById(id).value;
    const resultado = Catalogo.cadastrar(
      {
        especie: valor("especie"),
        raca: valor("raca"),
        sexo: valor("sexo"),
        localizacao: valor("localizacao"),
        tamanho: valor("tamanho"),
        alergias: valor("alergias").trim(),
        doencas: valor("doencas").trim()
      },
      Auth.usuario()
    );
    if (resultado.erro) {
      document.getElementById("erro").textContent = resultado.erro;
    } else {
      window.location.href = "catalogo.html";
    }
  });
}
