/* =====================================================================
   NAVALHA NEGRA · comportamento do site
   1. Conteúdo (serviços, horários, contato, depoimentos)
   2. Links de WhatsApp e do Estúdio Forja
   3. Rolagem suave (Lenis) e âncoras
   4. Abertura (loader) e hero em vídeo
   5. Cabeçalho, menu do celular, botões flutuantes
   6. Animações de entrada e contadores de preço
   7. Filme do salão guiado pela rolagem (canvas)
   8. Vídeo das ferramentas, parallax, cartões e galeria ampliada
   ===================================================================== */
(function () {
  "use strict";

  var C = window.NAVALHA || {};
  var doc = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var ehCelular = window.innerWidth < 768;
  var lenis = null;

  if (reduz) doc.classList.add("sem-movimento");
  if (!temGSAP) doc.classList.add("sem-anim");
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  /* -------------------------------------------------------------------
     1. CONTEÚDO
     ------------------------------------------------------------------- */
  function montarConteudo() {
    var servicos = Array.isArray(C.servicos) ? C.servicos : [];

    var lista = $("#lista-servicos");
    if (lista) {
      lista.innerHTML = servicos.map(function (s, i) {
        var preco = Number(s.preco);
        var temPreco = !isNaN(preco) && preco > 0;
        return '<li class="cartao" data-item>' +
          '<div class="cartao-topo"><span class="cartao-num">' + String(i + 1).padStart(2, "0") + "</span>" +
          (s.destaque ? '<span class="cartao-tag">' + esc(s.destaque) + "</span>" : "") + "</div>" +
          "<h3>" + esc(s.nome) + "</h3>" +
          '<p class="cartao-desc">' + esc(s.descricao) + "</p>" +
          '<div class="cartao-base">' +
            (temPreco ? '<p class="preco"><small>R$</small><span class="preco-num" data-valor="' + preco + '">' + preco.toLocaleString("pt-BR") + "</span></p>" : "<span></span>") +
            (s.tempo ? '<p class="tempo"><svg aria-hidden="true"><use href="#i-relogio"/></svg>' + esc(s.tempo) + " min</p>" : "") +
          "</div>" +
          '<a class="cartao-agendar" data-wa data-servico="' + esc(s.nome) + '" href="#agendar" aria-label="Agendar ' + esc(s.nome) + ' pelo WhatsApp">Agendar este serviço<svg aria-hidden="true"><use href="#i-seta"/></svg></a>' +
          "</li>";
      }).join("");
    }

    var rodServ = $("#rodape-servicos");
    if (rodServ) rodServ.innerHTML = servicos.map(function (s) { return "<li>" + esc(s.nome) + "</li>"; }).join("");

    var horarios = Array.isArray(C.horarios) ? C.horarios : [];
    var htmlHorarios = horarios.map(function (h) {
      var fechado = /fechado/i.test(h.hora || "");
      return "<dt>" + esc(h.dia) + '</dt><dd class="' + (fechado ? "fechado" : "") + '">' + esc(h.hora) + "</dd>";
    }).join("");
    ["#lista-horarios", "#rodape-horarios"].forEach(function (id) { var el = $(id); if (el) el.innerHTML = htmlHorarios; });

    var end = $("#endereco");
    if (end) {
      if (C.endereco) {
        end.textContent = C.endereco;
        var mapa = $("#mapa");
        if (mapa) {
          mapa.hidden = false;
          mapa.innerHTML = '<iframe title="Mapa: ' + esc(C.endereco) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' +
            encodeURIComponent(C.endereco) + '&output=embed"></iframe>';
        }
      } else {
        end.textContent = "O endereço completo é enviado na confirmação do seu agendamento.";
        end.classList.add("vazio");
      }
    }

    if (C.telefone) {
      var tel = String(C.telefone).replace(/\D/g, "");
      var htmlTel = '<a href="tel:+55' + esc(tel) + '"><svg aria-hidden="true"><use href="#i-fone"/></svg>' + esc(C.telefone) + "</a>";
      var t1 = $("#telefone"), t2 = $("#rodape-telefone");
      if (t1) { t1.innerHTML = htmlTel; t1.hidden = false; }
      if (t2) { t2.innerHTML = htmlTel; t2.hidden = false; }
    }

    var redes = [
      { url: C.instagram, nome: "Instagram", icone: "i-instagram" },
      { url: C.facebook, nome: "Facebook", icone: "i-facebook" },
      { url: C.tiktok, nome: "TikTok", icone: "i-tiktok" }
    ].filter(function (r) { return r.url && /^https?:\/\//i.test(r.url); });
    if (redes.length) {
      var htmlRedes = redes.map(function (r) {
        return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener" aria-label="Navalha Negra no ' + r.nome + '"><svg aria-hidden="true"><use href="#' + r.icone + '"/></svg></a></li>';
      }).join("");
      ["#redes", "#rodape-redes"].forEach(function (id) { var el = $(id); if (el) { el.innerHTML = htmlRedes; el.hidden = false; } });
    }

    var deps = Array.isArray(C.depoimentos) ? C.depoimentos : [];
    var listaDep = $("#lista-depoimentos");
    if (listaDep) {
      listaDep.innerHTML = deps.map(function (d) {
        return '<figure class="depoimento" data-item><span class="aspas" aria-hidden="true">“</span>' +
          "<blockquote><p>" + esc(d.texto) + "</p></blockquote>" +
          "<figcaption>Cliente · " + esc(d.servico) + "</figcaption></figure>";
      }).join("");
      if (!deps.length) $("#depoimentos").hidden = true;
    }

    [["#aviso-precos", C.avisoPrecos], ["#aviso-horarios", C.avisoHorarios], ["#aviso-depoimentos", C.avisoDepoimentos]]
      .forEach(function (p) { var el = $(p[0]); if (el) el.textContent = p[1] || ""; });

    var ano = $("#ano");
    if (ano) ano.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     2. LINKS: WhatsApp e Estúdio Forja
     ------------------------------------------------------------------- */
  var E = C.estudio || {};
  var portfolio = C.modoPortfolio !== false;
  var numero = String(C.whatsapp || "").replace(/\D/g, "");
  var numeroEstudio = String(E.whatsapp || "").replace(/\D/g, "");
  function wa(num, msg) { return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : ""); }
  function linkWhats(servico) {
    if (!numero) return "#contato";
    var msg = servico && C.mensagemServico ? C.mensagemServico.replace("{servico}", servico) : (C.mensagem || "");
    return wa(numero, msg);
  }
  var linkEstudio = numeroEstudio ? wa(numeroEstudio, E.mensagem) : (E.site || "#");

  function ligarLinks() {
    $$("[data-wa]").forEach(function (a) {
      // No modo portfólio o clique abre a janela de demonstração; o link
      // em si já aponta para o Estúdio (vale para "abrir em nova aba").
      a.href = portfolio ? linkEstudio : linkWhats(a.getAttribute("data-servico"));
      if (portfolio) a.setAttribute("aria-haspopup", "dialog");
      if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; }
    });
    if (E.site) $$("[data-forja]").forEach(function (a) { a.href = E.site; });
    var zap = $("#janela-whatsapp");
    if (zap) zap.href = linkEstudio;
  }

  function iniciarJanela() {
    var janela = $("#janela-agenda");
    if (!portfolio || !janela || typeof janela.showModal !== "function") return;
    var alvoServico = $("#janela-servico"), origem = null;
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("[data-wa]") : null;
      if (!a || a.closest("#janela-agenda")) return;
      e.preventDefault();
      origem = a;
      fecharMenu(true);
      var nome = a.getAttribute("data-servico");
      alvoServico.textContent = nome ? "o agendamento de “" + nome + "”" : "o seu horário";
      janela.showModal();
      if (lenis) lenis.stop();
      // Atenção: não animar a própria <dialog> com GSAP (o Chrome deixa de
      // tratá-la como modal). A entrada da janela é feita no CSS.
      if (temGSAP && !reduz) {
        gsap.fromTo($$(".rotulo, .janela-titulo, .janela-texto, .janela-acoes > *, .janela-continuar", janela),
          { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, delay: 0.1, ease: "power3.out" });
      }
    }, true);
    janela.addEventListener("click", function (e) {
      // fecha no X, em "Continuar explorando" ou clicando fora da janela
      if (e.target.closest("[data-fechar]") || e.target === janela) janela.close();
    });
    janela.addEventListener("close", function () {
      if (lenis) lenis.start();
      if (origem && document.contains(origem)) origem.focus({ preventScroll: true });
    });
  }

  /* -------------------------------------------------------------------
     3. ROLAGEM SUAVE E ÂNCORAS
     ------------------------------------------------------------------- */
  function alturaTopo() {
    var f = $(".faixa-forja"), t = $(".topo");
    return (f ? f.offsetHeight : 0) + (t ? t.offsetHeight : 0);
  }
  function irPara(el, imediato) {
    if (!el) return;
    var offset = el.id === "inicio" ? 0 : -alturaTopo();
    if (lenis) {
      lenis.scrollTo(el, { offset: offset, duration: imediato ? 0 : 1.4, immediate: !!imediato, force: true });
    } else {
      var y = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: imediato || reduz ? "auto" : "smooth" });
    }
    // leva o foco do teclado junto, sem pular a tela
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  function iniciarRolagem() {
    if (temGSAP) gsap.registerPlugin(ScrollTrigger);
    if (!reduz && temGSAP && typeof window.Lenis === "function") {
      lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      var alvo = document.getElementById(id.slice(1));
      if (!alvo) return;
      e.preventDefault();
      fecharMenu(true);
      irPara(alvo);
    });
  }

  /* -------------------------------------------------------------------
     4. ABERTURA E HERO
     ------------------------------------------------------------------- */
  var heroVideo = $("#hero-video");
  function prepararHero() {
    if (!heroVideo || reduz) return Promise.resolve();
    heroVideo.src = ehCelular ? "media/video/hero-854.mp4" : "media/video/hero-1280.mp4";
    heroVideo.load();
    return new Promise(function (ok) {
      var feito = false;
      function fim() { if (!feito) { feito = true; ok(); } }
      heroVideo.addEventListener("canplaythrough", fim, { once: true });
      heroVideo.addEventListener("error", fim, { once: true });
      setTimeout(fim, 3500);
    });
  }
  function tocarHero() {
    if (!heroVideo || reduz) return;
    // Quando o vídeo termina, ele é trocado pela foto do mesmo último quadro
    // (troca invisível) e é a FOTO que continua se afastando bem devagar.
    // Mover o <video> parado faz o Chrome "tremer" (arredonda pixels).
    var img = $(".hero-final");
    function passarParaFoto() {
      if (!img) return;
      img.style.opacity = 1;
      img.classList.add("respirando");
      heroVideo.style.visibility = "hidden";
    }
    heroVideo.addEventListener("ended", passarParaFoto, { once: true });
    var p = heroVideo.play();
    if (p && p.catch) p.catch(passarParaFoto); // vídeo bloqueado (ex.: modo economia)
  }

  function abertura() {
    var barra = $("#loader-barra"), pct = $("#loader-pct");
    var progresso = 0;
    function avanca(v) {
      progresso = Math.max(progresso, v);
      if (barra) barra.style.width = progresso + "%";
      if (pct) pct.textContent = Math.round(progresso) + "%";
    }
    avanca(8);
    var fontes = (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { avanca(40); });
    // No celular o site aparece logo; o vídeo entra quando estiver pronto
    // (até lá fica a primeira imagem dele). No computador espera o vídeo.
    var heroPronto = prepararHero();
    var video = (ehCelular ? Promise.resolve() : heroPronto).then(function () { avanca(85); });
    var minimo = new Promise(function (ok) { setTimeout(ok, ehCelular ? 450 : 900); });
    var limite = new Promise(function (ok) { setTimeout(ok, ehCelular ? 1200 : 4500); });

    return Promise.race([Promise.all([fontes, video, minimo]), limite]).then(function () {
      avanca(100);
      return new Promise(function (ok) { setTimeout(ok, 250); });
    }).then(function () {
      var loader = $("#loader");
      function concluir() {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        document.body.classList.remove("carregando");
        if (lenis) lenis.start();
      }
      if (temGSAP && loader && !reduz) {
        gsap.to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power4.inOut", onComplete: concluir });
      } else {
        concluir();
      }
      tocarHero();
      introHero();
      if (temGSAP) ScrollTrigger.refresh();
      if (location.hash.length > 1) {
        var alvo = document.getElementById(location.hash.slice(1));
        if (alvo) setTimeout(function () { irPara(alvo, true); }, 50);
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  function introHero() {
    if (!temGSAP || reduz) return;
    var tl = gsap.timeline({ delay: 0.35 });
    tl.fromTo(".hero-rotulo", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" })
      .fromTo(".hero-titulo .linha",
        { clipPath: "polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)" },
        { clipPath: "polygon(0% 0%, 125% 0%, 100% 100%, -25% 100%)", duration: 1.2, stagger: 0.18, ease: "power3.inOut" }, "-=0.5")
      .fromTo(".hero-manchete", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.55")
      .fromTo(".hero-texto", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7")
      .fromTo(".hero-acoes > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-rolar", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4");

    // ao rolar, o hero se afasta (conteúdo sobe e o vídeo cresce levemente)
    gsap.to(".hero-conteudo", { y: -80, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-midia", { scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* -------------------------------------------------------------------
     5. CABEÇALHO, MENU, FLUTUANTES
     ------------------------------------------------------------------- */
  var menu = $("#menu"), menuBotao = $(".menu-botao");
  function abrirMenu() {
    if (!menu) return;
    menu.hidden = false;
    menuBotao.setAttribute("aria-expanded", "true");
    menuBotao.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    $(".topo").classList.add("solido");
    if (temGSAP && !reduz) {
      gsap.fromTo(menu, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.out" });
      gsap.fromTo($$("nav a, .botao, .menu-forja", menu), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.15, ease: "power3.out" });
    }
    var primeiro = $("nav a", menu);
    if (primeiro) primeiro.focus();
  }
  function fecharMenu(semFoco) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuBotao.setAttribute("aria-expanded", "false");
    menuBotao.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    atualizarTopo();
    if (!semFoco) menuBotao.focus();
  }
  function iniciarMenu() {
    if (!menuBotao) return;
    menuBotao.addEventListener("click", function () { menu.hidden ? abrirMenu() : fecharMenu(); });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { fecharMenu(); return; }
      if (e.key === "Tab") {
        // mantém o foco dentro do menu aberto
        var focaveis = [menuBotao].concat($$("a, button", menu));
        var i = focaveis.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); focaveis[focaveis.length - 1].focus(); }
        else if (!e.shiftKey && i === focaveis.length - 1) { e.preventDefault(); focaveis[0].focus(); }
      }
    });
    $$("[data-wa], [data-forja]", menu).forEach(function (a) { a.addEventListener("click", function () { fecharMenu(true); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 960) fecharMenu(true); });
  }

  var topo = $(".topo"), fWhats = $(".flutuante-whats"), fTopo = $(".flutuante-topo"), barra = $(".barra-agenda");
  function atualizarTopo() {
    var y = window.pageYOffset;
    if (topo && (menu ? menu.hidden : true)) topo.classList.toggle("solido", y > 40);
    if (fWhats) fWhats.classList.toggle("visivel", y > window.innerHeight * 0.75);
    if (barra) barra.classList.toggle("visivel", y > window.innerHeight * 0.75);
    if (fTopo) fTopo.classList.toggle("visivel", y > window.innerHeight * 2);
  }
  function iniciarTopo() {
    window.addEventListener("scroll", atualizarTopo, { passive: true });
    atualizarTopo();
    if (fTopo) fTopo.addEventListener("click", function () { irPara($("#inicio")); });

    // no rodapé, os botões flutuantes saem para não cobrir os links
    var rodape = $(".rodape");
    if (rodape && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        document.body.classList.toggle("no-rodape", en[0].isIntersecting);
      }, { rootMargin: "0px 0px -80px 0px" }).observe(rodape);
    }

    // marca no menu a seção que está na tela
    var links = $$(".nav a");
    if ("IntersectionObserver" in window && links.length) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle("ativo", l.getAttribute("href") === "#" + en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["inicio", "servicos", "sobre", "diferenciais", "galeria", "depoimentos", "contato", "agendar"].forEach(function (id) {
        var s = document.getElementById(id); if (s) obs.observe(s);
      });
    }
  }

  /* -------------------------------------------------------------------
     6. ANIMAÇÕES DE ENTRADA (cada seção com um tipo diferente)
     ------------------------------------------------------------------- */
  var ANIM = {
    "fade-up":     { de: { y: 50, opacity: 0 }, dur: 0.9, ease: "power3.out", stagger: 0.12 },
    "slide-left":  { de: { x: -80, opacity: 0 }, dur: 0.9, ease: "power3.out", stagger: 0.14 },
    "slide-right": { de: { x: 80, opacity: 0 }, dur: 0.9, ease: "power3.out", stagger: 0.14 },
    "scale-up":    { de: { scale: 0.85, opacity: 0 }, dur: 1.0, ease: "power2.out", stagger: 0.12 },
    "rotate-in":   { de: { y: 40, rotation: 3, opacity: 0 }, dur: 0.9, ease: "power3.out", stagger: 0.1 },
    "stagger-up":  { de: { y: 60, opacity: 0 }, dur: 0.8, ease: "power3.out", stagger: 0.15 },
    "clip-reveal": { de: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }, para: { clipPath: "inset(0% 0% 0% 0%)" }, dur: 1.2, ease: "power4.inOut", stagger: 0.15 },
    // assinatura da marca: revelação em diagonal, como o passar da navalha
    "corte":       { de: { clipPath: "polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)", opacity: 0 }, para: { clipPath: "polygon(0% 0%, 125% 0%, 100% 100%, -25% 100%)" }, dur: 1.1, ease: "power3.inOut", stagger: 0.14 }
  };
  function estadoFinal(tipo) {
    var a = ANIM[tipo] || ANIM["fade-up"];
    var para = { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 };
    if (a.para) for (var k in a.para) para[k] = a.para[k];
    return para;
  }
  function animarItens(itens, tipo, extra) {
    var a = ANIM[tipo] || ANIM["fade-up"];
    var para = estadoFinal(tipo);
    para.duration = a.dur; para.ease = a.ease; para.stagger = a.stagger;
    if (a.para && a.para.clipPath) para.clearProps = "clipPath"; // libera sombras e bordas depois do recorte
    if (extra) for (var k in extra) para[k] = extra[k];
    return gsap.fromTo(itens, a.de, para);
  }

  function contarPreco(el) {
    var valor = Number(el.getAttribute("data-valor")) || 0;
    var obj = { v: 0 };
    el.textContent = "0";
    gsap.to(obj, {
      v: valor, duration: 1.6, ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString("pt-BR"); },
      onComplete: function () { el.textContent = valor.toLocaleString("pt-BR"); }
    });
  }

  function iniciarEntradas() {
    if (!temGSAP || reduz) return;
    $$("[data-anima]").forEach(function (cont) {
      var tipo = cont.getAttribute("data-anima");
      var itens = $$("[data-item]", cont);
      if (!itens.length) return;
      gsap.set(itens, ANIM[tipo] ? ANIM[tipo].de : { opacity: 0 });
      // em lotes: itens que entram juntos na tela aparecem em sequência
      ScrollTrigger.batch(itens, {
        start: "top 88%",
        once: true,
        onEnter: function (lote) {
          animarItens(lote, tipo);
          lote.forEach(function (it) { $$(".preco-num", it).forEach(contarPreco); });
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     7. FILME DO SALÃO GUIADO PELA ROLAGEM
     ------------------------------------------------------------------- */
  function iniciarFilme() {
    var filme = $("#diferenciais"), palco = $(".filme-palco"), canvas = $("#filme-canvas");
    if (!filme || !canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var PASTA = ehCelular ? "media/filme-m/" : "media/filme/";
    var TOTAL = ehCelular ? 95 : 127;
    var FRAME_SPEED = 1.9;          // o passeio termina em ~53% da seção
    var ZOOM_FINAL = 0.07;          // aproximação lenta depois que o passeio termina
    var quadros = new Array(TOTAL);
    var atual = -1, zoom = 0, progressoAtual = 0, pedido = false;

    function urlQuadro(i) { return PASTA + "q_" + String(i + 1).padStart(4, "0") + ".webp"; }
    function carregar(i) {
      return new Promise(function (ok) {
        var img = new Image();
        img.decoding = "async";
        img.onload = function () { quadros[i] = img; ok(); };
        img.onerror = function () { ok(); };
        img.src = urlQuadro(i);
      });
    }

    function tamanho() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = palco.clientWidth, h = palco.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      desenhar(true);
    }
    function quadroDisponivel(i) {
      if (quadros[i]) return quadros[i];
      for (var k = i - 1; k >= 0; k--) if (quadros[k]) return quadros[k];
      for (var j = i + 1; j < TOTAL; j++) if (quadros[j]) return quadros[j];
      return null;
    }
    function desenhar(forcar) {
      var p = progressoAtual;
      var acel = Math.min(p * FRAME_SPEED, 1);
      var idx = Math.min(Math.floor(acel * TOTAL), TOTAL - 1);
      var z = p * FRAME_SPEED > 1 ? (p - 1 / FRAME_SPEED) / (1 - 1 / FRAME_SPEED) * ZOOM_FINAL : 0;
      if (!forcar && idx === atual && Math.abs(z - zoom) < 0.0005) return;
      var img = quadroDisponivel(idx);
      if (!img) return;
      atual = idx; zoom = z;
      var cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
      // cenário (não produto em fundo liso): cobre a tela inteira, escala 1
      var s = Math.max(cw / iw, ch / ih) * (1 + zoom);
      var dw = iw * s, dh = ih * s;
      ctx.fillStyle = "#1C1C1C";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }
    function pedirDesenho() {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(function () { pedido = false; desenhar(false); });
    }

    // Movimento reduzido: só o último quadro, parado
    if (reduz || !temGSAP) {
      progressoAtual = 1;
      carregar(TOTAL - 1).then(tamanho);
      window.addEventListener("resize", tamanho);
      return;
    }

    // Carregamento: 10 primeiros quadros já, o resto em segundo plano
    var comecou = false;
    function carregarTudo() {
      if (comecou) return;
      comecou = true;
      var primeiros = [];
      for (var i = 0; i < Math.min(10, TOTAL); i++) primeiros.push(carregar(i));
      Promise.all(primeiros).then(function () {
        desenhar(true);
        var prox = 10;
        function trabalhador() {
          if (prox >= TOTAL) return Promise.resolve();
          var i = prox++;
          return carregar(i).then(function () { if (i === atual) desenhar(true); return trabalhador(); });
        }
        var fila = [];
        for (var w = 0; w < 6; w++) fila.push(trabalhador());
        return Promise.all(fila);
      });
    }
    if (document.readyState === "complete") setTimeout(carregarTudo, 800);
    else window.addEventListener("load", function () { setTimeout(carregarTudo, 800); });
    if ("IntersectionObserver" in window) {
      var perto = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { carregarTudo(); perto.disconnect(); }
      }, { rootMargin: "200% 0px" });
      perto.observe(filme);
    }

    // Textos: cada bloco aparece no centro da tela no meio do seu intervalo
    var secoes = $$(".filme-texto", filme).map(function (el) {
      var tipo = el.getAttribute("data-animation");
      var itens = $$("[data-item]", el);
      var a = ANIM[tipo] || ANIM["fade-up"];
      gsap.set(itens, a.de);
      var tl = gsap.timeline({ paused: true });
      var para = estadoFinal(tipo);
      para.duration = a.dur; para.ease = a.ease; para.stagger = a.stagger;
      tl.fromTo(itens, a.de, para);
      return {
        el: el, tl: tl, ligado: false,
        enter: parseFloat(el.getAttribute("data-enter")) / 100,
        leave: parseFloat(el.getAttribute("data-leave")) / 100,
        persist: el.getAttribute("data-persist") === "true",
        lado: el.classList.contains("lado-esq") ? "esq" : el.classList.contains("lado-dir") ? "dir" : "",
        escuro: el.getAttribute("data-escuro") === "true"
      };
    });
    function posicionar() {
      var H = filme.offsetHeight, vh = palco.offsetHeight;
      secoes.forEach(function (s) {
        var meio = (s.enter + s.leave) / 2;
        s.el.style.top = (meio * (H - vh) + vh / 2) + "px";
      });
    }
    var escuro = $("#filme-escuro");
    var secEscura = secoes.filter(function (s) { return s.escuro; })[0];
    var marquee = $(".marquee"), marqueeTexto = $(".marquee-texto");

    function atualizarTextos(p) {
      var lado = "";
      secoes.forEach(function (s) {
        var ativo = s.persist ? p >= s.enter : (p >= s.enter && p <= s.leave);
        if (ativo && !s.ligado) { s.ligado = true; s.tl.play(); }
        else if (!ativo && s.ligado) { s.ligado = false; s.tl.reverse(); }
        // o lado do texto ativo ganha um véu escuro para leitura
        if (p >= s.enter - 0.03 && p <= s.leave + 0.01 && s.lado) lado = s.lado;
      });
      if (palco.getAttribute("data-lado") !== lado) palco.setAttribute("data-lado", lado);
      // véu escuro para a frase central (0.9 de opacidade)
      var op = 0;
      if (secEscura) {
        var f = 0.04, e = secEscura.enter, l = secEscura.leave;
        if (p >= e - f && p <= e) op = (p - (e - f)) / f * 0.9;
        else if (p > e && p < l) op = 0.9;
        else if (p >= l && p <= l + f) op = 0.9 * (1 - (p - l) / f);
      }
      if (escuro) escuro.style.opacity = op;
      if (marquee) {
        var m = clamp01((p - 0.06) / 0.05) * clamp01((0.96 - p) / 0.05);
        marquee.style.opacity = m * (1 - op * 0.75);
      }
    }

    ScrollTrigger.create({
      trigger: filme,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function (self) {
        progressoAtual = self.progress;
        pedirDesenho();
        atualizarTextos(self.progress);
      },
      onRefresh: function (self) { posicionar(); progressoAtual = self.progress; desenhar(true); }
    });

    // Revelação em círculo: o salão "abre" enquanto a seção chega
    ScrollTrigger.create({
      trigger: filme,
      start: "top bottom",
      end: "top 10%",
      scrub: true,
      onUpdate: function (self) {
        palco.style.clipPath = "circle(" + (self.progress * 75).toFixed(2) + "% at 50% 50%)";
      },
      onLeave: function () { palco.style.clipPath = "none"; },
      onEnterBack: function () { palco.style.clipPath = "circle(75% at 50% 50%)"; }
    });

    // Letreiro gigante deslizando na horizontal
    if (marqueeTexto) {
      gsap.to(marqueeTexto, {
        xPercent: -30, ease: "none",
        scrollTrigger: { trigger: filme, start: "top top", end: "bottom bottom", scrub: true }
      });
    }

    tamanho();
    posicionar();
    window.addEventListener("resize", function () { tamanho(); });
  }

  /* -------------------------------------------------------------------
     8. DETALHES: vídeo das ferramentas, parallax, cartões, galeria
     ------------------------------------------------------------------- */
  function iniciarSobreVideo() {
    var v = $("#sobre-video");
    if (!v) return;
    if (reduz) { v.poster = "media/video/ferramentas-fim.webp"; return; }
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      obs.disconnect();
      v.src = ehCelular ? "media/video/ferramentas-854.mp4" : "media/video/ferramentas-1280.mp4";
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.poster = "media/video/ferramentas-fim.webp"; });
    }, { threshold: 0.45 });
    obs.observe(v);
  }

  function iniciarParallax() {
    if (!temGSAP || reduz) return;
    var foto = $(".servicos-foto img");
    if (foto) {
      gsap.set(foto, { scale: 1.14 });
      gsap.fromTo(foto, { yPercent: -5 }, { yPercent: 5, ease: "none",
        scrollTrigger: { trigger: ".servicos-foto", start: "top bottom", end: "bottom top", scrub: true } });
    }
    var fundo = $(".chamada-fundo");
    if (fundo) {
      gsap.fromTo(fundo, { yPercent: -7 }, { yPercent: 7, ease: "none",
        scrollTrigger: { trigger: ".chamada", start: "top bottom", end: "bottom top", scrub: true } });
    }
  }

  function iniciarCartoes() {
    $$(".cartao").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    });
  }

  function iniciarGaleria() {
    var dlg = $("#lightbox");
    var botoes = $$("[data-ampliar]");
    if (!dlg || !botoes.length || typeof dlg.showModal !== "function") return;
    var img = $("#lightbox-img"), leg = $("#lightbox-legenda");
    var atual = 0, origem = null;
    function mostrar(i) {
      atual = (i + botoes.length) % botoes.length;
      var b = botoes[atual];
      img.src = b.getAttribute("data-ampliar");
      img.alt = ($("img", b) || {}).alt || "";
      leg.textContent = b.getAttribute("data-legenda") || "";
      if (temGSAP && !reduz) gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
    }
    botoes.forEach(function (b, i) {
      b.addEventListener("click", function () {
        origem = b;
        mostrar(i);
        dlg.showModal();
        if (lenis) lenis.stop();
      });
    });
    $(".lb-fechar", dlg).addEventListener("click", function () { dlg.close(); });
    $(".lb-ant", dlg).addEventListener("click", function () { mostrar(atual - 1); });
    $(".lb-prox", dlg).addEventListener("click", function () { mostrar(atual + 1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });
    dlg.addEventListener("close", function () {
      if (lenis) lenis.start();
      if (origem) origem.focus();
    });
  }

  /* -------------------------------------------------------------------
     CARROSSÉIS DO CELULAR (serviços, galeria, depoimentos)
     No computador o CSS mostra tudo em grade e os pontinhos ficam ocultos.
     ------------------------------------------------------------------- */
  function iniciarCarrosseis() {
    $$("[data-carrossel]").forEach(function (c) {
      var itens = Array.prototype.slice.call(c.children);
      if (itens.length < 2) return;
      var nav = document.createElement("div");
      nav.className = "carrossel-nav";
      nav.innerHTML = '<span class="carrossel-dica" aria-hidden="true">Deslize</span><div class="carrossel-pontos">' +
        itens.map(function (_, i) { return '<button type="button" aria-label="Ver item ' + (i + 1) + " de " + itens.length + '"></button>'; }).join("") +
        "</div>";
      c.parentNode.insertBefore(nav, c.nextSibling);
      var pontos = $$("button", nav);
      function passo() { return itens[1].offsetLeft - itens[0].offsetLeft || c.clientWidth; }
      function marcar() {
        var i = Math.max(0, Math.min(itens.length - 1, Math.round(c.scrollLeft / passo())));
        pontos.forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
        if (i > 0) nav.classList.add("usado");
      }
      // a dica "Deslize" some depois que a pessoa toca no carrossel
      c.addEventListener("touchstart", function () { nav.classList.add("usado"); }, { once: true, passive: true });
      pontos.forEach(function (b, i) {
        b.addEventListener("click", function () { c.scrollTo({ left: i * passo(), behavior: reduz ? "auto" : "smooth" }); });
      });
      c.addEventListener("scroll", function () { requestAnimationFrame(marcar); }, { passive: true });
      marcar();
    });
  }

  /* -------------------------------------------------------------------
     INÍCIO
     ------------------------------------------------------------------- */
  try {
    montarConteudo();
    iniciarCarrosseis();
    ligarLinks();
    iniciarRolagem();
    iniciarMenu();
    iniciarTopo();
    iniciarEntradas();
    iniciarFilme();
    iniciarSobreVideo();
    iniciarParallax();
    iniciarCartoes();
    iniciarGaleria();
    iniciarJanela();
    window.__navalhaOk = true;
    abertura().catch(function (err) { falhar(err); });
  } catch (err) {
    falhar(err);
  }

  function falhar(err) {
    // nunca deixa o visitante numa tela vazia: mostra tudo sem animação
    if (window.console) console.error("[Navalha Negra]", err);
    doc.classList.add("sem-anim");
    var loader = $("#loader");
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    document.body.classList.remove("carregando");
    if (lenis) lenis.start();
    window.__navalhaOk = true;
  }
})();
