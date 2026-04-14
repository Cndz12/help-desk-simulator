@echo off
cd /d "%~dp0"
call ".venv\Scripts\activate.bat"
pyinstaller --noconfirm --clean --windowed --name "HelpDeskSimulator" --add-data "assets;assets" --add-data "characters;characters" --add-data "scenes;scenes" --add-data "scripts;scripts" --add-data "systems;systems" --add-data "tickets;tickets" --add-data "index.html;." app.py
