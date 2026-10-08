import React from 'react';
import { PERSONAL_INFO } from '../data';
import { Mail, Phone, Linkedin, MessageSquare, Send, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <section
      id="contato"
      className="py-20 bg-white border-t border-rose-100 relative overflow-hidden print:hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/50">
            Contato
          </span>
          <h2 className="text-3xl font-bold font-display text-stone-900 mt-3 tracking-tight">
            Vamos Conversar?
          </h2>
          <p className="text-stone-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Sinta-se à vontade para entrar em contato diretamente. Estou disponível para responder propostas, agendar entrevistas e esclarecer dúvidas.
          </p>
          <div className="w-12 h-1 bg-rose-800 mx-auto mt-4 rounded-full" />
        </div>

        {/* Center Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          
          {/* Telephone */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-stone-50/60 border border-stone-200 shadow-sm hover:border-rose-200 hover:bg-white transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 shadow-sm">
              <Phone size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">Telefone / Celular</span>
              <a href={`tel:+5585985976871`} className="text-base font-bold text-stone-800 hover:text-rose-800 transition">
                {PERSONAL_INFO.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-stone-50/60 border border-stone-200 shadow-sm hover:border-rose-200 hover:bg-white transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 shadow-sm">
              <Mail size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">E-mail Profissional</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-base font-bold text-stone-800 hover:text-rose-800 transition break-all block">
                {PERSONAL_INFO.email}
              </a>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-stone-50/60 border border-stone-200 shadow-sm hover:border-rose-200 hover:bg-white transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 shadow-sm">
              <Linkedin size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">LinkedIn Profissional</span>
              <a 
                href={PERSONAL_INFO.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="text-base font-bold text-stone-800 hover:text-rose-800 transition truncate block"
              >
                carolferreiraofc
              </a>
            </div>
          </div>

          {/* Portfolio Web */}
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-stone-50/60 border border-stone-200 shadow-sm hover:border-rose-200 hover:bg-white transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 shadow-sm">
              <Globe size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-0.5">Portfólio Web Oficial</span>
              <a 
                href={PERSONAL_INFO.portfolioUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-base font-bold text-stone-800 hover:text-rose-800 transition truncate block"
              >
                {PERSONAL_INFO.portfolioDisplay}
              </a>
            </div>
          </div>

          {/* WhatsApp direct launch card */}
          <div className="md:col-span-2">
            <a
              href={PERSONAL_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 rounded-3xl bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-950 border border-emerald-500/15 hover:border-emerald-500/25 transition duration-300 group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-0.5">Conversa Imediata</span>
                  <span className="text-base font-bold block">Falar com Carolina Ferreira no WhatsApp</span>
                </div>
              </div>
              <Send size={18} className="text-emerald-700 transition-transform group-hover:translate-x-1 mr-2" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
