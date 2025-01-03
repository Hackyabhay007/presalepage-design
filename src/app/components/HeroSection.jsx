'use client';
import { motion } from 'framer-motion';
import { TimerIcon, ChevronDownIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';

const PresaleHero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-accent-900/20" />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 lg:pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Presale Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Presale Stage Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-accent-500/10 
              border border-accent-500/20 rounded-full px-4 py-2 mb-6"
            >
              <TimerIcon className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-accent-400">Stage 1 Presale Live</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 
              text-transparent bg-clip-text">
                Don't Miss Out on
              </span>
              <br />
              <span className="text-text">The Next Big Thing</span>
            </h1>

            {/* Presale Progress */}
            <div className="max-w-md mx-auto lg:mx-0 mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Raised: 1,250 ETH</span>
                <span className="text-accent-400">Target: 2,000 ETH</span>
              </div>
              <div className="h-3 bg-background-elevated rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '62.5%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent-500 to-secondary-500"
                />
              </div>
            </div>

            {/* Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto lg:mx-0 mb-8">
              {[
                { value: '14', label: 'Days' },
                { value: '22', label: 'Hours' },
                { value: '45', label: 'Minutes' },
                { value: '30', label: 'Seconds' },
              ].map((time, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background-elevated p-3 rounded-xl border border-accent-500/20"
                >
                  <div className="text-2xl font-bold text-accent-400">{time.value}</div>
                  <div className="text-xs text-text-secondary">{time.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Key Features */}
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                'Community Driven',
                'Fair Access',
                'Secure and safe investment opportunity',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle2Icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span className="text-text-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Info Alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-accent-500/5 border border-accent-500/20 rounded-xl p-4 mb-8 
              max-w-md mx-auto lg:mx-0"
            >
              <div className="flex items-start space-x-3">
                <AlertCircleIcon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-text-secondary">
                  Presale tokens will be locked for 30 days after listing. 
                  <a href="#" className="text-accent-400 hover:text-accent-300 ml-1">
                   Buy Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Token Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/8728384/pexels-photo-8728384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Token Visualization"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -right-8 bg-accent-500/10 backdrop-blur-xl 
                border border-accent-500/20 rounded-xl p-4 shadow-xl"
              >
                <div className="text-sm font-medium text-accent-400">Current Price</div>
                <div className="text-xl font-bold text-text">1 ETH = 50,000 TOKEN</div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-8 -left-8 bg-secondary-500/10 backdrop-blur-xl 
                border border-secondary-500/20 rounded-xl p-4 shadow-xl"
              >
                <div className="text-sm font-medium text-secondary-400">Next Stage Price</div>
                <div className="text-xl font-bold text-text">1 ETH = 40,000 TOKEN</div>
              </motion.div>
            </div>

            {/* Background Glow Effects */}
            <div className="absolute -inset-4 bg-accent-500/20 rounded-full blur-3xl opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/0 via-accent-500/5 to-secondary-500/20 rounded-2xl" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-text-secondary text-sm mb-2">Learn More</span>
          <ChevronDownIcon className="w-6 h-6 text-accent-400" />
        </motion.div>
      </div>
    </div>
  );
};

export default PresaleHero;
