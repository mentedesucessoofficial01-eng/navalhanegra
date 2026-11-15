#!/usr/bin/env bash
# Prepara toda a mídia do site Navalha Negra a partir das pastas originais.
# Não altera os originais: só lê de lá e grava em media/.
# Uso (Git Bash):  bash tools/preparar_midia.sh
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
IMG="/c/Users/Sony/Downloads/site barbearia"
VID="/c/Users/Sony/Downloads/site barbearia videos"
OUT="$RAIZ/media"
mkdir -p "$OUT"/{img,video,filme,filme-m,galeria}

# Correção de cor: aproxima os vídeos (mais claros) do preto profundo das fotos.
COR_HERO="eq=contrast=1.18:brightness=-0.05:gamma=0.78:saturation=1.08"
COR="eq=contrast=1.1:brightness=-0.02:gamma=0.9:saturation=1.05"
X264="-c:v libx264 -preset slow -pix_fmt yuv420p -movflags +faststart -an"

echo "1/5 Hero (vídeo 1, tocado de trás para frente: do couro até o salão)"
ffmpeg -v error -y -i "$VID/video 1.mp4" -vf "reverse,$COR_HERO" $X264 -crf 23 "$OUT/video/hero-1280.mp4"
ffmpeg -v error -y -i "$VID/video 1.mp4" -vf "reverse,$COR_HERO,scale=854:-2" $X264 -crf 25 "$OUT/video/hero-854.mp4"
# Primeiro quadro exibido (close no couro) e último (salão aberto, usado também sem animação)
ffmpeg -v error -y -i "$VID/video 1.mp4" -vf "select='eq(n\,189)',$COR_HERO" -frames:v 1 -c:v libwebp -quality 80 "$OUT/video/hero-inicio.webp"
# Foto final tirada do PRÓPRIO vídeo do site (último quadro): a troca vídeo -> foto fica invisível
ffmpeg -v error -y -sseof -0.2 -i "$OUT/video/hero-1280.mp4" -update 1 -c:v libwebp -quality 92 "$OUT/video/hero-fim.webp"

echo "2/5 Ferramentas (vídeo 3)"
ffmpeg -v error -y -i "$VID/video 3.mp4" -vf "$COR" $X264 -crf 23 "$OUT/video/ferramentas-1280.mp4"
ffmpeg -v error -y -i "$VID/video 3.mp4" -vf "$COR,scale=854:-2" $X264 -crf 25 "$OUT/video/ferramentas-854.mp4"
ffmpeg -v error -y -i "$VID/video 3.mp4" -vf "select='eq(n\,0)',$COR" -frames:v 1 -c:v libwebp -quality 80 "$OUT/video/ferramentas-inicio.webp"
ffmpeg -v error -y -i "$VID/video 3.mp4" -vf "select='eq(n\,189)',$COR" -frames:v 1 -c:v libwebp -quality 80 "$OUT/video/ferramentas-fim.webp"

echo "3/5 Filme do salão guiado pela rolagem (vídeo 2 em quadros)"
rm -f "$OUT"/filme/*.webp "$OUT"/filme-m/*.webp
# Computador: 2 de cada 3 quadros (127), suave e mais leve.
ffmpeg -v error -y -i "$VID/video 2.mp4" -vf "select='not(eq(mod(n\,3)\,2))',$COR" -fps_mode vfr -c:v libwebp -quality 62 "$OUT/filme/q_%04d.webp"
# Celular: metade dos quadros, menor (economiza dados e memória)
ffmpeg -v error -y -i "$VID/video 2.mp4" -vf "select='not(mod(n\,2))',$COR,scale=854:-2" -fps_mode vfr -c:v libwebp -quality 68 "$OUT/filme-m/q_%04d.webp"

echo "4/5 Fotos (as cinco imagens, em dois tamanhos)"
for n in 1 2 3 4 5; do
  ffmpeg -v error -y -i "$IMG/imagem $n.jpeg" -c:v libwebp -quality 80 "$OUT/img/imagem-$n-1600.webp"
  ffmpeg -v error -y -i "$IMG/imagem $n.jpeg" -vf "scale=800:-2" -c:v libwebp -quality 80 "$OUT/img/imagem-$n-800.webp"
done

echo "5/5 Recortes da galeria (só de material existente, nada gerado)"
g(){ ffmpeg -v error -y -i "$1" -vf "$2" -frames:v 1 -c:v libwebp -quality 82 "$OUT/galeria/$3.webp"; }
g "$IMG/imagem 4.jpeg" "crop=760:900:420:0"          retrato
g "$IMG/imagem 2.jpeg" "crop=640:820:740:60"         degrade
g "$IMG/imagem 2.jpeg" "crop=600:600:880:280"        barba
g "$IMG/imagem 3.jpeg" "crop=1060:560:500:250"       navalha
g "$IMG/imagem 5.jpeg" "scale=1280:-2"               ambiente
g "$VID/video 1.mp4"   "select='eq(n\,189)',$COR_HERO,crop=640:720:420:0" cadeira

echo "Pronto. Quadros do filme: $(ls "$OUT/filme" | wc -l) (computador), $(ls "$OUT/filme-m" | wc -l) (celular)"
du -sh "$OUT"/*
