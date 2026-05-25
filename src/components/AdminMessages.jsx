import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Clock, User, Copy, Check, ShieldAlert } from 'lucide-react';
import { fetchMessages, deleteMessage } from '../firebase';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Decrypt and purge this message block permanently?")) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error("Failed to delete message:", error);
        alert("Failed to purge message: " + error.message);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown Time';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-nhubx-glow-primary border-white/5 animate-spin" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono animate-pulse">
          Acquiring Secure Signal Logs...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DB Console Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-nhubx-glow-primary/10 border border-nhubx-glow-primary/20">
            <Mail className="w-5 h-5 text-nhubx-glow-primary animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400">
              STATUS: <span className="text-green-400 font-bold">ONLINE</span> // TUNNEL ACTIVE
            </p>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Secure Transmission Logs
            </h3>
          </div>
        </div>
        <div className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          LOGGED TRANSMISSIONS: <span className="text-nhubx-glow-primary font-bold">{messages.length}</span>
        </div>
      </motion.div>

      {/* Messages Grid/List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass rounded-xl border border-white/10 p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:border-nhubx-glow-primary/30 group hover:shadow-glow/5"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.04] font-mono">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white">
                    <User size={14} className="text-nhubx-glow-primary" />
                    <span className="text-sm font-bold tracking-wider">{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-gray-500">Routing:</span>
                    <a href={`mailto:${msg.email}`} className="hover:text-nhubx-glow-primary transition-colors underline">
                      {msg.email}
                    </a>
                    <button
                      onClick={() => copyToClipboard(msg.email, msg.id + '_email')}
                      className="p-1 hover:bg-white/5 rounded transition-colors text-gray-500 hover:text-white"
                      title="Copy Email"
                    >
                      {copiedId === msg.id + '_email' ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                  <Clock size={12} />
                  <span>{formatDate(msg.timestamp)}</span>
                </div>
              </div>

              {/* Message Payload */}
              <div className="bg-black/25 border border-white/5 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {msg.message}
              </div>

              {/* Floating Delete Action */}
              <div className="absolute right-4 bottom-4 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(msg.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg border border-transparent hover:border-red-500/30 transition-all text-gray-500 hover:text-red-400"
                  title="Purge transmission block"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl border border-white/5 p-12 text-center text-gray-500 font-mono bg-white/[0.01]"
          >
            <ShieldAlert className="w-12 h-12 mx-auto text-gray-600 mb-4 animate-pulse" />
            <p className="text-sm uppercase tracking-widest font-bold mb-2">No transmissions logged</p>
            <p className="text-xs text-gray-600">The encrypted communication channel is idle.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
