import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Briefcase, Plus, Copy, Check, FileText, Sparkles, Trash2, 
  Calendar, Eye, Send, Building, ShieldCheck, Heart, Award, RefreshCw, CheckCircle, ExternalLink
} from 'lucide-react';
import { PERSONAL_INFO } from '../data';

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
    company: 'Exemplo de Empresa S.A.',
    role: 'Recepcionista Administrativa',
    segment: 'Recepção',
    date: '14/07/2026',
    status: 'Enviado',
    notes: 'Vaga enviada pelo LinkedIn. Exige conhecimentos em planilhas.'
  }
];

export default function AdminPanel({ isOpen, onClose, onOpenResume }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'tracker' | 'letters' | 'ai' | 'downloads'>('tracker');
  const [applications, setApplications] = useState<Application[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Authentication state (using sessionStorage so she stays logged in during the active tab session)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('carol_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

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

    // Reset form
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
      "Analisando sua experiência na Solistica... 📦",
      "Valorizando suas competências como Lash Designer... 🌸",
      "Cruzando seus cursos de Assistente Administrativo e Informática... 💻",
      "Formatando a melhor estratégia de abordagem... ✨",
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
      setAiError('Ocorreu um erro ao consultar o assistente de IA. Mas não desanime! Continue focada que a vaga é sua!');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Cover Letter pre-written texts
  const coverLetters = [
    {
      id: 'let-1',
      title: '📞 Perfil Recepcionista / Recepção Administrativa',
      description: 'Ideal para vagas de recepcionista em clínicas, escritórios corporativos, transportadoras ou consultórios. Foco em organização e no seu histórico brilhante na Solistica.',
      text: `Prezada equipe de Recrutamento,

Gostaria de manifestar meu forte interesse na vaga de Recepcionista. Minha trajetória profissional é marcada pela excelência no atendimento ao cliente e suporte administrativo de alta qualidade, conforme demonstrado em minha atuação na Solistica, onde gerenciei recepção, cadastros em sistemas de CRM, emissão e conferência de notas fiscais, além de apoio integral às rotinas financeiras e de arquivamento.

Possuo formação como Assistente Administrativo e Informática Básica pelo IEP, o que me confere domínio das ferramentas do Pacote Office (Word, Excel) e Google Docs. Sou uma pessoa extremamente organizada, comunicativa e dedicada a acolher clientes e parceiros com simpatia e profissionalismo.

Estou à disposição para uma entrevista e anexo meu currículo detalhado.

Atenciosamente,
Ana Carolina Ferreira da Costa
Telefone: (85) 98597-6871 | carolcilios01@gmail.com`
    },
    {
      id: 'let-2',
      title: '📝 Perfil Assistente / Auxiliar Administrativo',
      description: 'Perfeito para vagas administrativas gerais que requerem controle de rotinas financeiras, emissão de notas fiscais, planilhas e digitação ágil.',
      text: `Prezados,

Escrevo para me candidatar à vaga de Assistente Administrativo / Auxiliar Administrativo. Com uma sólida base teórica obtida no curso de Assistente Administrativo e aplicação prática em ambiente corporativo de grande porte, estou capacitada para otimizar os fluxos organizacionais de sua empresa.

Na Solistica, desenvolvi atividades de grande responsabilidade administrativa e financeira, incluindo a emissão, lançamento e conferência de notas fiscais, recebimento de pagamentos com controle de fluxo de caixa, além de auditoria de documentos operacionais. Tenho facilidade com planilhas de Excel e manuseio rápido de sistemas digitais.

Meus diferenciais são a atenção aos detalhes, o comprometimento com prazos e a organização rigorosa das demandas de escritório.

Agradeço a atenção e coloco-me à disposição para um contato pessoal.

Cordialmente,
Ana Carolina Ferreira da Costa
Telefone: (85) 98597-6871 | carolcilios01@gmail.com`
    },
    {
      id: 'let-3',
      title: '🌸 Atendimento ao Cliente / Clínicas de Estética & Beleza',
      description: 'Excelente para recepção em consultórios estéticos, recepção de salões e estúdios de beleza. Valoriza muito o seu lado empreendedor e autônomo na área de Lash Designer.',
      text: `Olá!

Gostaria de me candidatar à vaga de Atendimento ao Cliente / Recepção Comercial. Atuo como profissional autônoma no segmento de beleza e bem-estar (design de sobrancelhas e lash designer), o que me capacitou profundamente em relacionamento personalizado, fidelização, gestão autônoma de agenda de clientes e atendimento comercial rápido e proativo via WhatsApp e redes sociais.

Adicionalmente, possuo experiência administrativa em rotinas de faturamento e notas fiscais adquirida na Solistica, unindo perfeitamente a empatia no trato com o público ao rigor técnico necessário para manter as operações do estabelecimento em ordem.

Acredito que posso receber seus clientes com o máximo de carinho, dedicação e organização que o seu negócio merece.

Um abraço,
Ana Carolina Ferreira da Costa
Telefone: (85) 98597-6871 | carolcilios01@gmail.com`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 overflow-y-auto px-4 py-6 sm:py-10 flex justify-center items-start">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
        style={{ display: isAuthenticated ? 'none' : 'flex' }}
      >
        {/* Passcode Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            title="Fechar"
          >
            <X size={16} />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-inner border border-blue-500/30">
            🔑
          </div>
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">Área Restrita</span>
          <h2 className="text-lg font-bold font-display mt-1">Acesso para Carol</h2>
          <p className="text-[11px] text-slate-400 mt-1.5 max-w-xs mx-auto">
            Este painel é confidencial. Por favor, digite sua senha de acesso exclusiva para gerenciar suas vagas.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Senha de Acesso</label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full bg-slate-50 border ${
                passwordError ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-blue-900'
              } rounded-2xl px-4 py-3 text-sm text-slate-800 text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all`}
              autoFocus
            />
            {passwordError && (
              <p className="text-[11px] text-rose-500 font-bold text-center mt-1 animate-pulse">
                ❌ Senha incorreta! Tente novamente, Carol.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-widest py-3 px-4 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            Confirmar e Entrar
          </button>
        </form>
      </motion.div>

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
        >
          {/* Panel Header */}
          <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
              title="Fechar"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white text-xl font-bold">
                AC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Área Reservada</span>
                  <button 
                    onClick={handleLogout}
                    className="text-[9px] font-bold bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded transition uppercase cursor-pointer"
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
            <p className="text-xs text-blue-100/80 mt-2 max-w-2xl">
              Sua central secreta para rastrear candidaturas, copiar modelos de cartas e qualificar seu currículo em segmentos de mercado usando inteligência artificial!
            </p>
          </div>

          {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-4 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracker' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building size={14} />
            Rastrear Vagas
          </button>
          
          <button
            onClick={() => setActiveTab('letters')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'letters' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={14} />
            Cartas Prontas
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            Analisar Compatibilidade (IA)
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'downloads' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye size={14} />
            Baixar Currículo
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-white min-h-[450px]">
          
          {/* TAB 1: TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              
              {/* Tracker Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Candidaturas</span>
                  <span className="text-2xl font-bold text-slate-800">{applications.length}</span>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Entrevistas Agendadas</span>
                  <span className="text-2xl font-bold text-blue-900">
                    {applications.filter(a => a.status === 'Entrevista').length}
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Aprovadas / Sucesso</span>
                  <span className="text-2xl font-bold text-emerald-800">
                    {applications.filter(a => a.status === 'Aprovado').length}
                  </span>
                </div>
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-center">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Taxa de Resposta</span>
                  <span className="text-2xl font-bold text-indigo-900">
                    {applications.length > 0 
                      ? `${Math.round((applications.filter(a => a.status !== 'Enviado').length / applications.length) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>

              {/* Add New Application Form */}
              <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-4">
                  <Plus size={16} className="text-blue-900" />
                  Cadastrar Nova Candidatura
                </h3>
                <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Hospital Unimed"
                      value={newApp.company}
                      onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Cargo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Recepcionista de Clínica"
                      value={newApp.role}
                      onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Segmento</label>
                    <select
                      value={newApp.segment}
                      onChange={(e) => setNewApp({ ...newApp, segment: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-900"
                    >
                      <option value="Recepção">Recepção</option>
                      <option value="Administrativo">Administrativo</option>
                      <option value="Atendimento">Atendimento ao Cliente</option>
                      <option value="Outro">Outro segmento</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-850 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 h-[34px]"
                  >
                    Adicionar
                  </button>
                </form>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Minha Lista de Candidaturas</h3>
                {applications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">Nenhuma candidatura cadastrada ainda. Use o formulário acima para rastrear sua busca!</p>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">Empresa</th>
                          <th className="p-3.5">Cargo / Segmento</th>
                          <th className="p-3.5">Data de Envio</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-bold text-slate-800">{app.company}</td>
                            <td className="p-3.5">
                              <div>{app.role}</div>
                              <span className="text-[10px] text-slate-400 font-semibold">{app.segment}</span>
                            </td>
                            <td className="p-3.5 text-slate-500">{app.date}</td>
                            <td className="p-3.5">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                  app.status === 'Enviado' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                  app.status === 'Entrevista' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                  app.status === 'Aprovado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                  'bg-slate-50 border-slate-200 text-slate-600'
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
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
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

          {/* TAB 2: LETTERS */}
          {activeTab === 'letters' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 text-blue-950 p-4 rounded-2xl text-xs flex items-start gap-2.5">
                <Heart className="text-blue-900 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold">Textos Prontos de Apresentação:</p>
                  <p className="text-slate-600 mt-0.5">
                    Estes textos foram especialmente redigidos para as suas competências reais. Basta escolher o perfil da vaga, copiar com um clique e colar no e-mail ou no chat do recrutador!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {coverLetters.map((letter) => (
                  <div key={letter.id} className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{letter.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{letter.description}</p>
                      </div>
                      <button
                        onClick={() => handleCopyText(letter.text, letter.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                          copiedId === letter.id 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {copiedId === letter.id ? (
                          <>
                            <Check size={12} />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copiar Carta
                          </>
                        )}
                      </button>
                    </div>
                    
                    <pre className="mt-2 bg-white p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-sans whitespace-pre-line select-all max-h-48 overflow-y-auto">
                      {letter.text}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI ANALYZER */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 p-4 rounded-2xl text-xs flex items-start gap-2.5">
                <Sparkles className="text-indigo-900 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold">Otimizador e Validador de Vagas Inteligente:</p>
                  <p className="text-slate-600 mt-0.5">
                    Digite o segmento da vaga onde quer se candidatar. Nosso assistente de IA irá ler seu currículo real e gerar uma análise completa de adequação e as melhores dicas para a entrevista!
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/50 p-5 rounded-3xl border border-slate-200">
                <div className="md:col-span-4 flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5">Segmento / Cargo da Vaga</label>
                  <select
                    value={aiSegment}
                    onChange={(e) => setAiSegment(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-900 shadow-sm"
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
                      className="mt-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-900 shadow-sm"
                    />
                  )}
                </div>

                <div className="md:col-span-8 flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5">Requisitos ou Descrição da Vaga (Opcional)</label>
                  <textarea
                    rows={3}
                    placeholder="Cole aqui os detalhes da vaga (requisitos, benefícios, etc) se quiser uma análise ainda mais profunda!"
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-900 shadow-sm resize-none"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end">
                  <button
                    onClick={handleAiAnalyze}
                    disabled={isAiLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-blue-900/10"
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
                    className="p-12 text-center flex flex-col items-center justify-center border border-slate-200 bg-slate-50 rounded-3xl"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
                      <div className="absolute w-12 h-12 rounded-full border-4 border-blue-900 border-t-transparent animate-spin" />
                      <Sparkles size={20} className="text-blue-900 animate-bounce" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mt-4">Nossa IA está trabalhando por você...</h3>
                    <p className="text-xs text-blue-900 font-semibold mt-2 animate-pulse bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                      {motivationalMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error block */}
              {aiError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-semibold">
                  {aiError}
                </div>
              )}

              {/* AI Output Result Card */}
              {aiResult && !isAiLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg p-6 space-y-6"
                >
                  {/* Score & Header info */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center rounded-full bg-slate-50 border-4 border-slate-100">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="#1e3a8a" strokeWidth="8" fill="transparent" 
                          strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * aiResult.matchPercentage) / 100}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-blue-900 leading-none">{aiResult.matchPercentage}%</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Match</span>
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left space-y-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        Análise Realizada com Sucesso!
                      </span>
                      <h4 className="text-base font-bold font-display text-slate-900 mt-1">
                        Compatibilidade com: <span className="text-blue-900">{aiSegment === 'Outro' ? aiCustomSegment : aiSegment}</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{aiResult.justification}"
                      </p>
                    </div>
                  </div>

                  {/* Strengths & Tips Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Strengths */}
                    <div className="space-y-3 bg-blue-50/20 p-4 rounded-2xl border border-blue-50">
                      <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck size={15} className="text-blue-900" />
                        Seus Diferenciais Competitivos
                      </h5>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {aiResult.strengths?.map((str: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-900 font-bold mt-0.5">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interview Tips */}
                    <div className="space-y-3 bg-amber-50/20 p-4 rounded-2xl border border-amber-50">
                      <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={15} className="text-amber-700" />
                        O que Destaque na Entrevista
                      </h5>
                      <ul className="space-y-2 text-xs text-slate-600">
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
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Apresentação Customizada Gerada pela IA
                      </span>
                      <button
                        onClick={() => handleCopyText(aiResult.customIntro, 'ai-pitch')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                          copiedId === 'ai-pitch' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
                    <pre className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line select-all bg-white p-4 rounded-xl border border-slate-100 italic">
                      {aiResult.customIntro}
                    </pre>
                  </div>

                </motion.div>
              )}

            </div>
          )}

          {/* TAB 4: DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center shadow-inner">
                <FileText size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Visualizar e Baixar Currículo Formatado
                </h3>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed mx-auto">
                  Abaixo você pode abrir o painel de visualização completo do seu currículo. Ele é otimizado para salvar em PDF de forma perfeita ou imprimir direto!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                <button
                  onClick={() => {
                    onClose();
                    onOpenResume();
                  }}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition shadow-lg shadow-blue-900/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye size={15} />
                  Visualizar Currículo de Novo
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenResume();
                    setTimeout(() => {
                      const printBtn = document.getElementById('print-btn');
                      if (printBtn) printBtn.click();
                    }, 500);
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full transition cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
                >
                  <CheckCircle size={15} className="text-slate-500" />
                  Imprimir / Salvar PDF Direto
                </button>
              </div>

              {/* Small tip box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left max-w-md text-[11px] text-slate-500 leading-normal">
                <p className="font-bold text-slate-700 mb-1">Dica de Sucesso:</p>
                Mantenha seu currículo sempre atualizado. Toda vez que concluir um novo curso na área administrativa ou de informática, você pode incluí-lo na sua central!
              </div>
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          <span>Suíte de Sucesso Profissional v2.0</span>
          <span className="flex items-center gap-1">
            Feito com <Heart size={10} className="text-rose-500 fill-rose-500" /> para Carol
          </span>
        </div>

      </motion.div>
      )}
    </div>
  );
}
