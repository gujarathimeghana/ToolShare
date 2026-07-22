import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext';

const NotificationToast = () => {
  const { toast, clearToast } = useNotification();

  if (!toast) return null;

  const icons = {
    success: <FiCheckCircle class="text-emerald-500 text-xl" />,
    error: <FiAlertCircle class="text-rose-500 text-xl" />,
    info: <FiInfo class="text-indigo-500 text-xl" />
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        class="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-4 max-w-md"
      >
        {icons[toast.type] || icons.info}
        <p class="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">{toast.message}</p>
        <button onClick={clearToast} class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <FiX />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationToast;
