import { renderMenuScene } from "../scenes/menu_scene.js";
import { renderOfficeScene } from "../scenes/office_scene.js";
import { renderResolutionScene } from "../scenes/resolution_scene.js";
import { renderGameOverScene } from "../scenes/game_over_scene.js";
import { GameController, getControllerMeta } from "../systems/game_controller.js";
import { AudioSystem } from "../systems/audio_system.js";

const app = document.getElementById("app");
const controller = new GameController();
const audio = new AudioSystem();
const helpers = getControllerMeta();

controller.subscribe((state) => {
  app.innerHTML = renderApp(state);

  for (const cue of controller.drainSoundCues()) {
    audio.play(cue);
  }
});

renderCurrentState();

app.addEventListener("click", (event) => {
  audio.prime();
  const target = event.target.closest("[data-dispatch]");

  if (!target) {
    return;
  }

  controller.dispatch(target.dataset.dispatch, {
    type: target.dataset.type,
    mode: target.dataset.mode,
    difficulty: target.dataset.difficulty,
    tab: target.dataset.tab,
    step: target.dataset.step,
    action_key: target.dataset.actionKey,
    ticket_id: target.dataset.ticketId
  });
});

window.addEventListener("keydown", (event) => {
  if (controller.handleKeyInput(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener("beforeunload", () => {
  controller.destroy();
});

function renderCurrentState() {
  app.innerHTML = renderApp(controller.getState());
}

function renderApp(state) {
  const scene = state.scene === "menu"
    ? renderMenuScene(state, helpers)
    : state.run?.scene === "office"
      ? renderOfficeScene(state)
      : state.run?.scene === "resolution"
        ? renderResolutionScene(state)
        : renderGameOverScene(state);

  return `
    ${scene}
    ${renderOverlay(state)}
  `;
}

function renderOverlay(state) {
  if (!state.overlay) {
    return "";
  }

  if (state.overlay.type === "controls") {
    return `
      <div class="overlay">
        <div class="overlay-card">
          <div class="panel-header">
            <span>Configurar controles</span>
            <span>KEYMAP</span>
          </div>
          <div class="overlay-body">
            <p>Todos os atalhos podem ser trocados aqui. Clique em um comando e pressione a nova tecla.</p>
            <div class="control-editor">
              ${Object.entries(state.settings.controls).map(([actionKey, key]) => `
                <div class="control-editor__row">
                  <span>${actionKey.replaceAll("_", " ")}</span>
                  <button class="control-chip${state.overlay.waiting_action === actionKey ? " control-chip--listening" : ""}" data-dispatch="controls/listen" data-action-key="${actionKey}">
                    ${state.overlay.waiting_action === actionKey ? "Aguardando..." : key}
                  </button>
                </div>
              `).join("")}
            </div>
            <div class="overlay-actions">
              <button class="pixel-button" data-dispatch="controls/reset">Restaurar padrao</button>
              <button class="pixel-button pixel-button--primary" data-dispatch="overlay/close">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}
