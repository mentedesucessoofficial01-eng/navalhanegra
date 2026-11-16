/* =====================================================================
   NAVALHA NEGRA — CONTEÚDO EDITÁVEL
   ---------------------------------------------------------------------
   Este é o único arquivo que você precisa mexer para trocar preços,
   horários, número do WhatsApp, endereço e redes sociais.
   Regras simples:
   - Troque só o que está entre aspas "assim".
   - Não apague vírgulas nem chaves { }.
   - Campo vazio ("") = o site esconde aquela informação sozinho.
   ===================================================================== */

window.NAVALHA = {

  /* MODO PORTFÓLIO
     true  = este site é um exemplar do Estúdio Forja: os botões de
             agendamento abrem uma janela explicando o que aconteceria
             num site real, com "Quero um site assim" (WhatsApp do
             Estúdio), "Ver outros projetos" e "Continuar explorando".
     false = site de uma barbearia real: os botões abrem direto o
             WhatsApp da barbearia (campo "whatsapp" abaixo). */
  modoPortfolio: true,

  /* Estúdio Forja (usado no modo portfólio e no link de volta) */
  estudio: {
    nome: "Estúdio Forja",
    site: "https://estudioforja.com.br/#portfolio",
    whatsapp: "5545991164764",
    mensagem: "Olá! Vi o site da Navalha Negra e quero um site assim para o meu negócio."
  },

  /* WhatsApp da barbearia (só usado com modoPortfolio: false).
     Formato: 55 + DDD + número, só dígitos. */
  whatsapp: "",

  /* Mensagem que já chega escrita no WhatsApp.
     {servico} é trocado pelo nome do serviço quando o clique vem de um
     cartão de serviço. */
  mensagem: "Olá! Acessei o site da Navalha Negra e gostaria de agendar um horário. Poderia me informar as disponibilidades?",
  mensagemServico: "Olá! Acessei o site da Navalha Negra e gostaria de agendar um horário para {servico}. Poderia me informar as disponibilidades?",

  /* Serviços. Preço em reais (número, sem "R$"). Tempo em minutos.
     Os valores abaixo são DEMONSTRATIVOS. */
  avisoPrecos: "Valores e tempos demonstrativos.",
  servicos: [
    {
      nome: "Corte masculino",
      descricao: "Conversa rápida antes de começar, tesoura e máquina em equilíbrio. O corte é pensado para o seu rosto, o seu cabelo e a sua rotina.",
      preco: 70,
      tempo: 45
    },
    {
      nome: "Degradê / Fade",
      descricao: "Transição limpa do zero ao comprimento, sem marcas. Do low ao high fade, executado com paciência de relojoeiro.",
      preco: 80,
      tempo: 50
    },
    {
      nome: "Barba",
      descricao: "Desenho, aparo e contorno na navalha. Toalha quente e finalização com óleo para a barba ficar alinhada por mais tempo.",
      preco: 55,
      tempo: 30
    },
    {
      nome: "Corte + Barba",
      descricao: "O ritual completo numa única cadeira: corte, barba e acabamento na navalha, sem pressa entre uma etapa e outra.",
      preco: 115,
      tempo: 75,
      destaque: "Mais completo"
    },
    {
      nome: "Sobrancelha",
      descricao: "Limpeza discreta com navalha. Corrige o desenho sem mudar a sua expressão.",
      preco: 25,
      tempo: 15
    },
    {
      nome: "Acabamento",
      descricao: "Pezinho, contorno e nuca redesenhados entre um corte e outro, para o visual durar mais.",
      preco: 35,
      tempo: 20
    }
  ],

  /* Horários. Deixe "Fechado" nos dias sem atendimento.
     Os horários abaixo são DE REFERÊNCIA (troque pelos reais). */
  avisoHorarios: "Horários de referência.",
  horarios: [
    { dia: "Segunda", hora: "Fechado" },
    { dia: "Terça a sexta", hora: "9h às 20h" },
    { dia: "Sábado", hora: "8h às 18h" },
    { dia: "Domingo", hora: "Fechado" }
  ],

  /* Endereço. Vazio = o site mostra que o endereço é enviado na
     confirmação do agendamento, e o mapa fica escondido.
     Preenchido = aparece o endereço e o mapa do Google. */
  endereco: "",

  /* Telefone fixo opcional, como deve aparecer na tela. Ex.: "(45) 3000-0000" */
  telefone: "",

  /* Redes sociais: cole o link completo. Vazio = não aparece. */
  instagram: "",
  facebook: "",
  tiktok: "",

  /* Depoimentos ILUSTRATIVOS. Troque pelos relatos reais dos clientes
     (com autorização deles). "servico" aparece abaixo da frase. */
  avisoDepoimentos: "Depoimentos ilustrativos.",
  depoimentos: [
    {
      texto: "Saí com a sensação de que alguém finalmente entendeu o que eu pedia. O degradê ficou exatamente onde eu queria.",
      servico: "Degradê / Fade"
    },
    {
      texto: "A barba na navalha com toalha quente virou o meu momento da semana. Sem pressa, sem conversa forçada.",
      servico: "Barba"
    },
    {
      texto: "Ambiente bonito, atendimento no horário e um acabamento que dura. É o tipo de lugar que você indica sem pensar.",
      servico: "Corte + Barba"
    }
  ]
};
