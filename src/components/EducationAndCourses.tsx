import React from 'react';
import { useContent } from '../useContent';
import { Calendar } from 'lucide-react';

export default function EducationAndCourses() {
  const { education, courses } = useContent();

  return (
    <section
      id="formacao"
      className="py-20 sm:py-28 bg-[#FBF7F2] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-14 text-left">
          <span className="inline-block text-xs font-bold text-[#881337] uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#E7DFD6] mb-3 bg-white">
            03 — Formação
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold font-display text-[#1C1917] tracking-tight leading-tight">
            Formação & Cursos de Qualificação
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            Estudos e cursos que complementam a prática.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Formação Acadêmica) */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-display text-[#1C1917] mb-4">
                Formação Acadêmica
              </h3>
            </div>
            
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
              >
                <span className="inline-block text-sm font-semibold text-[#881337] border border-[#E7DFD6] px-3 py-0.5 rounded-full mb-3">
                  Ensino Regular
                </span>
                <h4 className="text-lg font-bold text-[#1C1917] font-display leading-snug">
                  {edu.degree}
                </h4>
                <p className="text-base font-semibold text-[#881337] mt-1">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-[#57534E] mt-4 font-medium">
                  <Calendar size={15} className="text-[#881337]" />
                  <span>Concluído em {edu.completionYear}</span>
                </div>
              </div>
            ))}

            <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6]">
              <h4 className="text-sm font-bold text-[#881337] uppercase tracking-wider mb-2">
                Aperfeiçoamento Contínuo
              </h4>
              <p className="text-[17px] leading-[1.7] text-[#57534E]">
                Comprometida com atualização constante em rotinas administrativas, excelência em acolhimento e postura corporativa.
              </p>
            </div>
          </div>

          {/* Right Column (Cursos Profissionais) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-display text-[#1C1917] mb-4">
                Cursos Profissionais & Certificados
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col h-full transition-all duration-150 hover:-translate-y-1 hover:border-[#1C1917] hover:shadow-[4px_4px_0_#1C1917] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-lg font-bold text-[#1C1917] font-display leading-snug">
                      {course.name}
                    </h4>
                    {course.workload && (
                      <span className="shrink-0 text-sm font-semibold text-[#57534E] border border-[#E7DFD6] px-3 py-0.5 rounded-full">
                        {course.workload}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[#881337] mb-4">
                    {course.institution}
                  </p>

                  <div className="w-full h-px bg-[#E7DFD6] mb-4" />

                  {/* Conteúdo Programático */}
                  <div className="flex flex-col gap-2 flex-grow">
                    <span className="text-sm font-bold text-[#57534E] uppercase tracking-wider">
                      Grade Curricular:
                    </span>
                    <ul className="space-y-1.5 mt-1">
                      {course.syllabus.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#1C1917] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#881337] shrink-0 mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
