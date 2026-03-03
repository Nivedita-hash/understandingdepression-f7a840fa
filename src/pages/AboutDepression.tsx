import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { useState } from "react";
import { CloudRain, Search, LifeBuoy, Compass } from "lucide-react";

const phaseIcons: Record<string, { icon: typeof CloudRain; label: string }> = {
  onset: { icon: CloudRain, label: "Gathering clouds representing onset" },
  recognition: { icon: Search, label: "Awareness and recognition" },
  treatment: { icon: LifeBuoy, label: "Support and treatment" },
  living: { icon: Compass, label: "Navigation and ongoing management" },
};

interface PhaseData {
  id: string;
  title: string;
  bullets: string[];
}

const phases: PhaseData[] = [
  {
    id: "onset",
    title: "Onset",
    bullets: [
      "Early changes in mood, energy, or motivation may appear.",
      "Sleep, appetite, and focus can start to shift.",
      "Social withdrawal or reduced interest in usual activities may begin.",
      "Symptoms can build gradually or appear after stress/life changes.",
    ],
  },
  {
    id: "recognition",
    title: "Recognition",
    bullets: [
      "Patterns become clearer and harder to ignore.",
      "Daily responsibilities may feel harder to manage.",
      "Naming what's happening can reduce confusion or self-blame.",
      "Reaching out to someone trusted can help with next steps.",
    ],
  },
  {
    id: "treatment",
    title: "Treatment",
    bullets: [
      "Support may include therapy, lifestyle changes, and medical guidance.",
      "Finding the right approach can take time and adjustments.",
      "Simple routines (sleep, movement, meals) can support recovery.",
      "Tracking symptoms can help identify what helps.",
    ],
  },
  {
    id: "living",
    title: "Living With",
    bullets: [
      "Ongoing coping tools and support can help maintain stability.",
      "Setbacks can happen; planning for them makes them easier to handle.",
      "Small consistent habits often matter more than occasional big efforts.",
      "Staying connected to support systems can make things easier.",
    ],
  },
];

const AboutDepression = () => {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  const activeData = phases.find((p) => p.id === activePhase);

  return (
    <PageWrapper>
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-12 md:pt-20 flex flex-col items-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="heading-display mb-4">Understanding Depression</h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6"
            >
              Depression moves through phases - each one shaped by personal context and experience.
            </motion.p>
          </motion.div>
        </section>

        {/* Phase Buttons + Content */}
        <section className="px-6 pb-8">
          <div className="max-w-3xl mx-auto">
            {/* Phase buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {phases.map((phase, index) => (
                <motion.button
                  key={phase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                  className={`px-6 py-3 rounded-full font-medium text-sm md:text-base backdrop-blur-sm border transition-all duration-300 ${
                    activePhase === phase.id
                      ? "bg-primary/20 text-primary border-primary/40 shadow-md"
                      : "bg-card/80 text-foreground border-border hover:bg-card hover:shadow-lg"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {phase.title}
                </motion.button>
              ))}
            </div>

            {/* Phase content with inline icon */}
            <AnimatePresence mode="wait">
              {activeData && activePhase && (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <ul className="space-y-4 flex-1">
                      {activeData.bullets.map((bullet, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-3 text-foreground/90 leading-relaxed"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>
                    {(() => {
                      const PhaseIcon = phaseIcons[activePhase]?.icon;
                      return PhaseIcon ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="flex items-center justify-center md:flex-shrink-0"
                          aria-label={phaseIcons[activePhase].label}
                        >
                          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <PhaseIcon className="w-10 h-10 md:w-14 md:h-14 text-primary/50" strokeWidth={1.2} />
                          </div>
                        </motion.div>
                      ) : null;
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Reflective closing */}
        <section className="py-8 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-px bg-border mx-auto mb-8" />
            <p className="text-lg text-muted-foreground italic leading-relaxed font-serif">
              "Each phase carries its own weight. Understanding them is the first step toward compassion - for others,
              and for ourselves."
            </p>
            <div className="w-16 h-px bg-border mx-auto mt-8" />
          </motion.div>
        </section>
      </div>

      
    </PageWrapper>
  );
};

export default AboutDepression;
