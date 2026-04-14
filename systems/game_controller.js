import { OFFICE_USERS, TECHNICIAN, getCharacterById } from "../characters/character_roster.js";
import { spriteSummary } from "../assets/sprites/sprite_manager.js";
import { ACTION_ORDER, getActionLabel, getPriorityMeta } from "../tickets/ticket_catalog.js";
import {
  createTicket,
  evaluateTicketAction,
  escalatePriority,
  getDifficultyScale,
  getIssueById
} from "../tickets/ticket_system.js";

const SETTINGS_KEY = "help_desk_simulator_settings_v2";

const MODE_PRESETS = {
  classic: {
    label: "Classico",
    description: "Fluxo equilibrado com crescimento gradual da fila.",
    spawn_interval: 4,
    event_interval: 7,
    time_step: 10,
    queue_pressure: 1
  },
  rush: {
    label: "Rush",
    description: "Chamados surgem mais rapido e o escritorio vira um incendio controlado.",
    spawn_interval: 3,
    event_interval: 5,
    time_step: 12,
    queue_pressure: 1.2
  },
  treino: {
    label: "Treino",
    description: "Modo mais gentil para entender o fluxo e testar acoes.",
    spawn_interval: 5,
    event_interval: 8,
    time_step: 8,
    queue_pressure: 0.75
  }
};

const DIFFICULTY_PRESETS = {
  easy: {
    label: "Facil",
    description: "Mais folego, menos caos e crescimento lento da pressao.",
    spawn_modifier: 1.2,
    penalty_modifier: 0.8,
    stress_drain: 1
  },
  normal: {
    label: "Padrao",
    description: "Experiencia principal do simulador.",
    spawn_modifier: 1,
    penalty_modifier: 1,
    stress_drain: 0
  },
  hard: {
    label: "Dificil",
    description: "A operacao entra em colapso se voce vacilar duas vezes.",
    spawn_modifier: 0.85,
    penalty_modifier: 1.25,
    stress_drain: -1
  }
};

const DEFAULT_CONTROLS = {
  cycle_ticket: "Tab",
  open_ticket: "Enter",
  action_1: "1",
  action_2: "2",
  action_3: "3",
  action_4: "4",
  action_5: "5",
  pause: "P",
  back: "Escape"
};

const RANDOM_EVENTS = [
  {
    title: "Cafe no teclado",
    message: "Uma caneca tombou na mesa do comercial. O clima ficou dramaticamente pegajoso.",
    effects: { stress: 6, reputation: -1, satisfaction: -2 },
    cue: "warning"
  },
  {
    title: "Atualizacao surpresa",
    message: "O Windows decidiu atualizar sem consultar ninguem. Classico.",
    effects: { stress: 4, reputation: -1, satisfaction: -1 },
    cue: "alert"
  },
  {
    title: "Aplauso raro",
    message: "Um usuario agradeceu sem abrir chamado duplicado. O time ganha moral.",
    effects: { stress: -5, reputation: 3, satisfaction: 4 },
    cue: "success"
  },
  {
    title: "Ping fantasma",
    message: "A rede voltou sozinha por dois minutos. Ninguem confia nisso.",
    effects: { stress: 3, reputation: 0, satisfaction: 1 },
    cue: "warning"
  }
];

