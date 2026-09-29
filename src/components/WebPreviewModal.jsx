import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';

const WebPreviewModal = ({ isOpen, url, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) setIsLoading(true);
  }, [isOpen, url]);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && url && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className={`fixed z-[210] rounded-2xl border border-white/10 shadow-2xl bg-black overflow-hidden flex flex-col ${isMaximized ? 'inset-2 sm:inset-4' : 'inset-4 md:inset-10 lg:inset-20'}`}>
            <div className="bg-black/95 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-300 truncate">{url}</span>
              <div className="flex items-center gap-1 shrink-0">
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Open in new tab"><ExternalLink size={18} /></a>
                <button onClick={handleCopyUrl} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Copy URL">{isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}</button>
                <button onClick={() => setIsMaximized((value) => !value)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title={isMaximized ? 'Restore' : 'Maximize'}>{isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-300" title="Close"><X size={18} /></button>
              </div>
            </div>
            <div className="relative flex-1 bg-[#111]">
              {isLoading && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400"><div className="w-9 h-9 rounded-full border-2 border-white/10 border-t-nhubx-glow-primary animate-spin" /><span className="text-xs uppercase tracking-widest">Loading project</span></div>}
              <iframe src={url} onLoad={() => setIsLoading(false)} className="relative w-full h-full border-0 bg-white" title="Project Preview" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-downloads" allow="fullscreen; clipboard-read; clipboard-write" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WebPreviewModal;
