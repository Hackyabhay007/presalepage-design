// app/(admin)/admin/layout.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ListOrdered, 
  LogOut,
  User
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Transactions',
    path: '/admin/transactions',
    icon: ListOrdered
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (!auth && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  if (isLoading || pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-4">
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-accent to-accent/50 
                bg-clip-text text-transparent"
            >
              Admin Panel
            </motion.h1>
            
            <nav className="hidden md:flex items-center space-x-2 ml-6">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(item.path)}
                    className={`
                      flex items-center px-4 py-2 rounded-lg text-sm
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-accent text-white' 
                        : 'hover:bg-accent/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 border-r border-border/50 pr-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-lg text-sm
                text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 
        backdrop-blur supports-[backdrop-filter]:bg-background/60 
        border-t border-border/50"
      >
        <nav className="container flex items-center justify-around h-16">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.path)}
                className={`
                  flex flex-col items-center justify-center px-4 py-2
                  rounded-lg text-xs transition-colors duration-200
                  ${isActive 
                    ? 'text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.name}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
