import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Contact = () => {
  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10 md:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6">Let's <span className="glow-text-primary text-nhubx-glow-secondary">Connect</span></h2>
        <p className="text-gray-400 text-sm md:text-base">Reach out to the NHubX team for partnerships, support, or developer access.</p>
      </motion.div>

      <Card className="max-w-2xl mx-auto">
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Name</label>
              <input 
                type="text" 
                placeholder="Ex. John Doe"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-nhubx-glow-primary/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Email</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-nhubx-glow-primary/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Message</label>
            <textarea 
              rows="5"
              placeholder="Tell us about your project..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-nhubx-glow-primary/50 transition-all resize-none"
            />
          </div>

          <Button variant="primary" className="w-full mt-4 py-4">
            Send Message
          </Button>
        </form>
      </Card>

      <div className="mt-20 text-center text-gray-500 text-sm">
        <p>Direct Email: contact@nhubx.io</p>
        <p className="mt-2 tracking-widest font-bold">SECURE CHANNEL ACTIVE</p>
      </div>
    </div>
  );
};

export default Contact;
