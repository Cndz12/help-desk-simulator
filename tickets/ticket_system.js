import { ACTION_LABELS, ACTION_ORDER, PRIORITIES, TICKET_CATALOG } from "./ticket_catalog.js";

// ===== EDITAR LOGICA DE TICKETS AQUI =====
// Este arquivo controla geracao, prioridade e avaliacao dos chamados.
// Para adicionar um novo problema, atualize ticket_catalog.js.
export function createTicket({ user, ticketId, timeMinutes, difficultyScale }) {
  const issue = randomItem(TICKET_CATALOG);
  const priorityKey = rollPriority(issue.priority_weights, user.difficulty_bias, difficultyScale);
  const patience = clamp(Math.round(user.patience - difficultyScale * 3 + Math.random() * 12), 35, 100);

  return {
    id: `ticket-${ticketId}`,
    user_id: user.id,
    user_name: user.name,
    issue_id: issue.id,
    title: issue.title,
    summary: issue.summary,
    prompt: issue.user_prompt,
    priority: priorityKey,
    device_hint: issue.device_hint,
    status: "Novo",
    attempts: 0,
    patience,
    created_at: timeMinutes,
    action_order: [...ACTION_ORDER]
  };
}

export function evaluateTicketAction(ticket, actionKey) {
  const issue = getIssueById(ticket.issue_id);
  const result = issue.outcomes[actionKey];

  return {
    ticket: {
      ...ticket,
      attempts: ticket.attempts + (result.resolves ? 0 : 1),
      status: result.resolves ? "Resolvido" : "Reaberto"
    },
    result
  };
}

export function getIssueById(issueId) {
  return TICKET_CATALOG.find((issue) => issue.id === issueId);
}

export function getPriorityMeta(priorityKey) {
  return PRIORITIES[priorityKey];
}

export function getActionLabel(actionKey) {
  return ACTION_LABELS[actionKey];
}

export function escalatePriority(priorityKey) {
  if (priorityKey === "low") {
    return "medium";
  }

  return "high";
}

export function getTicketAgeLabel(ticket, currentMinutes) {
  const diff = currentMinutes - ticket.created_at;
  const minutes = Math.max(5, diff);
  return `${minutes} min`;
}

export function getDifficultyScale(resolvedCount) {
  return 1 + Math.floor(resolvedCount / 4);
}

function rollPriority(weights, userBias, difficultyScale) {
  const entries = Object.entries(weights).map(([key, weight]) => {
    const extra = key === "high" ? difficultyScale * 0.45 : key === "medium" ? difficultyScale * 0.2 : 0;
    return [key, weight * userBias + extra];
  });
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [key, weight] of entries) {
    roll -= weight;

    if (roll <= 0) {
      return key;
    }
  }

  return "medium";
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
