@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 Iniciando deploy para GitHub Pages...
echo.

cd /d "C:\Users\Pichau\Documents\projects\8rped-structure"

echo ✅ Adicionando arquivos ao git...
git add .

echo ✅ Fazendo commit...
git commit -m "Adicionar cronograma com Google Sheets API e design responsivo

- Integração em tempo real com Google Sheets
- Design moderno azul-branco responsivo
- Barra de busca e filtros por dia
- Otimizado para mobile
- Auto-refresh a cada 5 minutos

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo ✅ Fazendo push para GitHub...
git push origin master

echo.
echo 🎉 Deploy concluído!
echo.
echo 📝 Agora configure GitHub Pages:
echo    1. Vá em: https://github.com/seu-usuario/8rped-structure/settings/pages
echo    2. Em "Source", selecione "master" branch
echo    3. Clique em "Save"
echo.
echo 🌐 Seu site estará disponível em:
echo    https://seu-usuario.github.io/8rped-structure/
echo.
pause
