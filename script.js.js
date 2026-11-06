/* =====================================================================
   PORTFÓLIO — Enzo Geovane Xavier Santos
   Arquivo: script.js.js  (toda a interatividade da página)
   ===================================================================== */

// Avisa o CSS que o JavaScript está funcionando.
document.documentElement.classList.add("js-ativo");

// Detecta se o usuário prefere movimento reduzido
const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------------
  1. ALTERNAR TEMA (Dark / Light)
  --------------------------------------------------------------------- */
const botaoTema = document.getElementById("botao-tema");
const chaveTema = "tema-portfolio"; 

// Aplica um tema ("claro" ou "escuro") na página
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  
  // Seleciona o ícone de forma segura dentro da função
  const iconeTema = botaoTema.querySelector("i");

  if (tema === "escuro") {
    if (iconeTema) iconeTema.className = "bi bi-sun-fill";
    botaoTema.setAttribute("aria-label", "Ativar modo claro");
  } else {
    if (iconeTema) iconeTema.className = "bi bi-moon-stars-fill";
    botaoTema.setAttribute("aria-label", "Ativar modo escuro");
  }
}

// Troca o tema atual pelo outro e salva a escolha
function alternarTema() {
  const temaAtual = document.documentElement.getAttribute("data-tema");
  const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
  aplicarTema(novoTema);

  try {
    localStorage.setItem(chaveTema, novoTema);
  } catch (erro) {
    // Ignora se o navegador bloquear o localStorage
  }
}

// Descobre o tema inicial
function definirTemaInicial() {
  let temaSalvo = null;
  try {
    temaSalvo = localStorage.getItem(chaveTema);
  } catch (erro) {
    temaSalvo = null;
  }

  if (temaSalvo === "claro" || temaSalvo === "escuro") {
    aplicarTema(temaSalvo);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    aplicarTema("escuro");
  } else {
    aplicarTema("claro");
  }
}

botaoTema.addEventListener("click", alternarTema);
definirTemaInicial();


/* ---------------------------------------------------------------------
   2. MENU HAMBÚRGUER
  --------------------------------------------------------------------- */
const botaoMenu = document.getElementById("botao-menu");
const menuNavegacao = document.getElementById("menu-navegacao");

function abrirMenu() {
  menuNavegacao.classList.add("aberto");
  botaoMenu.setAttribute("aria-expanded", "true");
  botaoMenu.setAttribute("aria-label", "Fechar menu");
  const iconeMenu = botaoMenu.querySelector("i");
  if (iconeMenu) iconeMenu.className = "bi bi-x-lg";
}

function fecharMenu() {
  menuNavegacao.classList.remove("aberto");
  botaoMaenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  const iconeMenu = botaoMenu.querySelector("i");
  if (iconeMenu) iconeMenu.className = "bi bi-list";
}

function alternarMenu() {
  if (menuNavegacao.classList.contains("aberto")) {
    fecharMenu();
  } else {
    abrirMenu();
  }
}

botaoMenu.addEventListener("click", alternarMenu);

// Fecha o menu ao clicar em um link
menuNavegacao.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});

// Fecha o menu com a tecla Esc
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menuNavegacao.classList.contains("aberto")) {
    fecharMenu();
    botaoMenu.focus();
  }
});

// Se a tela ficar grande, fecha o menu automaticamente
window.matchMedia("(min-width: 992px)").addEventListener("change", function (evento) {
  if (evento.matches) {
    fecharMenu();
  }
});


/* ---------------------------------------------------------------------
   3. EFEITO MÁQUINA DE ESCREVER
  --------------------------------------------------------------------- */
const textoDigitado = document.getElementById("texto-digitado");

const frases = [
  "Estudante de Desenvolvimento Full Stack",
  "Foco atual: Front-end",
  "Aprendendo HTML, CSS e JavaScript"
];

let indiceFrase = 0;     
let indiceLetra = 0;     
let apagando = false;    

function digitarTexto() {
  const fraseAtual = frases[indiceFrase];

  if (apagando) {
    indiceLetra--;
  } else {
    indiceLetra++;
  }

  textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);

  let atraso = apagando ? 40 : 80; 

  if (!apagando && indiceLetra === fraseAtual.length) {
    apagando = true;
    atraso = 1800;
  } else if (apagando && indiceLetra === 0) {
    apagando = false;
    indiceFrase = (indiceFrase + 1) % frases.length;
    atraso = 400;
  }

  setTimeout(digitarTexto, atraso);
}

if (!prefereMovimentoReduzido) {
  textoDigitado.textContent = "";
  digitarTexto();
}


/* ---------------------------------------------------------------------
   4. BOTÃO "VOLTAR AO TOPO"
  --------------------------------------------------------------------- */
const botaoTopo = document.getElementById("botao-topo");

function controlarBotaoTopo() {
  if (window.scrollY > 400) {
    botaoTopo.classList.add("visivel");
  } else {
    botaoTopo.classList.remove("visivel");
  }
}

function voltarAoTopo() {
  window.scrollTo({
    top: 0,
    behavior: prefereMovimentoReduzido ? "auto" : "smooth"
  });
}

window.addEventListener("scroll", controlarBotaoTopo, { passive: true });
botaoTopo.addEventListener("click", voltarAoTopo);
controlarBotaoTopo();


/* ---------------------------------------------------------------------
   5. ANO AUTOMÁTICO NO RODAPÉ
  --------------------------------------------------------------------- */
document.getElementById("ano-atual").textContent = new Date().getFullYear();


/* ---------------------------------------------------------------------
   6. ANIMAÇÃO DE ENTRADA AO ROLAR (IntersectionObserver)
  --------------------------------------------------------------------- */
const elementosRevelar = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target); 
      }
    });
  }, { threshold: 0.12 });

  elementosRevelar.forEach(function (elemento) {
    observador.observe(elemento);
  });
} else {
  elementosRevelar.forEach(function (elemento) {
    elemento.classList.add("visivel");
  });
}


/* ---------------------------------------------------------------------
   7. BOTÃO "BAIXAR MEU CV"
  --------------------------------------------------------------------- */
const botaoCurriculo = document.getElementById("botao-cv");
const avisoCurriculo = document.getElementById("aviso-cv");
const caminhoCurriculo = "curriculo.pdf";

function mostrarAvisoCurriculo(mensagem) {
  avisoCurriculo.textContent = mensagem;
  avisoCurriculo.hidden = false;
}

async function baixarCurriculo(evento) {
  evento.preventDefault(); 
  avisoCurriculo.hidden = true;

  try {
    const resposta = await fetch(caminhoCurriculo, { method: "HEAD", cache: "no-store" });

    if (!resposta.ok) {
      throw new Error("Arquivo não encontrado");
    }

    const linkTemporario = document.createElement("a");
    linkTemporario.href = caminhoCurriculo;
    linkTemporario.download = "curriculo.pdf";
    document.body.appendChild(linkTemporario);
    linkTemporario.click();
    linkTemporario.remove();
  } catch (erro) {
    mostrarAvisoCurriculo(
      "O currículo ainda não está disponível. Salve o arquivo curriculo.pdf na mesma pasta do index.html " +
      "(e abra o site por um servidor, como o Live Server ou o GitHub Pages)."
    );
  }
}

botaoCurriculo.addEventListener("click", baixarCurriculo);