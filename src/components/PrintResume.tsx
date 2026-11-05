import React, { useState, useEffect } from 'react';
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

  // Safe browser printing
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className="bg-white text-[#1C1917] p-6 sm:p-10 max-w-[850px] mx-auto border border-[#E7DFD6] rounded-[12px] print:rounded-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:shadow-none"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10.5pt',
        letterSpacing: 0,
        boxShadow: 'none'
      }}
    >
      {/* SCREEN TOOLBAR (Hidden in Print) */}
      <div className="print:hidden border-b border-[#E7DFD6] pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#881337] uppercase tracking-wider px-3 py-1 rounded-full border border-[#E7DFD6] bg-[#F3EBE2]">
              Configurações de Impressão
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

      {/* HEADER SECTION */}
      <header className="border-b-2 border-[#881337] pb-5 mb-5 break-after-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
        <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-4">
          
          {/* Avatar Photo (if enabled) + Name & Title */}
          <div className="flex items-start gap-4 flex-1">
            {config.showPhoto && (
              <div className="shrink-0">
                <div
                  className={`border-2 border-[#1C1917] overflow-hidden bg-white ${
                    config.photoShape === 'rounded'
                      ? 'w-24 h-28 sm:w-28 sm:h-32 print:w-20 print:h-24 rounded-[12px] print:rounded-none'
                      : 'w-24 h-24 sm:w-28 sm:h-28 print:w-20 print:h-20 rounded-full print:rounded-full'
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
              <h1 className="text-2xl sm:text-3xl print:text-[18pt] font-extrabold text-[#1C1917] tracking-tight font-display print:font-[Arial,Helvetica,sans-serif]">
                {personal.fullName}
              </h1>
              <h2 className="text-base print:text-[11.5pt] font-bold text-[#881337] mt-0.5 print:font-[Arial,Helvetica,sans-serif]">
                {personal.title}
              </h2>
              <p className="text-sm print:text-[10pt] text-[#57534E] mt-2 max-w-xl leading-relaxed text-justify print:font-[Arial,Helvetica,sans-serif]">
                {personal.objective}
              </p>
            </div>
          </div>

          {/* Contact Details & Optional QR Code */}
          <div className="flex items-start gap-4 print:gap-3 w-full sm:w-auto print:w-auto justify-between sm:justify-end">
            
            {/* Contacts list */}
            <div className="flex flex-col gap-1 text-sm print:text-[9.5pt] text-[#57534E] sm:items-end print:items-end print:font-[Arial,Helvetica,sans-serif]">
              <div className="flex items-center gap-1.5">
                <span>{personal.city}</span>
                <MapPin size={14} className="text-[#881337]" shrink-0 />
              </div>
              <div className="flex items-center gap-1.5">
                <span>{personal.phone}</span>
                <Phone size={14} className="text-[#881337]" shrink-0 />
              </div>
              <div className="flex items-center gap-1.5">
                <a href={`mailto:${personal.email}`} className="hover:text-[#881337] hover:underline">
                  {personal.email}
                </a>
                <Mail size={14} className="text-[#881337]" shrink-0 />
              </div>
              <div className="flex items-center gap-1.5">
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#881337] hover:underline">
                  {personal.linkedinDisplay || 'carolferreiraofc'}
                </a>
                <Linkedin size={14} className="text-[#881337]" shrink-0 />
              </div>
              {config.showPortfolioLink && (
                <div className="flex items-center gap-1.5 font-bold text-[#881337]">
                  <a href={personal.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
                    {personal.portfolioDisplay}
                  </a>
                  <Globe size={14} className="text-[#881337]" shrink-0 />
                </div>
              )}
            </div>

            {/* QR Code (if enabled) */}
            {config.showQrCode && qrCodeUrl && (
              <div className="flex flex-col items-center p-1.5 rounded-[12px] print:rounded-none border border-[#E7DFD6] shrink-0 text-center bg-white" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <img
                  src={qrCodeUrl}
                  alt="QR Code do Portfólio"
                  className="w-16 h-16 print:w-14 print:h-14 object-contain"
                />
                <span className="text-sm print:text-[8pt] font-bold text-[#881337] tracking-wider mt-0.5 print:font-[Arial,Helvetica,sans-serif]">
                  Portfólio Web
                </span>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (1/3): Sobre Mim, Formação, Competências, Diferenciais */}
        <div className="md:col-span-1 print:col-span-1 flex flex-col gap-5">
          
          {/* Perfil Profissional */}
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-2 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
              Sobre Mim
            </h3>
            <p className="text-sm print:text-[10pt] text-[#57534E] leading-relaxed text-justify print:font-[Arial,Helvetica,sans-serif]">
              {personal.about ? personal.about.split('\n')[0] : 'Profissional comunicativa, organizada e focada na satisfação do cliente.'}
            </p>
          </section>

          {/* Formação Acadêmica */}
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-2 flex items-center gap-1.5 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
              <GraduationCap size={15} />
              Formação
            </h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-sm print:text-[10pt]" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h4 className="font-bold text-[#1C1917] print:font-[Arial,Helvetica,sans-serif]">{edu.degree}</h4>
                <p className="text-[#57534E] print:font-[Arial,Helvetica,sans-serif]">{edu.institution}</p>
                <span className="inline-block text-xs print:text-[9.5pt] text-[#881337] font-semibold mt-0.5 print:font-[Arial,Helvetica,sans-serif]">
                  Conclusão: {edu.completionYear}
                </span>
              </div>
            ))}
          </section>

          {/* Competências Principais */}
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-2 flex items-center gap-1.5 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
              <Award size={15} />
              Principais Competências
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(skills.length > 0 ? skills.slice(0, 10).map((s) => s.name) : RESUME_MAIN_SKILLS).map((skillName, idx) => (
                <span 
                  key={idx} 
                  className="text-xs print:text-[9.5pt] bg-white text-[#1C1917] border border-[#E7DFD6] px-2.5 py-1 rounded-full font-medium print:rounded-none print:border-[#E7DFD6] print:font-[Arial,Helvetica,sans-serif]"
                >
                  {skillName}
                </span>
              ))}
            </div>
          </section>

          {/* Diferenciais */}
          {personal.additionalInfo && personal.additionalInfo.length > 0 && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-2 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
                Diferenciais
              </h3>
              <ul className="text-sm print:text-[10pt] text-[#57534E] space-y-1.5 print:font-[Arial,Helvetica,sans-serif]">
                {personal.additionalInfo.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-1.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <span className="text-[#881337] font-bold mt-0.5">·</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN (2/3): Experiências Profissionais e Cursos */}
        <div className="md:col-span-2 print:col-span-2 flex flex-col gap-5">
          
          {/* Experiência Profissional */}
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-3 flex items-center gap-1.5 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
              <Briefcase size={15} />
              Experiência Profissional
            </h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-sm print:text-[10.5pt]" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h4 className="font-bold text-[#1C1917] text-sm sm:text-base print:text-[11pt] print:font-[Arial,Helvetica,sans-serif]">
                        {exp.role}
                      </h4>
                      <p className="text-[#881337] font-semibold print:font-[Arial,Helvetica,sans-serif]">{exp.company}</p>
                    </div>
                    <div className="text-right text-xs print:text-[9.5pt] text-[#57534E] print:font-[Arial,Helvetica,sans-serif]">
                      <p className="font-semibold text-[#1C1917]">{exp.period}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[#57534E] leading-relaxed text-justify list-disc pl-4 print:font-[Arial,Helvetica,sans-serif]">
                    {exp.activities.map((act, i) => (
                      <li key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Cursos e Qualificações */}
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h3 className="text-sm print:text-[10.5pt] font-bold text-[#881337] border-b border-[#E7DFD6] pb-1 mb-3 flex items-center gap-1.5 font-display print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
              <Award size={15} />
              Cursos e Qualificações
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="text-sm print:text-[10pt] bg-white p-3 rounded-[12px] print:rounded-none border border-[#E7DFD6] print:border-none print:p-0"
                  style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
                >
                  <div className="flex justify-between items-baseline gap-1">
                    <h4 className="font-bold text-[#1C1917] print:font-[Arial,Helvetica,sans-serif]">{course.name}</h4>
                    {course.workload && (
                      <span className="text-xs print:text-[9pt] text-[#881337] font-semibold shrink-0 print:font-[Arial,Helvetica,sans-serif]">
                        {course.workload}
                      </span>
                    )}
                  </div>
                  <p className="text-xs print:text-[9.5pt] text-[#881337] font-medium mb-1 print:font-[Arial,Helvetica,sans-serif]">{course.institution}</p>
                  <p className="text-xs print:text-[9pt] text-[#57534E] leading-normal print:font-[Arial,Helvetica,sans-serif]">
                    {course.syllabus.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

      {/* PRINTABLE FOOTER */}
      <footer className="mt-6 pt-4 border-t border-[#E7DFD6] flex flex-col sm:flex-row justify-between items-center text-xs print:text-[9pt] text-[#57534E] gap-1 print:flex print:font-[Arial,Helvetica,sans-serif]" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <p>{personal.fullName} — Contato: {personal.phone} | {personal.email}</p>
        <p className="font-semibold text-[#881337]">
          Portfólio online: {personal.portfolioDisplay}
        </p>
      </footer>

    </div>
  );
}
