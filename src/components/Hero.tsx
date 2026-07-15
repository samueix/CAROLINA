import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { Download, Linkedin, Send, MessageSquare, MapPin, CheckCircle } from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(PERSONAL_INFO.photoUrl);

  const handleImageError = () => {
    const backup = (PERSONAL_INFO as any).backupPhotoUrl;
    if (photoSrc !== backup) {
      setPhotoSrc(backup);
    }
  };

  const roles = PERSONAL_INFO.roles;
  const period = 150; // Typing speed
  const deletePeriod = 75; // Deleting speed
  const pauseTime = 1500; // Time before deleting

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = roles[roleIndex];

    if (!isDeleting) {
      if (typedText !== currentFullText) {
        timer = setTimeout(() => {
          setTypedText(currentFullText.slice(0, typedText.length + 1));
        }, period);
      } else {
        // Full word typed, pause then delete
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (typedText !== '') {
        timer = setTimeout(() => {
          setTypedText(currentFullText.slice(0, typedText.length - 1));
        }, deletePeriod);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex, roles]);

  const scrollToContact = () => {
    const target = document.querySelector('#contato');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-24 pb-16 bg-slate-50/50 overflow-hidden print:hidden"
    >
      {/* Decorative Grid Patterns / Blur shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Tag location */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-xs font-semibold border border-blue-100/50 mb-6"
            >
              <MapPin size={12} className="text-blue-900" />
              <span>{PERSONAL_INFO.city}</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-slate-900 text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight"
            >
              Olá, eu sou <span className="text-blue-900 block sm:inline">{PERSONAL_INFO.displayName}</span>
            </motion.h1>

            {/* Subtitle / Typing Cargo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="h-10 sm:h-12 flex items-center mt-3"
            >
              <h2 className="font-display font-semibold text-lg sm:text-xl md:text-2xl text-blue-900 flex items-center">
                <span>{typedText}</span>
                <span className="w-[2px] h-[18px] sm:h-[22px] bg-blue-900 ml-1.5 animate-pulse" />
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mt-4"
            >
              Seja bem-vindo ao meu espaço profissional. Atuo na organização administrativa, relacionamento estratégico com clientes e atendimento de excelência com agilidade, proatividade e foco na solução.
            </motion.p>

            {/* Call to Actions (Buttons) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 mt-8 w-full sm:w-auto"
            >
              <button
                onClick={onOpenResume}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                <Download size={15} />
                Baixar Currículo (PDF)
              </button>
              
              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Send size={15} />
                Entrar em Contato
              </button>
            </motion.div>

            {/* Social Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4 mt-8"
            >
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Conecte-se comigo:
              </span>
              <div className="flex gap-2">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 flex items-center justify-center transition border border-slate-200"
                  title="Acessar LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={PERSONAL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 flex items-center justify-center transition border border-slate-200"
                  title="Falar no WhatsApp"
                >
                  <MessageSquare size={15} />
                </a>
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold"
            >
              <CheckCircle size={14} className="animate-pulse" />
              <span>Disponível para entrevistas e novos desafios</span>
            </motion.div>

          </div>

          {/* Right Column (Round Professional Image) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl shadow-blue-900/10 group border-8 border-white bg-slate-100"
            >
              {/* Soft visual glow background */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-900 to-blue-200 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500 z-0 rounded-full" />
              
              {/* The photo of Ana Carolina (perfectly round) */}
              <img
                src={photoSrc}
                onError={handleImageError}
                alt={`Foto Profissional de ${PERSONAL_INFO.fullName}`}
                className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105 rounded-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Minimal circular portrait subtitle */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <span className="text-xs font-bold text-blue-900 tracking-wide uppercase">{PERSONAL_INFO.fullName}</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-0.5">{PERSONAL_INFO.city}</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
