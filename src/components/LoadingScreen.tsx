import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 bg-slate-50 z-50 flex flex-col justify-center items-center p-4 print:hidden"
        >
          <div className="text-center max-w-sm w-full">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-2xl font-bold text-slate-900 tracking-wider font-display"
            >
              {PERSONAL_INFO.fullName}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-blue-900 font-semibold uppercase tracking-widest mt-2"
            >
              Portfólio Profissional
            </motion.p>

            <div className="w-full h-[2px] bg-slate-200 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="h-full bg-blue-900"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[10px] text-slate-500 font-mono mt-3 inline-block"
            >
              Carregando experiência...
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
