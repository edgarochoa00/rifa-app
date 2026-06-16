'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onAuthenticate: () => void;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'rifa2025';

export default function AdminLogin({ onAuthenticate }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-2xl p-8">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-accent-cyan" />
          </div>

          <h1 className="text-xl font-bold text-text-primary text-center mb-1">
            Panel de Administración
          </h1>
          <p className="text-sm text-text-muted text-center mb-6">
            Ingresa la contraseña para acceder
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all pr-10 ${
                  error ? 'border-red-500/50' : 'border-border-subtle'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold text-sm shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>


        </div>
      </motion.div>
    </div>
  );
}
