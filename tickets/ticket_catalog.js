// ===== CATALOGO DE CHAMADOS =====
//
// Estrutura de cada ticket:
// - id: identificador unico
// - title: titulo do chamado
// - category: tipo do problema (network, hardware, etc)
// - severity: nivel de impacto
// - sla_minutes: tempo ideal de resolucao
// - diagnosis_required: exige diagnostico antes de resolver
// - reopen_chance: chance de voltar apos resolucao
// - device_hint: tipo de dispositivo relacionado
// - user_prompt: fala inicial do usuario
// - summary: descricao tecnica
// - priority_weights: chance de prioridade (low, medium, high)
// - outcomes: resultado de cada acao do jogador
//
// Observacao:
// Esse arquivo controla o comportamento dos problemas.
// Para adicionar novos tickets, basta seguir esse padrao.
export const ACTION_ORDER = [
  "diagnose",
  "reset_password",
  "swap_cable",
  "restart_pc",
  "escalate_n2",
  "ignore"
];

export const ACTION_LABELS = {
  diagnose: "Diagnosticar",
  reset_password: "Reset senha",
  swap_cable: "Trocar cabo",
  restart_pc: "Reiniciar PC",
  escalate_n2: "Escalar para N2",
  ignore: "Ignorar"
};

export const PRIORITIES = {
  low: { label: "Baixa", color: "priority-low", weight: 1 },
  medium: { label: "Media", color: "priority-medium", weight: 2 },
  high: { label: "Alta", color: "priority-high", weight: 3 }
};

export function getPriorityMeta(priorityKey) {
  return PRIORITIES[priorityKey];
}

export function getActionLabel(actionKey) {
  return ACTION_LABELS[actionKey];
}

