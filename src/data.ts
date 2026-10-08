import { Experience, Education, Course, Skill } from './types';

export const PERSONAL_INFO = {
  fullName: "Ana Carolina Ferreira da Costa",
  displayName: "Carolina Ferreira",
  title: "Recepcionista | Assistente Administrativo | Atendimento ao Cliente",
  roles: [
    "Recepcionista Corporativa",
    "Assistente Administrativo",
    "Atendimento ao Cliente de Alta Performance",
    "Auxiliar de Escritório & Apoio Financeiro",
    "Gestão de Agendas & Recepção de Clínicas"
  ],
  city: "Fortaleza e Região Metropolitana - CE",
  phone: "(85) 98597-6871",
  email: "carolcilios01@gmail.com",
  linkedin: "https://www.linkedin.com/in/carolferreiraofc/",
  linkedinDisplay: "linkedin.com/in/carolferreiraofc",
  portfolioUrl: "https://carolina-ferreira.vercel.app/",
  portfolioDisplay: "carolina-ferreira.vercel.app",
  whatsappUrl: "https://wa.me/5585985976871?text=Ol%C3%A1%20Carolina%20Ferreira%2C%20vi%20seu%20portf%C3%B3lio%20profissional%20e%20gostaria%20de%20conversar!",
  photoUrl: new URL('./assets/images/carolfoto.jpg', import.meta.url).href, 
  backupPhotoUrl: new URL('./assets/images/carolfoto.jpg', import.meta.url).href,
  about: "Profissional dedicada com sólida experiência em recepção corporativa, rotinas administrativas, suporte financeiro e excelência no atendimento ao cliente. Possui vivência no ambiente corporativo de grande porte (Solistica), desempenhando atividades de recepção de visitantes, conferência e lançamento de notas fiscais, controle de fluxo de caixa operacional, emissão de recibos e gestão de documentação administrativa e logística.\n\nSimultaneamente, atua como empreendedora autônoma na área de estética e beleza facial (design de sobrancelhas e lash designer), aprimorando competências de autogestão, atendimento humanizado, fidelização de público, negociação direta via WhatsApp/redes sociais, controle de insumos e organização rigorosa de agendas.\n\nReconhecida pela pontualidade, comunicação clara e assertiva, discrição corporativa, facilidade em operar sistemas integrados (CRM/ERP) e capacidade de solucionar demandas com rapidez, empatia e compromisso.",
  objective: "Atuar nas áreas de Recepção Empresarial ou Clínica, Assistente Administrativo, Auxiliar Administrativo, Atendimento ao Cliente ou Secretariado, aplicando organização metódica, agilidade em sistemas e excelência no acolhimento de clientes, parceiros e fornecedores.",
  additionalInfo: [
    "Excelente comunicação verbal, escrita e dicção corporativa",
    "Facilidade no aprendizado rápido de novos softwares e sistemas de CRM",
    "Conhecimento prático em notas fiscais (NF-e/Danfe) e conciliação",
    "Digitação ágil, elaboração de relatórios e redação de ofícios",
    "Gestão metódica de agenda corporativa e organização de arquivos",
    "Disponibilidade para início imediato e flexibilidade de horários",
    "Perfil proativo, colaborativo, pontual e comprometido com metas"
  ]
};

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    company: "Solistica",
    role: "Recepcionista Administrativa",
    period: "Maio de 2024 até Fevereiro de 2025",
    location: "Fortaleza e Região - CE",
    activities: [
      "Recepção presencial e acolhimento cordial de clientes, visitantes, fornecedores e parceiros corporativos",
      "Atendimento telefônico via central PABX, triagem de chamadas, recados e encaminhamento para departamentos competentes",
      "Gerenciamento e triagem de correspondências, malotes internos, encomendas e circulação de documentos sigilosos",
      "Cadastro rigoroso e atualização contínua de dados de clientes e parceiros em sistema informatizado de CRM",
      "Emissão, lançamento no sistema e conferência minuciosa de Notas Fiscais (NF-e / Danfe) e romaneios",
      "Apoio direto às rotinas do departamento financeiro: recebimento de valores, emissão de recibos e conciliação de comprovantes",
      "Controle, organização e arquivamento físico e digital de prontuários, contratos e relatórios administrativos",
      "Suporte operacional à equipe de expedição e logística na conferência física e documental de cargas recebidas",
      "Redação de comunicados oficiais, elaboração de e-mails corporativos e agendamento de reuniões em salas corporativas"
    ]
  },
  {
    id: "exp-2",
    company: "Profissional Autônoma / Empreendedora",
    role: "Designer de Sobrancelhas e Lash Designer",
    period: "Março de 2025 até Atualmente",
    location: "Fortaleza e Região - CE",
    activities: [
      "Gestão autônoma de negócio próprio de estética facial, unindo atendimento comercial de alta qualidade e pós-venda",
      "Prestação de serviços minuciosos de design de sobrancelhas personalizado, mapeamento facial e extensão de cílios",
      "Administração completa de agenda de atendimentos, confirmações antecipadas e reagendamentos estratégicos",
      "Atendimento consultivo humanizado focado em entender a necessidade de cada cliente, gerando alta fidelização e indicações",
      "Comunicação direta e proativa através de canais digitais (WhatsApp Business e redes sociais comerciais)",
      "Gestão financeira autônoma: fluxo de caixa diário, controle de contas a receber, precificação e controle de despesas",
      "Controle criterioso de estoque de insumos, cotação com distribuidores, compras e estrito cumprimento de normas de biossegurança"
    ],
    isFreelance: true
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    id: "edu-1",
    degree: "Ensino Médio Completo",
    institution: "EEM José de Alencar",
    completionYear: "2023"
  }
];

