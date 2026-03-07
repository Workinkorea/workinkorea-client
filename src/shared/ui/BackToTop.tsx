'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none cursor-pointer"
          aria-label="맨 위로 이동"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
