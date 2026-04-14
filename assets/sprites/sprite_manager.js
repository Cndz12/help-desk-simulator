export const SPRITE_STANDARD = {
  base_size: 64,
  scale: 2,
  naming: "snake_case"
};

// ===== TROCAR SPRITES AQUI =====
// Substitua os placeholders abaixo pelos arquivos finais quando a arte estiver pronta.
// A logica do jogo deve continuar chamando apenas spriteMarkup / getSprite.
// No futuro, basta apontar "path" e "sheet/frame" para os sprites reais.
export const SPRITES = {
  characters: {
    technician_idle: createSprite("characters", "technician_idle", {
      label: "Tecnico parado",
      path: "assets/sprites/characters/technician_idle.png",
      sheet: "characters_sheet",
      frame: { x: 0, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--technician",
      colors: makePalette("#8db8ea", "#486483", "#6d4a38")
    }),
    technician_working: createSprite("characters", "technician_working", {
      label: "Tecnico trabalhando",
      path: "assets/sprites/characters/technician_working.png",
      sheet: "characters_sheet",
      frame: { x: 32, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--working",
      colors: makePalette("#6ea0dc", "#415977", "#6d4a38")
    }),
    user_normal: createSprite("characters", "user_normal", {
      label: "Usuario calmo",
      path: "assets/sprites/characters/user_normal.png",
      sheet: "characters_sheet",
      frame: { x: 64, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--user-normal",
      colors: makePalette("#d88aa7", "#624559", "#6d4a38")
    }),
    user_stressed: createSprite("characters", "user_stressed", {
      label: "Usuario estressado",
      path: "assets/sprites/characters/user_stressed.png",
      sheet: "characters_sheet",
      frame: { x: 96, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--user-stressed",
      colors: makePalette("#d38163", "#6c4436", "#6d4a38")
    }),
    user_focused: createSprite("characters", "user_focused", {
      label: "Usuario focado",
      path: "assets/sprites/characters/user_focused.png",
      sheet: "characters_sheet",
      frame: { x: 128, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--user-focused",
      colors: makePalette("#7ebb77", "#466942", "#6d4a38")
    }),
    user_supportive: createSprite("characters", "user_supportive", {
      label: "Usuario paciente",
      path: "assets/sprites/characters/user_supportive.png",
      sheet: "characters_sheet",
      frame: { x: 160, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-person sprite-person--user-supportive",
      colors: makePalette("#8a7bd1", "#4d4683", "#6d4a38")
    })
  },
  environment: {
    desk: createSprite("environment", "desk", {
      label: "Mesa",
      path: "assets/sprites/environment/desk.png",
      sheet: "environment_sheet",
      frame: { x: 0, y: 0, w: 64, h: 64 },
      placeholder_class: "sprite-object sprite-desk",
      colors: makePalette("#c38f63", "#724d37", "#dcb39a")
    }),
    chair: createSprite("environment", "chair", {
      label: "Cadeira",
      path: "assets/sprites/environment/chair.png",
      sheet: "environment_sheet",
      frame: { x: 64, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-chair",
      colors: makePalette("#6d7f99", "#3c465d", "#8da3c6")
    }),
    computer: createSprite("environment", "computer", {
      label: "Computador",
      path: "assets/sprites/environment/computer.png",
      sheet: "environment_sheet",
      frame: { x: 96, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-computer",
      colors: makePalette("#88bbd8", "#4a5979", "#f2efe4")
    }),
    printer: createSprite("environment", "printer", {
      label: "Impressora",
      path: "assets/sprites/environment/printer.png",
      sheet: "environment_sheet",
      frame: { x: 128, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-printer",
      colors: makePalette("#a9adb6", "#5d6471", "#ece7db")
    }),
    phone: createSprite("environment", "phone", {
      label: "Telefone",
      path: "assets/sprites/environment/phone.png",
      sheet: "environment_sheet",
      frame: { x: 160, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-phone",
      colors: makePalette("#2d405c", "#172133", "#d0d9e7")
    }),
    plant: createSprite("environment", "plant", {
      label: "Planta",
      path: "assets/sprites/environment/plant.png",
      sheet: "environment_sheet",
      frame: { x: 192, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-plant",
      colors: makePalette("#6baa65", "#4f6b3d", "#b8754d")
    }),
    water_cooler: createSprite("environment", "water_cooler", {
      label: "Bebedouro",
      path: "assets/sprites/environment/water_cooler.png",
      sheet: "environment_sheet",
      frame: { x: 224, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-water-cooler",
      colors: makePalette("#77bfe0", "#51647b", "#dce6f1")
    }),
    whiteboard: createSprite("environment", "whiteboard", {
      label: "Quadro",
      path: "assets/sprites/environment/whiteboard.png",
      sheet: "environment_sheet",
      frame: { x: 256, y: 0, w: 64, h: 48 },
      placeholder_class: "sprite-object sprite-whiteboard",
      colors: makePalette("#f2ead4", "#5c5465", "#7595c6")
    }),
    clock: createSprite("environment", "clock", {
      label: "Relogio",
      path: "assets/sprites/environment/clock.png",
      sheet: "environment_sheet",
      frame: { x: 320, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-object sprite-clock",
      colors: makePalette("#f2ead4", "#5c5465", "#b34c45")
    }),
    server_rack: createSprite("environment", "server_rack", {
      label: "Rack de servidor",
      path: "assets/sprites/environment/server_rack.png",
      sheet: "environment_sheet",
      frame: { x: 352, y: 0, w: 48, h: 64 },
      placeholder_class: "sprite-object sprite-server-rack",
      colors: makePalette("#636d83", "#1f2634", "#9da8ba")
    })
  },
  ui: {
    button_idle: createSprite("ui", "button_idle", {
      label: "Botao idle",
      path: "assets/sprites/ui/button_idle.png",
      sheet: "ui_sheet",
      frame: { x: 0, y: 0, w: 128, h: 32 },
      placeholder_class: "sprite-ui sprite-ui-button-idle",
      colors: makePalette("#5d7eb8", "#334766", "#90a9d4")
    }),
    button_hover: createSprite("ui", "button_hover", {
      label: "Botao hover",
      path: "assets/sprites/ui/button_hover.png",
      sheet: "ui_sheet",
      frame: { x: 128, y: 0, w: 128, h: 32 },
      placeholder_class: "sprite-ui sprite-ui-button-hover",
      colors: makePalette("#d58256", "#774334", "#f0bc7b")
    }),
    ticket_panel: createSprite("ui", "ticket_panel", {
      label: "Painel de ticket",
      path: "assets/sprites/ui/ticket_panel.png",
      sheet: "ui_sheet",
      frame: { x: 0, y: 32, w: 128, h: 64 },
      placeholder_class: "sprite-ui sprite-ui-ticket-panel",
      colors: makePalette("#ead8b5", "#24201b", "#fff0cf")
    }),
    stress_bar: createSprite("ui", "stress_bar", {
      label: "Barra de estresse",
      path: "assets/sprites/ui/stress_bar.png",
      sheet: "ui_sheet",
      frame: { x: 128, y: 32, w: 128, h: 24 },
      placeholder_class: "sprite-ui sprite-ui-stress-bar",
      colors: makePalette("#d5675d", "#5b2730", "#f0c45e")
    }),
    clipboard_logo: createSprite("ui", "clipboard_logo", {
      label: "Prancheta do menu",
      path: "assets/sprites/ui/clipboard_logo.png",
      sheet: "ui_sheet",
      frame: { x: 0, y: 96, w: 64, h: 64 },
      placeholder_class: "sprite-ui sprite-ui-clipboard",
      colors: makePalette("#c58c63", "#76503a", "#f2efe4")
    })
  },
  effects: {
    error_icon: createSprite("effects", "error_icon", {
      label: "Icone de erro",
      path: "assets/sprites/effects/error_icon.png",
      sheet: "effects_sheet",
      frame: { x: 0, y: 0, w: 16, h: 16 },
      placeholder_class: "sprite-effect sprite-effect-error",
      colors: makePalette("#d5675d", "#6d3038", "#f7d7cd")
    }),
    success_icon: createSprite("effects", "success_icon", {
      label: "Icone de sucesso",
      path: "assets/sprites/effects/success_icon.png",
      sheet: "effects_sheet",
      frame: { x: 16, y: 0, w: 16, h: 16 },
      placeholder_class: "sprite-effect sprite-effect-success",
      colors: makePalette("#71b96e", "#395a38", "#daf1d7")
    }),
    alert_icon: createSprite("effects", "alert_icon", {
      label: "Icone de alerta",
      path: "assets/sprites/effects/alert_icon.png",
      sheet: "effects_sheet",
      frame: { x: 32, y: 0, w: 16, h: 16 },
      placeholder_class: "sprite-effect sprite-effect-alert",
      colors: makePalette("#f0be58", "#754d19", "#fff0cf")
    })
  },
  placeholders: {
    placeholder_character: createSprite("placeholders", "placeholder_character", {
      label: "Placeholder de personagem",
      path: "assets/sprites/placeholders/placeholder_character.png",
      sheet: "placeholder_sheet",
      frame: { x: 0, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-placeholder sprite-placeholder-character",
      colors: makePalette("#8aa2c1", "#3b4c66", "#d2dbe8")
    }),
    placeholder_object: createSprite("placeholders", "placeholder_object", {
      label: "Placeholder de objeto",
      path: "assets/sprites/placeholders/placeholder_object.png",
      sheet: "placeholder_sheet",
      frame: { x: 32, y: 0, w: 32, h: 32 },
      placeholder_class: "sprite-placeholder sprite-placeholder-object",
      colors: makePalette("#b0b7c3", "#5b6676", "#ecf0f6")
    })
  }
};

export function getSprite(category, key) {
  return SPRITES[category]?.[key] || SPRITES.placeholders.placeholder_object;
}

export function spriteMarkup(category, key, options = {}) {
  const sprite = getSprite(category, key);
  const size = options.size || SPRITE_STANDARD.base_size;
  const style = [
    `--sprite-primary:${sprite.colors.primary}`,
    `--sprite-secondary:${sprite.colors.secondary}`,
    `--sprite-accent:${sprite.colors.accent}`,
    `--sprite-outline:${sprite.colors.outline}`,
    `width:${size}px`,
    `height:${size}px`
  ].join(";");
  const extraClass = options.class_name ? ` ${options.class_name}` : "";
  const label = options.label || sprite.label;
  const frame = `${sprite.frame.x},${sprite.frame.y},${sprite.frame.w},${sprite.frame.h}`;

  return `
    <div
      class="sprite ${sprite.placeholder_class}${extraClass}"
      style="${style}"
      data-sprite-category="${category}"
      data-sprite-key="${key}"
      data-sprite-sheet="${sprite.sheet}"
      data-sprite-frame="${frame}"
      aria-label="${label}"
      title="${label}"
    ></div>
  `;
}

export function spriteSummary() {
  return {
    base_size: SPRITE_STANDARD.base_size,
    scale: SPRITE_STANDARD.scale,
    categories: Object.keys(SPRITES)
  };
}

function createSprite(category, key, config) {
  return {
    category,
    key,
    ...config
  };
}

function makePalette(primary, secondary, accent) {
  return {
    primary,
    secondary,
    accent,
    outline: "#23283a"
  };
}
