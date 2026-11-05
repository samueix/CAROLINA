import React, { useState } from 'react';
import { PERSONAL_INFO, EXPERIENCES, COURSES_LIST, SKILLS_LIST } from '../data';
import { Download, Linkedin, Send, MessageSquare, CheckCircle, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const [photoSrc, setPhotoSrc] = useState(PERSONAL_INFO.photoUrl);

  const handleImageError = () => {
    const backup = (PERSONAL_INFO as any).backupPhotoUrl;
    if (photoSrc !== backup) {
      setPhotoSrc(backup);
    }
  };

  const scrollToContact = () => {
    const target = document.querySelector('#contato');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCourseHours = COURSES_LIST.reduce(
    (acc, c) => acc + (parseInt(c.workload, 10) || 0),
    0
  );

  return (
    <section
      id="inicio"
      className="relative pt-28 pb-20 bg-[#FBF7F2] border-b border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top row: City tag & Availability seal */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold border border-[#E7DFD6] text-[#57534E] bg-white">
                <MapPin size={14} className="text-[#881337]" />
                <span>{PERSONAL_INFO.city}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold border border-[#047857] text-[#047857] bg-white">
                <CheckCircle size={14} className="text-[#047857] shrink-0" />
                <span>Disponível para início imediato e entrevistas</span>
              </div>
            </div>

            {/* Name with solid pure-CSS underline on first name */}
            <h1 className="font-display font-extrabold text-[#1C1917] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              Olá, eu sou{' '}
              <span
                className="inline-block"
                style={{
                  backgroundImage: 'linear-gradient(#881337, #881337)',
                  backgroundSize: '100% 0.3em',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 100%',
                }}
              >
                Carolina
              </span>{' '}
              Ferreira
            </h1>

            {/* Static Cargo / Title */}
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#881337] mt-3">
              {PERSONAL_INFO.title}
            </h2>

            {/* Roles tags in pills with 1px border and transparent background */}
            <div className="flex flex-wrap gap-2 mt-4">
              {PERSONAL_INFO.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full border border-[#E7DFD6] text-xs sm:text-sm font-medium text-[#57534E] bg-transparent"
                >
                  {role}
                </span>
              ))}
            </div>

            {/* Description (min 16px, max 60ch, unmodified text) */}
            <p className="text-base sm:text-lg text-[#57534E] max-w-[60ch] leading-relaxed mt-6">
              Seja bem-vindo ao meu espaço profissional. Uno a precisão das rotinas administrativas corporativas ao atendimento acolhedor de alta fidelização. Pronta para contribuir com organização, notas fiscais, CRM e simpatia no atendimento ao público.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 mt-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenResume}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#047857] hover:bg-[#036546] text-white rounded-full text-base font-semibold shadow-[4px_4px_0_#1C1917] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
              >
                <Download size={18} />
                Baixar Currículo (PDF)
              </button>
              
              <button
                type="button"
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white rounded-full text-base font-semibold transition-colors cursor-pointer"
              >
                <Send size={18} />
                Entrar em Contato
              </button>
            </div>

            {/* Social Links (pills with fine border, no shadow, neutral hover) */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <span className="text-sm font-semibold text-[#57534E]">
                Conecte-se comigo:
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7DFD6] text-[#1C1917] hover:border-[#881337] hover:text-[#881337] transition-colors text-sm font-medium bg-white"
                  title="Acessar LinkedIn"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={PERSONAL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7DFD6] text-[#1C1917] hover:border-[#881337] hover:text-[#881337] transition-colors text-sm font-medium bg-white"
                  title="Falar no WhatsApp"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (Rectangular Photo with displaced wine block) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px]">
              {/* Solid wine block displaced 16px down and right */}
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 bg-[#881337] rounded-[12px]"
                aria-hidden="true"
              />
              {/* Photo frame with 2px solid border, 12px radius */}
              <div className="relative z-10 w-full h-full rounded-[12px] border-2 border-[#1C1917] overflow-hidden bg-white">
                <img
                  src={photoSrc}
                  onError={handleImageError}
                  alt={`Foto Profissional de ${PERSONAL_INFO.fullName}`}
                  className="w-full h-full object-cover object-[center_16%]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 4 Stat Cards with real calculated data from data.ts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#E7DFD6]">
          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6]">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#881337] block">
              {EXPERIENCES.length}
            </span>
            <p className="text-sm font-medium text-[#57534E] mt-1">
              Experiências
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6]">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#881337] block">
              {COURSES_LIST.length}
            </span>
            <p className="text-sm font-medium text-[#57534E] mt-1">
              Cursos
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6]">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#881337] block">
              {totalCourseHours} h
            </span>
            <p className="text-sm font-medium text-[#57534E] mt-1">
              Horas de cursos
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6]">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#881337] block">
              {SKILLS_LIST.length}
            </span>
            <p className="text-sm font-medium text-[#57534E] mt-1">
              Competências
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
