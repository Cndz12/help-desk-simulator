// ===== EDITAR PERSONAGENS AQUI =====
// Adicione novos usuarios do escritorio nesta lista.
// O sprite de cada personagem deve apontar para uma chave existente no sprite_manager.
export const TECHNICIAN = {
  id: "alex",
  name: "Alex",
  role: "Suporte Nivel 1",
  temperament: "focused",
  sprite_key: "technician_working"
};

export const OFFICE_USERS = [
  {
    id: "maria",
    name: "Maria",
    role: "Financeiro",
    temperament: "normal",
    patience: 88,
    difficulty_bias: 0.9,
    sprite_key: "user_normal",
    intro: "Preciso fechar o relatorio antes do almoco."
  },
  {
    id: "liam",
    name: "Liam",
    role: "Comercial",
    temperament: "stressed",
    patience: 72,
    difficulty_bias: 1.1,
    sprite_key: "user_stressed",
    intro: "O cliente esta na linha e meu sistema resolveu filosofar."
  },
  {
    id: "dave",
    name: "Dave",
    role: "Infraestrutura",
    temperament: "supportive",
    patience: 95,
    difficulty_bias: 0.8,
    sprite_key: "user_supportive",
    intro: "Se travar de novo eu prometo que foi culpa do universo."
  },
  {
    id: "val",
    name: "Val",
    role: "RH",
    temperament: "normal",
    patience: 84,
    difficulty_bias: 1,
    sprite_key: "user_focused",
    intro: "A apresentacao para onboarding vai comecar em minutos."
  },
  {
    id: "noah",
    name: "Noah",
    role: "Operacoes",
    temperament: "stressed",
    patience: 68,
    difficulty_bias: 1.2,
    sprite_key: "user_stressed",
    intro: "Tudo estava funcionando ate eu respirar perto do teclado."
  },
  {
    id: "lila",
    name: "Lila",
    role: "Marketing",
    temperament: "supportive",
    patience: 90,
    difficulty_bias: 0.95,
    sprite_key: "user_normal",
    intro: "Prometo que cliquei so uma vez. Talvez duas."
  }
];

export function getCharacterById(characterId) {
  if (characterId === TECHNICIAN.id) {
    return TECHNICIAN;
  }

  return OFFICE_USERS.find((character) => character.id === characterId) || null;
}
