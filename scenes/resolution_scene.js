import { getCharacterById } from "../characters/character_roster.js";
import { spriteMarkup } from "../assets/sprites/sprite_manager.js";
import { ACTION_LABELS, ACTION_ORDER, getPriorityMeta } from "../tickets/ticket_catalog.js";
import { getIssueById } from "../tickets/ticket_system.js";

export function renderResolutionScene(state) {
  const run = state.run;
  const ticket = run.queue.find((item) => item.id === run.active_ticket_id) || run.queue.find((item) => item.id === run.selected_ticket_id);
  const user = getCharacterById(ticket.user_id);
  const issue = getIssueById(ticket.issue_id);
  const priority = getPriorityMeta(ticket.priority);
  const feedback = run.resolution_feedback;

  return `
    <main class="resolution-screen">
      <header class="hud-bar hud-bar--game">
        <span>Atendimento dedicado</span>
        <span>Ticket: ${ticket.id}</span>
        <span class="${priority.color}">Prioridade ${priority.label}</span>
        <span>Stress: ${Math.round(run.stress)}%</span>
      </header>

      <div class="resolution-layout">
        <section class="resolution-stage">
          <div class="resolution-stage__header">
            <div class="resolution-stage__portrait">
              ${spriteMarkup("characters", ticket.attempts > 0 ? "user_stressed" : user.sprite_key, { size: 118 })}
            </div>
            <div class="resolution-stage__bubble">
              <strong>${user.name}</strong>
              <p>${issue.user_prompt}</p>
              <span>${issue.summary}</span>
            </div>
          </div>

          <div class="resolution-stage__device">
            ${spriteMarkup("environment", issue.device_hint, { size: issue.device_hint === "server_rack" ? 132 : 124 })}
          </div>

          <div class="resolution-stage__stats">
            <span>Tentativas: ${ticket.attempts}/2</span>
            <span>Paciencia: ${Math.round(ticket.patience)}%</span>
            <span>Status: ${ticket.status}</span>
          </div>

          <div class="resolution-stage__feedback${feedback ? ` resolution-stage__feedback--${feedback.tone}` : ""}">
            ${feedback ? `${spriteMarkup("effects", feedback.icon, { size: 24 })}<p>${feedback.message}</p>` : `<p>Escolha uma acao. Algumas resolvem, outras vao alimentar o caos corporativo.</p>`}
          </div>
        </section>

        <aside class="resolution-actions">
          <div class="panel-header">
            <span>Acoes disponiveis</span>
            <span>5 opcoes</span>
          </div>
          <div class="resolution-action-list">
            ${ACTION_ORDER.map((actionKey, index) => renderActionButton(state.settings.controls[`action_${index + 1}`], actionKey)).join("")}
          </div>

          <div class="panel-card panel-card--notes">
            <h2>Dica do ticket</h2>
            <p>${issue.title} normalmente pede leitura rapida do contexto e zero improviso heroico.</p>
          </div>

          <button class="pixel-button" data-dispatch="resolution/back">Voltar ao escritorio</button>
        </aside>
      </div>
    </main>
  `;
}

function renderActionButton(hotkey, actionKey) {
  return `
    <button class="action-button" data-dispatch="resolution/action" data-action-key="${actionKey}">
      <span class="action-button__hotkey">${hotkey}</span>
      <strong>${ACTION_LABELS[actionKey]}</strong>
    </button>
  `;
}
