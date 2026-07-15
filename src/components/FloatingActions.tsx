import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 print:hidden">
      <AnimatePresence>
        {/* WhatsApp Floating Button */}
        <motion.a
          key="floating-whatsapp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          href={PERSONAL_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer group relative"
          title="Falar no WhatsApp"
        >
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:opacity-0" />
          
          <MessageCircle size={28} className="relative z-10 transition-transform group-hover:scale-110" />
        </motion.a>

        {/* Back to Top Button */}
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer group"
            title="Voltar ao Topo"
            aria-label="Voltar ao Topo"
          >
            <ArrowUp size={20} className="transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