// ===== EDITAR LOGICA PRINCIPAL AQUI =====
// Controle de loop, progressao, game over, pausas e estados das cenas.
export class GameController {
  constructor() {
    this.listeners = [];
    this.sound_cues = [];
    this.state = this.createInitialState();
    this.loop = window.setInterval(() => this.tick(), 1000);
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  getState() {
    return this.state;
  }

  dispatch(action, payload = {}) {
    switch (action) {
      case "menu/start":
        this.updateState({
          menu: {
            ...this.state.menu,
            step: "mode"
          }
        });
        return;
      case "menu/back":
        this.updateState({
          menu: {
            ...this.state.menu,
            step: payload.step || "idle"
          }
        });
        return;
      case "menu/mode":
        this.updateState({
          menu: {
            ...this.state.menu,
            draft_mode: payload.mode,
            step: "difficulty"
          }
        });
        return;
      case "menu/difficulty":
        this.startGame(payload.difficulty);
        return;
      case "menu/info":
        this.updateState({
          menu: {
            ...this.state.menu,
            sidebar_tab: payload.tab
          }
        });
        return;
      case "overlay/open":
        this.updateState({
          overlay: {
            type: payload.type,
            waiting_action: null
          }
        });
        return;
      case "overlay/close":
        this.updateState({
          overlay: null
        });
        return;
      case "controls/listen":
        this.updateState({
          overlay: {
            type: "controls",
            waiting_action: payload.action_key
          }
        });
        return;
      case "controls/reset":
        this.state.settings.controls = { ...DEFAULT_CONTROLS };
        this.persistSettings();
        this.updateState({
          overlay: {
            type: "controls",
            waiting_action: null
          }
        });
        return;
      case "office/select-ticket":
        this.selectTicket(payload.ticket_id);
        return;
      case "office/open-ticket":
        this.openSelectedTicket();
        return;
      case "office/back-to-menu":
        this.updateState({
          scene: "menu",
          menu: {
            ...this.state.menu,
            step: "idle"
          },
          overlay: null,
          run: null
        });
        return;
      case "office/toggle-pause":
        if (this.state.run) {
          this.state.run.paused = !this.state.run.paused;
          this.pushFeed(this.state.run.paused ? "Jogo pausado." : "Jogo retomado.");
          this.queueSound("alert");
          this.commit();
        }
        return;
      case "resolution/action":
        this.resolveTicket(payload.action_key);
        return;
      case "resolution/back":
        if (this.state.run) {
          this.state.run.scene = "office";
          this.state.run.resolution_feedback = null;
          this.commit();
        }
        return;
      case "game/restart":
        this.updateState({
          scene: "menu",
          menu: {
            ...this.state.menu,
            step: "mode"
          },
          overlay: null,
          run: null
        });
        return;
      default:
        return;
    }
  }

  handleKeyInput(rawKey) {
    const key = normalizeKey(rawKey);

    if (this.state.overlay?.type === "controls" && this.state.overlay.waiting_action) {
      this.state.settings.controls[this.state.overlay.waiting_action] = key;
      this.persistSettings();
      this.updateState({
        overlay: {
          type: "controls",
          waiting_action: null
        }
      });
      this.queueSound("success");
      return true;
    }

    const controls = this.state.settings.controls;

    if (key === controls.pause && this.state.scene !== "menu") {
      this.dispatch("office/toggle-pause");
      return true;
    }

    if (key === controls.back && this.state.run?.scene === "resolution") {
      this.dispatch("resolution/back");
      return true;
    }

    if (!this.state.run || this.state.run.paused) {
      return false;
    }

    if (this.state.run.scene === "office") {
      if (key === controls.cycle_ticket) {
        this.cycleTickets();
        return true;
      }

      if (key === controls.open_ticket) {
        this.openSelectedTicket();
        return true;
      }
    }

    if (this.state.run.scene === "resolution") {
      const hotkeys = [
        controls.action_1,
        controls.action_2,
        controls.action_3,
        controls.action_4,
        controls.action_5
      ];
      const index = hotkeys.findIndex((hotkey) => hotkey === key);

      if (index >= 0) {
        this.resolveTicket(ACTION_ORDER[index]);
        return true;
      }
    }

    return false;
  }

  drainSoundCues() {
    const cues = [...this.sound_cues];
    this.sound_cues = [];
    return cues;
  }

  destroy() {
    window.clearInterval(this.loop);
  }

  createInitialState() {
    const settings = this.loadSettings();

    return {
      scene: "menu",
      overlay: null,
      menu: {
        step: "idle",
        draft_mode: settings.mode,
        sidebar_tab: "credits"
      },
      settings,
      sprite_summary: spriteSummary(),
      run: null
    };
  }

  loadSettings() {
    const fallback = {
      mode: "classic",
      difficulty: "normal",
      controls: { ...DEFAULT_CONTROLS }
    };

    try {
      const saved = localStorage.getItem(SETTINGS_KEY);

      if (!saved) {
        return fallback;
      }

      const parsed = JSON.parse(saved);

      return {
        mode: parsed.mode || fallback.mode,
        difficulty: parsed.difficulty || fallback.difficulty,
        controls: {
          ...fallback.controls,
          ...(parsed.controls || {})
        }
      };
    } catch (error) {
      return fallback;
    }
  }

  persistSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.state.settings));
  }

  startGame(difficultyKey) {
    this.state.settings.mode = this.state.menu.draft_mode;
    this.state.settings.difficulty = difficultyKey;
    this.persistSettings();

    const run = {
      scene: "office",
      paused: false,
      time_minutes: 9 * 60,
      day_label: "MANHA",
      reputation: 80,
      stress: difficultyKey === "easy" ? 16 : difficultyKey === "hard" ? 26 : 20,
      satisfaction: 88,
      resolved: 0,
      queue: [],
      selected_ticket_id: null,
      active_ticket_id: null,
      resolution_feedback: null,
      collapse_reason: "",
      spawn_timer: 2,
      event_timer: MODE_PRESETS[this.state.settings.mode].event_interval,
      feed: [
        "Operacao iniciada. Primeiro cafe da manha consumido com sucesso.",
        "Fila pronta para receber os primeiros tickets."
      ],
      ticket_counter: 1
    };

    this.state.scene = "game";
    this.state.menu.step = "idle";
    this.state.run = run;
    this.state.overlay = null;
    this.seedQueue();
    this.queueSound("alert");
    this.commit();
  }

  seedQueue() {
    for (let index = 0; index < 2; index += 1) {
      this.spawnTicket();
    }
  }

  spawnTicket() {
    if (!this.state.run) {
      return;
    }

    const busyUsers = new Set(this.state.run.queue.map((ticket) => ticket.user_id));
    const candidates = OFFICE_USERS.filter((user) => !busyUsers.has(user.id));
    const user = randomItem(candidates.length ? candidates : OFFICE_USERS);
    const difficultyScale = getDifficultyScale(this.state.run.resolved);
    const ticket = createTicket({
      user,
      ticketId: this.state.run.ticket_counter,
      timeMinutes: this.state.run.time_minutes,
      difficultyScale
    });

    this.state.run.queue.unshift(ticket);
    this.state.run.ticket_counter += 1;
    this.state.run.selected_ticket_id = this.state.run.queue[0]?.id || null;
    this.pushFeed(`Novo ticket: ${ticket.title} para ${ticket.user_name}.`);
    this.queueSound("alert");
  }

  tick() {
    if (!this.state.run || this.state.scene !== "game" || this.state.run.paused) {
      return;
    }

    const mode = MODE_PRESETS[this.state.settings.mode];
    const difficulty = DIFFICULTY_PRESETS[this.state.settings.difficulty];
    const difficultyScale = getDifficultyScale(this.state.run.resolved);
    this.state.run.time_minutes += mode.time_step;

    if (this.state.run.time_minutes >= 12 * 60 && this.state.run.day_label === "MANHA") {
      this.state.run.day_label = "TARDE";
      this.pushFeed("Virou a tarde. A fila percebeu e decidiu acelerar.");
      this.queueSound("warning");
    }

    this.state.run.spawn_timer -= 1;
    this.state.run.event_timer -= 1;
    const queuePressure = Math.max(0, this.state.run.queue.length - 2);
    this.state.run.stress = clamp(
      this.state.run.stress + queuePressure * mode.queue_pressure + difficulty.stress_drain,
      0,
      100
    );

    this.state.run.satisfaction = clamp(
      this.state.run.satisfaction - queuePressure * 0.6 * difficulty.penalty_modifier,
      0,
      100
    );

    this.state.run.queue = this.state.run.queue.map((ticket) => {
      const loss = getPriorityMeta(ticket.priority).weight * difficulty.penalty_modifier;

      return {
        ...ticket,
        patience: clamp(ticket.patience - loss, 0, 100)
      };
    });

    const expired = this.state.run.queue.filter((ticket) => ticket.patience <= 0);

    if (expired.length) {
      this.state.run.queue = this.state.run.queue.filter((ticket) => ticket.patience > 0);
      this.applyEffects({
        reputation: -4 * expired.length,
        stress: 8 * expired.length,
        satisfaction: -7 * expired.length
      });
      this.pushFeed(`${expired.length} ticket(s) explodiram em reclamacoes por falta de retorno.`);
      this.queueSound("error");
    }

    if (this.state.run.spawn_timer <= 0 && this.state.run.queue.length < 8) {
      this.spawnTicket();
      this.state.run.spawn_timer = Math.max(2, Math.round(mode.spawn_interval * difficulty.spawn_modifier - difficultyScale * 0.2));
    }

    if (this.state.run.event_timer <= 0) {
      const event = randomItem(RANDOM_EVENTS);
      this.applyEffects(event.effects);
      this.pushFeed(`${event.title}: ${event.message}`);
      this.queueSound(event.cue);
      this.state.run.event_timer = MODE_PRESETS[this.state.settings.mode].event_interval;
    }

    if (!this.state.run.selected_ticket_id && this.state.run.queue[0]) {
      this.state.run.selected_ticket_id = this.state.run.queue[0].id;
    }

    if (
      this.state.run.stress >= 100 ||
      this.state.run.reputation <= 0 ||
      this.state.run.satisfaction <= 0 ||
      this.state.run.queue.length >= 9
    ) {
      this.triggerGameOver();
    } else {
      this.commit();
    }
  }

  selectTicket(ticketId) {
    if (!this.state.run) {
      return;
    }

    this.state.run.selected_ticket_id = ticketId;
    this.commit();
  }

  cycleTickets() {
    if (!this.state.run || !this.state.run.queue.length) {
      return;
    }

    const currentIndex = this.state.run.queue.findIndex((ticket) => ticket.id === this.state.run.selected_ticket_id);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % this.state.run.queue.length;
    this.state.run.selected_ticket_id = this.state.run.queue[nextIndex].id;
    this.queueSound("alert");
    this.commit();
  }

  openSelectedTicket() {
    if (!this.state.run) {
      return;
    }

    const selected = this.state.run.queue.find((ticket) => ticket.id === this.state.run.selected_ticket_id);

    if (!selected) {
      return;
    }

    this.state.run.active_ticket_id = selected.id;
    this.state.run.scene = "resolution";
    this.state.run.resolution_feedback = null;
    this.commit();
  }

  resolveTicket(actionKey) {
    if (!this.state.run) {
      return;
    }

    const activeTicket = this.getActiveTicket();

    if (!activeTicket) {
      return;
    }

    const evaluation = evaluateTicketAction(activeTicket, actionKey);
    const issue = getIssueById(activeTicket.issue_id);
    const meta = evaluation.result;
    this.applyEffects(scaleEffects(meta.effects, DIFFICULTY_PRESETS[this.state.settings.difficulty].penalty_modifier, meta.kind));

    if (meta.resolves) {
      this.state.run.queue = this.state.run.queue.filter((ticket) => ticket.id !== activeTicket.id);
      this.state.run.active_ticket_id = null;
      this.state.run.selected_ticket_id = this.state.run.queue[0]?.id || null;
      this.state.run.resolved += 1;
      this.state.run.scene = "office";
      this.state.run.resolution_feedback = null;
      this.pushFeed(`${issue.title} resolvido para ${activeTicket.user_name}: ${meta.message}`);
      this.queueSound(meta.kind === "success" ? "success" : "warning");
      this.commit();
      return;
    }

    const updatedTicket = {
      ...evaluation.ticket,
      priority: escalatePriority(activeTicket.priority),
      patience: clamp(activeTicket.patience - 18, 0, 100)
    };
    this.state.run.queue = this.state.run.queue.map((ticket) => ticket.id === activeTicket.id ? updatedTicket : ticket);
    this.state.run.active_ticket_id = updatedTicket.id;
    this.state.run.selected_ticket_id = updatedTicket.id;
    this.state.run.resolution_feedback = {
      tone: meta.kind,
      message: meta.message,
      icon: meta.kind === "chaos" ? "error_icon" : "alert_icon"
    };
    this.pushFeed(`${issue.title} piorou para ${activeTicket.user_name}. Ticket voltou mais bravo.`);
    this.queueSound(meta.kind === "chaos" ? "error" : "warning");

    if (updatedTicket.attempts >= 2 || actionKey === "ignore") {
      this.state.run.scene = "office";
      this.state.run.active_ticket_id = null;
    }

    this.commit();
  }

  getActiveTicket() {
    if (!this.state.run) {
      return null;
    }

    return this.state.run.queue.find((ticket) => ticket.id === this.state.run.active_ticket_id) || null;
  }

  triggerGameOver() {
    if (!this.state.run) {
      return;
    }

    this.state.run.scene = "game_over";
    this.state.run.active_ticket_id = null;

    if (this.state.run.stress >= 100) {
      this.state.run.collapse_reason = "Voce entrou em colapso antes da operacao.";
    } else if (this.state.run.reputation <= 0) {
      this.state.run.collapse_reason = "A reputacao da central evaporou no cafe da tarde.";
    } else if (this.state.run.satisfaction <= 0) {
      this.state.run.collapse_reason = "Os usuarios desistiram do suporte e comecaram a rezar para a impressora.";
    } else {
      this.state.run.collapse_reason = "A fila de tickets dominou o escritorio.";
    }

    this.queueSound("error");
    this.commit();
  }

  applyEffects(effects) {
    if (!this.state.run) {
      return;
    }

    this.state.run.reputation = clamp(this.state.run.reputation + effects.reputation, 0, 100);
    this.state.run.stress = clamp(this.state.run.stress + effects.stress, 0, 100);
    this.state.run.satisfaction = clamp(this.state.run.satisfaction + effects.satisfaction, 0, 100);
  }

  pushFeed(message) {
    if (!this.state.run) {
      return;
    }

    this.state.run.feed.unshift(message);
    this.state.run.feed = this.state.run.feed.slice(0, 6);
  }

  queueSound(cue) {
    this.sound_cues.push(cue);
  }

  updateState(partial) {
    this.state = {
      ...this.state,
      ...partial
    };
    this.commit();
  }

  commit() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export function getControllerMeta() {
  return {
    technician: TECHNICIAN,
    users: OFFICE_USERS,
    modes: MODE_PRESETS,
    difficulties: DIFFICULTY_PRESETS,
    action_order: ACTION_ORDER,
    get_action_label: getActionLabel,
    get_priority_meta: getPriorityMeta,
    get_character: getCharacterById
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeKey(key) {
  if (key === " ") {
    return "Space";
  }

  if (key.length === 1) {
    return key.toUpperCase();
  }

  return key;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function scaleEffects(effects, penaltyModifier, kind) {
  if (kind === "success" || kind === "partial" || kind === "escalated") {
    return effects;
  }

  return {
    reputation: Math.round(effects.reputation * penaltyModifier),
    stress: Math.round(effects.stress * penaltyModifier),
    satisfaction: Math.round(effects.satisfaction * penaltyModifier)
  };
}
