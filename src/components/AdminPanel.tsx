import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { 
  X, Briefcase, Plus, Copy, Check, FileText, Sparkles, Trash2, 
  Calendar, Eye, Send, Building, ShieldCheck, Heart, Award, RefreshCw, 
  CheckCircle, ExternalLink, Camera, QrCode as QrIcon, Globe, Printer, Edit3
} from 'lucide-react';
import { PERSONAL_INFO } from '../data';
import { ResumeConfig } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
}

interface Application {
  id: string;
  company: string;
  role: string;
  segment: string;
  date: string;
  status: 'Enviado' | 'Entrevista' | 'Rejeitado' | 'Aprovado';
  notes: string;
}

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    company: 'Exemplo de Empresa / Clínica',
    role: 'Recepcionista Administrativa',
    segment: 'Recepção',
    date: '14/07/2026',
    status: 'Enviado',
    notes: 'Vaga enviada pelo LinkedIn. Exige simpatia no atendimento e organização de planilhas.'
  }
];

export default function AdminPanel({ isOpen, onClose, onOpenResume }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'downloads' | 'letters' | 'tracker' | 'ai'>('downloads');
  const [applications, setApplications] = useState<Application[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('carol_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Resume Download Customizer Config State
  const [resumeConfig, setResumeConfig] = useState<ResumeConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carol_resume_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      showPhoto: true,
      showQrCode: true,
      showPortfolioLink: true
    };
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(PERSONAL_INFO.portfolioUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#881337',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, []);

  const handleUpdateResumeConfig = (key: keyof ResumeConfig) => {
    const updated = {
      ...resumeConfig,
      [key]: !resumeConfig[key]
    };
    setResumeConfig(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('carol_resume_config', JSON.stringify(updated));
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '15112025') {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('carol_admin_auth', 'true');
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('carol_admin_auth');
  };

  // Letter Personalizer fields
  const [letterCompany, setLetterCompany] = useState('');
  const [letterRecruiter, setLetterRecruiter] = useState('');
  const [letterRole, setLetterRole] = useState('');

  // Application Form State
  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    segment: 'Recepção',
    notes: ''
  });

  // AI Analyzer State
  const [aiSegment, setAiSegment] = useState('Recepcionista Clínico');
  const [aiCustomSegment, setAiCustomSegment] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState('Lendo as informações...');

  // Copy status helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Load applications
  useEffect(() => {
    const saved = localStorage.getItem('carol_applications');
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
      } catch (e) {
        setApplications(DEFAULT_APPLICATIONS);
      }
    } else {
      setApplications(DEFAULT_APPLICATIONS);
      localStorage.setItem('carol_applications', JSON.stringify(DEFAULT_APPLICATIONS));
    }
  }, [isOpen]);

  // Save application
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.company || !newApp.role) return;

    const added: Application = {
      id: `app-${Date.now()}`,
      company: newApp.company,
      role: newApp.role,
      segment: newApp.segment,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Enviado',
      notes: newApp.notes
    };

    const updated = [added, ...applications];
    setApplications(updated);
    localStorage.setItem('carol_applications', JSON.stringify(updated));

    setNewApp({
      company: '',
      role: '',
      segment: 'Recepção',
      notes: ''
    });
  };

  // Delete application
  const handleDeleteApp = (id: string) => {
    const filtered = applications.filter(app => app.id !== id);
    setApplications(filtered);
    localStorage.setItem('carol_applications', JSON.stringify(filtered));
  };

  // Update Status
  const handleUpdateStatus = (id: string, newStatus: any) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem('carol_applications', JSON.stringify(updated));
  };

  // AI Loading motivational text cycle
  useEffect(() => {
    if (!isAiLoading) return;
    const messages = [
      "Analisando sua experiência na Solistica... ✨",
      "Valorizando suas competências como Lash Designer... ✨",
      "Cruzando seus cursos de Assistente Administrativo e Informática... 💻",
      "Formatando a melhor estratégia de abordagem... 📝",
      "Quase pronto! Gerando conselhos personalizados de RH... 📊"
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMotivationalMessage(messages[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAiLoading]);

  // AI Match call
  const handleAiAnalyze = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);

    const segmentToAnalyze = aiSegment === 'Outro' ? aiCustomSegment : aiSegment;

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          segment: segmentToAnalyze,
          description: aiDescription
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      setAiError('Ocorreu um erro ao consultar o assistente de IA. Mas continue focada que a vaga é sua!');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Cover Letter pre-written templates (with dynamic replacement support)
  const rawLetters = [
    {
      id: 'let-1',
      badge: 'Recepção Geral & Corporativa',
      title: '📞 Perfil Recepcionista Corporativa / Recepção Geral',
      description: 'Ideal para vagas de recepcionista em empresas, transportadoras, escritórios e consultórios em geral. Foco em atendimento, PABX, organização de salas e sistema de CRM.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa || 'sua empresa';
        const rec = recrutador || 'Equipe de Recrutamento e Seleção';
        const car = cargo || 'Recepcionista';
        return `Prezado(a) ${rec},

Gostaria de manifestar meu forte interesse em integrar a equipe da ${emp} na função de ${car}. Minha trajetória profissional é fundamentada na excelência no atendimento ao público, comunicação assertiva e organização rigorosa de rotinas administrativas.

Em minha experiência na Solistica, atuei diretamente na recepção de visitantes e clientes corporativos, operação de central telefônica, cadastros em sistema de CRM, além de suporte integral a notas fiscais (emissão e conferência) e controle documental. Paralelamente, minha atuação como profissional autônoma consolidou habilidades essenciais em pontualidade, atendimento cordial e resolução ágil de demandas.

Possuo formação completa como Assistente Administrativo e Informática Corporativa pelo IEP, dominando ferramentas do Pacote Office (Word, Excel) e Google Workspace.

Estou à inteira disposição para agendarmos uma entrevista presencial ou online. Meu portfólio completo pode ser acessado em: ${PERSONAL_INFO.portfolioUrl}

Atenciosamente,
${PERSONAL_INFO.fullName}
Telefone/WhatsApp: ${PERSONAL_INFO.phone}
E-mail: ${PERSONAL_INFO.email}
LinkedIn: ${PERSONAL_INFO.linkedinDisplay}`;
      }
    },
    {
      id: 'let-2',
      badge: 'Saúde & Clínicas',
      title: '🏥 Perfil Recepção em Clínicas Médicas, Odontológicas & Consultórios',
      description: 'Perfeito para clínicas de saúde, laboratórios e consultórios. Destaque para acolhimento humanizado, organização de prontuários, agendamentos e sigilo.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa || 'sua clínica';
        const rec = recrutador || 'Gestão da Clínica / Recursos Humanos';
        const car = cargo || 'Recepcionista de Clínica';
        return `Prezado(a) ${rec},

Apresento minha candidatura à vaga de ${car} na ${emp}. Reconheço a importância vital que a recepção representa na experiência e acolhimento dos pacientes e seus familiares, unindo empatia, cordialidade e organização metódica.

Possuo experiência corporativa na recepção de público, controle de correspondências e prontuários, cadastro minucioso em sistemas digitais, emissão de recibos e conferência documental. Adicionalmente, minha vivência autônoma no atendimento personalizado me capacitou profundamente no gerenciamento humanizado de agenda, confirmação antecipada de consultas e resolução ágil de dúvidas com calma e profissionalismo.

Sou extremamente pontual, organizada e comprometida com a ética e sigilo das informações dos pacientes.

Fico à disposição para uma entrevista e anexo meu currículo detalhado.
Portfólio online: ${PERSONAL_INFO.portfolioUrl}

Cordialmente,
${PERSONAL_INFO.fullName}
Contato: ${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email}`;
      }
    },
    {
      id: 'let-3',
      badge: 'Administrativo & Financeiro',
      title: '📝 Perfil Assistente / Auxiliar Administrativo & Apoio Financeiro',
      description: 'Indicado para vagas de suporte administrativo, faturamento, conferência de notas fiscais, controle de fluxo de caixa e planilhas.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa || 'sua empresa';
        const rec = recrutador || 'Equipe de Gestão e Recursos Humanos';
        const car = cargo || 'Assistente Administrativo';
        return `Prezado(a) ${rec},

Escrevo para me candidatar à oportunidade de ${car} na ${emp}. Com uma sólida base teórica obtida no curso de Assistente Administrativo pelo IEP e aplicação prática no ambiente corporativo da Solistica, estou preparada para contribuir ativamente com a eficiência operacional da organização.

Dentre minhas principais atribuições corporativas, destaco a emissão, lançamento e conferência minuciosa de Notas Fiscais (NF-e/Danfe), recebimento e conciliação de pagamentos com controle de fluxo de caixa, apoio na triagem de cargas e romaneios, além de arquivamento sistemático de documentos e elaboração de relatórios em Excel e Word.

Meus diferenciais incluem grande atenção aos detalhes numéricos e fiscais, facilidade para assimilar novos softwares integrados (ERP/CRM) e comprometimento rigoroso com prazos internos.

Coloco-me à disposição para uma conversa detalhada sobre minhas qualificações.
Meu portfólio profissional está disponível em: ${PERSONAL_INFO.portfolioUrl}

Respeitosamente,
${PERSONAL_INFO.fullName}
Telefone: ${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email}`;
      }
    },
    {
      id: 'let-4',
      badge: 'Beleza & Atendimento Personalizado',
      title: '✨ Atendimento ao Cliente / Clínicas de Estética, Beleza & Salões',
      description: 'Ideal para atendimento, recepção comercial e pós-venda em estúdios de beleza e clínicas de estética. Valoriza imensamente a sua experiência como Lash Designer e empreendedora.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa || 'seu estabelecimento';
        const rec = recrutador || 'Responsável pelo Espaço / Recrutamento';
        const car = cargo || 'Atendimento ao Cliente / Recepção';
        return `Olá, ${rec}!

Gostaria de submeter meu currículo para a função de ${car} no ${emp}. Atuo como profissional autônoma no segmento de estética facial (design de sobrancelhas e lash designer), o que me proporcionou ampla bagagem em atendimento de alta fidelização, recepção acolhedora e comunicação estratégica via WhatsApp e redes sociais comerciais.

Compreendo exatamente como receber clientes com carinho e transformar cada atendimento em uma experiência de encantamento e retorno constante. Além disso, associo essa sensibilidade estética à minha sólida experiência em rotinas administrativas, controle de estoque de insumos e emissão de notas fiscais adquirida na Solistica.

Tenho certeza de que posso somar à sua equipe com simpatia, dedicação, pontualidade e organização impecável!

Estou pronta para conversar quando for conveniente.
Conheça meu perfil e portfólio completo em: ${PERSONAL_INFO.portfolioUrl}

Um abraço cordial,
${PERSONAL_INFO.fullName}
Telefone: ${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email}`;
      }
    },
    {
      id: 'let-5',
      badge: 'Logística & Operações',
      title: '📦 Apoio Operacional, Logística & Suporte Administrativo',
      description: 'Excelente para empresas de logística, distribuidoras e centros de distribuição. Valoriza sua vivência real na Solistica em romaneios e conferência.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa || 'sua empresa';
        const rec = recrutador || 'Equipe de Operações e Recursos Humanos';
        const car = cargo || 'Auxiliar Administrativo Operacional';
        return `Prezados da ${emp},

Venho manifestar meu interesse na vaga de ${car}. Minha experiência na Solistica me permitiu vivenciar de perto o dinamismo e as exigências da rotina operacional de transporte e logística.

Participei ativamente no recebimento e conferência física de romaneios de cargas recebidas, lançamento de documentação fiscal de transporte, arquivamento de canhotos e comprovantes, além do atendimento aos motoristas, clientes e fornecedores com agilidade e foco na precisão de dados.

Possuo boa afinidade com planilhas de controle, facilidade em cumprir normas de segurança e processos padronizados de conferência.

Estou à disposição para uma entrevista e início imediato.
Portfólio profissional: ${PERSONAL_INFO.portfolioUrl}

Atenciosamente,
${PERSONAL_INFO.fullName}
Contato: ${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email}`;
      }
    },
    {
      id: 'let-6',
      badge: 'Envio Rápido / WhatsApp',
      title: '⚡ Apresentação Expressa (Mensagem Curta para WhatsApp ou Chat)',
      description: 'Ideal para enviar diretamente no WhatsApp de recrutadores ou no campo de mensagem rápida de plataformas como LinkedIn e Gupy.',
      template: (empresa: string, recrutador: string, cargo: string) => {
        const emp = empresa ? ` da ${empresa}` : '';
        const rec = recrutador ? `Olá, ${recrutador}!` : 'Olá! Tudo bem?';
        const car = cargo || 'sua vaga';
        return `${rec} Meu nome é Carolina Ferreira e gostaria de me candidatar à oportunidade de ${car}${emp}.

Possuo sólida experiência em recepção, atendimento ao cliente de alta performance e rotinas administrativas corporativas (atuação na Solistica e formação de Assistente Administrativo e Informática pelo IEP), com facilidade em notas fiscais, CRM, planilhas e gestão de agendas.

Sou muito organizada, comunicativa e dedicada a somar com simpatia e agilidade.

Você pode conferir meu currículo completo e portfólio no link:
👉 ${PERSONAL_INFO.portfolioUrl}

Fico à disposição para uma entrevista. Muito obrigada pela atenção!`;
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md z-50 overflow-y-auto px-4 py-6 sm:py-10 flex justify-center items-start print:hidden">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* LOGIN MODAL */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col"
        style={{ display: isAuthenticated ? 'none' : 'flex' }}
      >
        {/* Passcode Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            title="Fechar"
          >
            <X size={16} />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-sm font-black mx-auto mb-3 shadow-inner border border-rose-400/30 tracking-wider">
            CF
          </div>
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block">Área Reservada</span>
          <h2 className="text-lg font-bold font-display mt-1">Acesso Administrativo da Carolina</h2>
          <p className="text-[11px] text-rose-200/80 mt-1.5 max-w-xs mx-auto">
            Digite sua senha para configurar downloads de currículo, acessar modelos de cartas e gerenciar suas candidaturas.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 block uppercase tracking-wider">Senha de Acesso</label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full bg-stone-50 border ${
                passwordError ? 'border-rose-500 focus:border-rose-500 bg-rose-50/20' : 'border-stone-200 focus:border-rose-800'
              } rounded-2xl px-4 py-3 text-sm text-stone-800 text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-rose-800/15 transition-all`}
              autoFocus
            />
            {passwordError && (
              <p className="text-[11px] text-rose-600 font-bold text-center mt-1 animate-pulse">
                ❌ Senha incorreta! Tente novamente, Carol.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-rose-800 hover:bg-rose-900 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-widest py-3 px-4 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20"
          >
            Confirmar e Entrar
          </button>
        </form>
      </motion.div>

      {/* AUTHENTICATED ADMIN PANEL */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col"
        >
          {/* Panel Header */}
          <div className="p-6 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
              title="Fechar"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white text-xl font-bold shadow-inner border border-white/20">
                AC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Central Exclusiva</span>
                  <button 
                    onClick={handleLogout}
                    className="text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white px-2 py-0.5 rounded transition uppercase cursor-pointer"
                    title="Bloquear Painel"
                  >
                    Sair / Bloquear
                  </button>
                </div>
                <h1 className="text-xl font-bold font-display flex items-center gap-2">
                  Painel Administrativo da Carol
                </h1>
              </div>
            </div>
            <p className="text-xs text-rose-100/90 mt-2 max-w-2xl leading-relaxed">
              Personalize seu currículo (com ou sem foto, com QR Code do portfólio), copie modelos de cartas prontas e rastreie suas vagas!
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 px-4 overflow-x-auto gap-1">
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'downloads' 
                  ? 'border-rose-800 text-rose-900 bg-white/60' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Printer size={14} />
              Baixar Currículo (Opções)
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'letters' 
                  ? 'border-rose-800 text-rose-900 bg-white/60' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <FileText size={14} />
              Modelos de Cartas Prontas
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tracker' 
                  ? 'border-rose-800 text-rose-900 bg-white/60' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Building size={14} />
              Rastrear Vagas
            </button>
            
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai' 
                  ? 'border-rose-800 text-rose-900 bg-white/60' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles size={14} className="text-amber-600" />
              Analisar Compatibilidade (IA)
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 bg-white min-h-[460px]">
            
            {/* TAB 1: DOWNLOADS & RESUME CONFIG (NEW FEATURE) */}
            {activeTab === 'downloads' && (
              <div className="space-y-6">
                
                {/* Info Card */}
                <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-rose-200/60 text-rose-900 flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Opções de Exportação e Download do Currículo</p>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      Configure abaixo como seu currículo será gerado. Você pode alternar para sair com ou sem sua foto profissional, ativar o QR Code que leva os recrutadores direto para o seu portfólio web (<strong className="text-rose-900">https://carolina-ferreira.vercel.app/</strong>) e salvar como PDF vetorizado perfeito!
                    </p>
                  </div>
                </div>

                {/* Interactive Config Card */}
                <div className="bg-stone-50/80 p-5 rounded-3xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Edit3 size={16} className="text-rose-800" />
                    Personalize seu Currículo antes de Imprimir / Baixar:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Toggle Photo */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showPhoto')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showPhoto
                          ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                          : 'bg-white border-stone-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Camera size={20} className={resumeConfig.showPhoto ? 'text-rose-800' : 'text-stone-400'} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          resumeConfig.showPhoto ? 'bg-rose-200 text-rose-900' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {resumeConfig.showPhoto ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">Foto no Currículo</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {resumeConfig.showPhoto 
                          ? 'Foto profissional com enquadramento refinado no topo.' 
                          : 'Currículo limpo sem foto (preferido por algumas empresas).'}
                      </p>
                      
                      {resumeConfig.showPhoto && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextShape = resumeConfig.photoShape === 'rounded' ? 'circle' : 'rounded';
                            const updated = { ...resumeConfig, photoShape: nextShape };
                            setResumeConfig(updated);
                            localStorage.setItem('carol_resume_config', JSON.stringify(updated));
                          }}
                          className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between text-[11px] font-bold text-rose-900"
                        >
                          <span>Formato:</span>
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-rose-300 shadow-xs hover:bg-rose-100">
                            {resumeConfig.photoShape === 'rounded' ? '📷 Retangular Suave' : '✨ Redonda Executiva'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Toggle QR Code */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showQrCode')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showQrCode
                          ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                          : 'bg-white border-stone-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <QrIcon size={20} className={resumeConfig.showQrCode ? 'text-rose-800' : 'text-stone-400'} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          resumeConfig.showQrCode ? 'bg-rose-200 text-rose-900' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {resumeConfig.showQrCode ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">QR Code do Portfólio Web</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {resumeConfig.showQrCode 
                          ? 'Gera QR Code escaneável para seu portfólio oficial no topo.' 
                          : 'Oculta o QR Code do cabeçalho do currículo.'}
                      </p>
                    </div>

                    {/* Toggle Portfolio Link */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showPortfolioLink')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showPortfolioLink
                          ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                          : 'bg-white border-stone-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Globe size={20} className={resumeConfig.showPortfolioLink ? 'text-rose-800' : 'text-stone-400'} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          resumeConfig.showPortfolioLink ? 'bg-rose-200 text-rose-900' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {resumeConfig.showPortfolioLink ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">Link Clicável do Portfólio</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {resumeConfig.showPortfolioLink 
                          ? 'Exibe o link carolina-ferreira.vercel.app no contato.' 
                          : 'Oculta o link do portfólio na barra de contato.'}
                      </p>
                    </div>

                  </div>

                  {/* QR Code Preview & Direct Link */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {qrCodeUrl && (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code Preview" 
                          className="w-14 h-14 rounded-lg border border-rose-200 p-0.5 bg-white shrink-0" 
                        />
                      )}
                      <div>
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                          Link Configurado do seu Portfólio Web:
                        </span>
                        <a 
                          href={PERSONAL_INFO.portfolioUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs sm:text-sm font-bold text-stone-900 hover:text-rose-800 flex items-center gap-1 hover:underline"
                        >
                          {PERSONAL_INFO.portfolioUrl}
                          <ExternalLink size={12} className="text-rose-700" />
                        </a>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          Recrutadores podem escanear com a câmera do celular ou clicar direto no PDF!
                        </p>
                      </div>
                    </div>

                    <a
                      href={PERSONAL_INFO.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap"
                    >
                      Testar Link Web ↗
                    </a>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center sm:justify-start">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="px-6 py-3 bg-rose-800 hover:bg-rose-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20"
                    >
                      <Eye size={15} />
                      Abrir Prévia do Currículo com estas Opções
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenResume();
                        setTimeout(() => {
                          const printBtn = document.getElementById('print-btn');
                          if (printBtn) printBtn.click();
                        }, 400);
                      }}
                      className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 border border-stone-200"
                    >
                      <Printer size={15} className="text-rose-800" />
                      Imprimir / Salvar PDF Direto
                    </button>
                  </div>

                </div>

                {/* Helpful HR Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Camera size={14} className="text-rose-800" />
                      Quando usar COM foto?
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Excelente para vagas de recepção corporativa, atendimento ao público presencial, secretariado e clínicas, onde boa postura, simpatia e imagem contam positivamente.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <FileText size={14} className="text-rose-800" />
                      Quando usar SEM foto?
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Recomendado para vagas onde a empresa ou plataforma (Gupy, portais corporativos formais) solicita explicitamente o modelo tradicional ou processos às cegas.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COVER LETTERS (MODELOS DE CARTAS PRONTAS) */}
            {activeTab === 'letters' && (
              <div className="space-y-6">
                
                {/* Intro notice */}
                <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-2xl text-xs flex items-start gap-3">
                  <Heart className="text-rose-800 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-sm">Modelos Prontos de Cartas de Apresentação</p>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      Textos redigidos profissionalmente com foco na sua experiência real na Solistica e como empreendedora de beleza. Preencha os campos abaixo para personalizar automaticamente o nome da empresa e recrutador em todas as cartas com 1 clique!
                    </p>
                  </div>
                </div>

                {/* Live Personalizer inputs */}
                <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-3">
                    ✍️ Personalização Automática das Cartas (Opcional):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Clínica Odontológica Sorrir"
                        value={letterCompany}
                        onChange={(e) => setLetterCompany(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                        Nome do Recrutador / Responsável
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Dra. Mariana / Equipe de RH"
                        value={letterRecruiter}
                        onChange={(e) => setLetterRecruiter(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                        Cargo Desejado na Vaga
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Recepcionista de Clínica"
                        value={letterRole}
                        onChange={(e) => setLetterRole(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Letters Catalog */}
                <div className="space-y-6">
                  {rawLetters.map((letter) => {
                    const finalLetterText = letter.template(letterCompany, letterRecruiter, letterRole);
                    return (
                      <div key={letter.id} className="bg-stone-50/70 p-5 rounded-3xl border border-stone-200 flex flex-col hover:border-rose-200 transition">
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                          <div>
                            <span className="inline-block text-[9px] font-bold text-rose-900 bg-rose-100/80 px-2.5 py-0.5 rounded-full uppercase mb-1">
                              {letter.badge}
                            </span>
                            <h3 className="text-sm font-bold text-stone-900">{letter.title}</h3>
                            <p className="text-[11px] text-stone-500 mt-0.5">{letter.description}</p>
                          </div>
                          <button
                            onClick={() => handleCopyText(finalLetterText, letter.id)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                              copiedId === letter.id 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-rose-800'
                            }`}
                          >
                            {copiedId === letter.id ? (
                              <>
                                <Check size={12} />
                                Copiado com Sucesso!
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                Copiar Carta Pronta
                              </>
                            )}
                          </button>
                        </div>
                        
                        <pre className="mt-2 bg-white p-4 rounded-2xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed font-sans whitespace-pre-line select-all max-h-56 overflow-y-auto">
                          {finalLetterText}
                        </pre>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 3: TRACKER */}
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                
                {/* Tracker Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total de Vagas</span>
                    <span className="text-2xl font-bold text-stone-800">{applications.length}</span>
                  </div>
                  <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/60 text-center">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Entrevistas Agendadas</span>
                    <span className="text-2xl font-bold text-rose-950">
                      {applications.filter(a => a.status === 'Entrevista').length}
                    </span>
                  </div>
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/60 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Aprovadas / Sucesso</span>
                    <span className="text-2xl font-bold text-emerald-900">
                      {applications.filter(a => a.status === 'Aprovado').length}
                    </span>
                  </div>
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/60 text-center">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Taxa de Resposta</span>
                    <span className="text-2xl font-bold text-purple-900">
                      {applications.length > 0 
                        ? `${Math.round((applications.filter(a => a.status !== 'Enviado').length / applications.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>

                {/* Add New Application Form */}
                <div className="bg-stone-50/80 p-5 rounded-3xl border border-stone-200">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5 mb-4">
                    <Plus size={16} className="text-rose-800" />
                    Cadastrar Nova Candidatura
                  </h3>
                  <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-stone-500 mb-1 uppercase">Empresa</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Clínica São Camilo"
                        value={newApp.company}
                        onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                        className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-stone-500 mb-1 uppercase">Cargo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Recepcionista de Clínica"
                        value={newApp.role}
                        onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                        className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-stone-500 mb-1 uppercase">Segmento</label>
                      <select
                        value={newApp.segment}
                        onChange={(e) => setNewApp({ ...newApp, segment: e.target.value })}
                        className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800"
                      >
                        <option value="Recepção">Recepção</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Atendimento">Atendimento ao Cliente</option>
                        <option value="Estética / Beleza">Estética / Beleza</option>
                        <option value="Outro">Outro segmento</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 h-[34px]"
                    >
                      Adicionar
                    </button>
                  </form>
                </div>

                {/* Applications List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-stone-800">Minha Lista de Candidaturas</h3>
                  {applications.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">Nenhuma candidatura cadastrada ainda. Use o formulário acima para rastrear sua busca!</p>
                  ) : (
                    <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3.5">Empresa</th>
                            <th className="p-3.5">Cargo / Segmento</th>
                            <th className="p-3.5">Data de Envio</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-stone-50/50">
                              <td className="p-3.5 font-bold text-stone-800">{app.company}</td>
                              <td className="p-3.5">
                                <div>{app.role}</div>
                                <span className="text-[10px] text-stone-400 font-semibold">{app.segment}</span>
                              </td>
                              <td className="p-3.5 text-stone-500">{app.date}</td>
                              <td className="p-3.5">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                    app.status === 'Enviado' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                    app.status === 'Entrevista' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                    app.status === 'Aprovado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                    'bg-stone-50 border-stone-200 text-stone-600'
                                  }`}
                                >
                                  <option value="Enviado">✉️ Enviado</option>
                                  <option value="Entrevista">📞 Entrevista</option>
                                  <option value="Aprovado">🎉 Aprovado</option>
                                  <option value="Rejeitado">🛑 Rejeitado</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteApp(app.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Deletar registro"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: AI ANALYZER */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                
                <div className="bg-rose-50/60 border border-rose-200 text-rose-950 p-4 rounded-2xl text-xs flex items-start gap-2.5">
                  <Sparkles className="text-rose-800 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold">Otimizador e Validador de Vagas Inteligente:</p>
                    <p className="text-stone-600 mt-0.5">
                      Digite o segmento da vaga onde quer se candidatar. O assistente de IA irá ler seu currículo real e gerar uma análise completa de adequação e as melhores dicas para a entrevista!
                    </p>
                  </div>
                </div>

                {/* Form Input */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-stone-50/50 p-5 rounded-3xl border border-stone-200">
                  <div className="md:col-span-4 flex flex-col">
                    <label className="text-xs font-semibold text-stone-500 mb-1.5">Segmento / Cargo da Vaga</label>
                    <select
                      value={aiSegment}
                      onChange={(e) => setAiSegment(e.target.value)}
                      className="bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm"
                    >
                      <option value="Recepcionista Clínico">Recepcionista Clínico (Consultório)</option>
                      <option value="Assistente Administrativo Corporativo">Assistente Administrativo</option>
                      <option value="Atendimento em Salão de Beleza">Atendimento de Beleza / Estética</option>
                      <option value="Auxiliar de Logística e Cargas">Auxiliar Logístico / Administrativo</option>
                      <option value="Auxiliar de Escritório Geral">Auxiliar de Escritório Geral</option>
                      <option value="Outro">Outro cargo personalizado...</option>
                    </select>

                    {aiSegment === 'Outro' && (
                      <input
                        type="text"
                        required
                        placeholder="Qual cargo ou segmento?"
                        value={aiCustomSegment}
                        onChange={(e) => setAiCustomSegment(e.target.value)}
                        className="mt-3 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm"
                      />
                    )}
                  </div>

                  <div className="md:col-span-8 flex flex-col">
                    <label className="text-xs font-semibold text-stone-500 mb-1.5">Requisitos ou Descrição da Vaga (Opcional)</label>
                    <textarea
                      rows={3}
                      placeholder="Cole aqui os detalhes da vaga (requisitos, benefícios, etc) se quiser uma análise ainda mais profunda!"
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-800 shadow-sm resize-none"
                    />
                  </div>

                  <div className="md:col-span-12 flex justify-end">
                    <button
                      onClick={handleAiAnalyze}
                      disabled={isAiLoading}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-800 hover:bg-rose-900 disabled:bg-stone-300 text-white rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-rose-900/10"
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Analisando Perfil...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Verificar Compatibilidade de Currículo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Loading State */}
                <AnimatePresence>
                  {isAiLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-12 text-center flex flex-col items-center justify-center border border-stone-200 bg-stone-50 rounded-3xl"
                    >
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-rose-100 animate-pulse" />
                        <div className="absolute w-12 h-12 rounded-full border-4 border-rose-800 border-t-transparent animate-spin" />
                        <Sparkles size={20} className="text-rose-800 animate-bounce" />
                      </div>
                      <h3 className="text-sm font-bold text-stone-800 mt-4">Nossa IA está trabalhando por você...</h3>
                      <p className="text-xs text-rose-900 font-semibold mt-2 animate-pulse bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200">
                        {motivationalMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error block */}
                {aiError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold">
                    {aiError}
                  </div>
                )}

                {/* AI Output Result Card */}
                {aiResult && !isAiLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-lg p-6 space-y-6"
                  >
                    {/* Score & Header info */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100">
                      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center rounded-full bg-stone-50 border-4 border-stone-100">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#f5f5f4" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="40" stroke="#881337" strokeWidth="8" fill="transparent" 
                            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * aiResult.matchPercentage) / 100}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-rose-900 leading-none">{aiResult.matchPercentage}%</span>
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Match</span>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-left space-y-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                          Análise Realizada com Sucesso!
                        </span>
                        <h4 className="text-base font-bold font-display text-stone-900 mt-1">
                          Compatibilidade com: <span className="text-rose-900">{aiSegment === 'Outro' ? aiCustomSegment : aiSegment}</span>
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed italic">
                          "{aiResult.justification}"
                        </p>
                      </div>
                    </div>

                    {/* Strengths & Tips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      
                      {/* Strengths */}
                      <div className="space-y-3 bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
                        <h5 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-rose-800" />
                          Seus Diferenciais Competitivos
                        </h5>
                        <ul className="space-y-2 text-xs text-stone-600">
                          {aiResult.strengths?.map((str: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-800 font-bold mt-0.5">✓</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interview Tips */}
                      <div className="space-y-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
                        <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Award size={15} className="text-amber-700" />
                          O que Destacar na Entrevista
                        </h5>
                        <ul className="space-y-2 text-xs text-stone-600">
                          {aiResult.pitchTips?.map((tip: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-600 font-bold mt-0.5">✦</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* AI Generated Pitch Intro */}
                    <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                          Apresentação Customizada Gerada pela IA
                        </span>
                        <button
                          onClick={() => handleCopyText(aiResult.customIntro, 'ai-pitch')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                            copiedId === 'ai-pitch' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {copiedId === 'ai-pitch' ? (
                            <>
                              <Check size={12} />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copiar Apresentação
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-stone-600 leading-relaxed font-sans whitespace-pre-line select-all bg-white p-4 rounded-xl border border-stone-100 italic">
                        {aiResult.customIntro}
                      </pre>
                    </div>

                  </motion.div>
                )}

              </div>
            )}

          </div>

          {/* Footer info banner */}
          <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
            <span>Suíte Profissional Carol Ferreira v3.0</span>
            <span className="flex items-center gap-1">
              Feito com <Heart size={10} className="text-rose-500 fill-rose-500" /> para Carol
            </span>
          </div>

        </motion.div>
      )}
    </div>
  );
}
