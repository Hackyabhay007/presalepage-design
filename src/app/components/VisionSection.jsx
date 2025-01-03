'use client';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Globe } from 'lucide-react';

const VisionSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Fair Access',
      description: 'Burn or stake $SPY tokens to participate in private sales, pre-sales, and Dutch auctions with equal opportunity.',
      gradient: 'from-cyan-500 to-accent-500'
    },
    {
      icon: Zap,
      title: 'Dutch Auctions',
      description: 'Dynamic price discovery model ensuring fair token distribution based on market demand and value.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Cross-Chain Support',
      description: 'Compatible with Ethereum, Binance Smart Chain, and Polygon for maximum accessibility.',
      gradient: 'from-green-500 to-cyan-500'
    },
    {
      icon: Cpu,
      title: 'Community Rewards',
      description: 'Earn rewards through staking, loyalty programs, and active ecosystem participation.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="relative min-h-screen bg-background py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-accent-500/10 via-transparent to-secondary-500/10"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Section Title */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-accent-500/10 
                border border-accent-500/20 rounded-full px-4 py-2 mb-4"
              >
                <span className="text-sm text-accent-400">Next Generation Protocol</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 
                text-transparent bg-clip-text">
                  Revolutionizing
                </span>
                <br />
                <span className="text-text">Decentralized Funding</span>
              </h2>
              
              <p className="text-lg text-text-secondary">
              SwingFi is a decentralized, fair-for-all crypto launchpad designed to bridge the gap between retail investors and high-potential Web3 startups. By leveraging innovative staking and burning mechanisms through our native token, $SPY, SwingFi provides an equitable platform where everyone has a chance to participate in token sales, fostering innovation and creating opportunities for retail investors to be part of the next big success stories in blockchain.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-secondary-500/10 
                    rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative bg-background-elevated/50 backdrop-blur-sm border 
                    border-accent-500/20 rounded-xl p-6 hover:border-accent-500/40 transition-colors">
                    <div className={`bg-gradient-to-r ${feature.gradient} w-12 h-12 rounded-lg 
                      flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text mb-2">{feature.title}</h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Holographic Display */}
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  rotateY: [0, 10, 0],
                  rotateX: [0, -10, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Replace with your actual blockchain visualization */}
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-secondary-500/20 
                    rounded-3xl blur-2xl" />
                  
                  {/* Blockchain Cube Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        rotateX: [0, 360]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                      className="relative w-64 h-64"
                    >
                      {/* Cube Faces */}
                      {[...Array(6)].map((_, index) => (
                        <motion.div
                          key={index}
                          className="absolute inset-0 border-2 border-accent-500/20 
                          rounded-2xl backdrop-blur-sm"
                          style={{
                            transform: `rotateY(${index * 60}deg) translateZ(150px)`,
                            background: 'linear-gradient(45deg, rgba(157, 78, 221, 0.1), rgba(90, 24, 154, 0.1))'
                          }}
                        >
                          {/* Node Points */}
                          <div className="absolute inset-0 p-4">
                            <div className="grid grid-cols-3 gap-4 h-full">
                              {[...Array(9)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                  }}
                                  transition={{
                                    duration: 2,
                                    delay: i * 0.1,
                                    repeat: Infinity,
                                  }}
                                  className="w-2 h-2 rounded-full bg-accent-400"
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Floating Info Cards */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    x: [-5, 5, -5]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-10 -right-10 bg-background-elevated/50 backdrop-blur-xl 
                  border border-accent-500/20 rounded-xl p-4 shadow-xl"
                >
                  <div className="text-sm font-medium text-accent-400">Total Nodes</div>
                  <div className="text-xl font-bold text-text">10,000+</div>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    x: [5, -5, 5]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-10 -left-10 bg-background-elevated/50 backdrop-blur-xl 
                  border border-accent-500/20 rounded-xl p-4 shadow-xl"
                >
                  <div className="text-sm font-medium text-secondary-400">Network Speed</div>
                  <div className="text-xl font-bold text-text">2ms Latency</div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl opacity-20" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisionSection;
