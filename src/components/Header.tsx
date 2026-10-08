import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { FileText, Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenResume, onOpenAdmin }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre Mim', href: '#sobre' },
    { label: 'Experiência', href: '#experiencia' },
    { label: 'Formação & Cursos', href: '#formacao' },
    { label: 'Competências', href: '#competencias' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 print:hidden ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-rose-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAdmin();
            }}
            className="w-10 h-10 rounded-xl bg-rose-800 flex items-center justify-center text-white font-black text-sm tracking-wide transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-md shadow-rose-900/15"
            title="Painel Administrativo da Carolina (Área Restrita)"
          >
            CF
          </div>
          <a 
            href="#inicio" 
            onClick={(e) => handleNavClick(e, '#inicio')}
            className="font-display font-semibold text-stone-900 text-xl tracking-tight hover:text-rose-800 transition cursor-pointer"
          >
            {PERSONAL_INFO.displayName}
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xs font-medium uppercase tracking-widest text-stone-600 hover:text-rose-800 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Call To Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-900/15"
          >
            <FileText size={14} />
            Visualizar Currículo
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenResume}
            className="p-2 text-stone-700 hover:text-rose-800 transition"
            title="Visualizar Currículo"
          >
            <FileText size={18} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-rose-800 transition cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-rose-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block py-2 text-sm font-medium text-stone-600 hover:text-rose-800 hover:bg-rose-50/60 px-3 rounded-lg transition"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-rose-100 px-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  <FileText size={16} />
                  Visualizar Currículo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
