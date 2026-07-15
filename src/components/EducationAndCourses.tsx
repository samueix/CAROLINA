import React from 'react';
import { motion } from 'motion/react';
import { EDUCATION_LIST, COURSES_LIST } from '../data';
import { GraduationCap, Award, BookOpen, Clock, Calendar, Check } from 'lucide-react';

export default function EducationAndCourses() {
  return (
    <section
      id="formacao"
      className="py-20 bg-white border-t border-slate-200 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Educação
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900 mt-3 tracking-tight">
            Formação & Cursos de Qualificação
          </h2>
          <div className="w-12 h-1 bg-blue-900 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Education - Formação Acadêmica) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="text-blue-900" size={22} />
              <h3 className="text-lg font-bold font-display text-slate-900">
                Formação Acadêmica
              </h3>
            </div>
            
            {EDUCATION_LIST.map((edu) => (
              <motion.div
                key={edu.id}
                whileHover={{ y: -2 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
              >
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase mb-4">
                  Ensino Regular
                </span>
                <h4 className="text-base font-bold text-slate-900 font-display leading-snug">
                  {edu.degree}
                </h4>
                <p className="text-sm font-semibold text-blue-900 mt-1">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-4 font-medium">
                  <Calendar size={13} />
                  <span>Concluído em {edu.completionYear}</span>
                </div>
              </motion.div>
            ))}

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 text-slate-700">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                Evolução Contínua
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Sempre atualizada com as tendências administrativas, rotinas corporativas modernas e excelência em relacionamento interpessoal.
              </p>
            </div>
          </div>

          {/* Right Column (Courses - Cursos Livres/Especializações) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-blue-900" size={22} />
              <h3 className="text-lg font-bold font-display text-slate-900">
                Cursos Profissionais & Certificados
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COURSES_LIST.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 flex flex-col h-full"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full">
                      IEP Certificado
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display leading-snug">
                    {course.name}
                  </h4>
                  <p className="text-xs font-semibold text-blue-900 mt-1">
                    {course.institution}
                  </p>

                  <div className="w-full h-px bg-slate-100 my-4" />

                  {/* Syllabus tags/topics */}
                  <div className="flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Grade Curricular:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.syllabus.map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
