import { OFFICE_USERS, TECHNICIAN } from "../characters/character_roster.js";
import { spriteMarkup } from "../assets/sprites/sprite_manager.js";

// ===== TEXTO DO MENU =====
// Define os textos auxiliares exibidos no painel lateral do menu principal.
const MENU_COPY = {
  tutorial: {
    title: "Como jogar",
    body: "Receba tickets, priorize o caos, abra o atendimento e escolha a melhor resposta antes que sua reputacao vire poeira."
  },
  credits: {
    title: "Creditos",
    body: "Projeto Help Desk Simulator. Base profissional em JavaScript modular, com placeholders centralizados no sprite_manager para troca futura da arte."
  }
};

// ===== CENA PRINCIPAL DO MENU =====
// Esta funcao monta a tela inicial do jogo.
//
// Estrutura:
// - menu-board: layout principal em duas colunas
// - menu-main: area esquerda com preview do escritorio e destaque do jogo
// - menu-sidebar: area direita com botoes, informacoes e controles
//
// Ajuste realizado:
// - restaurado o layout original em duas colunas
// - reativado o preview visual do escritorio no menu
// - mantido o painel lateral com botoes e informacoes
export function renderMenuScene(state, helpers) {
  const currentInfo = MENU_COPY[state.menu.sidebar_tab] || MENU_COPY.tutorial;

  const sidebarContent = state.menu.step !== "idle"
    ? renderSetupSidebar(state, helpers)
    : `
      <div class="panel-header">
        <span>Menu principal</span>
        <span class="panel-rec">REC</span>
      </div>

      <div class="button-stack">
        <button class="pixel-button pixel-button--primary" data-dispatch="menu/start">Iniciar jogo</button>
        <button class="pixel-button" data-dispatch="overlay/open" data-type="controls">Configurar controles</button>
        <button class="pixel-button" data-dispatch="menu/info" data-tab="tutorial">Como jogar</button>
        <button class="pixel-button" data-dispatch="menu/info" data-tab="credits">Creditos</button>
      </div>

      <div class="panel-card panel-card--notes">
        <h2>${currentInfo.title}</h2>
        <p>${currentInfo.body}</p>
      </div>

      <div class="mini-controls">
        <div class="mini-controls__header">
          <span>Controles atuais</span>
          <button class="micro-button" data-dispatch="overlay/open" data-type="controls">Alterar</button>
        </div>
        <div class="mini-controls__grid">
          ${renderControlSummary(state.settings.controls)}
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-box">
          <span>Dificuldade</span>
          <strong>${helpers.difficulties[state.settings.difficulty].label}</strong>
        </div>
        <div class="summary-box">
          <span>Modo</span>
          <strong>${helpers.modes[state.settings.mode].label}</strong>
        </div>
        <div class="summary-box">
          <span>Sprites</span>
          <strong>Placeholder</strong>
        </div>
      </div>
    `;

  return `
    <div class="menu-board">
      <section class="menu-main">
        <div class="panel-window menu-hero">
          ${renderMenuOfficePreview()}
        </div>

        <div class="panel-window menu-intro">
          <div class="menu-intro__content">
            <h1 class="menu-title">HELP DESK<br>SIMULATOR</h1>
            <p class="menu-description">
              Assuma o suporte tecnico, resolva tickets, mantenha a reputacao da equipe
              e sobreviva ao caos do escritorio.
            </p>
          </div>
        </div>
      </section>

      <aside class="menu-sidebar">
        ${sidebarContent}
      </aside>
    </div>
  `;
}

