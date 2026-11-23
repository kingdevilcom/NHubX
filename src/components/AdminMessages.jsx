import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Clock, User, Copy, Check, ShieldAlert } from 'lucide-react';
import { fetchMessages, deleteMessage, saveEnquiryStage } from '../firebase';
import { enquiryStages, getEnquiryPlan, getEnquiryStage } from '../enquiryTracking';
import { readEnquirySource } from '../leadSource';

function replyLink(email, plan) {
  const address = encodeURIComponent(email).replace('%40', '@');
  const subject = encodeURIComponent(plan ? 'Your NHubX ' + plan + ' enquiry' : 'Your NHubX enquiry');
  return 'mailto:' + address + '?subject=' + subject;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [stageFilter, setStageFilter] = useState('All');
  const [savingStage, setSavingStage] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setNotice('The inbox could not be loaded. Try opening it again.');
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  const updateStage = async (id, stage) => {
    setSavingStage(true);
    setNotice('');
    try {
      await saveEnquiryStage(id, stage);
      setMessages((current) => current.map((message) => message.id === id ? { ...message, stage } : message));
      setNotice('Enquiry moved to ' + stage + '.');
    } catch (error) {
      console.error('Unable to save enquiry stage:', error);
      setNotice('Could not save the stage. Check your admin access and the published Firestore rules.');
    } finally {
      setSavingStage(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Decrypt and purge this message block permanently?")) {
      try {
        await deleteMessage(id);
        setMessages((current) => current.filter(m => m.id !== id));
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

  const visibleMessages = messages.filter((message) => stageFilter === 'All' || getEnquiryStage(message.stage) === stageFilter);

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
              Enquiry inbox
            </h3>
          </div>
        </div>
        <div className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          LOGGED TRANSMISSIONS: <span className="text-nhubx-glow-primary font-bold">{messages.length}</span>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3 text-sm">
          Filter by stage
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="rounded-lg border border-white/10 bg-nhubx-bg-secondary px-3 py-2 text-white">
            <option value="All">All stages</option>
            {enquiryStages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
        <p role="status" className="text-sm text-gray-400">{notice}</p>
      </div>

      {/* Messages Grid/List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg, idx) => {
            const { source, message } = readEnquirySource(msg.message);
            const plan = getEnquiryPlan(message);
            const reply = replyLink(msg.email, plan);
            return (
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
                    <a href={reply} className="hover:text-nhubx-glow-primary transition-colors underline">
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

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-semibold text-nhubx-glow-primary">{plan || 'General enquiry'}</p>
                  <p className="mt-1 text-xs text-gray-400">{source || 'Source unavailable'}</p>
                </div>
                <label className="flex items-center gap-2 text-gray-300">
                  Stage
                  <select aria-label={'Stage for ' + msg.name} value={getEnquiryStage(msg.stage)} disabled={savingStage} onChange={(event) => updateStage(msg.id, event.target.value)} className="rounded-lg border border-white/10 bg-nhubx-bg-secondary px-3 py-2 text-white disabled:opacity-50">
                    {enquiryStages.map((stage) => <option key={stage}>{stage}</option>)}
                  </select>
                </label>
              </div>

              {/* Message Payload */}
              <div className="bg-black/25 border border-white/5 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {message}
              </div>
              <a href={reply} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-nhubx-glow-primary px-3 text-sm font-semibold hover:bg-nhubx-glow-hover">
                <Mail size={15} aria-hidden="true" /> Reply by email
              </a>

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
            );
          })}
        </AnimatePresence>

        {visibleMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl border border-white/5 p-12 text-center text-gray-500 font-mono bg-white/[0.01]"
          >
            <ShieldAlert className="w-12 h-12 mx-auto text-gray-600 mb-4 animate-pulse" />
            <p className="text-sm font-bold">{stageFilter === 'All' ? 'No enquiries yet' : 'No enquiries in this stage'}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
