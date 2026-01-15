import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import ScrollIndicator from '@/components/ScrollIndicator';
import { TrendingDown, Heart, RefreshCw, Sun, ChevronDown, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface JourneyPhase {
  number: number;
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
    number: 1,
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
    number: 2,
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
    number: 3,
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
    number: 4,
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
}

const StackingPhaseCard = ({ 
  phase, 
  index, 
  totalCards, 
  scrollYProgress,
  isExpanded,
  onToggle
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

  return (
    <motion.div
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
            <span className={`text-2xl font-serif ${phase.color}`}>{phase.number}</span>
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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const sections = [
    {
      icon: TrendingDown,
      title: "It's Not Just Sadness",
      content: "Depression is more than feeling sad. It's a complex condition that affects how you think, feel, and handle daily activities. It can manifest as persistent emptiness, loss of interest in things you once enjoyed, or a sense of hopelessness that colors everything.",
      color: "text-clay"
    },
    {
      icon: RefreshCw,
      title: "A Non-Linear Journey",
      content: "Recovery from depression rarely follows a straight path. There are setbacks and breakthroughs, plateaus and progress. Understanding this non-linearity is crucial—both for those experiencing depression and those supporting them.",
      color: "text-medical"
    },
    {
      icon: Heart,
      title: "Treatment Takes Many Forms",
      content: "From therapy and medication to lifestyle changes and support groups, treatment approaches are as varied as the individuals seeking help. What works for one person may not work for another—and that's okay.",
      color: "text-primary"
    },
    {
      icon: Sun,
      title: "Recovery Is Possible",
      content: "While depression can feel permanent, recovery is possible. For many, it means learning to manage symptoms effectively. For others, it means complete remission. Each journey is valid and valuable.",
      color: "text-sage"
    }
  ];

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
      <div className="page-container max-w-4xl mx-auto">
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

        {/* Journey Infographic - Stacking Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
                  key={phase.number}
                  phase={phase}
                  index={index}
                  totalCards={journeyPhases.length}
                  scrollYProgress={scrollYProgress}
                  isExpanded={expandedIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="section-card flex gap-6"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${section.color}`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="heading-section mb-3">{section.title}</h3>
                <p className="narrative-text text-muted-foreground">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
