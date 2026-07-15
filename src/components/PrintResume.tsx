import React from 'react';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_LIST, COURSES_LIST, SKILLS_LIST } from '../data';
import { Mail, Phone, MapPin, Linkedin, Award, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';

interface PrintResumeProps {
  onClose?: () => void;
}

export default function PrintResume({ onClose }: PrintResumeProps) {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div className="max-w-[800px] mx-auto bg-white text-slate-800 p-8 md:p-12 shadow-2xl rounded-2xl border border-slate-100 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full">
      
      {/* Iframe Warning Banner */}
      {isIframe && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-3xl mb-6 text-xs flex flex-col gap-2 print:hidden shadow-sm">
          <p className="font-bold flex items-center gap-1.5 text-amber-800 text-sm">
            ⚠️ Atenção: Limitação de Impressão na Prévia
          </p>
          <p className="text-slate-600 leading-relaxed">
            Navegadores bloqueiam a impressão direta de dentro do painel de desenvolvimento (iframe). 
            Para baixar seu currículo em PDF perfeitamente, clique no botão abaixo para abrir o site em uma nova aba e clique em <strong>"Imprimir / Salvar PDF"</strong> lá!
          </p>
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition w-fit mt-1 shadow-md shadow-blue-900/10"
          >
            Abrir Portfólio em Nova Aba 🚀
          </a>
        </div>
      )}

      {/* Print Control Bar - Hidden when printing */}
      {onClose && (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-6 border-b border-slate-100 print:hidden">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Visualização do Currículo</h3>
            <p className="text-xs text-slate-500">Pronto para salvar como PDF ou imprimir</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (isIframe) {
                  alert("Para salvar o PDF, primeiro clique no botão 'Abrir Portfólio em Nova Aba 🚀' exibido no aviso em amarelo acima. O navegador não permite imprimir de dentro deste painel lateral!");
                } else {
                  window.print();
                }
              }}
              className="px-5 py-2.5 bg-blue-900 text-white rounded-full hover:bg-blue-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-900/20"
              id="print-btn"
            >
              Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Fechar Prévia
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="border-b-4 border-blue-900 pb-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">{PERSONAL_INFO.fullName}</h1>
            <h2 className="text-lg font-semibold text-blue-900 mt-1">{PERSONAL_INFO.title}</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xl font-medium">{PERSONAL_INFO.objective}</p>
          </div>
          
          <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-medium md:items-end w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span>{PERSONAL_INFO.city}</span>
              <MapPin size={14} className="text-blue-900 hidden md:inline" />
            </div>
            <div className="flex items-center gap-2">
              <span>{PERSONAL_INFO.phone}</span>
              <Phone size={14} className="text-blue-900 hidden md:inline" />
            </div>
            <div className="flex items-center gap-2">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">{PERSONAL_INFO.email}</a>
              <Mail size={14} className="text-blue-900 hidden md:inline" />
            </div>
            <div className="flex items-center gap-2">
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:underline">linkedin.com/in/ana-carolina</a>
              <Linkedin size={14} className="text-blue-900 hidden md:inline" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column (1/3): Skills, Info & Education */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* About Me (Resumo) */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
              Sobre Mim
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              Profissional organizada e comunicativa, com experiência consolidada em recepção, atendimento ao cliente e suporte administrativo. Desenvolve competências financeiras e operacionais com proatividade e compromisso.
            </p>
          </section>

          {/* Education (Formação) */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <GraduationCap size={15} />
              Formação
            </h3>
            {EDUCATION_LIST.map((edu) => (
              <div key={edu.id} className="text-xs">
                <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                <p className="text-slate-600">{edu.institution}</p>
                <span className="text-[10px] text-blue-900 font-semibold bg-blue-50 px-1.5 py-0.5 rounded print:p-0 print:bg-none">Conclusão: {edu.completionYear}</span>
              </div>
            ))}
          </section>

          {/* Competências Principais */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <Award size={15} />
              Competências
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS_LIST.filter(s => s.level >= 85).map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium print:border print:border-slate-200 print:bg-white"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Informações Adicionais */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
              Diferenciais
            </h3>
            <ul className="text-[11px] text-slate-600 space-y-1">
              {PERSONAL_INFO.additionalInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-900 mt-0.5">▪</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column (2/3): Experience & Courses */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Experiences */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-4 flex items-center gap-2">
              <Briefcase size={15} />
              Experiência Profissional
            </h3>
            <div className="space-y-5">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{exp.role}</h4>
                      <p className="text-blue-900 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 font-semibold">
                      <p>{exp.period}</p>
                      <p className="italic font-normal">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-600 leading-relaxed text-justify list-disc pl-4">
                    {exp.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Courses & Qualifications */}
          <section>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-4 flex items-center gap-2">
              <Award size={15} />
              Cursos e Qualificações
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSES_LIST.map((course) => (
                <div key={course.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100 print:bg-white print:border-none print:p-0">
                  <h4 className="font-bold text-slate-900">{course.name}</h4>
                  <p className="text-[10px] text-blue-900 font-medium mb-1.5">{course.institution}</p>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-3 print:line-clamp-none">
                    {course.syllabus.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
      
      {/* Printable Footer */}
      <footer className="hidden print:block mt-8 pt-4 border-t border-slate-100 text-center text-[9px] text-slate-400">
        <p>{PERSONAL_INFO.fullName} — Contato: {PERSONAL_INFO.phone} | {PERSONAL_INFO.email}</p>
      </footer>
    </div>
  );
}
