import React from 'react';
import { PERSONAL_INFO } from '../data';
import { Mail, Phone, Linkedin, MessageSquare, Globe, MapPin, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <section
      id="contato"
      className="py-20 bg-[#FBF7F2] border-t border-[#E7DFD6] print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title (Padrão das fases) */}
        <div className="mb-12">
          <span className="inline-block text-sm font-semibold text-[#881337] border border-[#E7DFD6] px-3.5 py-1 rounded-full mb-3 bg-white">
            05 — Contato
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1C1917] tracking-tight">
            Vamos Conversar?
          </h2>
          <p className="text-base text-[#57534E] mt-2">
            Por onde falar comigo.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Telefone */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center gap-2.5 mb-3">
              <Phone size={18} className="text-[#881337]" />
              <span className="text-sm font-semibold text-[#57534E]">
                Telefone / Celular
              </span>
            </div>
            <a 
              href="tel:+5585985976871" 
              className="text-base font-bold text-[#1C1917] hover:text-[#881337] transition-colors"
            >
              {PERSONAL_INFO.phone}
            </a>
          </div>

          {/* E-mail */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center gap-2.5 mb-3">
              <Mail size={18} className="text-[#881337]" />
              <span className="text-sm font-semibold text-[#57534E]">
                E-mail Profissional
              </span>
            </div>
            <a 
              href={`mailto:${PERSONAL_INFO.email}`} 
              className="text-base font-bold text-[#1C1917] hover:text-[#881337] transition-colors break-all"
            >
              {PERSONAL_INFO.email}
            </a>
          </div>

          {/* LinkedIn */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <Linkedin size={18} className="text-[#881337]" />
                <span className="text-sm font-semibold text-[#57534E]">
                  LinkedIn Profissional
                </span>
              </div>
              <ArrowUpRight size={16} className="text-[#57534E]" />
            </div>
            <a 
              href={PERSONAL_INFO.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-base font-bold text-[#1C1917] hover:text-[#881337] transition-colors truncate block"
            >
              carolferreiraofc
            </a>
          </div>

          {/* Localização */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center gap-2.5 mb-3">
              <MapPin size={18} className="text-[#881337]" />
              <span className="text-sm font-semibold text-[#57534E]">
                Localização & Disponibilidade
              </span>
            </div>
            <p className="text-base font-bold text-[#1C1917]">
              {PERSONAL_INFO.city}
            </p>
          </div>

          {/* Portfólio Web */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <Globe size={18} className="text-[#881337]" />
                <span className="text-sm font-semibold text-[#57534E]">
                  Portfólio Web Oficial
                </span>
              </div>
              <ArrowUpRight size={16} className="text-[#57534E]" />
            </div>
            <a 
              href={PERSONAL_INFO.portfolioUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-base font-bold text-[#1C1917] hover:text-[#881337] transition-colors truncate block"
            >
              {PERSONAL_INFO.portfolioDisplay}
            </a>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E7DFD6] flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#881337] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
            <div className="flex items-center gap-2.5 mb-3">
              <MessageSquare size={18} className="text-[#881337]" />
              <span className="text-sm font-semibold text-[#57534E]">
                Mensagem Instantânea
              </span>
            </div>
            <div>
              <a
                href={PERSONAL_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-2.5 rounded-full bg-[#047857] text-white text-base font-semibold shadow-[4px_4px_0px_#1C1917] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1C1917] focus-visible:outline-2 focus-visible:outline-[#881337] focus-visible:outline-offset-2"
              >
                <span>Falar no WhatsApp</span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
