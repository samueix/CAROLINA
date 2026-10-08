import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_LIST, COURSES_LIST, SKILLS_LIST, RESUME_MAIN_SKILLS } from '../data';
import { ResumeConfig } from '../types';
import { 
  Mail, Phone, MapPin, Linkedin, Award, Briefcase, GraduationCap, 
  Globe, QrCode as QrIcon, Camera, Check, Sparkles, Printer, X
} from 'lucide-react';

interface PrintResumeProps {
  onClose?: () => void;
  initialConfig?: ResumeConfig;
  onConfigChange?: (config: ResumeConfig) => void;
}

const DEFAULT_CONFIG: ResumeConfig = {
  showPhoto: true,
  photoShape: 'circle',
  showQrCode: true,
  showPortfolioLink: true
};

export default function PrintResume({ onClose, initialConfig, onConfigChange }: PrintResumeProps) {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Configuration state with localStorage persistence
  const [config, setConfig] = useState<ResumeConfig>(() => {
    if (initialConfig) return initialConfig;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carol_resume_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_CONFIG;
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [photoSrc, setPhotoSrc] = useState(PERSONAL_INFO.photoUrl);

  // Sync external config if provided
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Generate QR Code vector data URL
  useEffect(() => {
    QRCode.toDataURL(PERSONAL_INFO.portfolioUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#881337', // Deep rose / wine tone
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Erro ao gerar QR Code:', err));
  }, []);

  const updateConfig = (newConfig: ResumeConfig) => {
    setConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('carol_resume_config', JSON.stringify(newConfig));
    }
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const handleToggle = (key: keyof ResumeConfig) => {
    updateConfig({
      ...config,
      [key]: !config[key]
    });
  };

  return (
    <div className="max-w-[850px] mx-auto bg-white text-stone-800 p-6 sm:p-10 shadow-2xl rounded-3xl border border-rose-100 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full">
      
      {/* Iframe Warning Banner */}
      {isIframe && (
        <div className="bg-rose-50/70 border border-rose-200 text-rose-950 p-4 rounded-2xl mb-6 text-xs flex flex-col gap-2 print:hidden shadow-sm">
          <p className="font-bold flex items-center gap-1.5 text-rose-900 text-sm">
            ✨ Dica para Download em PDF Perfeito
          </p>
          <p className="text-stone-600 leading-relaxed">
            Navegadores bloqueiam a impressão direta de dentro do painel lateral (iframe). 
            Para gerar seu currículo com máxima qualidade visual e vetorial, clique no botão abaixo para abrir o site em nova aba e clique em <strong>"Imprimir / Salvar PDF"</strong> lá!
          </p>
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition w-fit mt-1 shadow-md shadow-rose-900/10"
          >
            Abrir Portfólio em Nova Aba 🚀
          </a>
        </div>
      )}

      {/* Interactive Customization Toolbar - Hidden during printing */}
      <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl mb-6 print:hidden">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Sparkles size={16} className="text-rose-700" />
              Personalizar Conteúdo do Currículo
            </h3>
            <p className="text-[11px] text-stone-500">
              Escolha o que deseja incluir antes de imprimir ou salvar como PDF:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isIframe) {
                  alert("Para salvar o PDF, primeiro clique no botão 'Abrir Portfólio em Nova Aba 🚀' exibido no aviso acima. O navegador não permite imprimir de dentro deste painel lateral!");
                } else {
                  window.print();
                }
              }}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-rose-900/15 flex items-center gap-1.5"
              id="print-btn"
            >
              <Printer size={14} />
              Imprimir / Salvar PDF
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-full text-xs font-semibold transition cursor-pointer"
                title="Fechar"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Toggles for photo, qr code, portfolio link */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
            Opções:
          </span>

          {/* Toggle Photo */}
          <button
            onClick={() => handleToggle('showPhoto')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showPhoto
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold shadow-sm'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Camera size={13} className={config.showPhoto ? 'text-rose-800' : 'text-stone-400'} />
            {config.showPhoto ? '✓ Com Foto' : '✕ Sem Foto'}
          </button>

          {/* Photo Shape Switch (only visible if photo is on) */}
          {config.showPhoto && (
            <button
              onClick={() => {
                const nextShape = config.photoShape === 'rounded' ? 'circle' : 'rounded';
                updateConfig({
                  ...config,
                  photoShape: nextShape
                });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-rose-200 bg-white hover:bg-rose-50 text-rose-900"
              title="Alternar formato da foto"
            >
              <Sparkles size={12} className="text-rose-700" />
              {config.photoShape === 'rounded' ? 'Formato: Retangular Suave' : 'Formato: Redonda Executiva'}
            </button>
          )}

          {/* Toggle QR Code */}
          <button
            onClick={() => handleToggle('showQrCode')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showQrCode
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <QrIcon size={13} className={config.showQrCode ? 'text-rose-800' : 'text-stone-400'} />
            {config.showQrCode ? '✓ Com QR Code' : '✕ Sem QR Code'}
          </button>

          {/* Toggle Portfolio Link */}
          <button
            onClick={() => handleToggle('showPortfolioLink')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showPortfolioLink
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Globe size={13} className={config.showPortfolioLink ? 'text-rose-800' : 'text-stone-400'} />
            {config.showPortfolioLink ? '✓ Com Link do Portfólio' : '✕ Sem Link do Portfólio'}
          </button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="border-b-4 border-rose-900 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-5">
          
          {/* Avatar Photo (if enabled) + Name & Title */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            {config.showPhoto && (
              <div className="shrink-0 relative group">
                <div
                  className={`p-1 bg-gradient-to-tr from-rose-300 via-rose-100 to-rose-400 shadow-md border border-rose-200/90 transition-all ${
                    config.photoShape === 'rounded'
                      ? 'w-24 h-28 sm:w-28 sm:h-32 print:w-22 print:h-26 rounded-2xl'
                      : 'w-24 h-24 sm:w-28 sm:h-28 print:w-22 print:h-22 rounded-full'
                  }`}
                >
                  <div
                    className={`w-full h-full overflow-hidden border-2 border-white bg-rose-50 shadow-inner ${
                      config.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                    }`}
                  >
                    <img
                      src={photoSrc}
                      onError={() => setPhotoSrc((PERSONAL_INFO as any).backupPhotoUrl)}
                      alt={PERSONAL_INFO.fullName}
                      className="w-full h-full object-cover object-[center_16%] contrast-[1.04] brightness-[1.03] saturate-[1.03] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl print:text-2xl font-black text-rose-950 tracking-tight font-display">
                {PERSONAL_INFO.fullName}
              </h1>
              <h2 className="text-sm sm:text-base print:text-sm font-bold text-rose-800 mt-0.5">
                {PERSONAL_INFO.title}
              </h2>
              <p className="text-[11px] text-stone-600 mt-2 max-w-xl font-medium leading-relaxed text-justify print:text-[10px]">
                {PERSONAL_INFO.objective}
              </p>
            </div>
          </div>

          {/* Contact Details & Optional QR Code */}
          <div className="flex items-start gap-3 sm:gap-4 print:gap-3 w-full sm:w-auto print:w-auto justify-between sm:justify-end">
            
            {/* Contacts list */}
            <div className="flex flex-col gap-1 text-[11px] print:text-[10px] text-stone-600 font-medium sm:items-end print:items-end">
              <div className="flex items-center gap-1.5">
                <span>{PERSONAL_INFO.city}</span>
                <MapPin size={13} className="text-rose-800 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>{PERSONAL_INFO.phone}</span>
                <Phone size={13} className="text-rose-800 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-rose-900 hover:underline">
                  {PERSONAL_INFO.email}
                </a>
                <Mail size={13} className="text-rose-800 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-rose-900 hover:underline">
                  {PERSONAL_INFO.linkedinDisplay}
                </a>
                <Linkedin size={13} className="text-rose-800 shrink-0" />
              </div>
              {config.showPortfolioLink && (
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <a href={PERSONAL_INFO.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
                    {PERSONAL_INFO.portfolioDisplay}
                  </a>
                  <Globe size={13} className="text-rose-800 shrink-0" />
                </div>
              )}
            </div>

            {/* QR Code (if enabled) */}
            {config.showQrCode && qrCodeUrl && (
              <div className="flex flex-col items-center bg-rose-50/50 p-1.5 rounded-xl border border-rose-200 shrink-0 text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code do Portfólio Web"
                  className="w-16 h-16 print:w-14 print:h-14 object-contain rounded"
                />
                <span className="text-[8px] font-bold text-rose-900 uppercase tracking-tighter mt-0.5">
                  Portfólio Web
                </span>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6 md:gap-7 print:gap-6">
        
        {/* LEFT COLUMN (1/3): Resumo, Formação, Competências, Diferenciais */}
        <div className="md:col-span-1 print:col-span-1 flex flex-col gap-5">
          
          {/* Perfil Profissional / Sobre Mim */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-2.5 flex items-center gap-1.5">
              Sobre Mim
            </h3>
            <p className="text-[11px] print:text-[10px] text-stone-600 leading-relaxed text-justify">
              Profissional comunicativa, organizada e focada na satisfação do cliente. Possui vivência corporativa em rotinas de recepção, atendimento telefônico/presencial, conciliação e lançamento de notas fiscais, CRM e suporte operacional, além de sólida habilidade em autogestão e relacionamento.
            </p>
          </section>

          {/* Formação Acadêmica */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <GraduationCap size={14} />
              Formação
            </h3>
            {EDUCATION_LIST.map((edu) => (
              <div key={edu.id} className="text-[11px] print:text-[10px]">
                <h4 className="font-bold text-stone-900">{edu.degree}</h4>
                <p className="text-stone-600">{edu.institution}</p>
                <span className="inline-block text-[10px] text-rose-900 font-semibold bg-rose-50 px-1.5 py-0.5 rounded mt-0.5 print:bg-transparent print:p-0">
                  Conclusão: {edu.completionYear}
                </span>
              </div>
            ))}
          </section>

          {/* Competências Principais */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <Award size={14} />
              Principais Competências
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {RESUME_MAIN_SKILLS.map((skillName, idx) => (
                <span 
                  key={idx} 
                  className="text-[9.5px] print:text-[9px] bg-rose-50/80 text-rose-950 border border-rose-200 px-2 py-0.5 rounded font-medium print:bg-white print:border-stone-300"
                >
                  {skillName}
                </span>
              ))}
            </div>
          </section>

          {/* Diferenciais Competitivos */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-2.5 flex items-center gap-1.5">
              Diferenciais
            </h3>
            <ul className="text-[10.5px] print:text-[9.5px] text-stone-600 space-y-1">
              {PERSONAL_INFO.additionalInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-800 mt-0.5 font-bold">▪</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* RIGHT COLUMN (2/3): Experiências Profissionais e Cursos */}
        <div className="md:col-span-2 print:col-span-2 flex flex-col gap-5">
          
          {/* Experiência Profissional */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-3 flex items-center gap-1.5">
              <Briefcase size={14} />
              Experiência Profissional
            </h3>
            <div className="space-y-4">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="text-[11px] print:text-[10px]">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm print:text-xs">
                        {exp.role}
                      </h4>
                      <p className="text-rose-800 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right text-[10px] text-stone-500 font-medium">
                      <p className="font-semibold text-stone-700">{exp.period}</p>
                      <p className="italic">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-stone-600 leading-relaxed text-justify list-disc pl-4">
                    {exp.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Cursos e Certificações */}
          <section>
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-200 pb-1 mb-3 flex items-center gap-1.5">
              <Award size={14} />
              Cursos e Qualificações
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3">
              {COURSES_LIST.map((course) => (
                <div key={course.id} className="text-[10.5px] print:text-[9.5px] bg-stone-50 p-2.5 rounded-xl border border-stone-200 print:bg-white print:border-none print:p-0">
                  <div className="flex justify-between items-baseline gap-1">
                    <h4 className="font-bold text-stone-900">{course.name}</h4>
                    {course.workload && (
                      <span className="text-[9px] text-rose-800 font-semibold shrink-0">
                        {course.workload}
                      </span>
                    )}
                  </div>
                  <p className="text-[9.5px] text-rose-800 font-medium mb-1">{course.institution}</p>
                  <p className="text-[9px] text-stone-500 leading-normal line-clamp-3 print:line-clamp-none">
                    {course.syllabus.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

      {/* PRINTABLE FOOTER */}
      <footer className="mt-6 pt-4 border-t border-rose-100 flex flex-col sm:flex-row justify-between items-center text-[9px] text-stone-400 gap-1 print:flex">
        <p>{PERSONAL_INFO.fullName} — Contato: {PERSONAL_INFO.phone} | {PERSONAL_INFO.email}</p>
        <p className="font-semibold text-rose-800">
          Portfólio online: {PERSONAL_INFO.portfolioDisplay}
        </p>
      </footer>

    </div>
  );
}
