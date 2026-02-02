import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ScrollIndicator from "@/components/ScrollIndicator";
import GhostJourneyMap from "@/components/GhostJourneyMap";
import { useEffect, useRef } from "react";
import homepageBackground from "@/assets/homepage-background.jpg";

const AboutDepression = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToMap = () => {
    const mapSection = document.getElementById("journey-map");
    mapSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageWrapper backPath="/" backLabel="Home" nextPath="/cases" nextLabel="Case Stories">
      {/* Animated background image with parallax */}
      <motion.div
        className="fixed inset-[-20px] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-background/70 to-background/50 pointer-events-none z-0" />

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="fixed bottom-20 left-20 w-80 h-80 rounded-full bg-medical/30 blur-3xl pointer-events-none z-0"
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="heading-display mb-8">Understanding Depression</h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4 mb-12"
            >
              <p className="text-xl md:text-2xl text-foreground/90 font-serif leading-relaxed">
                Depression does not follow a single path.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                What looks like the same phase can feel completely different.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={scrollToMap}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-card/80 backdrop-blur-sm text-foreground font-medium border border-border hover:bg-card hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore the Journey Map</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-primary"
              >
                ↓
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Subtle scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
            >
              <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </section>

        {/* Journey Map Section */}
        <section id="journey-map" className="min-h-screen py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <GhostJourneyMap />
            </motion.div>
          </div>
        </section>

        {/* Reflective closing */}
        <section className="py-16 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-px bg-border mx-auto mb-8" />
            <p className="text-lg text-muted-foreground italic leading-relaxed font-serif">
              "The same life phase can unfold in radically different ways. Understanding this is the first step toward
              compassion: for others, and for ourselves."
            </p>
            <div className="w-16 h-px bg-border mx-auto mt-8" />
          </motion.div>
        </section>
      </div>

      <ScrollIndicator />
    </PageWrapper>
  );
};

export default AboutDepression;
