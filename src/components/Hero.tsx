import React, { useState, useEffect } from 'react';
import { useContent } from '../useContent';
import { Download, Linkedin, Send, MessageSquare, CheckCircle, MapPin, Briefcase, Clock, GraduationCap, Award } from 'lucide-react';
import { Experience } from '../types';

interface HeroProps {
  onOpenResume: () => void;
}

const MONTH_MAP: Record<string, number> = {
  janeiro: 0, jan: 0,
  fevereiro: 1, fev: 1,
  marco: 2, março: 2, mar: 2,
  abril: 3, abr: 3,
  maio: 4, mai: 4,
  junho: 5, jun: 5,
  julho: 6, jul: 6,
  agosto: 7, ago: 7,
  setembro: 8, set: 8,
  outubro: 9, out: 9,
  novembro: 10, nov: 10,
  dezembro: 11, dez: 11
};

function parseDate(str: string): { month: number; year: number } | null {
  const clean = str.trim().toLowerCase();
  const yearMatch = clean.match(/\b(19\d\d|20\d\d)\b/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);

  let month = 0;
  for (const [mName, mIdx] of Object.entries(MONTH_MAP)) {
    if (clean.includes(mName)) {
      month = mIdx;
      break;
    }
  }
  return { month, year };
}

function calculateExperienceTime(experiences: Experience[]): string {
  let totalMonths = 0;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const yearsFound: number[] = [];

  for (const exp of experiences) {
    const period = exp.period || '';
    const parts = period.split(/\baté\b|\ba\b|-/i);
    if (parts.length >= 2) {
      const start = parseDate(parts[0]);
      if (start) {
        yearsFound.push(start.year);
        let endYear = currentYear;
        let endMonth = currentMonth;

        if (!parts[1].toLowerCase().includes('atual')) {
          const end = parseDate(parts[1]);
          if (end) {
            endYear = end.year;
            endMonth = end.month;
            yearsFound.push(end.year);
          }
        }

        const months = (endYear - start.year) * 12 + (endMonth - start.month) + 1;
        if (months > 0) {
          totalMonths += months;
        }
      }
    }
  }

  if (totalMonths <= 0) {
    if (yearsFound.length > 0) {
      const minYear = Math.min(...yearsFound);
      return `Desde ${minYear}`;
    }
    return '1 ano e 9 meses';
  }

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  } else if (years > 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else {
    return `${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  }
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { personal, experiences, courses, education } = useContent();
  const [photoSrc, setPhotoSrc] = useState(personal.photoUrl);

  // Sync photoSrc if personal.photoUrl changes via content override
  useEffect(() => {
    setPhotoSrc(personal.photoUrl);
  }, [personal.photoUrl]);

  const handleImageError = () => {
    const backup = (personal as any).backupPhotoUrl || personal.photoUrl;
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

  // 4 Cards data calculations
  const experienceTimeText = calculateExperienceTime(experiences) || '1 ano e 9 meses';
  const educationDegreeText = (education[0]?.degree || 'Ensino Médio').replace(/completo/gi, '').trim();
  const educationYearText = education[0]?.completionYear || '2023';
  const coursesCountText = `${courses.length} cursos`;

  return (
    <section
      id="inicio"
      className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-[#FBF7F2] border-b border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top row: City tag & Availability badge com ambas as disponibilidades */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold border border-[#E7DFD6] text-[#57534E] bg-white">
                <MapPin size={14} className="text-[#881337]" />
                <span>{personal.city}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold border border-[#047857] text-[#047857] bg-white">
                <CheckCircle size={14} className="text-[#047857] shrink-0" />
                <span>Disponibilidade total de horário & início imediato</span>
              </div>
            </div>

            {/* Name with clamp and thinner highlight underline (0.16em) positioned on baseline BEHIND the text */}
            <h1 className="font-display font-extrabold text-[#1C1917] text-[clamp(2.75rem,7vw,5.25rem)] tracking-tight leading-[1.08]">
              Olá, eu sou{' '}
              <span className="relative inline-block isolate">
                <span className="relative z-10">Carolina</span>
                <span 
                  className="absolute left-0 bottom-[0.08em] w-full h-[0.16em] bg-[#881337] -z-10 rounded-xs" 
                  aria-hidden="true" 
                />
              </span>{' '}
              Ferreira
            </h1>

            {/* Static Cargo / Title */}
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#881337] mt-3">
              {personal.title}
            </h2>

            {/* Roles tags: max 2 lines, lighter weight than title */}
            <div className="flex flex-wrap gap-2 mt-4 max-w-2xl">
              {personal.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full border border-[#E7DFD6] text-xs sm:text-sm font-medium text-[#57534E] bg-white/70"
                >
                  {role}
                </span>
              ))}
            </div>

            {/* Description (17px, line-height 1.7) */}
            <p className="text-[17px] text-[#57534E] max-w-[62ch] leading-[1.7] mt-6">
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

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <span className="text-sm font-semibold text-[#57534E]">
                Conecte-se comigo:
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7DFD6] text-[#1C1917] hover:border-[#1C1917] hover:text-[#881337] transition-colors text-sm font-medium bg-white"
                  title="Acessar LinkedIn"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={personal.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7DFD6] text-[#1C1917] hover:border-[#1C1917] hover:text-[#881337] transition-colors text-sm font-medium bg-white"
                  title="Falar no WhatsApp"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (Round Hero Photo with displaced sand #EADFD3 circle) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px] aspect-square">
              {/* Solid sand #EADFD3 circle displaced 14px down and right */}
              <div
                className="absolute inset-0 translate-x-[14px] translate-y-[14px] bg-[#EADFD3] rounded-full"
                aria-hidden="true"
              />
              {/* Round Photo with 3px solid border #1C1917 */}
              <div className="relative z-10 w-full h-full rounded-full border-[3px] border-[#1C1917] overflow-hidden bg-white aspect-square">
                <img
                  src={photoSrc}
                  onError={handleImageError}
                  alt={`Foto Profissional de ${personal.fullName}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-top rounded-full aspect-square"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 4 Stat Cards Perfeitamente Equilibrados e Sem Textos Longos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#E7DFD6]">
          {/* Card 1: Experiência profissional */}
          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                Atuação
              </span>
              <Briefcase size={16} className="text-[#881337]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#881337] block leading-tight">
                {experienceTimeText}
              </span>
              <h3 className="font-bold text-[#1C1917] text-sm sm:text-base mt-2">
                Experiência profissional
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Tempo de atuação
              </p>
            </div>
          </div>

          {/* Card 2: Disponibilidade */}
          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                Horário
              </span>
              <Clock size={16} className="text-[#881337]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#881337] block leading-tight">
                Integral
              </span>
              <h3 className="font-bold text-[#1C1917] text-sm sm:text-base mt-2">
                Disponibilidade
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Disponibilidade total de horário
              </p>
            </div>
          </div>

          {/* Card 3: Escolaridade */}
          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                Educação
              </span>
              <GraduationCap size={16} className="text-[#881337]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#881337] block leading-tight">
                {educationDegreeText}
              </span>
              <h3 className="font-bold text-[#1C1917] text-sm sm:text-base mt-2">
                Escolaridade
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Concluído em {educationYearText}
              </p>
            </div>
          </div>

          {/* Card 4: Qualificação */}
          <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:transform-none motion-reduce:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                Cursos
              </span>
              <Award size={16} className="text-[#881337]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#881337] block leading-tight">
                {coursesCountText}
              </span>
              <h3 className="font-bold text-[#1C1917] text-sm sm:text-base mt-2">
                Qualificação
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Cursos complementares
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
