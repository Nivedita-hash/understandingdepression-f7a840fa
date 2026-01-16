import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import ScrollIndicator from '@/components/ScrollIndicator';
import { CloudRain, Eye, Stethoscope, Sunrise, ChevronDown } from 'lucide-react';
import { useRef, useState, useCallback, useEffect } from 'react';
import homepageBackground from '@/assets/homepage-background.jpg';
interface JourneyPhase {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  details: {
    heading: string;
    points: string[];
  };
}

const journeyPhases: JourneyPhase[] = [
  {
    icon: CloudRain,
    title: "Onset",
    subtitle: "Triggers and early symptoms emerge",
    color: "text-clay",
    bgColor: "bg-clay-light",
    details: {
      heading: "Triggers & Early Symptoms",
      points: [
        "Life changes like loss, trauma, or major transitions",
        "Gradual withdrawal from activities once enjoyed",
        "Sleep disturbances and changes in appetite",
        "Persistent fatigue that doesn't improve with rest",
        "Difficulty concentrating or making decisions"
      ]
    }
  },
  {
    icon: Eye,
    title: "Recognition",
    subtitle: "Acknowledging the need for help",
    color: "text-medical",
    bgColor: "bg-medical-light",
    details: {
      heading: "Signs of Recognition",
      points: [
        "Realizing symptoms have persisted for weeks",
        "Friends or family expressing concern",
        "Daily functioning becoming noticeably impaired",
        "Moments of clarity about the severity of feelings",
        "Beginning to research or seek information"
      ]
    }
  },
  {
    icon: Stethoscope,
    title: "Treatment",
    subtitle: "Finding what works for you",
    color: "text-sage",
    bgColor: "bg-sage-light",
    details: {
      heading: "Treatment Approaches",
      points: [
        "Psychotherapy (CBT, DBT, interpersonal therapy)",
        "Medication options and finding the right fit",
        "Lifestyle changes: exercise, sleep hygiene, nutrition",
        "Support groups and peer connections",
        "Combination approaches tailored to individual needs"
      ]
    }
  },
  {
    icon: Sunrise,
    title: "Living With",
    subtitle: "Recovery, management, or thriving",
    color: "text-primary",
    bgColor: "bg-primary/20",
    details: {
      heading: "The Path Forward",
      points: [
        "Developing personal coping strategies",
        "Building a sustainable support network",
        "Recognizing early warning signs of relapse",
        "Celebrating progress, no matter how small",
        "Embracing a new understanding of mental wellness"
      ]
    }
  }
];

interface StackingPhaseCardProps {
  phase: JourneyPhase;
  index: number;
  totalCards: number;
  scrollYProgress: any;
  isExpanded: boolean;
  onToggle: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

const StackingPhaseCard = ({ 
  phase, 
  index, 
  totalCards, 
  scrollYProgress,
  isExpanded,
  onToggle,
  cardRef
}: StackingPhaseCardProps) => {
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [100, 0]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd, Math.min(cardEnd + 0.1, 1)],
    [0.95, 1, 0.98]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(cardStart - 0.05, 0), cardStart, cardEnd],
    [0, 1, 1]
  );

  const IconComponent = phase.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale, opacity, zIndex: index + 1 }}
      className="sticky top-32 mb-8"
    >
      <motion.div
        layout
        onClick={onToggle}
        className={`section-card cursor-pointer transition-all duration-300 ${
          isExpanded ? 'ring-2 ring-primary/30' : 'hover:shadow-lg'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className={`flex-shrink-0 w-16 h-16 rounded-full ${phase.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-7 h-7 ${phase.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="heading-section mb-1">{phase.title}</h3>
            <p className="text-muted-foreground">{phase.subtitle}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className={`w-6 h-6 ${phase.color}`} />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-border">
                <h4 className={`font-medium mb-4 ${phase.color}`}>{phase.details.heading}</h4>
                <ul className="space-y-3">
                  {phase.details.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${phase.bgColor} mt-2 flex-shrink-0`} />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const AboutDepression = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for natural movement
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Transform mouse position to subtle parallax offset
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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollToCard = useCallback((index: number) => {
    const cardRef = cardRefs.current[index];
    if (cardRef) {
      cardRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setExpandedIndex(index);
      }, 500);
    }
  }, []);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageWrapper 
      backPath="/"
      backLabel="Home"
      nextPath="/cases"
      nextLabel="Case Stories"
    >
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
      
      {/* Decorative circles */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-0"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="fixed bottom-20 left-20 w-80 h-80 rounded-full bg-medical/20 blur-3xl pointer-events-none z-0"
      />

      <div className="page-container max-w-4xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-display mb-6">Understanding Depression</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Before we explore individual journeys, let's understand what depression 
            looks like as a process that unfolds over time.
          </p>
        </motion.header>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {journeyPhases.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <button
                key={phase.title}
                onClick={() => scrollToCard(index)}
                className={`w-12 h-12 rounded-full ${phase.bgColor} flex items-center justify-center transition-all hover:scale-110 hover:shadow-md`}
              >
                <IconComponent className={`w-5 h-5 ${phase.color}`} />
              </button>
            );
          })}
        </motion.div>

        {/* Journey Infographic - Stacking Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="heading-section text-center mb-4">Depression as a Journey</h2>
          <p className="text-center text-muted-foreground mb-8">
            Scroll to reveal each phase • Click to explore details
          </p>
          
          <div ref={containerRef} className="min-h-[250vh] relative">
            <div className="sticky top-24 pt-8">
              {journeyPhases.map((phase, index) => (
                <StackingPhaseCard
                  key={phase.title}
                  phase={phase}
                  index={index}
                  totalCards={journeyPhases.length}
                  scrollYProgress={scrollYProgress}
                  isExpanded={expandedIndex === index}
                  onToggle={() => handleToggle(index)}
                  cardRef={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 py-8 border-t border-border"
        >
          <p className="text-muted-foreground italic">
            "Every person's experience with depression is unique. 
            The following stories illustrate the diversity of these journeys."
          </p>
        </motion.div>
      </div>
      <ScrollIndicator />
    </PageWrapper>
  );
};

export default AboutDepression;
