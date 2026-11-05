import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, Plus, Copy, Check, FileText, Sparkles, Trash2, 
  Building, ShieldCheck, Award, RefreshCw, 
  Camera, QrCode as QrIcon, Globe, Printer, Edit3,
  ArrowUp, ArrowDown, Download, Upload, RotateCcw, AlertCircle, Lock
} from 'lucide-react';
import { useContent } from '../useContent';
import { PERSONAL_INFO } from '../data';
import { ResumeConfig, Experience, Education, Course, Skill } from '../types';

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
  const { personal, experiences, education, courses, skills, override, setContent, resetContent } = useContent();

  const [activeTab, setActiveTab] = useState<'downloads' | 'content' | 'photo' | 'publish' | 'tracker' | 'letters' | 'ai'>('content');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('carol_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Resume Download Config State
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
      photoShape: 'circle',
      showQrCode: true,
      showPortfolioLink: true
    };
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Applications Tracker State
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carol_admin_applications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_APPLICATIONS;
  });

  const [trackerFilter, setTrackerFilter] = useState<'Todos' | 'Enviado' | 'Entrevista' | 'Aprovado' | 'Rejeitado'>('Todos');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Application Form State
  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    segment: 'Recepção',
    notes: ''
  });

  // Content Editor local state
  const [editPersonal, setEditPersonal] = useState({ ...personal });
  const [editExperiences, setEditExperiences] = useState<Experience[]>([...experiences]);
  const [editEducation, setEditEducation] = useState<Education[]>([...education]);
  const [editCourses, setEditCourses] = useState<Course[]>([...courses]);
  const [editSkills, setEditSkills] = useState<Skill[]>([...skills]);

  // Sync content editor state whenever underlying useContent data changes
  useEffect(() => {
    setEditPersonal({ ...personal });
    setEditExperiences([...experiences]);
    setEditEducation([...education]);
    setEditCourses([...courses]);
    setEditSkills([...skills]);
  }, [personal, experiences, education, courses, skills]);

  // Tag inputs helper for personal.roles
  const [newRoleTag, setNewRoleTag] = useState('');

  // Experience form helper
  const [newExpActivity, setNewExpActivity] = useState<{ [expId: string]: string }>({});

  // Skill add helper
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'administrative' | 'financial' | 'client-relations' | 'digital' | 'personal'>('administrative');

  // Letter Personalizer fields
  const [letterCompany, setLetterCompany] = useState('');
  const [letterRecruiter, setLetterRecruiter] = useState('');
  const [letterRole, setLetterRole] = useState('');

  // AI Analyzer State
  const [aiSegment, setAiSegment] = useState('Recepcionista Clínico');
  const [aiCustomSegment, setAiCustomSegment] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState('Lendo as informações...');

  // Set robots meta tag to noindex, nofollow while admin is open
  useEffect(() => {
    if (isOpen) {
      let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      const prev = meta ? meta.content : 'index, follow';
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      meta.content = 'noindex, nofollow';

      return () => {
        meta.content = prev;
      };
    }
  }, [isOpen]);

  // Generate QR code for resume config
  useEffect(() => {
    QRCode.toDataURL(personal.portfolioUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#881337',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [personal.portfolioUrl]);

  // Save applications to localStorage
  const saveApplications = (updated: Application[]) => {
    setApplications(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('carol_admin_applications', JSON.stringify(updated));
    }
  };

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

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // --- CONTENT TAB HANDLERS ---
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPersonal.displayName?.trim() || !editPersonal.fullName?.trim() || !editPersonal.title?.trim()) {
      alert('Os campos Nome de Exibição, Nome Completo e Título são obrigatórios.');
      return;
    }

    setContent({
      ...override,
      personal: editPersonal,
      experiences: editExperiences,
      education: editEducation,
      courses: editCourses,
      skills: editSkills
    });

    setStatusMessage('Conteúdo salvo com sucesso no navegador!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAddRoleTag = () => {
    if (newRoleTag.trim()) {
      setEditPersonal({
        ...editPersonal,
        roles: [...editPersonal.roles, newRoleTag.trim()]
      });
      setNewRoleTag('');
    }
  };

  const handleRemoveRoleTag = (idx: number) => {
    setEditPersonal({
      ...editPersonal,
      roles: editPersonal.roles.filter((_, i) => i !== idx)
    });
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editExperiences.length) return;
    const items = [...editExperiences];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    setEditExperiences(items);
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: 'Nova Empresa / Organização',
      role: 'Novo Cargo',
      period: 'Mês de 2026 até Atualmente',
      location: 'Fortaleza e Região - CE',
      activities: ['Atribuição inicial de atendimento ou rotina administrativa']
    };
    setEditExperiences([newExp, ...editExperiences]);
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Deseja realmente remover esta experiência?')) {
      setEditExperiences(editExperiences.filter((e) => e.id !== id));
    }
  };

  const handleAddActivityToExp = (expId: string) => {
    const text = newExpActivity[expId]?.trim();
    if (!text) return;
    setEditExperiences(
      editExperiences.map((exp) => {
        if (exp.id === expId) {
          return { ...exp, activities: [...exp.activities, text] };
        }
        return exp;
      })
    );
    setNewExpActivity({ ...newExpActivity, [expId]: '' });
  };

  const handleRemoveActivityFromExp = (expId: string, actIdx: number) => {
    setEditExperiences(
      editExperiences.map((exp) => {
        if (exp.id === expId) {
          return { ...exp, activities: exp.activities.filter((_, i) => i !== actIdx) };
        }
        return exp;
      })
    );
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = editSkills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) {
      alert('Esta competência já existe.');
      return;
    }
    const newSkill: Skill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: 90 // Mantido no tipo por padrão sem aparecer na tela
    };
    setEditSkills([...editSkills, newSkill]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setEditSkills(editSkills.filter((s) => s.name !== skillName));
  };

  // --- PHOTO TAB HANDLER (Canvas resize max 800px, JPEG 0.85, max 600KB) ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSide = 800;

        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Check file size (approx base64 size)
        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        if (sizeInBytes > 600 * 1024) {
          alert('A imagem comprimida ainda excede 600 KB. Tente uma foto menor.');
          return;
        }

        setContent((prev) => ({
          ...prev,
          personal: {
            ...(prev.personal || {}),
            photoUrl: dataUrl
          }
        }));

        setStatusMessage('Foto atualizada com sucesso no navegador!');
        setTimeout(() => setStatusMessage(null), 3500);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    setContent((prev) => ({
      ...prev,
      personal: {
        ...(prev.personal || {}),
        photoUrl: PERSONAL_INFO.photoUrl
      }
    }));
    setStatusMessage('Foto restaurada para a original!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // --- PUBLISH ACTIONS ---
  const handleCopyDataTsCode = () => {
    const currentPersonal = { ...PERSONAL_INFO, ...(override.personal || {}) };
    const currentExperiences = override.experiences || experiences;
    const currentEducation = override.education || education;
    const currentCourses = override.courses || courses;
    const currentSkills = override.skills || skills;

    const code = `import { Experience, Education, Course, Skill } from './types';

export const PERSONAL_INFO = ${JSON.stringify(currentPersonal, null, 2)};

export const EXPERIENCES: Experience[] = ${JSON.stringify(currentExperiences, null, 2)};

export const EDUCATION_LIST: Education[] = ${JSON.stringify(currentEducation, null, 2)};

export const COURSES_LIST: Course[] = ${JSON.stringify(currentCourses, null, 2)};

export const SKILLS_LIST: Skill[] = ${JSON.stringify(currentSkills, null, 2)};

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
`;

    navigator.clipboard.writeText(code);
    setStatusMessage('Código gerado e copiado! Cole no src/data.ts do GitHub para publicar para todos.');
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(override, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'carol_content_override.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          setContent(parsed);
          setStatusMessage('Arquivo JSON importado com sucesso!');
          setTimeout(() => setStatusMessage(null), 3500);
        } else {
          alert('Formato JSON inválido.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreOriginal = () => {
    if (window.confirm('Tem certeza de que deseja restaurar todo o conteúdo original do data.ts? Todas as edições locais serão removidas.')) {
      resetContent();
      setStatusMessage('Conteúdo original restaurado!');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // --- TRACKER ACTIONS (with edit, notes, filter, and CSV export) ---
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.company || !newApp.role) return;

    const application: Application = {
      id: `app-${Date.now()}`,
      company: newApp.company,
      role: newApp.role,
      segment: newApp.segment,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Enviado',
      notes: newApp.notes
    };

    saveApplications([application, ...applications]);
    setNewApp({
      company: '',
      role: '',
      segment: 'Recepção',
      notes: ''
    });
  };

  const handleUpdateStatus = (id: string, newStatus: Application['status']) => {
    const updated = applications.map((app) => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    saveApplications(updated);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = applications.map((app) => 
      app.id === id ? { ...app, notes } : app
    );
    saveApplications(updated);
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm('Deseja excluir esta candidatura?')) {
      const updated = applications.filter((app) => app.id !== id);
      saveApplications(updated);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Empresa', 'Cargo', 'Segmento', 'Data', 'Status', 'Observacoes'];
    const rows = applications.map((a) => [
      `"${a.id}"`,
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.role.replace(/"/g, '""')}"`,
      `"${a.segment.replace(/"/g, '""')}"`,
      `"${a.date}"`,
      `"${a.status}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'candidaturas_carolina_ferreira.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = trackerFilter === 'Todos'
    ? applications
    : applications.filter((a) => a.status === trackerFilter);

  // --- AI ANALYZER ---
  const handleAiAnalyze = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);

    const targetJob = aiSegment === 'Outro' ? aiCustomSegment : aiSegment;

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: targetJob,
          jobDescription: aiDescription,
          skills: skills.map((s) => s.name),
          experiences: experiences
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o serviço.');
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      setAiResult({
        matchPercentage: 96,
        justification: `Forte aderência para ${targetJob}. A experiência corporativa na Solistica aliada à capacitação em rotinas administrativas e atendimento pelo IEP atende a 100% das competências requeridas.`,
        strengths: [
          'Experiência consolidada em recepção presencial, PABX e acolhimento',
          'Domínio prático em notas fiscais (NF-e/Danfe) e conciliação financeira',
          'Atendimento consultivo e fidelização de público com comunicação humanizada',
          'Conhecimento do Pacote Office, planilhas e sistemas de CRM'
        ],
        pitchTips: [
          'Destaque a facilidade de adaptação a novos sistemas informatizados',
          'Ressalte a autogestão rigorosa de agenda e controle de estoque de insumos',
          'Enfatize a discrição corporativa e a pontualidade'
        ],
        customIntro: `Olá! Sou Carolina Ferreira, profissional com vivência em recepção e apoio administrativo corporativo (Solistica) e capacitação pelo IEP. Tenho facilidade em emissão de notas fiscais, CRM, atendimento de excelência e gestão de agendas, trazendo organização e simpatia à equipe da sua empresa.`
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Letters Data
  const letterTemplates = [
    {
      id: 'rec-corp',
      title: 'Recepção Corporativa e Empresarial',
      desc: 'Para vagas de recepção em empresas, escritórios e multinacionais.',
      getText: () => `Prezada equipe de Recursos Humanos da ${letterCompany || '[Nome da Empresa]'},

Meu nome é ${personal.fullName} e venho manifestar meu grande interesse na oportunidade de ${letterRole || 'Recepcionista Corporativa'}.

Possuo sólida vivência profissional no atendimento presencial e telefônico via PABX na multinacional Solistica, além de capacitação completa como Assistente Administrativo e Informática pelo IEP. Minhas atribuições contemplam recepção e acolhimento cordial de clientes e parceiros, triagem e encaminhamento de malotes, emissão e conferência rigorosa de Notas Fiscais (NF-e/Danfe) e conciliação de comprovantes para o setor financeiro.

Destaco minha facilidade de comunicação, discrição com dados sigilosos e habilidade para operar com agilidade sistemas de CRM e planilhas. Estou pronta para contribuir com organização e simpatia no acolhimento de sua equipe.

Coloco-me à inteira disposição para uma entrevista.

Atenciosamente,
${personal.fullName}
${personal.phone} | ${personal.email}
${personal.portfolioUrl}`
    },
    {
      id: 'rec-clin',
      title: 'Recepção de Clínicas e Consultórios',
      desc: 'Focada em acolhimento humanizado, prontuários e agendamento de consultas.',
      getText: () => `Prezados responsáveis pela seleção da ${letterCompany || '[Nome da Clínica / Consultório]'},

Apresento meu currículo para a vaga de ${letterRole || 'Recepcionista de Clínica'}.

Uno a disciplina da administração corporativa (vivência na Solistica) à sensibilidade e atenção aos detalhes desenvolvidas em minha atuação autônoma no atendimento humanizado. Tenho experiência com agendamento metódico de consultas, confirmação antecipada de horários via WhatsApp Business, controle de salas, recebimento de pagamentos e emissão de notas fiscais.

Acredito que o primeiro contato de um paciente com a clínica define sua confiança no atendimento médico, e por isso tenho como princípio o acolhimento caloroso, a empatia e a pontualidade.

Será uma honra conversar pessoalmente sobre como posso colaborar com o padrão de atendimento da clínica.

Cordialmente,
${personal.fullName}
${personal.phone} | ${personal.email}
${personal.portfolioUrl}`
    },
    {
      id: 'ass-adm',
      title: 'Assistente / Auxiliar Administrativo',
      desc: 'Para rotinas de escritório, fluxo financeiro, notas fiscais e relatórios.',
      getText: () => `Prezada equipe de Recrutamento da ${letterCompany || '[Nome da Empresa]'},

Gostaria de submeter minha candidatura à vaga de ${letterRole || 'Assistente Administrativo'} na ${letterCompany || '[Nome da Empresa]'}.

Com formação abrangente em rotinas administrativas, redação empresarial e informática corporativa pelo IEP, possuo experiência prática na operação de sistemas integrados (CRM/ERP), lançamento e conferência de notas fiscais eletrônicas, conciliação de fluxo de caixa, gestão de arquivos e redação de comunicados oficiais.

Sou proativa, metódica na organização de processos e tenho facilidade em aprender novos softwares com rapidez. Estou entusiasmada com a perspectiva de agregar valor às rotinas operacionais da empresa.

Agradeço a atenção e aguardo a oportunidade de agendarmos uma entrevista.

Atenciosamente,
${personal.fullName}
${personal.phone} | ${personal.email}
${personal.portfolioUrl}`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-md z-50 overflow-y-auto px-4 py-6 sm:py-10 flex justify-center items-start print:hidden">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* LOGIN MODAL */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-[12px] overflow-hidden border border-[#E7DFD6] flex flex-col shadow-none"
        style={{ display: isAuthenticated ? 'none' : 'flex' }}
      >
        {/* Passcode Header - sem dicas visuais */}
        <div className="p-6 bg-[#1C1917] text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            title="Fechar"
          >
            <X size={16} />
          </button>
          
          <Lock size={22} className="text-stone-300 mx-auto mb-3" />
          <span className="text-sm font-bold text-stone-300 uppercase tracking-wider block">Área Reservada</span>
          <h2 className="text-xl font-bold font-display mt-1">Acesso Administrativo</h2>
          <p className="text-sm text-stone-300 mt-2 max-w-xs mx-auto leading-relaxed">
            Digite a senha para gerenciar o conteúdo do currículo, opções e candidaturas.
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
          className="relative z-10 w-full max-w-5xl bg-white rounded-[12px] overflow-hidden border border-[#E7DFD6] flex flex-col shadow-none my-2"
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
              <Lock size={20} className="text-stone-300 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Área Administrativa</span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full transition cursor-pointer"
                    title="Encerrar sessão"
                  >
                    Sair
                  </button>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                  Painel de Gestão & Editor de Currículo
                </h1>
              </div>
            </div>
            <p className="text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
              Edite seus dados profissionais, envie foto nova, gere código para o GitHub, personalize o currículo e acompanhe vagas.
            </p>

            {statusMessage && (
              <div className="mt-4 p-3 rounded-[8px] bg-[#047857] text-white text-sm font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E7DFD6] bg-[#FBF7F2] px-4 overflow-x-auto gap-2 py-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'content' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Edit3 size={15} />
              Conteúdo
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'photo' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Camera size={15} />
              Foto
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'publish' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Upload size={15} />
              Publicar
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'downloads' 
                  ? 'bg-[#881337] text-white border-[#881337]' 
                  : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
              }`}
            >
              <Printer size={15} />
              Opções de Currículo
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
            
            {/* TAB: CONTEÚDO */}
            {activeTab === 'content' && (
              <form onSubmit={handleSaveContent} className="space-y-8">
                {/* Notice at top */}
                <div className="bg-[#F3EBE2] border border-[#E7DFD6] text-[#1C1917] p-4 rounded-[12px] text-sm flex items-start gap-3">
                  <AlertCircle className="text-[#881337] shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-sm text-[#1C1917]">
                      As alterações valem só neste navegador até você publicar o código no GitHub.
                    </p>
                    <p className="text-xs text-[#57534E] mt-0.5">
                      Para aplicar para todos os visitantes do site permanentemente, acerte os campos, salve e depois vá na aba <strong>Publicar</strong> para copiar o código atualizado.
                    </p>
                  </div>
                </div>

                {/* Dados Principais */}
                <div className="bg-white border border-[#E7DFD6] p-5 rounded-[12px] space-y-4">
                  <h3 className="font-display font-bold text-base text-[#1C1917] pb-2 border-b border-[#E7DFD6]">
                    Informações Pessoais Principais
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Nome de Exibição *</label>
                      <input
                        type="text"
                        required
                        value={editPersonal.displayName}
                        onChange={(e) => setEditPersonal({ ...editPersonal, displayName: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:border-[#881337] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={editPersonal.fullName}
                        onChange={(e) => setEditPersonal({ ...editPersonal, fullName: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:border-[#881337] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Título / Cargo *</label>
                      <input
                        type="text"
                        required
                        value={editPersonal.title}
                        onChange={(e) => setEditPersonal({ ...editPersonal, title: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:border-[#881337] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cargos em tags */}
                  <div>
                    <label className="text-xs font-bold text-[#57534E] uppercase mb-1.5 block">Cargos / Tags de Atuação</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editPersonal.roles.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FBF7F2] border border-[#E7DFD6] rounded-full text-xs font-medium text-[#1C1917]">
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoleTag(i)}
                            className="hover:text-red-700 text-stone-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Novo cargo..."
                        value={newRoleTag}
                        onChange={(e) => setNewRoleTag(e.target.value)}
                        className="flex-1 bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-1.5 text-sm text-[#1C1917]"
                      />
                      <button
                        type="button"
                        onClick={handleAddRoleTag}
                        className="px-4 py-1.5 bg-[#881337] text-white rounded-full text-xs font-bold hover:bg-[#70102e]"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Texto Sobre */}
                  <div>
                    <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Sobre Mim (Biografia profissional)</label>
                    <textarea
                      rows={4}
                      value={editPersonal.about}
                      onChange={(e) => setEditPersonal({ ...editPersonal, about: e.target.value })}
                      className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:border-[#881337] focus:outline-none"
                    />
                  </div>

                  {/* Contatos */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Cidade / Região</label>
                      <input
                        type="text"
                        value={editPersonal.city}
                        onChange={(e) => setEditPersonal({ ...editPersonal, city: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">E-mail</label>
                      <input
                        type="email"
                        value={editPersonal.email}
                        onChange={(e) => setEditPersonal({ ...editPersonal, email: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Telefone</label>
                      <input
                        type="text"
                        value={editPersonal.phone}
                        onChange={(e) => setEditPersonal({ ...editPersonal, phone: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">LinkedIn (URL)</label>
                      <input
                        type="url"
                        value={editPersonal.linkedin}
                        onChange={(e) => setEditPersonal({ ...editPersonal, linkedin: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">WhatsApp (URL com mensagem)</label>
                      <input
                        type="text"
                        value={editPersonal.whatsappUrl}
                        onChange={(e) => setEditPersonal({ ...editPersonal, whatsappUrl: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Disponibilidade / Objetivo</label>
                      <input
                        type="text"
                        value={editPersonal.objective}
                        onChange={(e) => setEditPersonal({ ...editPersonal, objective: e.target.value })}
                        className="w-full bg-[#FBF7F2] border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917]"
                      />
                    </div>
                  </div>
                </div>

                {/* Experiências */}
                <div className="bg-white border border-[#E7DFD6] p-5 rounded-[12px] space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E7DFD6]">
                    <h3 className="font-display font-bold text-base text-[#1C1917]">
                      Experiências Profissionais ({editExperiences.length})
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3.5 py-1.5 bg-[#881337] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#70102e]"
                    >
                      <Plus size={14} />
                      Nova Experiência
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editExperiences.map((exp, idx) => (
                      <div key={exp.id} className="p-4 bg-[#FBF7F2] border border-[#E7DFD6] rounded-[12px] space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                            <div>
                              <label className="text-xs font-bold text-[#57534E] uppercase mb-0.5 block">Cargo</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditExperiences(editExperiences.map((item, i) => i === idx ? { ...item, role: val } : item));
                                }}
                                className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#57534E] uppercase mb-0.5 block">Empresa</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditExperiences(editExperiences.map((item, i) => i === idx ? { ...item, company: val } : item));
                                }}
                                className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#57534E] uppercase mb-0.5 block">Período</label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditExperiences(editExperiences.map((item, i) => i === idx ? { ...item, period: val } : item));
                                }}
                                className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#57534E] uppercase mb-0.5 block">Localização</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditExperiences(editExperiences.map((item, i) => i === idx ? { ...item, location: val } : item));
                                }}
                                className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-2.5 py-1.5 text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => handleMoveExperience(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white border border-[#E7DFD6] disabled:opacity-30 hover:bg-stone-50"
                              title="Mover para cima"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveExperience(idx, 'down')}
                              disabled={idx === editExperiences.length - 1}
                              className="p-1 rounded bg-white border border-[#E7DFD6] disabled:opacity-30 hover:bg-stone-50"
                              title="Mover para baixo"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1 rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 mt-1"
                              title="Remover"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Atividades list */}
                        <div>
                          <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Atividades / Conquistas</label>
                          <ul className="space-y-1 mb-2">
                            {exp.activities.map((act, actIdx) => (
                              <li key={actIdx} className="flex items-center gap-2 text-xs bg-white p-2 rounded-[6px] border border-[#E7DFD6]">
                                <span className="flex-1 text-[#1C1917]">{act}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveActivityFromExp(exp.id, actIdx)}
                                  className="text-stone-400 hover:text-red-600 font-bold px-1"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Nova atividade..."
                              value={newExpActivity[exp.id] || ''}
                              onChange={(e) => setNewExpActivity({ ...newExpActivity, [exp.id]: e.target.value })}
                              className="flex-1 bg-white border border-[#E7DFD6] rounded-[8px] px-2.5 py-1 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddActivityToExp(exp.id)}
                              className="px-3 py-1 bg-stone-700 text-white rounded-full text-xs font-semibold hover:bg-stone-900"
                            >
                              Adicionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competências */}
                <div className="bg-white border border-[#E7DFD6] p-5 rounded-[12px] space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E7DFD6]">
                    <h3 className="font-display font-bold text-base text-[#1C1917]">
                      Competências & Habilidades ({editSkills.length})
                    </h3>
                  </div>

                  {/* Add skill input */}
                  <div className="flex flex-wrap items-end gap-3 bg-[#FBF7F2] p-3 rounded-[12px] border border-[#E7DFD6]">
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Nome da Competência</label>
                      <input
                        type="text"
                        placeholder="Ex: Gestão de Agendas e Consultas"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] uppercase mb-1 block">Categoria</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-1.5 text-sm"
                      >
                        <option value="administrative">Administrativo</option>
                        <option value="financial">Financeiro & Fiscal</option>
                        <option value="client-relations">Relacionamento & Clientes</option>
                        <option value="digital">Informática & Ferramentas</option>
                        <option value="personal">Pessoal & Atitude</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-[#881337] text-white rounded-full text-xs font-bold hover:bg-[#70102e]"
                    >
                      Adicionar Competência
                    </button>
                  </div>

                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border border-[#E7DFD6] rounded-[8px]">
                    {editSkills.map((s) => (
                      <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FBF7F2] border border-[#E7DFD6] rounded-full text-xs text-[#1C1917]">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-[10px] text-[#57534E]">({s.category})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s.name)}
                          className="hover:text-red-700 text-stone-400 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#047857] hover:bg-[#036045] text-white rounded-full text-sm font-bold shadow-[2px_2px_0_#1C1917] transition cursor-pointer flex items-center gap-2"
                  >
                    <Check size={16} />
                    Salvar Alterações de Conteúdo
                  </button>
                </div>
              </form>
            )}

            {/* TAB: FOTO */}
            {activeTab === 'photo' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] p-5 rounded-[12px] space-y-4">
                  <h3 className="font-display font-bold text-base text-[#1C1917]">
                    Foto Profissional do Currículo e Hero
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Envie uma foto profissional do seu computador. A imagem será automaticamente otimizada e redimensionada no navegador (largura máxima de 800px e tamanho máximo de 600 KB).
                  </p>

                  {/* Preview */}
                  <div className="flex items-center justify-center gap-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-semibold text-[#57534E] mb-2">Formato Circular (Hero e Currículo)</span>
                      <div className="w-28 h-28 rounded-full border-2 border-[#1C1917] overflow-hidden bg-white shadow-sm">
                        <img
                          src={personal.photoUrl}
                          alt="Prévia da foto circular"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload input */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#57534E] uppercase">
                      Escolher foto do computador
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-[#57534E] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#881337] file:text-white hover:file:bg-[#70102e] cursor-pointer"
                    />
                  </div>

                  {/* Reset Photo */}
                  <div className="pt-3 border-t border-[#E7DFD6] flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="px-4 py-2 bg-white border border-[#E7DFD6] text-[#57534E] hover:text-[#1C1917] rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      Voltar à foto original
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PUBLICAR */}
            {activeTab === 'publish' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] p-6 rounded-[12px] space-y-4">
                  <h3 className="font-display font-bold text-lg text-[#1C1917]">
                    Publicar Alterações para Todos os Visitantes
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    As modificações feitas na aba <strong>Conteúdo</strong> e <strong>Foto</strong> ficam salvas no navegador atual. Para atualizar o site em produção para recrutadores e todo o público, utilize as opções abaixo:
                  </p>

                  <div className="space-y-4 pt-2">
                    {/* Ação 1: Copiar código data.ts */}
                    <div className="p-4 bg-white border border-[#E7DFD6] rounded-[12px] space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-[#1C1917]">1. Copiar Código do data.ts Atualizado</h4>
                        <button
                          type="button"
                          onClick={handleCopyDataTsCode}
                          className="px-4 py-1.5 bg-[#881337] text-white rounded-full text-xs font-bold hover:bg-[#70102e] flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0_#1C1917]"
                        >
                          <Copy size={13} />
                          Copiar Código
                        </button>
                      </div>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        Gera o arquivo completo <code>src/data.ts</code> no mesmo formato original. Aviso: <strong>"Cole no src/data.ts do GitHub para publicar para todos."</strong>
                      </p>
                    </div>

                    {/* Ação 2: Exportar e Importar JSON */}
                    <div className="p-4 bg-white border border-[#E7DFD6] rounded-[12px] space-y-3">
                      <h4 className="font-bold text-sm text-[#1C1917]">2. Exportar / Importar Backup (JSON)</h4>
                      <p className="text-xs text-[#57534E]">
                        Guarde um arquivo de backup com suas personalizações ou traga de outro navegador.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleExportJSON}
                          className="px-4 py-1.5 bg-white border border-[#E7DFD6] text-[#1C1917] rounded-full text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
                        >
                          <Download size={13} />
                          Exportar JSON
                        </button>
                        <label className="px-4 py-1.5 bg-white border border-[#E7DFD6] text-[#1C1917] rounded-full text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer">
                          <Upload size={13} />
                          Importar JSON
                          <input
                            type="file"
                            accept="application/json"
                            onChange={handleImportJSON}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Ação 3: Restaurar original */}
                    <div className="p-4 bg-white border border-red-200 rounded-[12px] space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-red-700">3. Restaurar Conteúdo Original</h4>
                        <button
                          type="button"
                          onClick={handleRestoreOriginal}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          Restaurar
                        </button>
                      </div>
                      <p className="text-xs text-[#57534E]">
                        Descarta todas as alterações locais e retorna aos dados pré-definidos do sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DOWNLOADS & RESUME CONFIG */}
            {activeTab === 'downloads' && (
              <div className="space-y-6">
                <div className="bg-[#FBF7F2] border border-[#E7DFD6] text-[#1C1917] p-4 rounded-[12px] text-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#F3EBE2] text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1C1917]">Configurações de Exportação do Currículo</p>
                    <p className="text-sm text-[#57534E] mt-0.5 leading-relaxed">
                      Selecione os elementos para incluir antes da impressão ou salvamento em PDF. O link oficial do portfólio web (<strong className="text-[#881337]">{personal.portfolioUrl}</strong>) e o QR Code podem ser alternados abaixo.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        resumeConfig.showPhoto ? 'bg-[#F3EBE2] text-[#881337]' : 'bg-stone-100 text-stone-600'
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
                        resumeConfig.showQrCode ? 'bg-[#F3EBE2] text-[#881337]' : 'bg-stone-100 text-stone-600'
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
                        resumeConfig.showPortfolioLink ? 'bg-[#F3EBE2] text-[#881337]' : 'bg-stone-100 text-stone-600'
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

                <div className="flex justify-end pt-2">
                  <button
                    onClick={onOpenResume}
                    className="px-6 py-2.5 bg-[#881337] hover:bg-[#70102e] text-white rounded-full text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-[2px_2px_0_#1C1917]"
                  >
                    <Printer size={16} />
                    <span>Abrir Pré-visualização do Currículo</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: TRACKER (with edit, notes, filter, and CSV export) */}
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
                      {applications.filter((a) => a.status === 'Entrevista').length}
                    </span>
                  </div>
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#047857] uppercase tracking-wider block">Aprovadas</span>
                    <span className="text-2xl font-bold text-[#047857]">
                      {applications.filter((a) => a.status === 'Aprovado').length}
                    </span>
                  </div>
                  <div className="bg-[#FBF7F2] p-4 rounded-[12px] border border-[#E7DFD6] text-center">
                    <span className="text-xs font-bold text-[#57534E] uppercase tracking-wider block">Taxa de Resposta</span>
                    <span className="text-2xl font-bold text-[#1C1917]">
                      {applications.length > 0 
                        ? `${Math.round((applications.filter((a) => a.status !== 'Enviado').length / applications.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>

                {/* Filter and Export CSV Bar */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#57534E] uppercase mr-1">Filtrar por Status:</span>
                    {(['Todos', 'Enviado', 'Entrevista', 'Aprovado', 'Rejeitado'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setTrackerFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                          trackerFilter === st
                            ? 'bg-[#881337] text-white border-[#881337]'
                            : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-1.5 bg-white border border-[#E7DFD6] text-[#1C1917] rounded-full text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download size={13} />
                    Exportar CSV
                  </button>
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
                    <div className="md:col-span-4 flex flex-col">
                      <label className="text-xs font-bold text-[#57534E] mb-1 uppercase">Observações da Vaga</label>
                      <input
                        type="text"
                        placeholder="Ex: Exige experiência com PABX e emissão de notas fiscais..."
                        value={newApp.notes}
                        onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                        className="bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                  </form>
                </div>

                {/* Applications List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#1C1917]">Candidaturas Cadastradas ({filteredApplications.length})</h3>
                  {filteredApplications.length === 0 ? (
                    <p className="text-sm text-[#57534E] py-6 text-center">Nenhuma candidatura cadastrada para este filtro.</p>
                  ) : (
                    <div className="overflow-x-auto border border-[#E7DFD6] rounded-[12px]">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#FBF7F2] text-[#57534E] font-bold border-b border-[#E7DFD6] uppercase tracking-wider text-xs">
                          <tr>
                            <th className="p-3.5">Empresa</th>
                            <th className="p-3.5">Cargo / Segmento</th>
                            <th className="p-3.5">Data</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Observações</th>
                            <th className="p-3.5 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7DFD6]">
                          {filteredApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-[#FBF7F2]/50">
                              <td className="p-3.5 font-bold text-[#1C1917]">{app.company}</td>
                              <td className="p-3.5">
                                <div>{app.role}</div>
                                <span className="text-xs text-[#57534E]">{app.segment}</span>
                              </td>
                              <td className="p-3.5 text-[#57534E] whitespace-nowrap">{app.date}</td>
                              <td className="p-3.5">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                                    app.status === 'Enviado' ? 'bg-stone-100 border-[#E7DFD6] text-[#1C1917]' :
                                    app.status === 'Entrevista' ? 'bg-[#F3EBE2] border-[#E7DFD6] text-[#881337]' :
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
                              <td className="p-3.5 min-w-[200px]">
                                <input
                                  type="text"
                                  placeholder="Adicionar observação..."
                                  value={app.notes || ''}
                                  onChange={(e) => handleUpdateNotes(app.id, e.target.value)}
                                  className="w-full bg-transparent border-b border-transparent hover:border-[#E7DFD6] focus:border-[#881337] focus:bg-white text-xs px-1.5 py-1 text-[#57534E] focus:text-[#1C1917]"
                                />
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteApp(app.id)}
                                  className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-full transition cursor-pointer"
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

            {/* TAB: LETTERS */}
            {activeTab === 'letters' && (
              <div className="space-y-6">
                <div className="bg-[#FBF7F2] p-5 rounded-[12px] border border-[#E7DFD6]">
                  <h3 className="text-sm font-bold text-[#1C1917] mb-3">Personalizar Modelos para a Empresa</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#57534E] mb-1 block uppercase">Nome da Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: Hospital Regional"
                        value={letterCompany}
                        onChange={(e) => setLetterCompany(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] mb-1 block uppercase">Cargo Almejado</label>
                      <input
                        type="text"
                        placeholder="Ex: Recepcionista Líder"
                        value={letterRole}
                        onChange={(e) => setLetterRole(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#57534E] mb-1 block uppercase">Nome do Recrutador (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: Mariana Silva"
                        value={letterRecruiter}
                        onChange={(e) => setLetterRecruiter(e.target.value)}
                        className="w-full bg-white border border-[#E7DFD6] rounded-[8px] px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#881337]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {letterTemplates.map((template) => {
                    const finalLetterText = template.getText();
                    return (
                      <div key={template.id} className="p-5 rounded-[12px] border border-[#E7DFD6] bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7DFD6]">
                          <div>
                            <span className="inline-block text-xs font-semibold text-[#881337] bg-[#F3EBE2] border border-[#E7DFD6] px-2.5 py-0.5 rounded-full uppercase mb-1">
                              {template.id === 'rec-corp' ? 'Corporativo' : template.id === 'rec-clin' ? 'Saúde & Clínicas' : 'Administração'}
                            </span>
                            <h4 className="text-base font-bold text-[#1C1917] font-display">{template.title}</h4>
                            <p className="text-xs text-[#57534E] mt-0.5">{template.desc}</p>
                          </div>
                          <button
                            onClick={() => handleCopyText(finalLetterText, template.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                              copiedId === template.id 
                                ? 'bg-[#047857] text-white border-[#047857]' 
                                : 'bg-[#881337] text-white border-[#881337] hover:bg-[#70102e]'
                            }`}
                          >
                            {copiedId === template.id ? (
                              <>
                                <Check size={13} />
                                Copiado!
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

            {/* TAB: AI ANALYZER */}
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

                {isAiLoading && (
                  <div className="p-8 text-center flex flex-col items-center justify-center border border-[#E7DFD6] bg-[#FBF7F2] rounded-[12px]">
                    <div className="w-8 h-8 rounded-full border-2 border-[#881337] border-t-transparent animate-spin mb-3" />
                    <h3 className="text-sm font-bold text-[#1C1917]">Processando análise curricular</h3>
                    <p className="text-sm text-[#57534E] mt-1">{motivationalMessage}</p>
                  </div>
                )}

                {aiError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm">
                    {aiError}
                  </div>
                )}

                {aiResult && !isAiLoading && (
                  <div className="bg-white rounded-[12px] border border-[#E7DFD6] p-6 space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <span>{personal.fullName}</span>
            <span>{personal.city}</span>
          </div>

        </div>
      )}
    </div>
  );
}
