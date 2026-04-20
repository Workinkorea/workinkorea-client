import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: 'default' | 'diagnosis';
}

export const ErrorMessage = ({ message, className = '', variant = 'default' }: ErrorMessageProps) => {
  const isDiagnosis = variant === 'diagnosis';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className={
          isDiagnosis
            ? `flex items-center gap-2 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-caption-1 font-medium text-red-700 ${className}`
            : `flex items-center mt-1 text-caption-2 text-status-error ${className}`
        }
      >
        {isDiagnosis && <AlertCircle size={16} className="text-red-500 shrink-0" />}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};