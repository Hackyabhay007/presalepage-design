// components/dashboard/DashboardHeader.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, ShoppingBag } from 'lucide-react';

export function DashboardHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'My Tokens',
      description: 'View your token holdings',
      href: '/dashboard',
      icon: Wallet,
    },
    {
      title: 'Buy Tokens',
      description: 'Participate in active presales',
      href: '/dashboard/buy',
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          <nav className="flex flex-1 items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer
                    ${pathname === item.href 
                      ? 'bg-accent text-white' 
                      : 'bg-card/50 hover:bg-accent/10 hover:text-accent'
                    } transition-colors`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
