"""Servidor local para testar o site (os quadros do filme e os vídeos
não carregam abrindo o arquivo direto). Suporta pedidos parciais de
vídeo, como a hospedagem real. Uso: python tools/servir.py [porta]"""
import http.server
import os
import sys

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8617
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp", ".mp4": "video/mp4", ".svg": "image/svg+xml",
        ".woff2": "font/woff2", ".js": "text/javascript", ".css": "text/css",
    }

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=RAIZ, **kw)

    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        try:
            ini, fim = rng.replace("bytes=", "").split("-")
            ini = int(ini) if ini else 0
            fim = int(fim) if fim else size - 1
        except ValueError:
            return super().send_head()
        fim = min(fim, size - 1)
        f = open(path, "rb")
        f.seek(ini)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {ini}-{fim}/{size}")
        self.send_header("Content-Length", str(fim - ini + 1))
        self.end_headers()
        self._restante = fim - ini + 1
        return f

    def copyfile(self, source, outputfile):
        restante = getattr(self, "_restante", None)
        if restante is None:
            return super().copyfile(source, outputfile)
        while restante > 0:
            bloco = source.read(min(65536, restante))
            if not bloco:
                break
            outputfile.write(bloco)
            restante -= len(bloco)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"Navalha Negra em http://localhost:{PORTA}  (Ctrl+C para parar)")
    http.server.ThreadingHTTPServer(("", PORTA), Handler).serve_forever()
