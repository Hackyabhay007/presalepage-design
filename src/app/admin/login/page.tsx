'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (auth) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminSession', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleLogin} className="bg-card border border-border/50 
          rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  className="w-full px-4 py-2 pl-10 bg-background border 
                    border-border/50 rounded-lg focus:outline-none 
                    focus:border-accent/50"
                  placeholder="Enter username"
                />
                <User className="w-4 h-4 absolute left-3 top-1/2 
                  -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  className="w-full px-4 py-2 pl-10 bg-background border 
                    border-border/50 rounded-lg focus:outline-none 
                    focus:border-accent/50"
                  placeholder="Enter password"
                />
                <Lock className="w-4 h-4 absolute left-3 top-1/2 
                  -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-accent text-white rounded-xl
              hover:bg-accent/90 transition-colors"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
