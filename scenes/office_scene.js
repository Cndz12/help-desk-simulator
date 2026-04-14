import { OFFICE_USERS, TECHNICIAN } from "../characters/character_roster.js";
import { spriteMarkup } from "../assets/sprites/sprite_manager.js";
import { getPriorityMeta } from "../tickets/ticket_catalog.js";
import { getTicketAgeLabel } from "../tickets/ticket_system.js";

export function renderOfficeScene(state) {
  const run = state.run;

  return `
    <main class="game-screen">
      ${renderHud(run)}
      <div class="game-layout">
        <section class="office-stage">
          <div class="office-stage__board">
            <div class="office-stage__props">
              ${spriteMarkup("environment", "whiteboard", { size: 110 })}
              ${spriteMarkup("environment", "printer", { size: 72 })}
              ${spriteMarkup("environment", "water_cooler", { size: 78 })}
              ${spriteMarkup("environment", "server_rack", { size: 94 })}
            </div>

            <div class="office-stage__grid">
              ${renderTechnicianDesk()}
              ${OFFICE_USERS.map((user) => renderOfficeUser(user, run.queue.find((ticket) => ticket.user_id === user.id), run.selected_ticket_id)).join("")}
            </div>
          </div>
        </section>

        <aside class="queue-sidebar">
          <div class="panel-header">
            <span>Fila de tickets</span>
            <span>${run.queue.length} ativos</span>
          </div>
          <div class="queue-list">
            ${run.queue.length ? run.queue.map((ticket) => renderTicketCard(ticket, run.selected_ticket_id === ticket.id, run.time_minutes)).join("") : `<div class="empty-card">Nenhum chamado aberto. Aproveite enquanto dura.</div>`}
          </div>

          <div class="panel-card panel-card--log">
            <h2>Radio do escritorio</h2>
            <div class="feed-list">
              ${run.feed.map((item) => `<p>${item}</p>`).join("")}
            </div>
          </div>

          <div class="office-actions">
            <button class="pixel-button pixel-button--primary" data-dispatch="office/open-ticket">Atender selecionado</button>
            <button class="pixel-button" data-dispatch="overlay/open" data-type="controls">Controles</button>
            <button class="pixel-button" data-dispatch="office/back-to-menu">Voltar ao menu</button>
          </div>

          <div class="control-hints">
            <span>Tab: trocar ticket</span>
            <span>Enter: abrir chamado</span>
            <span>P: pausar</span>
          </div>
        </aside>
      </div>
    </main>
  `;
}

function renderHud(run) {
  return `
    <header class="hud-bar hud-bar--game">
      <span>${run.day_label} - ${formatTime(run.time_minutes)}</span>
      <span>Reputacao: ${run.reputation}</span>
      <span>Stress: ${Math.round(run.stress)}%</span>
      <span>Resolvidos: ${run.resolved}</span>
      <span>Satisfacao: ${Math.round(run.satisfaction)}%</span>
    </header>
  `;
}

function renderTechnicianDesk() {
  return `
    <div class="office-user office-user--technician">
      <div class="office-user__desk">
        ${spriteMarkup("environment", "desk", { size: 168 })}
        ${spriteMarkup("environment", "computer", { size: 82, class_name: "office-user__computer" })}
        ${spriteMarkup("environment", "phone", { size: 40, class_name: "office-user__phone" })}
      </div>
      <div class="office-user__sprite">
        ${spriteMarkup("characters", TECHNICIAN.sprite_key, { size: 94 })}
      </div>
      <div class="office-user__label">${TECHNICIAN.name}</div>
    </div>
  `;
}

function renderOfficeUser(user, ticket, selectedTicketId) {
  const spriteKey = ticket ? "user_stressed" : user.sprite_key;
  const ticketBubble = ticket
    ? `<div class="office-user__ticket">${spriteMarkup("effects", ticket.priority === "high" ? "alert_icon" : "success_icon", { size: 24 })}</div>`
    : "";
  const isSelected = ticket?.id === selectedTicketId;

  return `
    <div class="office-user${isSelected ? " office-user--selected" : ""}">
      <div class="office-user__desk">
        ${spriteMarkup("environment", "desk", { size: 148 })}
        ${spriteMarkup("environment", "computer", { size: 74, class_name: "office-user__computer" })}
        ${spriteMarkup("environment", "chair", { size: 50, class_name: "office-user__chair" })}
      </div>
      <div class="office-user__sprite">
        ${spriteMarkup("characters", spriteKey, { size: 84 })}
      </div>
      ${ticketBubble}
      <div class="office-user__label">${user.name}</div>
      <div class="office-user__role">${user.role}</div>
    </div>
  `;
}

function renderTicketCard(ticket, selected, currentMinutes) {
  const priority = getPriorityMeta(ticket.priority);

  return `
    <button class="ticket-card${selected ? " ticket-card--selected" : ""}" data-dispatch="office/select-ticket" data-ticket-id="${ticket.id}">
      <div class="ticket-card__top">
        <span>${ticket.title}</span>
        <span class="${priority.color}">${priority.label}</span>
      </div>
      <div class="ticket-card__meta">
        <span>${ticket.user_name}</span>
        <span>${getTicketAgeLabel(ticket, currentMinutes)}</span>
      </div>
      <p>${ticket.summary}</p>
    </button>
  `;
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
