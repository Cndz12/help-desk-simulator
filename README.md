# Help Desk Simulator

Jogo 2D de simulacao de suporte tecnico com visual retro e placeholders centralizados para troca futura dos sprites.

## Estrutura do projeto

```text
/assets/sprites        -> sprite_manager centralizado e chaves visuais do jogo
/assets/ui             -> CSS e aparencia da interface retro
/characters            -> personagens e dados do escritorio
/scenes                -> cenas da tela inicial, escritorio, resolucao e game over
/scripts               -> bootstrap do jogo no navegador
/systems               -> controlador do jogo e audio
/tickets               -> catalogo e logica de tickets
```

## Como rodar

### No VS Code

1. Abra a pasta do projeto.
2. Use `F5` para abrir com `app.py`.

### Pelo terminal

```bat
.venv\Scripts\activate
python app.py
```

Ou:

```bat
run_game.bat
```

## Como trocar sprites

### Arquivo principal

Todo sprite do projeto passa por:

```text
assets/sprites/sprite_manager.js
```

### Regra importante

- Nenhuma cena chama sprite direto por caminho.
- Toda arte deve ser cadastrada no `SPRITES`.
- Depois disso, o jogo usa `spriteMarkup(category, key)`.

### Onde trocar

Dentro de `assets/sprites/sprite_manager.js` voce encontra comentarios assim:

```js
// ===== TROCAR SPRITES AQUI =====
```

Troque:

- `path`
- `sheet`
- `frame`
- `placeholder_class`

## Como adicionar novos tickets

Edite:

```text
tickets/ticket_catalog.js
```

Cada problema define:

- titulo
- resumo
- fala do usuario
- pesos de prioridade
- resultado de cada acao

## Como adicionar novos personagens

Edite:

```text
characters/character_roster.js
```

Cada personagem precisa de:

- `id`
- `name`
- `role`
- `temperament`
- `patience`
- `sprite_key`

## Como expandir a logica

- Fluxo principal e dificuldade: `systems/game_controller.js`
- Geracao e avaliacao de tickets: `tickets/ticket_system.js`
- Interface das cenas: `/scenes`

## Como importar spritesheets depois

1. Exporte sua spritesheet para `assets/sprites/...`
2. Cadastre o arquivo no `sprite_manager.js`
3. Atualize `sheet` e `frame` do sprite correspondente
4. Mantenha o mesmo `key`
5. A logica nao precisa mudar

## Empacotar em EXE

```bat
build_exe.bat
```

O executavel final sera gerado em `dist/`.
