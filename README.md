# Navalha Negra · site da barbearia (portfólio Estúdio Forja)

Site de uma página, sem instalação: HTML, CSS e JavaScript puros, com as
bibliotecas guardadas na pasta `vendor/` (GSAP, ScrollTrigger e Lenis) e
as fontes em `fonts/` (Bodoni Moda e Archivo). Nada depende de serviços de
terceiros para funcionar.

## Ver o site no computador

Dê dois cliques em **`abrir-site.bat`**. Ele liga um servidor local e abre
`http://localhost:8617`. Abrir o `index.html` direto não funciona: o filme
do salão e os vídeos precisam de um servidor.

## O que editar (e onde)

Tudo o que muda de cliente para cliente fica em **`js/conteudo.js`**:

| O quê | Campo |
| --- | --- |
| Modo portfólio (liga/desliga a janela de demonstração) | `modoPortfolio` |
| WhatsApp, mensagem e site do Estúdio Forja | `estudio` |
| WhatsApp da barbearia (só com `modoPortfolio: false`) | `whatsapp` |
| Mensagem que chega pronta para a barbearia | `mensagem` e `mensagemServico` |
| Serviços, preços e tempos | `servicos` |
| Horários | `horarios` |
| Endereço (liga o mapa sozinho) | `endereco` |
| Telefone, Instagram, Facebook, TikTok | `telefone`, `instagram`... (vazio = some) |
| Depoimentos | `depoimentos` |

Os preços, tempos, horários e depoimentos atuais são **demonstrativos** e
estão identificados assim no site.

**Modo portfólio (ligado):** todo botão de agendamento abre a janela
"Esse clique viraria um agendamento", com três saídas: *Quero um site
assim* (WhatsApp do Estúdio Forja com a mensagem "Olá! Vi o site da
Navalha Negra e quero um site assim para o meu negócio."), *Ver outros
projetos* (site do Estúdio) e *Continuar explorando*. Para transformar em
site de uma barbearia real, use `modoPortfolio: false` e preencha
`whatsapp`: os botões passam a abrir direto o WhatsApp da barbearia.

## Mídia

Os arquivos de `media/` são gerados a partir dos originais (que não são
alterados):

- fotos: `C:\Users\Sony\Downloads\site barbearia`
- vídeos: `C:\Users\Sony\Downloads\site barbearia videos`

Para refazer tudo (por exemplo, depois de trocar um vídeo), no Git Bash:

```bash
bash tools/preparar_midia.sh
```

| Vídeo | Uso no site |
| --- | --- |
| vídeo 1 (cadeira) | Abertura: tocado de trás para frente, do couro até o salão, uma vez |
| vídeo 2 (salão) | Seção Diferencial: vira quadros que andam com a rolagem |
| vídeo 3 (ferramentas) | Seção Sobre: toca uma vez quando aparece na tela |

## Publicar (Cloudflare)

A pasta inteira é o site. O arquivo `_headers` já define cache e
segurança, e `404.html` é a página de erro. Antes de publicar no
subdomínio, troque em `index.html` a imagem de compartilhamento
(`og:image`) pelo endereço completo, por exemplo
`https://navalhanegra.estudioforja.com.br/media/og.jpg`.

## Acessibilidade e desempenho

- Quem ativa "reduzir movimento" no aparelho vê o site sem animações.
- Se o JavaScript falhar, o conteúdo aparece mesmo assim (sem animação).
- No celular, o filme usa 95 quadros menores (4,5 MB); no computador, 127
  quadros (9,3 MB), carregados em segundo plano.
