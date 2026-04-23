import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight } from 'lucide-react';

const FlowingPaths = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <motion.path
        d="M-100,400 C200,300 400,500 600,350 S900,450 1300,300"
        stroke="hsl(var(--primary) / 0.06)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      />
      <motion.path
        d="M-100,500 C150,450 350,550 550,420 S850,520 1300,400"
        stroke="hsl(var(--secondary) / 0.05)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 15, ease: "linear", delay: 3, repeat: Infinity, repeatType: "loop" }}
      />
      <motion.path
        d="M-100,350 C250,250 450,400 700,300 S1000,380 1300,250"
        stroke="hsl(var(--accent) / 0.04)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 18, ease: "linear", delay: 6, repeat: Infinity, repeatType: "loop" }}
      />
    </svg>
  </div>
);

const WhatWeLearned = () => {
  const navigate = useNavigate();
  const bodyRef = useRef(null);
  const quoteRef = useRef(null);
  const ctaRef = useRef(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-40px" });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-40px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-20px" });

  return (
    <PageWrapper showNav={false}>
      <FlowingPaths />

      <div className="relative z-10 max-w-[700px] mx-auto px-6 py-16 md:py-24 min-h-screen flex flex-col">
        {/* SECTION 1: Title */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="heading-display text-3xl md:text-5xl lg:text-[3.25rem]">
            What These Journeys Reveal
          </h1>
        </motion.header>

        {/* SECTION 2: Body Paragraph */}
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0, y: 18 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20 md:mb-28"
        >
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
            By now, you've seen how differently these journeys can unfold—a steady climb toward relief, waves of progress and relapse, and a long plateau that only shifts when something deeper is understood. The same diagnosis, yet entirely different paths. What this reveals is simple, but often overlooked: depression does not follow a single direction, respond in one way, or come from one cause. It unfolds over time—shaped by individual experiences, underlying mechanisms, and the paths people take to recover. And when we begin to see these journeys as they are—not as isolated moments, but as evolving stories—the question itself changes. Not just what works, but what works for whom, under what conditions, and why. Because depression is not one story. It is many. And each one deserves to be seen.
          </p>
        </motion.div>

        {/* SECTION 3: Quote */}
        <motion.blockquote
          ref={quoteRef}
          initial={{ opacity: 0 }}
          animate={quoteInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xl md:text-2xl font-serif italic text-foreground/70 mb-3 leading-relaxed">
            "The wound is the place where the Light enters you."
          </p>
          <cite className="text-sm text-muted-foreground not-italic tracking-wide uppercase">
            — Rumi
          </cite>
        </motion.blockquote>

        {/* SECTION 4: CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mt-auto"
        >
          <button
            onClick={() => {
              navigate('/bibliography');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            className="nav-button-primary group text-base md:text-lg px-8 py-3 inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/85"
          >
            Explore the Evidence
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default WhatWeLearned;
