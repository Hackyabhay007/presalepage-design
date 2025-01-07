'use client';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Rocket, 
  GiftIcon, 
  Coins,
  Users,
  Leaf,
  Zap,
  Shield
} from 'lucide-react';

const TokenomicsSection = () => {
  // Tokenomics data
  const tokenDistribution = [
    { label: 'Initial Coin Offering', percentage: 40, color: '#FF6B6B', icon: Rocket },
    { label: 'Staking Rewards', percentage: 25, color: '#4ECDC4', icon: Coins },
    { label: 'Liquidity', percentage: 15, color: '#45B7D1', icon: Zap },
    { label: 'Community Rewards', percentage: 10, color: '#96F7D2', icon: GiftIcon },
    { label: 'Team', percentage: 10, color: '#9D50BB', icon: Users },
  ];

  // Token details
  const tokenDetails = [
    { label: 'Token Symbol', value: '$SWG' },
    { label: 'Total Supply', value: '5,000,000,000' },
    { label: 'Decimals', value: '18' },
    { label: 'ICO Allocation', value: '2,000,000,000 $SWG' },
  ];

  return (
    <div id='tokenomics' className="relative min-h-screen bg-background py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-accent-900/20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent-500/10 
            border border-accent-500/20 rounded-full px-4 py-2 mb-4">
            <Coins className="w-4 h-4 text-accent-400" />
            <span className="text-sm text-accent-400">Token Metrics</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 
              text-transparent bg-clip-text">
              Tokenomics
            </span>
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A carefully designed token distribution model ensuring long-term sustainability 
            and value appreciation for holders
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-background-elevated/50 backdrop-blur-xl rounded-3xl 
              border border-accent-500/20 p-8 relative overflow-hidden">
              {/* Animated Background Lines */}
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute h-[1px] w-full bg-accent-500/20"
                  style={{ top: `${index * 25}%` }}
                  animate={{
                    x: [-1000, 1000],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "linear"
                  }}
                />
              ))}

              {/* Distribution Bars */}
              <div className="space-y-6">
                {tokenDistribution.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                        <span className="text-text font-medium">{item.label}</span>
                      </div>
                      <span className="text-text-secondary">{item.percentage}%</span>
                    </div>
                    
                    <div className="h-3 bg-background-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{ backgroundColor: item.color }}
                        className="h-full rounded-full relative"
                      >
                        <motion.div
                          animate={{
                            opacity: [0.2, 0.8, 0.2],
                            width: ['0%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent 
                            via-white/30 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Token Details & Features */}
          <div className="space-y-8">
            {/* Token Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background-elevated/50 backdrop-blur-xl rounded-3xl 
                border border-accent-500/20 p-8"
            >
              <h3 className="text-2xl font-bold text-text mb-6">Token Details</h3>
              <div className="grid gap-4">
                {tokenDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center border-b 
                      border-accent-500/10 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-text-secondary">{detail.label}</span>
                    <span className="text-text font-medium">{detail.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Token Features */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4"
            >
              {[
                {
                  title: 'Anti-Dump Protection',
                  description: 'Maximum sell limit of 1% of total supply per transaction',
                  icon: Shield,
                  gradient: 'from-red-500 to-orange-500'
                },
                {
                  title: 'Liquidity Lock',
                  description: 'Initial liquidity locked for 5 years ensuring stability',
                  icon: Lock,
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Sustainable Growth',
                  description: '2% of transactions contribute to ecosystem development',
                  icon: Leaf,
                  gradient: 'from-green-500 to-emerald-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 
                    to-secondary-500/10 rounded-xl blur-xl opacity-0 
                    group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative bg-background-elevated/50 backdrop-blur-sm border 
                    border-accent-500/20 rounded-xl p-6 hover:border-accent-500/40 
                    transition-colors"
                  >
                    <div className={`bg-gradient-to-r ${feature.gradient} w-12 h-12 
                      rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsSection;
