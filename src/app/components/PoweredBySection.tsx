'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FIRST_ROW_LOGOS = [
  {
    name: 'AWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    link: 'https://aws.amazon.com'
  },
  {
    name: 'Stripe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    link: 'https://stripe.com'
  },
  {
    name: 'MongoDB',
    logo: 'https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png',
    link: 'https://mongodb.com'
  },
  {
    name: 'Vercel',
    logo: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    link: 'https://vercel.com'
  },
  {
    name: 'GitHub',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    link: 'https://github.com'
  }
];

const SECOND_ROW_LOGOS = [
  {
    name: 'Next.js',
    logo: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png',
    link: 'https://nextjs.org'
  },
  {
    name: 'React',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    link: 'https://reactjs.org'
  },
  {
    name: 'TypeScript',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
    link: 'https://typescriptlang.org'
  },
  {
    name: 'Tailwind CSS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    link: 'https://tailwindcss.com'
  },
  {
    name: 'Prisma',
    logo: 'https://prismalens.vercel.app/header/logo-dark.svg',
    link: 'https://prisma.io'
  }
];


export default function PoweredBySection() {
  const [isHovered, setIsHovered] = useState(false);
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstRow = firstRowRef.current;
    const secondRow = secondRowRef.current;
    if (!firstRow || !secondRow) return;

    let firstInterval: NodeJS.Timeout;
    let secondInterval: NodeJS.Timeout;

    const startScroll = () => {
      firstInterval = setInterval(() => {
        if (!isHovered && firstRow) {
          firstRow.scrollLeft += 1;
          if (firstRow.scrollLeft >= firstRow.scrollWidth / 2) {
            firstRow.scrollLeft = 0;
          }
        }
      }, 30);

      secondInterval = setInterval(() => {
        if (!isHovered && secondRow) {
          secondRow.scrollLeft -= 1;
          if (secondRow.scrollLeft <= 0) {
            secondRow.scrollLeft = secondRow.scrollWidth / 2;
          }
        }
      }, 30);
    };

    startScroll();
    return () => {
      clearInterval(firstInterval);
      clearInterval(secondInterval);
    };
  }, [isHovered]);

  return (
    <section className="w-full bg-background-elevated  relative py-10 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto ">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-text">
            Powered By Industry Leaders
          </h2>
          <p className="text-text-secondary mt-2">
            Built with cutting-edge technologies and trusted platforms
          </p>
        </motion.div>

        {/* Logos Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background-elevated to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-elevated to-transparent z-10" />

          {/* First Row */}
          <div ref={firstRowRef} className="overflow-hidden mb-12">
            <div className="inline-flex gap-16 animate-scroll">
              {[...FIRST_ROW_LOGOS, ...FIRST_ROW_LOGOS].map((logo, index) => (
                <LogoCard key={`${logo.name}-${index}`} {...logo} />
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div ref={secondRowRef} className="overflow-hidden">
            <div className="inline-flex gap-16 animate-scroll-reverse">
              {[...SECOND_ROW_LOGOS, ...SECOND_ROW_LOGOS].map((logo, index) => (
                <LogoCard key={`${logo.name}-${index}`} {...logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCard({ name, logo, link }: { name: string; logo: string; link: string }) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative"
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-24 h-24 flex items-center justify-center 
        bg-background-secondary rounded-xl border border-accent-200/10 
        group-hover:border-accent-400/20 transition-all duration-300"
      >
        {/* Logo Image */}
        <div className="relative w-16 h-16">
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain filter 
              brightness-75 group-hover:brightness-100 transition-all duration-300"
          />
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 
          bg-gradient-to-r from-accent-500/10 to-primary-500/10"
        />
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
        text-sm text-text-muted whitespace-nowrap"
      >
        {name}
      </div>
    </motion.a>
  );
}