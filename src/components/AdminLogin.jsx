import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = ({ onLoginSuccess }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle, isAuthLoading } = useAdmin();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (loginError) {
      if (loginError.code !== 'auth/popup-closed-by-user') {
        setError(loginError.message || 'Unable to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl border border-white/10 p-8 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-nhubx-glow-primary/20 rounded-full">
                <Lock className="w-8 h-8 text-nhubx-glow-primary" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 glow-text-primary">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Sign in with the authorized Google account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleLogin}
              disabled={isLoading || isAuthLoading}
              className="w-full bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-glow active:scale-95"
            >
              {isLoading || isAuthLoading ? 'Signing in...' : 'Continue with Google'}
            </motion.button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Protected area. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
