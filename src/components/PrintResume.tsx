import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useContent } from '../useContent';
import { RESUME_MAIN_SKILLS } from '../data';
import { ResumeConfig } from '../types';
import { 
  Mail, Phone, MapPin, Linkedin, Award, Briefcase, GraduationCap, 
  Globe, QrCode as QrIcon, Camera, Printer, X
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
  const { personal, experiences, education, courses, skills } = useContent();
  const originalTitleRef = useRef<string>('');

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
  const [photoSrc, setPhotoSrc] = useState(personal.photoUrl);

  // Sync photo if personal changes via useContent
  useEffect(() => {
    setPhotoSrc(personal.photoUrl);
  }, [personal.photoUrl]);

  // Sync external config if provided
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Ajusta o <title> durante a impressão para virar o nome oficial do PDF gerado
  useEffect(() => {
    const handleBeforePrint = () => {
      originalTitleRef.current = document.title;
      document.title = `${personal.fullName} - Currículo`;
    };

    const handleAfterPrint = () => {
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [personal.fullName]);

  // Generate QR Code vector data URL
  useEffect(() => {
    QRCode.toDataURL(personal.portfolioUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#881337',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [personal.portfolioUrl]);

  // Persist config changes
  const updateConfig = (newConfig: ResumeConfig) => {
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('carol_resume_config', JSON.stringify(newConfig));
      } catch (e) {
        console.error('Falha ao salvar carol_resume_config:', e);
      }
    }
  };

  const handleToggle = (key: keyof ResumeConfig) => {
    updateConfig({
      ...config,
      [key]: !config[key]
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const mainSkillsList = skills.length > 0 
    ? skills.slice(0, 10).map((s) => s.name) 
    : RESUME_MAIN_SKILLS;

  return (
    <div
      className="bg-white text-[#1C1917] p-6 sm:p-10 max-w-[850px] mx-auto border border-[#E7DFD6] rounded-[12px] print:rounded-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:shadow-none"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10pt',
        letterSpacing: 0,
        boxShadow: 'none'
      }}
    >
      {/* SCREEN TOOLBAR (Oculto na impressão) */}
      <div className="print:hidden border-b border-[#E7DFD6] pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#881337] uppercase tracking-wider px-3 py-1 rounded-full border border-[#E7DFD6] bg-[#F3EBE2]">
              Configurações de Impressão (2 Páginas A4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#047857] hover:bg-[#036546] text-white rounded-full text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1C1917]"
              title="Abrir diálogo de impressão do navegador"
            >
              <Printer size={16} />
              <span>Imprimir / Salvar PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-stone-100 rounded-full transition cursor-pointer"
                title="Fechar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Toggles for layout options */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#57534E]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mr-1">
            Opções:
          </span>

          {/* Toggle Photo */}
          <button
            onClick={() => handleToggle('showPhoto')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showPhoto
                ? 'bg-[#F3EBE2] text-[#881337] border-[#881337] font-semibold'
                : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
            }`}
          >
            <Camera size={14} className={config.showPhoto ? 'text-[#881337]' : 'text-stone-600'} />
            {config.showPhoto ? 'Com foto' : 'Sem foto'}
          </button>

          {/* Photo Shape Switch */}
          {config.showPhoto && (
            <button
              onClick={() => {
                const nextShape = config.photoShape === 'rounded' ? 'circle' : 'rounded';
                updateConfig({
                  ...config,
                  photoShape: nextShape
                });
              }}
              className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition cursor-pointer border border-[#E7DFD6] bg-white hover:bg-stone-50 text-[#1C1917]"
              title="Alternar formato da foto"
            >
              {config.photoShape === 'rounded' ? 'Formato: Retangular' : 'Formato: Redondo'}
            </button>
          )}

          {/* Toggle QR Code */}
          <button
            onClick={() => handleToggle('showQrCode')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showQrCode
                ? 'bg-[#F3EBE2] text-[#881337] border-[#881337] font-semibold'
                : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
            }`}
          >
            <QrIcon size={14} className={config.showQrCode ? 'text-[#881337]' : 'text-stone-600'} />
            {config.showQrCode ? 'Com QR Code' : 'Sem QR Code'}
          </button>

          {/* Toggle Portfolio Link */}
          <button
            onClick={() => handleToggle('showPortfolioLink')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              config.showPortfolioLink
                ? 'bg-[#F3EBE2] text-[#881337] border-[#881337] font-semibold'
                : 'bg-white text-[#57534E] border-[#E7DFD6] hover:bg-stone-50'
            }`}
          >
            <Globe size={14} className={config.showPortfolioLink ? 'text-[#881337]' : 'text-stone-600'} />
            {config.showPortfolioLink ? 'Com link do portfólio' : 'Sem link'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PÁGINA 1: Cabeçalho, Sobre, Formação, Competências, Diferenciais & Carreira */}
      {/* ========================================================================= */}
      <div className="print-page pb-4">
        
        {/* CABEÇALHO COMPLETO */}
        <header className="border-b-2 border-[#881337] pb-3.5 mb-4 print-item-avoid">
          <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-4">
            
            {/* Foto + Nome, Cargo e Objetivo */}
            <div className="flex items-start gap-3.5 flex-1">
              {config.showPhoto && (
                <div className="shrink-0">
                  <div
                    className={`border border-[#1C1917] overflow-hidden bg-white ${
                      config.photoShape === 'rounded'
                        ? 'w-20 h-24 sm:w-24 sm:h-28 print:w-[72px] print:h-[88px] rounded-[8px] print:rounded-none'
                        : 'w-20 h-20 sm:w-24 sm:h-24 print:w-[76px] print:h-[76px] rounded-full print:rounded-full'
                    }`}
                  >
                    <img
                      src={photoSrc}
                      onError={() => setPhotoSrc((personal as any).backupPhotoUrl || personal.photoUrl)}
                      alt={personal.fullName}
                      className="w-full h-full object-cover object-[center_16%]"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl print:text-[16pt] font-extrabold text-[#1C1917] tracking-tight leading-tight print:font-[Arial,Helvetica,sans-serif]">
                  {personal.fullName}
                </h1>
                <h2 className="text-sm sm:text-base print:text-[10pt] font-bold text-[#881337] mt-0.5 print:font-[Arial,Helvetica,sans-serif]">
                  {personal.title}
                </h2>
                <p className="text-xs sm:text-sm print:text-[8.5pt] text-[#57534E] mt-1.5 max-w-xl leading-[1.35] text-left print:font-[Arial,Helvetica,sans-serif]">
                  {personal.objective}
                </p>
              </div>
            </div>

            {/* Contatos & QR Code */}
            <div className="flex items-start gap-3 print:gap-2.5 w-full sm:w-auto print:w-auto justify-between sm:justify-end shrink-0">
              <div className="flex flex-col gap-0.5 text-xs print:text-[8pt] text-[#57534E] sm:items-end print:items-end print:font-[Arial,Helvetica,sans-serif] leading-tight">
                <div className="flex items-center gap-1.5">
                  <span>{personal.city}</span>
                  <MapPin size={12} className="text-[#881337] shrink-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{personal.phone}</span>
                  <Phone size={12} className="text-[#881337] shrink-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <a href={`mailto:${personal.email}`} className="hover:text-[#881337] hover:underline">
                    {personal.email}
                  </a>
                  <Mail size={12} className="text-[#881337] shrink-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#881337] hover:underline">
                    {personal.linkedinDisplay || 'carolferreiraofc'}
                  </a>
                  <Linkedin size={12} className="text-[#881337] shrink-0" />
                </div>
                {config.showPortfolioLink && (
                  <div className="flex items-center gap-1.5 font-bold text-[#881337]">
                    <a href={personal.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      {personal.portfolioDisplay}
                    </a>
                    <Globe size={12} className="text-[#881337] shrink-0" />
                  </div>
                )}
              </div>

              {/* QR Code opcional */}
              {config.showQrCode && qrCodeUrl && (
                <div className="flex flex-col items-center p-1 rounded-[6px] print:rounded-none border border-[#E7DFD6] shrink-0 text-center bg-white print-item-avoid">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do Portfólio"
                    className="w-14 h-14 print:w-[50px] print:h-[50px] object-contain"
                  />
                  <span className="text-[7.5pt] font-bold text-[#881337] tracking-wider mt-0.5 print:font-[Arial,Helvetica,sans-serif]">
                    Portfólio Web
                  </span>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* GRID PRINCIPAL DA PÁGINA 1: 1/3 (Esquerda) + 2/3 (Direita) */}
        <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-5 print:gap-4 items-start">
          
          {/* COLUNA ESQUERDA (1/3) */}
          <div className="md:col-span-1 print:col-span-1 flex flex-col gap-3.5 print:gap-3">
            
            {/* Sobre Mim */}
            <div>
              <h3 className="text-xs print:text-[9.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-0.5 mb-1 print-title-avoid print:font-[Arial,Helvetica,sans-serif]">
                Sobre Mim
              </h3>
              <p className="text-xs print:text-[8.5pt] text-[#57534E] leading-[1.3] text-left print:font-[Arial,Helvetica,sans-serif]">
                {personal.about ? personal.about.split('\n')[0] : 'Profissional comunicativa, organizada e focada na satisfação do cliente.'}
              </p>
            </div>

            {/* Formação Acadêmica */}
            <div>
              <h3 className="text-xs print:text-[9.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-0.5 mb-1 print-title-avoid flex items-center gap-1.5 print:font-[Arial,Helvetica,sans-serif]">
                <GraduationCap size={13} />
                Formação
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs print:text-[8.5pt] print-item-avoid">
                  <h4 className="font-bold text-[#1C1917] print:font-[Arial,Helvetica,sans-serif]">{edu.degree}</h4>
                  <p className="text-[#57534E] print:font-[Arial,Helvetica,sans-serif]">{edu.institution}</p>
                  <span className="inline-block text-[8pt] text-[#881337] font-semibold print:font-[Arial,Helvetica,sans-serif]">
                    Conclusão: {edu.completionYear}
                  </span>
                </div>
              ))}
            </div>

            {/* Principais Competências (Lista simples com linha fina entre itens para economizar altura) */}
            <div>
              <h3 className="text-xs print:text-[9.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-0.5 mb-1.5 print-title-avoid flex items-center gap-1.5 print:font-[Arial,Helvetica,sans-serif]">
                <Award size={13} />
                Principais Competências
              </h3>
              <ul className="text-xs print:text-[8pt] text-[#1C1917] divide-y divide-[#E7DFD6]/60 print:font-[Arial,Helvetica,sans-serif] leading-tight">
                {mainSkillsList.map((skillName, idx) => (
                  <li key={idx} className="py-0.5 flex items-center gap-1.5 text-left">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#881337] shrink-0" aria-hidden="true" />
                    <span className="truncate">{skillName}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diferenciais */}
            {personal.additionalInfo && personal.additionalInfo.length > 0 && (
              <div>
                <h3 className="text-xs print:text-[9.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-0.5 mb-1 print-title-avoid print:font-[Arial,Helvetica,sans-serif]">
                  Diferenciais
                </h3>
                <ul className="text-xs print:text-[8pt] text-[#57534E] space-y-0.5 text-left print:font-[Arial,Helvetica,sans-serif] leading-tight">
                  {personal.additionalInfo.map((info, idx) => (
                    <li key={idx} className="flex items-start gap-1 print-item-avoid">
                      <span className="text-[#881337] font-bold shrink-0">·</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* COLUNA DIREITA (2/3): Experiência Profissional Completa */}
          <div className="md:col-span-2 print:col-span-2 flex flex-col">
            <h3 className="text-xs print:text-[9.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-0.5 mb-2.5 print-title-avoid flex items-center gap-1.5 print:font-[Arial,Helvetica,sans-serif]">
              <Briefcase size={13} />
              Experiência Profissional
            </h3>

            <div className="space-y-3.5 print:space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-xs print:text-[8.5pt]">
                  {/* Cabeçalho da experiência */}
                  <div className="flex justify-between items-start flex-wrap gap-1 print-item-avoid">
                    <div>
                      <h4 className="font-bold text-[#1C1917] text-xs sm:text-sm print:text-[9.5pt] print:font-[Arial,Helvetica,sans-serif]">
                        {exp.role}
                      </h4>
                      <p className="text-[#881337] font-semibold text-xs print:text-[8.5pt] print:font-[Arial,Helvetica,sans-serif]">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right text-[7.5pt] print:text-[8pt] text-[#57534E] print:font-[Arial,Helvetica,sans-serif]">
                      <p className="font-semibold text-[#1C1917]">{exp.period}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>

                  {/* Lista de atribuições alinhada à esquerda sem text-justify */}
                  <ul className="mt-1 space-y-0.5 text-[#57534E] leading-[1.3] text-left list-disc pl-3.5 print:font-[Arial,Helvetica,sans-serif]">
                    {exp.activities.map((act, i) => (
                      <li key={i} className="print-item-avoid">
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* PÁGINA 2: Topo de Identificação, Cursos & Qualificações e Rodapé */}
      {/* ========================================================================= */}
      <div className="print-page pt-4 print:pt-1">
        
        {/* Linha pequena de identificação no topo da página 2 */}
        <div className="border-b border-[#E7DFD6] pb-1.5 mb-4 flex justify-between items-center text-xs text-[#57534E] print-item-avoid print:font-[Arial,Helvetica,sans-serif]">
          <span className="font-bold text-[#1C1917] text-xs print:text-[9.5pt]">{personal.fullName}</span>
          <span className="text-[8pt] font-semibold text-[#881337] uppercase tracking-wider">
            Currículo Profissional — Página 2 de 2
          </span>
        </div>

        {/* Cursos e Qualificações em 2 colunas */}
        <div>
          <h3 className="text-xs print:text-[10pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-3 print-title-avoid flex items-center gap-1.5 print:font-[Arial,Helvetica,sans-serif]">
            <Award size={14} />
            Cursos Profissionais & Certificações
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3.5 print:gap-3">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="text-xs print:text-[8.5pt] bg-white p-3 rounded-[8px] print:rounded-none border border-[#E7DFD6] print:border-[#E7DFD6] print-item-avoid"
              >
                <div className="flex justify-between items-baseline gap-1">
                  <h4 className="font-bold text-[#1C1917] print:text-[9pt] print:font-[Arial,Helvetica,sans-serif]">
                    {course.name}
                  </h4>
                  {course.workload && (
                    <span className="text-[7.5pt] print:text-[8pt] text-[#881337] font-semibold shrink-0 print:font-[Arial,Helvetica,sans-serif]">
                      {course.workload}
                    </span>
                  )}
                </div>
                <p className="text-[8pt] print:text-[8pt] text-[#881337] font-medium mb-1 print:font-[Arial,Helvetica,sans-serif]">
                  {course.institution}
                </p>
                <p className="text-[7.5pt] print:text-[8pt] text-[#57534E] leading-[1.3] text-left print:font-[Arial,Helvetica,sans-serif]">
                  {course.syllabus.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé de contato no final da página 2 */}
        <footer className="mt-8 pt-3 border-t border-[#E7DFD6] flex flex-col sm:flex-row justify-between items-center text-xs print:text-[8.5pt] text-[#57534E] gap-1 print:font-[Arial,Helvetica,sans-serif] print-item-avoid">
          <p>{personal.fullName} — Contato: {personal.phone} | {personal.email}</p>
          <p className="font-semibold text-[#881337]">
            Portfólio online: {personal.portfolioDisplay}
          </p>
        </footer>

      </div>

    </div>
  );
}
