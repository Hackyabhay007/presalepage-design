'use client';
import { motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  MessageCircle,
  ArrowUp,
  Shield,
  BookOpen,
  Box,
  Rocket
} from 'lucide-react';
import Image from 'next/image'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Breathing animation variant
  const breathingAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="relative bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,47,47,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(47,47,47,.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Orbs */}
        <motion.div
          variants={breathingAnimation}
          animate="animate"
          className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
        />
        <motion.div
          variants={breathingAnimation}
          animate="animate"
          className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-purple-500/20 blur-[100px]"
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Top Section with Logo and Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-border/50">
          {/* Logo & About */}
          <div className="space-y-6">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
               <Image 
                                   src="https://springfi.org/_next/static/media/Logo.4ffd2ef6.svg" 
                                   alt="SpringFi Logo"
                                   width={120}  // Increased from 100
                                   height={120}  // Increased from 40
                                   />
            </motion.div>
            <p className="text-muted-foreground">
              Revolutionizing blockchain presales with secure, transparent, and efficient token launches.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin, Globe].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-10 h-10 rounded-full bg-accent/10 text-accent 
                    flex items-center justify-center hover:bg-accent/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Active Presales', 'Launch App', 'Documentation', 'Governance'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              {[
                { text: 'Documentation', icon: BookOpen },
                { text: 'Security', icon: Shield },
                { text: 'Blog Posts', icon: Box },
                { text: 'Help Center', icon: MessageCircle },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-muted-foreground 
                    hover:text-accent transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-card/50 border border-border/50 
                    focus:outline-none focus:border-accent/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="absolute right-2 top-2 p-1.5 rounded-md bg-accent/10 text-accent
                    hover:bg-accent/20 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © 2024 LaunchPad. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 
                transition-colors flex items-center space-x-2"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent"
      />
    </footer>
  );
};

export default Footer;
