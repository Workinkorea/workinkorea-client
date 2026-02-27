import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center mt-1 text-xs text-red-500 ${className}`}
      >
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};