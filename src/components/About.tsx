import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { Sparkles, Shield, Bookmark, Calendar, Briefcase, FileCheck } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <FileCheck className="text-blue-600" size={20} />,
      title: "Organização Rigorosa",
      desc: "Gestão impecável de documentos administrativos, controle de arquivos e lançamentos financeiros operacionais."
    },
    {
      icon: <Shield className="text-blue-600" size={20} />,
      title: "Comprometimento e Ética",
      desc: "Atuação profissional pautada na responsabilidade, pontualidade, sigilo corporativo e proatividade cotidiana."
    },
    {
      icon: <Calendar className="text-blue-600" size={20} />,
      title: "Gestão Inteligente",
      desc: "Habilidade na administração de agendas complexas, controle de estoque de insumos e organização logística."
    },
    {
      icon: <Sparkles className="text-blue-600" size={20} />,
      title: "Relações Humanas",
      desc: "Atendimento caloroso, escuta ativa e comunicação focada em fidelização e na resolução de conflitos."
    }
  ];

  return (
    <section
      id="sobre"
      className="py-20 bg-white border-t border-slate-100 relative overflow-hidden print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Sobre Mim
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900 mt-3 tracking-tight">
            Perfil Profissional e Trajetória
          </h2>
          <div className="w-12 h-1 bg-blue-900 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block (Text and bio) */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-bold font-display text-blue-900">
              Minha missão é simplificar rotinas e encantar clientes com simpatia e organização.
            </h3>
            
            <div className="text-slate-600 text-sm leading-relaxed space-y-4">
              <p>
                Atuo em múltiplos pilares que exigem agilidade e excelente relacionamento interpessoal. Como <strong className="text-slate-900">Recepcionista Administrativa</strong> no ambiente corporativo da Solistica, adquiri forte domínio em lançamentos fiscais, atendimento telefônico/presencial, CRM e suporte financeiro prático.
              </p>
              <p>
                Paralelamente, a atuação como <strong className="text-slate-900">Empreendedora Autônoma</strong> na área da beleza me ensinou o real valor da autogestão: organização rigorosa de agendas, negociação via WhatsApp e redes sociais, controle estrito de estoque e fidelização genuína através de experiências personalizadas.
              </p>
              <p>
                Esta combinação singular de competências me permite ser uma profissional versátil, resiliente, com extrema facilidade para se adaptar a novos softwares de gestão corporativa e contribuir positivamente para o clima organizacional.
              </p>
            </div>

            {/* Micro-stats cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <span className="text-2xl font-bold text-blue-900 font-display">100%</span>
                <p className="text-xs text-slate-500 font-medium mt-1">Dedicação & Compromisso</p>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <span className="text-2xl font-bold text-blue-900 font-display">Fortaleza</span>
                <p className="text-xs text-slate-500 font-medium mt-1">Ceará, Brasil</p>
              </div>
            </div>
          </div>

          {/* Right Block (Key values cards grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