export const COURSES_LIST: Course[] = [
  {
    id: "course-1",
    name: "Assistente Administrativo Completo",
    institution: "IEP - Instituto de Educação Profissional",
    workload: "160 horas",
    syllabus: [
      "Rotinas Administrativas Gerais",
      "Atendimento ao Cliente de Excelência",
      "Comunicação Empresarial & Etiqueta Corporativa",
      "Redação Oficial e Correspondência Corporativa",
      "Organização de Arquivos Físicos e Digitais",
      "Noções Financeiras & Fluxo de Caixa",
      "Emissão, Lançamento e Controle de Notas Fiscais",
      "Noções de Departamento Pessoal e RH",
      "Ética Profissional e Postura no Ambiente de Trabalho",
      "Técnicas de Atendimento Telefônico e PABX",
      "Gestão Eficiente de Agendas e Compromissos",
      "Controle de Insumos e Materiais de Escritório"
    ]
  },
  {
    id: "course-2",
    name: "Informática Corporativa & Pacote Office",
    institution: "IEP - Instituto de Educação Profissional",
    workload: "120 horas",
    syllabus: [
      "Microsoft Word (Ofícios, Relatórios e Memorandos)",
      "Microsoft Excel (Planilhas de Controle, Fórmulas e Cadastros)",
      "Microsoft PowerPoint (Apresentações Corporativas)",
      "Microsoft Outlook (Gestão de Correio Eletrônico e Calendários)",
      "Google Workspace (Google Docs, Planilhas, Drive e Agenda)",
      "Técnicas de Digitação Rápida e Produtividade",
      "Navegação na Web, Segurança da Informação e Backup",
      "Organização de Pastas em Rede e Armazenamento em Nuvem"
    ]
  },
  {
    id: "course-3",
    name: "Atendimento ao Cliente & Comunicação Assertiva",
    institution: "Qualificação Profissional Contínua",
    workload: "60 horas",
    syllabus: [
      "Técnicas de Acolhimento e Escuta Ativa",
      "Comunicação Não-Violenta e Resolução Ágil de Conflitos",
      "Postura e Inteligência Emocional no Atendimento ao Público",
      "Fidelização e Encantamento de Clientes",
      "Atendimento Humanizado em Ambientes de Saúde e Recepção"
    ]
  },
  {
    id: "course-4",
    name: "Organização do Trabalho & Gestão de Tempo",
    institution: "Capacitação Profissional",
    workload: "40 horas",
    syllabus: [
      "Metodologia 5S aplicada ao ambiente administrativo",
      "Priorização de Tarefas e Cumprimento Rígido de Prazos",
      "Planejamento Diário e Redução de Gargalos Operacionais",
      "Trabalho em Equipe e Cooperação Interdepartamental"
    ]
  }
];

