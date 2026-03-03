import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import ScrollIndicator from '@/components/ScrollIndicator';
import { Lightbulb, GitBranch, Users, Heart } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';

const WhatWeLearned = () => {
  const insights = [
    {
      icon: GitBranch,
      title: "Non-Linearity of Depression",
      content: "Depression doesn't follow a predictable path. Each person's journey has unique rhythms—periods of progress followed by setbacks, unexpected breakthroughs, and gradual shifts that may not be visible day-to-day.",
      color: "bg-medical-light text-medical"
    },
    {
      icon: Users,
      title: "Variability of Outcomes",
      content: "Recovery looks different for everyone. Some achieve full remission; others find ways to manage and thrive. Both are valid outcomes. Comparing journeys should inspire hope, not create benchmarks.",
      color: "bg-sage-light text-sage"
    },
    {
      icon: Lightbulb,
      title: "The Value of Narrative",
      content: "Numbers and statistics can obscure the human experience of depression. By following real stories, we gain understanding that data alone cannot provide—the context, the choices, the meaning people make of their experiences.",
      color: "bg-clay-light text-clay"
    },
    {
      icon: Heart,
      title: "Hope in Diversity",
      content: "The diversity of these journeys reminds us that there is no single \"right\" way to experience or recover from depression. Each person's path, however winding, holds the possibility of meaning and growth.",
      color: "bg-primary/20 text-primary"
    }
  ];

  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-10, 10]);
  const bgScale = useTransform(smoothY, [0, 1], [1.05, 1.1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <PageWrapper>
      {/* Animated background image with parallax */}
      <motion.div 
        className="fixed inset-[-20px] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40 pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-0"
      />

      <div className="page-container max-w-4xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-display mb-6">What We Learned</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Reflecting on four unique journeys through depression.
          </p>
        </motion.header>

        {/* Insights */}
        <div className="space-y-8 mb-16">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="section-card"
            >
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${insight.color} flex items-center justify-center`}>
                  <insight.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="heading-section mb-3">{insight.title}</h3>
                  <p className="narrative-text text-muted-foreground">{insight.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Illustration Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-card bg-gradient-to-br from-sage-light/30 via-card to-medical-light/20 text-center py-12"
        >
          <div className="max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-2xl font-medium mb-4">
              Every Journey Matters
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              By sharing these stories, we hope to foster understanding, reduce stigma, 
              and remind those who struggle that their experiences are valid—and that 
              hope exists in many forms.
            </p>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-2xl font-serif italic text-foreground/80 mb-4">
            "The wound is the place where the Light enters you."
          </p>
          <cite className="text-muted-foreground">— Rumi</cite>
        </motion.blockquote>
      </div>
      <ScrollIndicator />
    </PageWrapper>
  );
};

export default WhatWeLearned;
