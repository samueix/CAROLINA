import { Experience, Education, Course, Skill } from './types';

export const PERSONAL_INFO = {
  fullName: "Ana Carolina Ferreira da Costa",
  displayName: "Ana Carolina",
  title: "Recepcionista | Assistente Administrativo | Atendimento ao Cliente",
  roles: [
    "Recepcionista",
    "Assistente Administrativo",
    "Atendimento ao Cliente",
    "Auxiliar Administrativo"
  ],
  city: "Fortaleza - Ceará",
  phone: "(85) 98597-6871",
  email: "carolcilios01@gmail.com",
  linkedin: "https://www.linkedin.com/in/ana-carolina-62b34b352/",
  whatsappUrl: "https://wa.me/5585985976871?text=Ol%C3%A1%20Ana%20Carolina%2C%20vi%20seu%20portf%C3%B3lio%20profissional%20e%20gostaria%20de%20conversar!",
  // SUA FOTO ENVIADA: carolfoto.jpg NA PASTA /src/assets/images/
  // Se a sua foto for quadrada, o portfólio irá deixá-la perfeitamente redonda de forma automática!
  photoUrl: new URL('./assets/images/carolfoto.jpg', import.meta.url).href, 
  backupPhotoUrl: new URL('./assets/images/carolfoto.jpg', import.meta.url).href, // Foto principal como backup também
  about: "Profissional com experiência em atendimento ao cliente, recepção e suporte administrativo. Atuou em ambiente corporativo desenvolvendo atividades administrativas, financeiras e de atendimento, sempre prezando pela organização, comunicação e qualidade no atendimento.\n\nTambém atua como profissional autônoma na área da beleza, realizando serviços de design de sobrancelhas e alongamento de cílios, desenvolvendo competências em relacionamento com clientes, organização de agenda e gestão do próprio negócio.\n\nBusca novos desafios para continuar evoluindo profissionalmente e contribuir para o crescimento da empresa.",
  objective: "Atuar nas áreas de Recepção, Assistente Administrativo, Auxiliar Administrativo, Atendimento ao Cliente ou áreas correlatas, contribuindo com organização, eficiência e qualidade nos processos administrativos e no atendimento ao público.",
  additionalInfo: [
    "Disponibilidade para novos desafios",
    "Disponibilidade de horário",
    "Facilidade em aprender novos sistemas",
    "Boa comunicação",
    "Comprometimento",
    "Perfil organizado"
  ]
};

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    company: "Solistica",
    role: "Recepcionista Administrativa",
    period: "Maio de 2024 até Fevereiro de 2025",
    location: "Fortaleza - Ceará",
    activities: [
      "Atendimento presencial, telefônico e por e-mail",
      "Recepção de visitantes e atendimento ao cliente com foco em satisfação",
      "Cadastro e atualização de informações em CRM",
      "Organização, controle e arquivamento de documentos administrativos e logísticos",
      "Apoio integral às rotinas administrativas e financeiras",
      "Emissão, lançamento e conferência de notas fiscais",
      "Recebimento de pagamentos e emissão de recibos",
      "Recebimento e conferência de cargas em suporte operacional"
    ]
  },
  {
    id: "exp-2",
    company: "Profissional Autônoma",
    role: "Designer de Sobrancelhas e Lash Designer",
    period: "Março de 2025 até Atualmente",
    location: "Fortaleza - Ceará",
    activities: [
      "Atendimento personalizado de alta qualidade focado em estética facial",
      "Realização de serviços especializados de design de sobrancelhas e alongamento/manutenção de cílios",
      "Gestão autônoma de agenda e agendamentos estratégicos",
      "Atendimento ao cliente integrado via WhatsApp e redes sociais comerciais",
      "Organização rigorosa de materiais, controle de estoque e fornecedores",
      "Relacionamento interpessoal e desenvolvimento de estratégias de fidelização de clientes"
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
    name: "Assistente Administrativo",
    institution: "IEP - Instituto de Educação Profissional",
    syllabus: [
      "Rotinas Administrativas",
      "Atendimento ao Cliente",
      "Comunicação Empresarial",
      "Organização de Documentos",
      "Arquivamento",
      "Redação Empresarial",
      "Noções Financeiras",
      "Noções de Departamento Pessoal",
      "Ética Profissional",
      "Atendimento Telefônico",
      "Organização de Agenda",
      "Pacote Office"
    ]
  },
  {
    id: "course-2",
    name: "Informática Básica",
    institution: "IEP - Instituto de Educação Profissional",
    syllabus: [
      "Microsoft Word",
      "Microsoft Excel Básico",
      "Microsoft PowerPoint",
      "Microsoft Outlook",
      "Internet & Correio Eletrônico",
      "Google Docs & Google Planilhas",
      "Digitação",
      "Organização de Arquivos"
    ]
  }
];

export const SKILLS_LIST: Skill[] = [
  // Administrative
  { name: "Recepção", level: 95, category: "administrative" },
  { name: "Rotinas Administrativas", level: 90, category: "administrative" },
  { name: "Organização de Documentos", level: 95, category: "administrative" },
  { name: "Controle Administrativo", level: 85, category: "administrative" },
  { name: "Gestão de Agenda", level: 90, category: "administrative" },
  { name: "Atendimento Telefônico", level: 95, category: "administrative" },
  
  // Financial
  { name: "Rotinas Financeiras", level: 80, category: "financial" },
  { name: "Emissão de Notas Fiscais", level: 85, category: "financial" },
  { name: "Conferência de Notas Fiscais", level: 85, category: "financial" },
  { name: "Lançamento de Notas Fiscais", level: 80, category: "financial" },
  { name: "Recebimento de Pagamentos", level: 90, category: "financial" },
  { name: "Controle Financeiro", level: 75, category: "financial" },
  
  // Client & Digital
  { name: "Atendimento ao Cliente", level: 98, category: "client-relations" },
  { name: "Relacionamento Interpessoal", level: 95, category: "client-relations" },
  { name: "CRM", level: 80, category: "client-relations" },
  { name: "Pacote Office", level: 85, category: "client-relations" },
  
  // Personal
  { name: "Comunicação", level: 95, category: "personal" },
  { name: "Organização", level: 95, category: "personal" },
  { name: "Proatividade", level: 90, category: "personal" },
  { name: "Responsabilidade", level: 95, category: "personal" },
  { name: "Trabalho em Equipe", level: 90, category: "personal" },
  { name: "Comprometimento", level: 95, category: "personal" }
];