export const SKILLS_LIST: Skill[] = [
  // Administrative
  { name: "Recepção Corporativa e Hospitalar", level: 98, category: "administrative" },
  { name: "Rotinas Administrativas Gerais", level: 95, category: "administrative" },
  { name: "Organização e Gestão de Documentos", level: 95, category: "administrative" },
  { name: "Triagem de Correspondências e Malotes", level: 92, category: "administrative" },
  { name: "Gestão Estratégica de Agenda", level: 94, category: "administrative" },
  { name: "Atendimento Telefônico e PABX", level: 96, category: "administrative" },
  { name: "Redação Empresarial e Comunicados", level: 90, category: "administrative" },
  { name: "Controle e Reposição de Estoque", level: 88, category: "administrative" },
  
  // Financial
  { name: "Rotinas e Apoio Financeiro", level: 88, category: "financial" },
  { name: "Emissão de Notas Fiscais (NF-e/Danfe)", level: 92, category: "financial" },
  { name: "Conferência e Lançamento de Notas Fiscais", level: 90, category: "financial" },
  { name: "Recebimento de Pagamentos e Emissão de Recibos", level: 95, category: "financial" },
  { name: "Controle de Fluxo de Caixa Diário", level: 85, category: "financial" },
  { name: "Conciliação de Comprovantes", level: 86, category: "financial" },
  
  // Client Relations
  { name: "Atendimento ao Cliente de Alto Padrão", level: 99, category: "client-relations" },
  { name: "Relacionamento Interpessoal e Empatia", level: 98, category: "client-relations" },
  { name: "Fidelização e Pós-Atendimento", level: 95, category: "client-relations" },
  { name: "Resolução Rápida de Conflitos", level: 92, category: "client-relations" },
  { name: "Comunicação via WhatsApp Business", level: 98, category: "client-relations" },
  { name: "Atendimento Humanizado", level: 97, category: "client-relations" },

  // Digital & Tools
  { name: "Sistemas de CRM e Gestão", level: 90, category: "digital" },
  { name: "Microsoft Word & Documentos", level: 95, category: "digital" },
  { name: "Microsoft Excel & Planilhas", level: 85, category: "digital" },
  { name: "Google Workspace (Docs, Drive, Agenda)", level: 92, category: "digital" },
  { name: "Digitação Ágil e Precisa", level: 94, category: "digital" },
  { name: "E-mail Corporativo & Outlook", level: 92, category: "digital" },
  
  // Personal & Attitude
  { name: "Comunicação Clara e Postura Ética", level: 98, category: "personal" },
  { name: "Organização e Atenção aos Detalhes", level: 98, category: "personal" },
  { name: "Proatividade e Resolução Prática", level: 95, category: "personal" },
  { name: "Pontualidade e Responsabilidade", level: 99, category: "personal" },
  { name: "Trabalho em Equipe e Flexibilidade", level: 94, category: "personal" },
  { name: "Facilidade em Aprender Novos Sistemas", level: 96, category: "personal" },
  { name: "Discrição e Sigilo Corporativo", level: 98, category: "personal" }
];

export const RESUME_MAIN_SKILLS = [
  "Recepção Corporativa & PABX",
  "Atendimento ao Cliente de Excelência",
  "Rotinas Administrativas Gerais",
  "Emissão & Conferência de Notas Fiscais (NF-e)",
  "Gestão Estratégica de Agenda",
  "Pacote Office & Planilhas Excel",
  "Organização & Gestão de Documentos",
  "Comunicação Assertiva & Etiqueta Corporativa",
  "Sistemas de CRM e Gestão",
  "Discrição & Sigilo Corporativo"
];
