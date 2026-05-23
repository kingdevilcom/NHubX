import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

const WebPreviewModal = ({ isOpen, url, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && url && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed z-50 rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col ${
              isMaximized 
                ? 'inset-0 m-4 md:m-6' 
                : 'inset-4 md:inset-8 lg:inset-20'
            }`}
          >
            {/* Header */}
            <div className="glass-panel bg-black/40 border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-300 truncate">{url}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyUrl}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Copy URL"
                >
                  {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title={isMaximized ? 'Minimize' : 'Maximize'}
                >
                  {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex-1 overflow-hidden bg-black/20">
              <iframe
                src={url}
                className="w-full h-full border-0"
                title="Project Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              />
            </div>

            {/* Loading State Fallback */}
            <style>{`
              iframe {
                background: linear-gradient(45deg, rgba(255, 90, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WebPreviewModal;
