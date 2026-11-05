import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { 
  X, Plus, Copy, Check, FileText, Sparkles, Trash2, 
  Eye, Building, ShieldCheck, Heart, Award, RefreshCw, 
  ExternalLink, Camera, QrCode as QrIcon, Globe, Printer, Edit3
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
      "Analisando sua experiência na Solistica...",
      "Valorizando suas competências como Lash Designer...",
      "Cruzando cursos de Assistente Administrativo e Informática...",
      "Formatando a melhor estratégia de abordagem...",
      "Gerando conselhos personalizados de RH..."
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
      setAiError('Ocorreu um erro ao consultar o assistente de análise. Tente novamente mais tarde.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Cover Letter pre-written templates (exact templates preserved)
  const rawLetters = [
    {
      id: 'let-1',
      badge: 'Recepção Geral e Corporativa',
      title: 'Perfil Recepcionista Corporativa / Recepção Geral',
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
      badge: 'Saúde e Clínicas',
      title: 'Perfil Recepção em Clínicas Médicas, Odontológicas e Consultórios',
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
      badge: 'Administrativo e Financeiro',
      title: 'Perfil Assistente / Auxiliar Administrativo e Apoio Financeiro',
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
      badge: 'Atendimento e Estética',
      title: 'Atendimento ao Cliente / Clínicas de Estética, Beleza e Salões',
      description: 'Ideal para atendimento, recepção comercial e pós-venda em estúdios de beleza e clínicas de estética. Valoriza a experiência em atendimento personalizado.',
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
      badge: 'Logística e Operações',
      title: 'Apoio Operacional, Logística e Suporte Administrativo',
      description: 'Excelente para empresas de logística, distribuidoras e centros de distribuição. Valoriza a vivência na Solistica em romaneios e conferência.',
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
      title: 'Apresentação Expressa (Mensagem Curta)',
      description: 'Ideal para envio direto no WhatsApp de recrutadores ou no campo de mensagem de plataformas de seleção.',
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
    <div className="fixed inset-0 bg-[#1C1917]/70 z-50 overflow-y-auto px-4 py-6 sm:py-10 flex justify-center items-start print:hidden">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* LOGIN MODAL */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-[12px] overflow-hidden border border-[#E7DFD6] flex flex-col shadow-none"
        style={{ display: isAuthenticated ? 'none' : 'flex' }}
      >
        {/* Passcode Header */}
        <div className="p-6 bg-[#1C1917] text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            title="Fechar"
          >
            <X size={16} />
          </button>
          
          <div className="w-12 h-12 rounded-[12px] bg-[#881337] text-white flex items-center justify-center text-sm font-bold mx-auto mb-3 tracking-wider">
            CF
          </div>
          <span className="text-sm font-bold text-stone-300 uppercase tracking-wider block">Área Reservada</span>
          <h2 className="text-xl font-bold font-display mt-1">Acesso Administrativo</h2>
          <p className="text-sm text-stone-300 mt-2 max-w-xs mx-auto leading-relaxed">
            Digite a senha para gerenciar opções de currículo, modelos de cartas e candidaturas.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1C1917] block">Senha de Acesso</label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full bg-[#FBF7F2] border ${
                passwordError ? 'border-red-600 bg-red-50/30' : 'border-[#E7DFD6] focus:border-[#881337]'
              } rounded-[12px] px-4 py-3 text-sm text-[#1C1917] text-center tracking-widest font-mono focus:outline-none transition`}
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-red-600 font-semibold text-center mt-1">
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#881337] hover:bg-[#6e0f2c] text-white text-sm font-bold py-3 px-4 rounded-full transition cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0_#1C1917]"
          >
            Entrar
          </button>
        </form>
      </div>

      {/* AUTHENTICATED ADMIN PANEL */}
      {isAuthenticated && (
        <div
          className="relative z-10 w-full max-w-4xl bg-white rounded-[12px] overflow-hidden border border-[#E7DFD6] flex flex-col shadow-none"
        >
          {/* Panel Header */}
          <div className="p-6 bg-[#1C1917] text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              title="Fechar"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#881337] flex items-center justify-center text-white text-base font-bold">
                CF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Área Administrativa</span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full transition cursor-pointer"
                    title="Bloquear Painel"
                  >
                    Sair
                  </button>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                  Painel de Gestão e Currículo
                </h1>
              </div>
            </div>
            <p className="text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
              Personalize o currículo para exportação, acesse cartas de apresentação estruturadas e acompanhe suas candidaturas.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E7DFD6] bg-[#FBF7F2] px-4 overflow-x-auto gap-2 py-2">
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'downloads' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Printer size={15} />
              Baixar Currículo
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'letters' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <FileText size={15} />
              Modelos de Cartas
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'tracker' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Building size={15} />
              Rastrear Vagas
            </button>
            
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'ai' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Sparkles size={15} />
              Análise de Vagas
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 bg-white min-h-[460px]">
            
            {/* TAB 1: DOWNLOADS & RESUME CONFIG */}
            {activeTab === 'downloads' && (
              <div className="space-y-6">
                
                {/* Info Card */}
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] text-[#1C1917] p-4 rounded-[12px] text-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-rose-100 text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1C1917]">Configurações de Exportação do Currículo</p>
                    <p className="text-sm text-[#57534E] mt-0.5 leading-relaxed">
                      Selecione os elementos para incluir antes da impressão ou salvamento em PDF. O link oficial do portfólio web (<strong className="text-[#881337]">{PERSONAL_INFO.portfolioUrl}</strong>) e o QR Code podem ser alternados abaixo.
                    </p>
                  </div>
                </div>

                {/* Interactive Config Card */}
                <div className="bg-[#FBF7F2] p-5 rounded-[12px] border border-[#E7DFD6] space-y-4">
                  <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                    <Edit3 size={16} className="text-[#881337]" />
                    Opções de Exibição
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Toggle Photo */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showPhoto')}
                      className={`p-4 rounded-[12px] border transition cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showPhoto
                          ? 'bg-white border-[#881337]'
                          : 'bg-white border-[#E7DFD6] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Camera size={20} className={resumeConfig.showPhoto ? 'text-[#881337]' : 'text-stone-600'} />
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          resumeConfig.showPhoto ? 'bg-rose-100 text-[#881337]' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {resumeConfig.showPhoto ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1C1917]">Foto no Currículo</h4>
                      <p className="text-sm text-[#57534E] mt-1">
                        {resumeConfig.showPhoto 
                          ? 'Foto profissional exibida no cabeçalho.' 
                          : 'Currículo textual direto, sem foto.'}
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
                          className="mt-3 pt-2.5 border-t border-[#E7DFD6] flex items-center justify-between text-xs font-bold text-[#881337]"
                        >
                          <span>Formato:</span>
                          <span className="bg-[#FBF7F2] px-2 py-0.5 rounded-full border border-[#E7DFD6] hover:bg-stone-100">
                            {resumeConfig.photoShape === 'rounded' ? 'Retangular' : 'Redondo'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Toggle QR Code */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showQrCode')}
                      className={`p-4 rounded-[12px] border transition cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showQrCode
                          ? 'bg-white border-[#881337]'
                          : 'bg-white border-[#E7DFD6] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <QrIcon size={20} className={resumeConfig.showQrCode ? 'text-[#881337]' : 'text-stone-600'} />
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          resumeConfig.showQrCode ? 'bg-rose-100 text-[#881337]' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {resumeConfig.showQrCode ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1C1917]">QR Code do Portfólio</h4>
                      <p className="text-sm text-[#57534E] mt-1">
                        {resumeConfig.showQrCode 
                          ? 'Código escaneável para acesso ao portfólio web.' 
                          : 'Oculta o QR Code do cabeçalho.'}
                      </p>
                    </div>

                    {/* Toggle Portfolio Link */}
                    <div 
                      onClick={() => handleUpdateResumeConfig('showPortfolioLink')}
                      className={`p-4 rounded-[12px] border transition cursor-pointer flex flex-col justify-between ${
                        resumeConfig.showPortfolioLink
                          ? 'bg-white border-[#881337]'
                          : 'bg-white border-[#E7DFD6] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Globe size={20} className={resumeConfig.showPortfolioLink ? 'text-[#881337]' : 'text-stone-600'} />
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          resumeConfig.showPortfolioLink ? 'bg-rose-100 text-[#881337]' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {resumeConfig.showPortfolioLink ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1C1917]">Link do Portfólio</h4>
                      <p className="text-sm text-[#57534E] mt-1">
                        {resumeConfig.showPortfolioLink 
                          ? 'Exibe o link no bloco de contatos.' 
                          : 'Oculta o link na área de contato.'}
                      </p>
                    </div>

                  </div>

                  {/* QR Code Preview & Direct Link */}
                  <div className="bg-white p-4 rounded-[12px] border border-[#E7DFD6] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {qrCodeUrl && (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-14 h-14 rounded-[8px] border border-[#E7DFD6] p-0.5 bg-white shrink-0" 
                        />
                      )}
                      <div>
                        <span className="text-xs font-bold text-[#881337] uppercase tracking-wider block">
                          Endereço do Portfólio:
                        </span>
                        <a 
                          href={PERSONAL_INFO.portfolioUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sm font-bold text-[#1C1917] hover:text-[#881337] flex items-center gap-1 hover:underline"
                        >
                          {PERSONAL_INFO.portfolioUrl}
                          <ExternalLink size={13} className="text-[#881337]" />
                        </a>
                        <p className="text-xs text-[#57534E] mt-0.5">
                          Acessível por leitura de QR Code ou clique direto no documento PDF.
                        </p>
                      </div>
                    </div>

                    <a
                      href={PERSONAL_INFO.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-white hover:bg-stone-50 text-[#1C1917] border border-[#E7DFD6] rounded-full text-sm font-semibold transition whitespace-nowrap"
                    >
                      Abrir Portfólio
                    </a>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center sm:justify-start">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="px-5 py-2.5 bg-[#047857] hover:bg-[#036045] text-white rounded-full text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0_#1C1917]"
                    >
                      <Eye size={15} />
                      Visualizar Currículo com estas Opções
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
                      className="px-5 py-2.5 bg-white hover:bg-stone-50 text-[#1C1917] rounded-full text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 border border-[#E7DFD6]"
                    >
                      <Printer size={15} className="text-[#881337]" />
                      Imprimir / Salvar PDF
                    </button>
                  </div>

                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FBF7F2] rounded-[12px] border border-[#E7DFD6] text-sm text-[#57534E] space-y-1">
                    <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Camera size={15} className="text-[#881337]" />
                      Quando incluir foto
                    </span>
                    <p className="text-sm leading-relaxed">
                      Indicado para recepção presencial, secretariado, clínicas e posições em que o contato visual inicial faça parte da rotina de acolhimento.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FBF7F2] rounded-[12px] border border-[#E7DFD6] text-sm text-[#57534E] space-y-1">
                    <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                      <FileText size={15} className="text-[#881337]" />
                      Quando omitir foto
                    </span>
                    <p className="text-sm leading-relaxed">
                      Recomendado para portais de triagem automatizada (Gupy e plataformas corporativas) ou quando a empresa orienta formato exclusivamente textual.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COVER LETTERS */}
            {activeTab === 'letters' && (
              <div className="space-y-6">
                
                {/* Intro notice */}
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] text-[#1C1917] p-4 rounded-[12px] text-sm flex items-start gap-3">
                  <Heart className="text-[#881337] shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-sm text-[#1C1917]">Modelos de Cartas de Apresentação</p>
                    <p className="text-sm text-[#57534E] mt-0.5 leading-relaxed">
                      Textos redigidos com base na sua experiência em rotinas administrativas e atendimento. Preencha os campos abaixo para personalizar empresa, destinatário e cargo antes de copiar.
                    </p>
                  </div>
                </div>

                {/* Live Personalizer inputs */}
                <div className="bg-[#FBF7F2] p-4 sm:p-5 rounded-[12px] border border-[#E7DFD6]">
                  <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block mb-3">
                    Personalização Automática dos Modelos (Opcional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase block mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Clínica Odontológica Sorrir"
                        value={letterCompany}
                        onChange={(e) => setLetterCompany(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase block mb-1">
                        Destinatário / Recrutador
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Dra. Mariana / Equipe de RH"
                        value={letterRecruiter}
                        onChange={(e) => setLetterRecruiter(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase block mb-1">
                        Cargo Desejado
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Recepcionista de Clínica"
                        value={letterRole}
                        onChange={(e) => setLetterRole(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                  </div>
                </div>

                {/* Letters Catalog */}
                <div className="space-y-4">
                  {rawLetters.map((letter) => {
                    const finalLetterText = letter.template(letterCompany, letterRecruiter, letterRole);
                    return (
                      <div key={letter.id} className="bg-white p-5 rounded-[12px] border border-[#E7DFD6] flex flex-col">
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                          <div>
                            <span className="inline-block text-xs font-semibold text-[#881337] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase mb-1">
                              {letter.badge}
                            </span>
                            <h3 className="text-base font-bold text-[#1C1917]">{letter.title}</h3>
                            <p className="text-sm text-[#57534E] mt-0.5">{letter.description}</p>
                          </div>
                          <button
                            onClick={() => handleCopyText(finalLetterText, letter.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                              copiedId === letter.id 
                                ? 'bg-[#047857] text-white border-[#047857]' 
                                : 'bg-white text-[#1C1917] border-[#E7DFD6] hover:bg-stone-50'
                            }`}
                          >
                            {copiedId === letter.id ? (
                              <>
                                <Check size={13} />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copiar Texto
                              </>
                            )}
                          </button>
                        </div>
                        
                        <pre className="mt-3 bg-[#FBF7F2] p-4 rounded-[8px] border border-[#E7DFD6] text-sm text-[#1C1917] leading-relaxed font-sans whitespace-pre-line select-all max-h-56 overflow-y-auto">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#57534E] uppercase tracking-wider block">Total de Vagas</span>
                    <span className="text-2xl font-bold text-[#1C1917]">{applications.length}</span>
                  </div>
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#881337] uppercase tracking-wider block">Entrevistas</span>
                    <span className="text-2xl font-bold text-[#881337]">
                      {applications.filter(a => a.status === 'Entrevista').length}
                    </span>
                  </div>
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#047857] uppercase tracking-wider block">Aprovadas</span>
                    <span className="text-2xl font-bold text-[#047857]">
                      {applications.filter(a => a.status === 'Aprovado').length}
                    </span>
                  </div>
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#57534E] uppercase tracking-wider block">Taxa de Resposta</span>
                    <span className="text-2xl font-bold text-[#1C1917]">
                      {applications.length > 0 
                        ? `${Math.round((applications.filter(a => a.status !== 'Enviado').length / applications.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>

                {/* Add New Application Form */}
                <div className="bg-[#FBF7F2] p-5 rounded-[12px] border border-[#E7DFD6]">
                  <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5 mb-4">
                    <Plus size={16} className="text-[#881337]" />
                    Cadastrar Nova Candidatura
                  </h3>
                  <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-[#57534E] mb-1 uppercase">Empresa</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Clínica São Camilo"
                        value={newApp.company}
                        onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                        className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-[#57534E] mb-1 uppercase">Cargo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Recepcionista de Clínica"
                        value={newApp.role}
                        onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                        className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-[#57534E] mb-1 uppercase">Segmento</label>
                      <select
                        value={newApp.segment}
                        onChange={(e) => setNewApp({ ...newApp, segment: e.target.value })}
                        className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
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
                      className="bg-[#047857] hover:bg-[#036045] text-white text-sm font-semibold py-2 px-4 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 h-[38px] shadow-[2px_2px_0_#1C1917]"
                    >
                      Adicionar
                    </button>
                  </form>
                </div>

                {/* Applications List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#1C1917]">Candidaturas Cadastradas</h3>
                  {applications.length === 0 ? (
                    <p className="text-sm text-[#57534E] py-6 text-center">Nenhuma candidatura cadastrada ainda.</p>
                  ) : (
                    <div className="overflow-x-auto border border-[#E7DFD6] rounded-[12px]">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#FBF7F2] text-[#57534E] font-bold border-b border-[#E7DFD6] uppercase tracking-wider text-xs">
                          <tr>
                            <th className="p-3.5">Empresa</th>
                            <th className="p-3.5">Cargo / Segmento</th>
                            <th className="p-3.5">Data</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7DFD6]">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-[#FBF7F2]/50">
                              <td className="p-3.5 font-bold text-[#1C1917]">{app.company}</td>
                              <td className="p-3.5">
                                <div>{app.role}</div>
                                <span className="text-xs text-[#57534E]">{app.segment}</span>
                              </td>
                              <td className="p-3.5 text-[#57534E]">{app.date}</td>
                              <td className="p-3.5">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                                    app.status === 'Enviado' ? 'bg-stone-100 border-[#E7DFD6] text-[#1C1917]' :
                                    app.status === 'Entrevista' ? 'bg-rose-50 border-rose-300 text-[#881337]' :
                                    app.status === 'Aprovado' ? 'bg-emerald-50 border-emerald-300 text-[#047857]' :
                                    'bg-stone-50 border-[#E7DFD6] text-[#57534E]'
                                  }`}
                                >
                                  <option value="Enviado">Enviado</option>
                                  <option value="Entrevista">Entrevista</option>
                                  <option value="Aprovado">Aprovado</option>
                                  <option value="Rejeitado">Rejeitado</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteApp(app.id)}
                                  className="p-1.5 text-rose-800 hover:bg-rose-50 rounded-full transition cursor-pointer"
                                  title="Remover"
                                >
                                  <Trash2 size={15} />
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
                
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] text-[#1C1917] p-4 rounded-[12px] text-sm flex items-start gap-2.5">
                  <Sparkles className="text-[#881337] shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-sm text-[#1C1917]">Análise de Compatibilidade de Vagas</p>
                    <p className="text-sm text-[#57534E] mt-0.5">
                      Indique o segmento ou requisitos da vaga. O sistema avalia a aderência do currículo e gera recomendações para a entrevista.
                    </p>
                  </div>
                </div>

                {/* Form Input */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#FBF7F2] p-5 rounded-[12px] border border-[#E7DFD6]">
                  <div className="md:col-span-4 flex flex-col">
                    <label className="text-xs font-semibold text-[#57534E] mb-1.5 uppercase">Segmento / Cargo</label>
                    <select
                      value={aiSegment}
                      onChange={(e) => setAiSegment(e.target.value)}
                      className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                    >
                      <option value="Recepcionista Clínico">Recepcionista Clínico</option>
                      <option value="Assistente Administrativo Corporativo">Assistente Administrativo</option>
                      <option value="Atendimento em Salão de Beleza">Atendimento de Beleza / Estética</option>
                      <option value="Auxiliar de Logística e Cargas">Auxiliar Logístico / Administrativo</option>
                      <option value="Auxiliar de Escritório Geral">Auxiliar de Escritório Geral</option>
                      <option value="Outro">Outro segmento...</option>
                    </select>

                    {aiSegment === 'Outro' && (
                      <input
                        type="text"
                        required
                        placeholder="Informe o cargo..."
                        value={aiCustomSegment}
                        onChange={(e) => setAiCustomSegment(e.target.value)}
                        className="mt-3 bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    )}
                  </div>

                  <div className="md:col-span-8 flex flex-col">
                    <label className="text-xs font-semibold text-[#57534E] mb-1.5 uppercase">Requisitos da Vaga (Opcional)</label>
                    <textarea
                      rows={3}
                      placeholder="Insira detalhes ou requisitos adicionais da vaga para refinar a análise..."
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                      className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337] resize-none"
                    />
                  </div>

                  <div className="md:col-span-12 flex justify-end">
                    <button
                      onClick={handleAiAnalyze}
                      disabled={isAiLoading}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#047857] hover:bg-[#036045] disabled:bg-stone-300 text-white rounded-full text-sm font-semibold transition cursor-pointer shadow-[2px_2px_0_#1C1917]"
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" />
                          <span>Processando análise...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Verificar Compatibilidade</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Loading State */}
                {isAiLoading && (
                  <div className="p-8 text-center flex flex-col items-center justify-center border border-[#E7DFD6] bg-[#FBF7F2] rounded-[12px]">
                    <div className="w-8 h-8 rounded-full border-2 border-[#881337] border-t-transparent animate-spin mb-3" />
                    <h3 className="text-sm font-bold text-[#1C1917]">Processando análise curricular</h3>
                    <p className="text-sm text-[#57534E] mt-1">
                      {motivationalMessage}
                    </p>
                  </div>
                )}

                {/* Error block */}
                {aiError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm">
                    {aiError}
                  </div>
                )}

                {/* AI Output Result Card */}
                {aiResult && !isAiLoading && (
                  <div className="bg-white rounded-[12px] border border-[#E7DFD6] p-6 space-y-6">
                    {/* Score & Header info */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E7DFD6]">
                      <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-full bg-[#FBF7F2] border-2 border-[#881337]">
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-extrabold text-[#881337] leading-none">{aiResult.matchPercentage}%</span>
                          <span className="text-[10pt] font-semibold text-[#57534E] uppercase tracking-wider mt-0.5">Match</span>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-left space-y-1">
                        <span className="text-xs font-semibold text-[#047857] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                          Análise Concluída
                        </span>
                        <h4 className="text-lg font-bold font-display text-[#1C1917] mt-1">
                          Aderência: <span className="text-[#881337]">{aiSegment === 'Outro' ? aiCustomSegment : aiSegment}</span>
                        </h4>
                        <p className="text-sm text-[#57534E] leading-relaxed">
                          "{aiResult.justification}"
                        </p>
                      </div>
                    </div>

                    {/* Strengths & Tips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Strengths */}
                      <div className="space-y-2 bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6]">
                        <h5 className="text-xs font-bold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={15} />
                          Diferenciais Identificados
                        </h5>
                        <ul className="space-y-1.5 text-sm text-[#57534E]">
                          {aiResult.strengths?.map((str: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#881337] font-bold mt-0.5">·</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interview Tips */}
                      <div className="space-y-2 bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6]">
                        <h5 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                          <Award size={15} />
                          Pontos para a Entrevista
                        </h5>
                        <ul className="space-y-1.5 text-sm text-[#57534E]">
                          {aiResult.pitchTips?.map((tip: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#047857] font-bold mt-0.5">·</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* AI Generated Pitch Intro */}
                    <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#57534E] uppercase tracking-wider">
                          Sugestão de Apresentação
                        </span>
                        <button
                          onClick={() => handleCopyText(aiResult.customIntro, 'ai-pitch')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition cursor-pointer border ${
                            copiedId === 'ai-pitch' 
                              ? 'bg-[#047857] text-white border-[#047857]' 
                              : 'bg-white text-[#1C1917] border-[#E7DFD6] hover:bg-stone-50'
                          }`}
                        >
                          {copiedId === 'ai-pitch' ? (
                            <>
                              <Check size={12} />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-sm text-[#57534E] leading-relaxed font-sans whitespace-pre-line select-all bg-white p-3 rounded-[8px] border border-[#E7DFD6]">
                        {aiResult.customIntro}
                      </pre>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer info banner */}
          <div className="p-4 bg-[#FBF7F2] border-t border-[#E7DFD6] flex justify-between items-center text-xs text-[#57534E]">
            <span>Carolina Ferreira da Costa</span>
            <span>Fortaleza e Região</span>
          </div>

        </div>
      )}
    </div>
  );
}
