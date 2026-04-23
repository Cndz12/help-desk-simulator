// ===== SISTEMA DE TICKETS =====
// 
// Responsabilidades:
// - criar tickets a partir do catalogo
// - avaliar a acao do jogador
// - controlar estado e evolucao dos chamados
// - fornecer funcoes utilitarias para outras partes do jogo
//
// Campos suportados nos tickets:
// - category: categoria do problema
// - severity: gravidade do chamado
// - sla_minutes: tempo ideal de resolucao
// - sla_deadline: minuto limite para resolver
// - sla_breached: indica se o SLA foi estourado
// - state: estado interno (new, in_progress, resolved, reopened, ignored)
// - diagnosis_required: se precisa diagnostico antes da resolucao
// - diagnosed: indica se ja foi analisado
// - reopen_chance: chance de reabrir apos resolucao
//
// Alteracoes recentes:
// - restaurados exports usados por outras cenas
// - adicionados sistemas de SLA, estado e prioridade
// - base preparada para diagnostico e reabertura de tickets

import { ACTION_LABELS, ACTION_ORDER, PRIORITIES, TICKET_CATALOG } from "./ticket_catalog.js";

// ===== LOGICA DE TICKETS =====

// Cria um novo ticket baseado no catalogo.
// Define prioridade, paciencia do usuario e dados adicionais
// como SLA, estado inicial e configuracoes de diagnostico.
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

    category: issue.category || "general",
    severity: issue.severity || 1,
    sla_minutes: issue.sla_minutes || 60,
    sla_deadline: timeMinutes + (issue.sla_minutes || 60),
    sla_breached: false,

    state: "new",

    device_hint: issue.device_hint,
    status: "Novo",
    attempts: 0,
    patience,
    created_at: timeMinutes,

    diagnosis_required: Boolean(issue.diagnosis_required),
    diagnosed: false,
    reopen_chance: issue.reopen_chance ?? 0.1,

    action_order: [...ACTION_ORDER]
  };
}

// Avalia a acao escolhida pelo jogador.
// Retorna o ticket atualizado e o resultado da acao.
// Tambem define o novo estado do chamado:
// - resolved (resolvido)
// - ignored (ignorado)
// - reopened (falhou e voltou)
// - in_progress (em andamento)
export function evaluateTicketAction(ticket, actionKey) {
  const issue = TICKET_CATALOG.find((item) => item.id === ticket.issue_id);

  if (!issue) {
    return {
      ticket: {
        ...ticket,
        attempts: ticket.attempts + 1,
        state: "reopened",
        status: "Reaberto"
      },
      result: {
        kind: "wrong",
        message: "Chamado nao encontrado.",
        effects: {
          reputation: -2,
          stress: 2,
          satisfaction: -2
        },
        resolves: false
      }
    };
  }

  const result = issue.outcomes[actionKey];

  if (!result) {
    return {
      ticket: {
        ...ticket,
        attempts: ticket.attempts + 1,
        state: "reopened",
        status: "Reaberto"
      },
      result: {
        kind: "wrong",
        message: "Acao invalida.",
        effects: {
          reputation: -2,
          stress: 2,
          satisfaction: -2
        },
        resolves: false
      }
    };
  }

  let nextState = "in_progress";
  let nextStatus = "Em atendimento";

  if (result.resolves) {
    nextState = "resolved";
    nextStatus = "Resolvido";
  } else if (actionKey === "ignore") {
    nextState = "ignored";
    nextStatus = "Ignorado";
  } else {
    nextState = "reopened";
    nextStatus = "Reaberto";
  }

  return {
    ticket: {
      ...ticket,
      attempts: ticket.attempts + 1,
      state: nextState,
      status: nextStatus
    },
    result
  };
}
// Retorna os dados da prioridade (low, medium, high)
// usados pela interface e logica do jogo.
export function getPriorityMeta(priorityKey) {
  return PRIORITIES[priorityKey] || PRIORITIES.medium;
}
// Retorna o nome amigavel de uma acao
// para exibicao na interface.
export function getActionLabel(actionKey) {
  return ACTION_LABELS[actionKey] || actionKey;
}
// Busca um problema no catalogo pelo ID.
// Usado para recuperar dados completos do ticket.
export function getIssueById(issueId) {
  return TICKET_CATALOG.find((item) => item.id === issueId);
}
// Retorna um rotulo baseado no tempo de vida do ticket.
// Usado na interface para indicar urgencia visual.
export function getTicketAgeLabel(ticket, currentTimeMinutes) {
  const age = currentTimeMinutes - ticket.created_at;

  if (age < 20) return "Novo";
  if (age < 45) return "Recente";
  if (age < 75) return "Aguardando";
  return "Antigo";
}
// Aumenta a prioridade do ticket.
// low -> medium -> high
export function escalatePriority(priorityKey) {
  if (priorityKey === "low") return "medium";
  if (priorityKey === "medium") return "high";
  return "high";
}
// Converte a dificuldade do jogo em um multiplicador numerico.
// Isso influencia geracao de tickets e comportamento do sistema.
export function getDifficultyScale(difficultyKey) {
  const table = {
    easy: 0.9,
    normal: 1,
    hard: 1.2
  };

  return table[difficultyKey] ?? 1;
}
// ===== FUNÇÕES AUXILIARES =====
// Sorteia a prioridade do ticket com base nos pesos definidos.
// Considera tambem dificuldade e bias do usuario.
function rollPriority(weights = {}, bias = 0, difficultyScale = 1) {
  const safeWeights = {
    low: Math.max(0, weights.low ?? 1),
    medium: Math.max(0, weights.medium ?? 1),
    high: Math.max(0, (weights.high ?? 1) + Math.max(0, bias) + Math.floor(difficultyScale - 1))
  };

  const total = safeWeights.low + safeWeights.medium + safeWeights.high;

  if (total <= 0) return "medium";

  let roll = Math.random() * total;

  for (const key of ["low", "medium", "high"]) {
    roll -= safeWeights[key];
    if (roll <= 0) return key;
  }

  return "medium";
}
// Retorna um item aleatorio de uma lista.
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
// Limita um valor entre minimo e maximo.
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
