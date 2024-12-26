'use client';
import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { 
  Rocket, 
  Binary,
  Cpu,
  Globe2,
  Network,
  Zap,
  CheckCircle2,
  Clock,
  Timer
} from 'lucide-react';

// Base Card Components
const Card = ({ className = '', ...props }) => (
  <div className={`rounded-xl border border-border bg-card text-card-foreground shadow ${className}`} {...props} />
);

const CardHeader = ({ className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />
);

const CardContent = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

// Badge Component
const Badge = ({ variant = 'default', className = '', ...props }) => {
  const variantStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    secondary: 'bg-secondary/10 text-secondary'
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
};

// Separator Component
const Separator = ({ className = '', ...props }) => (
  <div className={`shrink-0 bg-border h-[1px] w-full ${className}`} {...props} />
);

const RoadmapSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const roadmapData = [
    {
      phase: 'Phase 1',
      title: 'Genesis Launch',
      status: 'completed',
      timeline: 'Q1 2024',
      items: [
        'Smart Contract Development',
        'Security Audit & KYC',
        'Website & Dashboard',
        'Community Building',
        'Token Launch'
      ],
      icon: Binary,
    },
    {
      phase: 'Phase 2',
      title: 'Network Expansion',
      status: 'current',
      timeline: 'Q2 2024',
      items: [
        'DEX Integration',
        'Staking Platform',
        'Partnerships Launch',
        'Market Expansion',
        'CEX Listing'
      ],
      icon: Network,
    },
    {
      phase: 'Phase 3',
      title: 'Ecosystem Growth',
      status: 'upcoming',
      timeline: 'Q3 2024',
      items: [
        'Cross-chain Bridge',
        'Governance Portal',
        'NFT Marketplace',
        'Mobile App Beta',
        'SDK Release'
      ],
      icon: Cpu,
    },
    {
      phase: 'Phase 4',
      title: 'Global Integration',
      status: 'upcoming',
      timeline: 'Q4 2024',
      items: [
        'AI Integration',
        'Global Partnerships',
        'Enterprise Solutions',
        'DAO Framework',
        'Metaverse Portal'
      ],
      icon: Globe2,
    }
  ];

  const StatusBadge = ({ status }) => {
    const variants = {
      completed: { icon: CheckCircle2, variant: "success" },
      current: { icon: Clock, variant: "warning" },
      upcoming: { icon: Timer, variant: "secondary" }
    };
    
    const { icon: Icon, variant } = variants[status];
    
    return (
      <Badge variant={variant} className="h-6">
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-background py-20">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--background),var(--background))]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,47,47,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(47,47,47,.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

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
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-accent font-mono">Development Timeline</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Project Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our strategic development plan to revolutionize the blockchain ecosystem
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px 
            bg-gradient-to-b from-accent/50 via-accent/30 to-accent/10 
            transform md:-translate-x-px" />

          {/* Phases */}
          <div className="space-y-16">
            {roadmapData.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col md:flex-row items-start 
                  md:even:flex-row-reverse group"
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 
                  flex items-center justify-center z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-8 h-8 rounded-full bg-card border-4 border-accent 
                      flex items-center justify-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div className="ml-20 md:ml-0 md:w-[calc(50%-2rem)] 
                  md:group-even:ml-[calc(50%+2rem)] md:group-odd:mr-[calc(50%+2rem)]">
                  <Card className="relative overflow-hidden group-hover:border-accent/50 
                    transition-colors duration-500">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <phase.icon className="w-5 h-5 text-accent" />
                          <span className="text-foreground font-semibold">
                            {phase.phase}
                          </span>
                        </div>
                        <StatusBadge status={phase.status} />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {phase.title}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {phase.timeline}
                      </span>
                    </CardHeader>
                    
                    <CardContent>
                      <Separator className="mb-4" />
                      <ul className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: itemIndex * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-muted-foreground">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Vision Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 max-w-2xl mx-auto"
        >
          <Card className="bg-card/50 backdrop-blur border-accent/20">
            <CardHeader>
              <CardTitle className="text-center text-foreground">
                Beyond The Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Our journey continues beyond these milestones. We're committed to 
                continuous innovation and development, adapting to new technologies 
                and community needs.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapSection;
