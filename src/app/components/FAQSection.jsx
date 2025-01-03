'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is SwingFi?",
      answer: "SwingFi is a decentralized, fair-for-all crypto launchpad designed to bridge the gap between retail investors and high-potential Web3 startups. It uses innovative staking and burning mechanisms through the native $SPY token to provide equitable access to token sales.",
      icon: Sparkles
    },
    {
      question: "How can I participate in token sales?",
      answer: "There are two main ways to participate: 1) Burn $SPY tokens to access exclusive private sales, or 2) Stake $SPY tokens to participate in pre-sales and Dutch auctions. Each method ensures fair access while contributing to the ecosystem's growth.",
      icon: MessageCircle
    },
    {
      question: "What are the tokenomics of $SPY?",
      answer: "The total supply of $SPY is 5 Billion tokens, allocated as follows: 40% for Initial Coin Offering, 25% for Staking Rewards, 15% for Liquidity, 10% for Community Rewards, and 10% for Team (Development and Foundational Treasury).",
      icon: Sparkles
    },
    {
      question: "What chains does SwingFi support?",
      answer: "SwingFi supports multiple blockchains including Ethereum, Binance Smart Chain, and Polygon. This cross-chain compatibility enables scalability and flexibility for users across different networks.",
      icon: MessageCircle
    },
    {
      question: "What are the benefits of staking $SPY?",
      answer: "Staking $SPY provides access to pre-sales and Dutch auctions while earning staking rewards. It also demonstrates long-term commitment to the ecosystem and may grant governance rights for platform decisions.",
      icon: Sparkles
    },
    {
      question: "How does the burning mechanism work?",
      answer: "Users can burn $SPY tokens to access exclusive private sales. This process permanently removes tokens from circulation, contributing to the deflationary tokenomics and potentially increasing the value of remaining tokens over time.",
      icon: MessageCircle
    }
  ];

  // FAQ Item Component
  const FAQItem = ({ item, index, isOpen, onToggle }) => {
    const Icon = item.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group"
      >
        <div
          onClick={() => onToggle(index)}
          className="flex items-start space-x-4 p-6 cursor-pointer rounded-2xl 
            border border-border bg-card/50 backdrop-blur-sm
            hover:border-accent/50 transition-colors duration-300"
        >
          {/* Icon Container */}
          <div className="p-2 rounded-xl bg-accent/10 text-accent">
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-foreground pr-4">
                {item.question}
              </h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1"
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-background py-20">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,47,47,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(47,47,47,.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-accent/10 
              border border-accent/20 rounded-full px-6 py-3 mb-6"
          >
            <MessageCircle className="w-5 h-5 text-accent" />
            <span className="text-accent font-mono">Support Center</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our launch pad platform and presale participation
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={(idx) => setOpenIndex(idx === openIndex ? null : idx)}
            />
          ))}
        </div>

        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <div className="p-8 rounded-2xl border border-accent/20 bg-card/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Reach out to our support team.
            </p>
            <button className="inline-flex items-center space-x-2 bg-accent 
              hover:bg-accent/90 text-white px-6 py-3 rounded-full 
              transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQSection;