export const TICKET_CATALOG = [
  {
    id: "sem_internet",
    title: "Sem internet",
    category: "network",
    severity: 3,
    sla_minutes: 40,
    diagnosis_required: true,
    reopen_chance: 0.25,

    diagnosis: [
      "Cabo desconectado",
      "Roteador travado",
      "Problema no servidor"
    ],
    device_hint: "computer",
    user_prompt: "A internet sumiu e a reuniao ja comecou no Teams.",
    summary: "Sem acesso a rede corporativa.",
    priority_weights: { low: 1, medium: 3, high: 4 },
    outcomes: {
      reset_password: outcome("wrong", "Voce reseta a senha, mas a rede continua tao morta quanto a planta do corredor.", -4, 7, -5, false),
      swap_cable: outcome("success", "O cabo estava frouxo. Link restabelecido e o usuario voltou a respirar.", 5, -4, 7, true),
      restart_pc: outcome("partial", "O PC reinicia e volta sem internet. Pelo menos o wallpaper atualizou.", 1, 3, 0, false),
      escalate_n2: outcome("escalated", "Voce escalona para o N2. Resolve, mas a equipe sente o golpe.", 1, -1, 2, true),
      ignore: outcome("chaos", "Voce ignora. O usuario abre outro ticket com o assunto 'socorro urgente agora'.", -7, 10, -8, false)
    }
  },
  {
    id: "nao_loga",
    title: "Nao consegue logar",
    category: "hardware",
    severity: 2,
    sla_minutes: 20,
    diagnosis_required: true,
    diagnosis: [
      "Conta pode estar bloqueada por muitas tentativas.",
      "Senha pode estar incorreta ou expirada.",
      "Usuario pode estar tentando acessar o sistema errado."
    ],
    reopen_chance: 1.0,
    device_hint: "computer",
    user_prompt: "A tela diz senha invalida e eu tenho certeza absoluta de que estou digitando certo.",
    summary: "Falha de autenticacao.",
    priority_weights: { low: 1, medium: 4, high: 3 },
    outcomes: {
      reset_password: outcome("success", "Senha resetada e acesso liberado. O usuario jura que era isso que tentava fazer.", 5, -3, 8, true),
      swap_cable: outcome("wrong", "Voce troca um cabo aleatorio e o login continua revoltado.", -4, 6, -5, false),
      restart_pc: outcome("partial", "Depois de reiniciar, o usuario digita a senha certa sem querer. Funciona, mas fica feio no relatorio.", 2, 1, 2, true),
      escalate_n2: outcome("escalated", "N2 confirma bloqueio por tentativas. Resolvido, mas com custo de prestigio.", 1, 0, 1, true),
      ignore: outcome("chaos", "Voce ignora e o usuario tenta mais vinte vezes. Agora a conta esta bloqueada de verdade.", -8, 9, -9, false)
    }
  },
  {
    id: "monitor_apagado",
    title: "Monitor apagado",
    category: "hardware",
    severity: 2,
    sla_minutes: 30,
    diagnosis_required: true,
    diagnosis: [
      "Cabo desconectado",
      "Monitor Desligado",
      "Tela Queimou"
    ],
    reopen_chance: 1.0,
    device_hint: "computer",
    user_prompt: "O monitor esta preto, mas o gabinete faz barulho de foguete.",
    summary: "Video sem imagem.",
    priority_weights: { low: 1, medium: 3, high: 4 },
    outcomes: {
      reset_password: outcome("wrong", "A senha continua normal. O monitor continua um belo retangulo preto.", -3, 5, -4, false),
      swap_cable: outcome("success", "O cabo de video estava mal encaixado. Imagem voltou na hora.", 5, -4, 7, true),
      restart_pc: outcome("partial", "Depois da reinicializacao a imagem volta, mas o usuario perde o arquivo nao salvo.", 1, 2, -1, true),
      escalate_n2: outcome("escalated", "N2 manda trocar a porta do monitor. Resolve sem glamour.", 1, 0, 1, true),
      ignore: outcome("chaos", "Voce ignora e o usuario comeca a bater no botao power como se fosse um ritual.", -7, 9, -8, false)
    }
  },
  {
    id: "impressora_falha",
    title: "Impressora nao funciona",
    category: "hardware",
    severity: 3,
    sla_minutes: 20,
    diagnosis_required: true,
    reopen_chance: 0.23,
    diagnosis: [
      "Cabo desconectado",
      "Cabo da Impressora desconectado no computador",
      "Sem tinta."
    ],

    device_hint: "printer",
    user_prompt: "A impressora pisca, geme e se recusa a imprimir a folha 1.",
    summary: "Fila de impressao travada.",
    priority_weights: { low: 2, medium: 3, high: 2 },
    outcomes: {
      reset_password: outcome("wrong", "A impressora nao demonstra interesse algum na nova senha.", -3, 4, -3, false),
      swap_cable: outcome("partial", "Voce reconecta a USB e a impressora volta, mas imprime tres copias da pagina errada.", 2, 1, 1, true),
      restart_pc: outcome("success", "A fila de impressao limpa e a impressora enfim coopera.", 4, -2, 6, true),
      escalate_n2: outcome("escalated", "O N2 reseta o spooler remoto. Resolve, mas voce perde tempo de fila.", 1, 1, 1, true),
      ignore: outcome("chaos", "Voce ignora e alguem tenta imprimir 89 paginas coloridas. O setor inteiro repara.", -6, 8, -6, false)
    }
  },
  {
    id: "sistema_travado",
    title: "Sistema travado",
    category: "sistema",
    severity: 3,
    sla_minutes: 20,
    diagnosis_required: true,
    reopen_chance: 1.0,
    diagnosis: [
      "Acesso bloqueado.",
      "Sistema fora do ar.",
      "Reze."
    ],

    device_hint: "server_rack",
    user_prompt: "O sistema congelou na hora exata em que eu precisava provar que ele funcionava.",
    summary: "Aplicacao principal travada.",
    priority_weights: { low: 1, medium: 2, high: 5 },
    outcomes: {
      reset_password: outcome("wrong", "Trocar senha num sistema congelado e quase uma forma de arte conceitual.", -4, 6, -4, false),
      swap_cable: outcome("wrong", "Voce mexe no cabo e descobre que o problema era no software mesmo.", -3, 5, -3, false),
      restart_pc: outcome("success", "Reinicio limpo e sistema de volta. Todos fingem que isso era o plano.", 5, -4, 7, true),
      escalate_n2: outcome("escalated", "N2 reinicia o servico critico. Resolve, mas a operacao fica sob observacao.", 1, 1, 2, true),
      ignore: outcome("chaos", "Voce ignora e o usuario comeca a narrar o caos para o gestor em tempo real.", -8, 10, -8, false)
    }
  },
  {
    id: "senha_expirada",
    title: "Senha expirada",
    category: "acesso",
    severity: 1,
    sla_minutes: 10,
    diagnosis_required: true,
    reopen_chance: 1.0,
    diagnosis: [
      "Resetar Senha.",
      "Conta bloqueada.",
      "Problema do Usuario."
    ],

    device_hint: "computer",
    user_prompt: "A senha expirou num horario que parece planejado para causar dor emocional.",
    summary: "Senha corporativa expirada.",
    priority_weights: { low: 1, medium: 4, high: 2 },
    outcomes: {
      reset_password: outcome("success", "Senha renovada e usuario de volta ao trabalho.", 5, -3, 8, true),
      swap_cable: outcome("wrong", "A senha continua expirada, mas pelo menos o cabo ganhou atencao.", -4, 5, -4, false),
      restart_pc: outcome("partial", "O aviso reaparece depois do reboot. Pelo menos agora a tela travada saiu.", 1, 3, 0, false),
      escalate_n2: outcome("escalated", "N2 libera o acesso e encerra o drama com um script magico.", 2, -1, 3, true),
      ignore: outcome("chaos", "Voce ignora e o usuario cola a senha antiga num post-it com mais raiva ainda.", -7, 8, -7, false)
    }
  },
  {
    id: "cabo_desconectado",
    title: "Cabo desconectado",
    category: "hardware",
    severity: 2,
    sla_minutes: 10,
    diagnosis_required: true,
    reopen_chance: 1.0,
    diagnosis: [
      "Cabo desconectado(pensa um pouco).",
      "Dar outro cabo.",
      "Bater no Usuario."
    ],

    device_hint: "computer",
    user_prompt: "Troquei a mesa de lugar e agora tudo acende menos o sistema.",
    summary: "Conexao fisica perdida.",
    priority_weights: { low: 1, medium: 3, high: 3 },
    outcomes: {
      reset_password: outcome("wrong", "A autenticacao continua impecavel, mas o cabo segue fora do lugar.", -3, 4, -3, false),
      swap_cable: outcome("success", "Cabo recolocado. O equipamento ressuscita instantaneamente.", 5, -4, 7, true),
      restart_pc: outcome("partial", "Voce reinicia tudo e so entao percebe o cabo pendurado. Resolve, mas do jeito mais dramatico.", 1, 2, 1, true),
      escalate_n2: outcome("escalated", "N2 manda foto do cabo desconectado. Resolve, e voce ganha um meme interno.", 1, 1, 1, true),
      ignore: outcome("chaos", "Ignorar so faz o usuario ligar e desligar tudo mais algumas vezes.", -6, 7, -6, false)
    }
  }
];

function outcome(kind, message, reputation, stress, satisfaction, resolves) {
  return {
    kind,
    message,
    effects: {
      reputation,
      stress,
      satisfaction
    },
    resolves
  };

}
