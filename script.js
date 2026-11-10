/* =========================================================
   PORTFÓLIO — JAVASCRIPT
   Funções para tema, menu, digitação e pequenos efeitos.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Elementos principais da página
  const corpoPagina = document.body;
  const botaoTema = document.getElementById("botao-tema");
  const iconeTema = botaoTema.querySelector("i");
  const botaoMenu = document.getElementById("botao-menu");
  const listaMenu = document.getElementById("lista-menu");
  const botaoTopo = document.getElementById("botao-topo");
  const anoAtual = document.getElementById("ano-atual");

  // 1. Alternância entre tema claro e escuro
  function aplicarTema(tema) {
    const temaEscuroAtivo = tema === "escuro";

    corpoPagina.classList.toggle("tema-escuro", temaEscuroAtivo);
    iconeTema.className = temaEscuroAtivo
      ? "bi bi-sun-fill"
      : "bi bi-moon-stars-fill";

    botaoTema.setAttribute(
      "aria-label",
      temaEscuroAtivo ? "Ativar tema claro" : "Ativar tema escuro"
    );

    // Guarda a preferência para a próxima visita
    localStorage.setItem("tema-portfolio", tema);
  }

  // Recupera o tema salvo. Se não existir, começa no tema claro.
  const temaSalvo = localStorage.getItem("tema-portfolio") || "claro";
  aplicarTema(temaSalvo);

  botaoTema.addEventListener("click", function () {
    const novoTema = corpoPagina.classList.contains("tema-escuro")
      ? "claro"
      : "escuro";

    aplicarTema(novoTema);
  });

  // 2. Abrir e fechar o menu no celular
  function alternarMenu() {
    const menuEstaAberto = listaMenu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
    botaoMenu.setAttribute(
      "aria-label",
      menuEstaAberto ? "Fechar menu" : "Abrir menu"
    );
    botaoMenu.querySelector("i").className = menuEstaAberto
      ? "bi bi-x-lg"
      : "bi bi-list";
  }

  botaoMenu.addEventListener("click", alternarMenu);

  // Fecha o menu depois que um link é selecionado
  listaMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      listaMenu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
      botaoMenu.querySelector("i").className = "bi bi-list";
    });
  });

  // 3. Efeito máquina de escrever na apresentação
  const textoDigitado = document.getElementById("texto-digitado");
  const frases = [
    "Estudante de Desenvolvimento Full Stack",
    "Foco em Desenvolvimento Front-end",
    "Apaixonado por tecnologia"
  ];

  let indiceFrase = 0;
  let indiceLetra = 0;
  let apagando = false;

  function efeitoMaquina() {
    const fraseAtual = frases[indiceFrase];

    if (apagando) {
      indiceLetra--;
    } else {
      indiceLetra++;
    }

    textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);

    let velocidade = apagando ? 35 : 65;

    if (!apagando && indiceLetra === fraseAtual.length) {
      apagando = true;
      velocidade = 1500;
    } else if (apagando && indiceLetra === 0) {
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      velocidade = 350;
    }

    window.setTimeout(efeitoMaquina, velocidade);
  }

  // Inicia o efeito depois que a página termina de carregar
  textoDigitado.textContent = "";
  efeitoMaquina();

  // 4. Botão voltar ao topo: aparece depois de rolar a página
  function verificarRolagem() {
    botaoTopo.classList.toggle("visivel", window.scrollY > 350);
  }

  window.addEventListener("scroll", verificarRolagem, { passive: true });
  verificarRolagem();

  botaoTopo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 5. Ano automático no rodapé
  anoAtual.textContent = new Date().getFullYear();

  // 6. Animação dos elementos quando entram na área visível
  const elementosAnimados = document.querySelectorAll(".animar");

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      function (entradas, observadorAtual) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observadorAtual.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elementosAnimados.forEach(function (elemento) {
      observador.observe(elemento);
    });
  } else {
    // Alternativa para navegadores antigos
    elementosAnimados.forEach(function (elemento) {
      elemento.classList.add("visivel");
    });
  }
});