// ===== SIDEBAR DE CONFIGURACAO =====
// Painel usado quando o jogador escolhe modo e dificuldade antes de iniciar a partida.
function renderSetupSidebar(state, helpers) {
  if (state.menu.step === "mode") {
    return `
      <div class="panel-header">
        <span>Escolha o modo</span>
        <span class="panel-rec">SET</span>
      </div>
      <div class="selection-panel">
        <p class="selection-help">Primeiro definimos o ritmo do escritorio.</p>
        ${Object.entries(helpers.modes).map(([key, mode]) => `
          <button class="option-card" data-dispatch="menu/mode" data-mode="${key}">
            <strong>${mode.label}</strong>
            <span>${mode.description}</span>
          </button>
        `).join("")}
        <button class="micro-button micro-button--full" data-dispatch="menu/back" data-step="idle">Voltar</button>
      </div>
    `;
  }

  const mode = helpers.modes[state.menu.draft_mode];

  return `
    <div class="panel-header">
      <span>Escolha a dificuldade</span>
      <span class="panel-rec">SET</span>
    </div>
    <div class="selection-panel">
      <p class="selection-help">Modo selecionado: <strong>${mode.label}</strong></p>
      ${Object.entries(helpers.difficulties).map(([key, difficulty]) => `
        <button class="option-card" data-dispatch="menu/difficulty" data-difficulty="${key}">
          <strong>${difficulty.label}</strong>
          <span>${difficulty.description}</span>
        </button>
      `).join("")}
      <button class="micro-button micro-button--full" data-dispatch="menu/back" data-step="mode">Voltar</button>
    </div>
  `;
}

// ===== PREVIEW VISUAL DO ESCRITORIO =====
// Gera a cena ilustrativa do escritorio exibida na tela inicial.
function renderMenuOfficePreview() {
  const showcaseUsers = [OFFICE_USERS[0], OFFICE_USERS[1], TECHNICIAN, OFFICE_USERS[2], OFFICE_USERS[3]];

  return `
    <div class="office-preview office-preview--menu">
      <div class="office-preview__backdrop">
        <div class="office-preview__prop office-preview__prop--calendar">${spriteMarkup("environment", "whiteboard", { size: 88 })}</div>
        <div class="office-preview__prop office-preview__prop--clock">${spriteMarkup("environment", "clock", { size: 58 })}</div>
        <div class="office-preview__prop office-preview__prop--water">${spriteMarkup("environment", "water_cooler", { size: 88 })}</div>
      </div>

      <div class="office-preview__row office-preview__row--top">
        ${renderDeskCluster(showcaseUsers[0], "left")}
        ${renderDeskCluster(showcaseUsers[1], "top")}
        ${renderDeskCluster(showcaseUsers[3], "right")}
      </div>

      <div class="office-preview__row office-preview__row--bottom">
        ${renderDeskCluster(showcaseUsers[2], "center focus")}
        ${renderDeskCluster(showcaseUsers[4], "bottom-right")}
      </div>

      <div class="office-preview__prop office-preview__prop--plant">${spriteMarkup("environment", "plant", { size: 92 })}</div>
      <div class="office-preview__label">Alex</div>
    </div>
  `;
}

// ===== CLUSTER DE MESA =====
// Monta um conjunto visual com mesa, computador, cadeira e personagem.
function renderDeskCluster(character, modifier) {
  const statusIcon = character.id === TECHNICIAN.id
    ? spriteMarkup("effects", "alert_icon", { size: 30, class_name: "desk-cluster__alert" })
    : "";

  const modifierClasses = modifier
    .split(" ")
    .map((item) => `desk-cluster--${item}`)
    .join(" ");

  return `
    <div class="desk-cluster ${modifierClasses}">
      ${spriteMarkup("environment", "desk", { size: 152 })}
      <div class="desk-cluster__equipment">
        ${spriteMarkup("environment", "computer", { size: 72 })}
        ${spriteMarkup("environment", "chair", { size: 62 })}
      </div>
      <div class="desk-cluster__person">
        ${spriteMarkup("characters", character.sprite_key, { size: character.id === TECHNICIAN.id ? 88 : 82 })}
      </div>
      ${statusIcon}
    </div>
  `;
}

// ===== RESUMO DE CONTROLES =====
// Exibe apenas os quatro controles principais na tela inicial.
function renderControlSummary(controls) {
  return Object.entries(controls)
    .slice(0, 4)
    .map(([action, key]) => `
      <div class="mini-control">
        <span>${action.replaceAll("_", " ")}</span>
        <strong>${key}</strong>
      </div>
    `)
    .join("");
}