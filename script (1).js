/* =====================================================================
   PORTFÓLIO — Enzo Geovane Xavier Santos
   Arquivo: script.js  (toda a interatividade da página)

   O que este arquivo faz:
   1. Alterna entre tema claro e escuro
   2. Abre e fecha o menu hambúrguer
   3. Digita o texto do Hero (efeito máquina de escrever)
   4. Mostra o botão "Voltar ao Topo"
   5. Atualiza o ano do rodapé
   6. Anima os elementos quando aparecem na tela
   7. Confere se o currículo existe antes de baixar
   ===================================================================== */

// Avisa o CSS que o JavaScript está funcionando.
// (Assim, se o JS falhar, nenhum conteúdo fica escondido.)
document.documentElement.classList.add("js-ativo");

// Verifica se a pessoa pediu para reduzir animações no sistema
const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------------------------------------------------------------------
   1. ALTERNAR TEMA (Dark / Light)
   --------------------------------------------------------------------- */
const botaoTema = document.getElementById("botao-tema");
const iconeTema = botaoTema.querySelector("i");
const chaveTema = "tema-portfolio"; // nome usado para salvar a escolha no navegador

// Aplica um tema ("claro" ou "escuro") na página
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);

  if (tema === "escuro") {
    // No modo escuro, o botão mostra o Sol (para voltar ao claro)
    iconeTema.className = "bi bi-sun-fill";
    botaoTema.setAttribute("aria-label", "Ativar modo claro");
  } else {
    iconeTema.className = "bi bi-moon-stars-fill";
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
    // Alguns navegadores bloqueiam o armazenamento; nesse caso o tema só vale nesta visita.
  }
}

// Descobre o tema inicial: escolha salva > preferência do sistema > claro
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
const iconeMenu = botaoMenu.querySelector("i");

function abrirMenu() {
  menuNavegacao.classList.add("aberto");
  botaoMenu.setAttribute("aria-expanded", "true");
  botaoMenu.setAttribute("aria-label", "Fechar menu");
  iconeMenu.className = "bi bi-x-lg";
}

function fecharMenu() {
  menuNavegacao.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  iconeMenu.className = "bi bi-list";
}

function alternarMenu() {
  if (menuNavegacao.classList.contains("aberto")) {
    fecharMenu();
  } else {
    abrirMenu();
  }
}

botaoMenu.addEventListener("click", alternarMenu);

// Fecha o menu ao clicar em um link (para ele não ficar na frente do conteúdo)
menuNavegacao.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});

// Fecha o menu com a tecla Esc (ajuda quem usa teclado)
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menuNavegacao.classList.contains("aberto")) {
    fecharMenu();
    botaoMenu.focus();
  }
});

// Se a tela ficar grande (menu horizontal), garante que o estado do hambúrguer volte ao normal
window.matchMedia("(min-width: 992px)").addEventListener("change", function (evento) {
  if (evento.matches) {
    fecharMenu();
  }
});


/* ---------------------------------------------------------------------
   3. EFEITO MÁQUINA DE ESCREVER
   --------------------------------------------------------------------- */
const textoDigitado = document.getElementById("texto-digitado");

// Frases que serão digitadas (todas baseadas em informações reais do portfólio)
const frases = [
  "Estudante de Desenvolvimento Full Stack",
  "Foco atual: Front-end",
  "Aprendendo HTML, CSS e JavaScript"
];

let indiceFrase = 0;     // qual frase está sendo digitada
let indiceLetra = 0;     // quantas letras já apareceram
let apagando = false;    // true quando está apagando

function digitarTexto() {
  const fraseAtual = frases[indiceFrase];

  if (apagando) {
    indiceLetra--;
  } else {
    indiceLetra++;
  }

  textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);

  let atraso = apagando ? 40 : 80; // velocidade em milissegundos

  if (!apagando && indiceLetra === fraseAtual.length) {
    // Terminou de digitar: espera um pouco e começa a apagar
    apagando = true;
    atraso = 1800;
  } else if (apagando && indiceLetra === 0) {
    // Terminou de apagar: passa para a próxima frase
    apagando = false;
    indiceFrase = (indiceFrase + 1) % frases.length;
    atraso = 400;
  }

  setTimeout(digitarTexto, atraso);
}

// Com "movimento reduzido", o texto fica fixo (sem digitar)
if (!prefereMovimentoReduzido) {
  textoDigitado.textContent = "";
  digitarTexto();
}


/* ---------------------------------------------------------------------
   4. BOTÃO "VOLTAR AO TOPO"
   --------------------------------------------------------------------- */
const botaoTopo = document.getElementById("botao-topo");

// Mostra o botão depois de rolar 400 pixels
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
        observador.unobserve(entrada.target); // anima só uma vez
      }
    });
  }, { threshold: 0.12 });

  elementosRevelar.forEach(function (elemento) {
    observador.observe(elemento);
  });
} else {
  // Navegadores muito antigos: mostra tudo de uma vez
  elementosRevelar.forEach(function (elemento) {
    elemento.classList.add("visivel");
  });
}


/* ---------------------------------------------------------------------
   7. BOTÃO "BAIXAR MEU CV"
   Antes de baixar, confere se o arquivo curriculo.pdf realmente existe.
   Se não existir, mostra um aviso (e não finge que o download funcionou).
   --------------------------------------------------------------------- */
const botaoCurriculo = document.getElementById("botao-cv");
const avisoCurriculo = document.getElementById("aviso-cv");
const caminhoCurriculo = "curriculo.pdf";

function mostrarAvisoCurriculo(mensagem) {
  avisoCurriculo.textContent = mensagem;
  avisoCurriculo.hidden = false;
}

async function baixarCurriculo(evento) {
  evento.preventDefault(); // impede o download automático até conferirmos o arquivo
  avisoCurriculo.hidden = true;

  try {
    // Pergunta ao servidor se o arquivo existe (HEAD não baixa o arquivo inteiro)
    const resposta = await fetch(caminhoCurriculo, { method: "HEAD", cache: "no-store" });

    if (!resposta.ok) {
      throw new Error("Arquivo não encontrado");
    }

    // Arquivo existe: cria um link temporário e dispara o download
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
