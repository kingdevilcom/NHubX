import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { Lock, Mail, Globe, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { saveMessage } from '../firebase';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await saveMessage(name, email, message);
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
      
      {/* Background glow meshes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-nhubx-glow-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/[0.02] blur-3xl rounded-full -z-10" />

      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-nhubx-glow-primary/10 border border-nhubx-glow-primary/30 text-nhubx-glow-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            AES-256 Handshake Enabled
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none">
            Secure <span className="glow-text-primary text-nhubx-glow-secondary">Channel</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Establish a direct node connections for architectural collaborations, operational queries, or cryptographic consultation.
          </p>
        </motion.div>

        {/* Secure Form Card */}
        <Card className="glass-panel border-white/[0.06] p-6 sm:p-10 md:p-12 shadow-2xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] select-none pointer-events-none">
            <Lock className="w-48 h-48 text-white" />
          </div>
          
          <form className="flex flex-col gap-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                  Ident / Name
                </label>
                <input 
                  type="text" 
                  placeholder="Ex. Agent Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] focus:border-nhubx-glow-primary/50 focus:ring-1 focus:ring-nhubx-glow-primary/50 text-white rounded-lg px-4 py-3.5 outline-none transition-all duration-300 font-mono text-sm placeholder-gray-600 shadow-inner"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                  Routing / Email
                </label>
                <input 
                  type="email" 
                  placeholder="name@nexus.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] focus:border-nhubx-glow-primary/50 focus:ring-1 focus:ring-nhubx-glow-primary/50 text-white rounded-lg px-4 py-3.5 outline-none transition-all duration-300 font-mono text-sm placeholder-gray-600 shadow-inner"
                  required
                  disabled={status === 'loading'}
                />
              </div>
            </div>
            
            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                Message Telemetry
              </label>
              <textarea 
                rows="5"
                placeholder="Compose secure datablock transfer details here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] focus:border-nhubx-glow-primary/50 focus:ring-1 focus:ring-nhubx-glow-primary/50 text-white rounded-lg px-4 py-3.5 outline-none transition-all duration-300 font-mono text-sm placeholder-gray-600 resize-none shadow-inner"
                required
                disabled={status === 'loading'}
              />
            </div>

            {/* Status indicators */}
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-3 text-xs font-mono"
              >
                <CheckCircle2 size={16} />
                TRANSMISSION SUCCESSFUL // DATA_BLOCK_COMMITTED
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3 text-xs font-mono"
              >
                <AlertTriangle size={16} />
                TRANSMISSION FAILED // SECURE_WRITE_REJECTED
              </motion.div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-4 py-4 rounded-lg flex items-center justify-center gap-2"
              disabled={status === 'loading'}
            >
              <Lock size={14} className={status === 'loading' ? 'animate-spin' : ''} />
              {status === 'loading' ? 'Transmitting Secure Block...' : 'Transmit Secure Block'}
            </Button>
          </form>
        </Card>

        {/* Footer info blocks */}
        <div className="mt-16 grid sm:grid-cols-2 gap-6 text-center sm:text-left text-gray-500 text-xs font-mono">
          <div className="glass bg-white/[0.01] border-white/[0.06] rounded-xl p-4 flex items-center gap-3 justify-center sm:justify-start">
            <Mail size={16} className="text-nhubx-glow-primary" />
            <div>
              <p className="text-[10px] text-gray-600 uppercase font-mono tracking-wider">Direct Endpoint</p>
              <p className="text-gray-400 font-semibold mt-0.5">contact@nhubx.com</p>
            </div>
          </div>
          
          <div className="glass bg-white/[0.01] border-white/[0.06] rounded-xl p-4 flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck size={16} className="text-green-500 animate-pulse" />
            <div>
              <p className="text-[10px] text-gray-600 uppercase font-mono tracking-wider">Encryption Tunnel</p>
              <p className="text-green-400 font-semibold mt-0.5">SECURE HANDSHAKE COMPLETED</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
