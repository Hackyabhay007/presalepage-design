'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is a Launch Pad?",
      answer: "A Launch Pad is a platform that enables projects to raise capital and launch their tokens in a decentralized and secure manner. It provides features like token presales, liquidity locking, and fair distribution mechanisms to ensure a successful token launch.",
      icon: Sparkles
    },
    {
      question: "How can I participate in presales?",
      answer: "To participate in presales, you'll need to: 1) Connect your wallet, 2) Complete KYC verification if required, 3) Hold the minimum required tokens or meet other criteria, 4) Participate during the presale window with supported tokens (ETH, BNB, USDT).",
      icon: MessageCircle
    },
    {
      question: "What chains do you support?",
      answer: "We support multiple blockchains including Ethereum (ETH), Binance Smart Chain (BSC), and various USDT networks (ERC20, BEP20, TRC20). This allows for flexible participation options and lower transaction fees.",
      icon: Sparkles
    },
    {
      question: "How are presale tokens distributed?",
      answer: "Presale tokens are automatically distributed to participant wallets after the presale concludes and all conditions are met. The distribution timeline varies by project but typically occurs within 24-48 hours of presale completion.",
      icon: MessageCircle
    },
    {
      question: "Is KYC verification required?",
      answer: "KYC requirements vary by project. While some presales may not require KYC, many projects implement verification to ensure regulatory compliance and project security. Check individual presale requirements for specific details.",
      icon: Sparkles
    },
    {
      question: "What are the fees involved?",
      answer: "Our platform charges minimal fees to cover operational costs and ensure project quality. Typically, this includes a small percentage of raised funds and/or tokens. Exact fee structures are transparent and displayed before participation.",
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
