@echo off
rem Abre o site Navalha Negra no navegador (precisa do Python instalado).
cd /d "%~dp0"
start "" http://localhost:8617
python tools\servir.py 8617
