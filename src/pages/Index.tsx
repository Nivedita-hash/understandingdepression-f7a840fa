import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import homepageBackground from "@/assets/homepage-background.jpg";
import { initSession } from "@/lib/timeTracking";

const PRE_ASSESSMENT_URL = "https://forms.gle/o8WxXdHNWC5zKx36A";
const STORAGE_KEY = "pre-assessment-done";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [preDone, setPreDone] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");

  // Initialize session tracking
  useEffect(() => {
    initSession();
  }, []);

  // Detect ?pre=done and persist
  useEffect(() => {
    if (searchParams.get("pre") === "done") {
      localStorage.setItem(STORAGE_KEY, "true");
      setPreDone(true);
      // Clean up URL
      searchParams.delete("pre");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Mouse position tracking
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
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background image with parallax */}
      <motion.div
        className="absolute inset-[-20px] pointer-events-none"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />

      {/* Decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-medical/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="heading-display mb-6"
        >
          Understanding Depression
          <br />
          <span className="text-primary">Through Real Stories</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="narrative-text mx-auto mb-8 text-muted-foreground"
        >
          Depression affects millions, yet each person's experience is unique. Follow four real stories to understand
          how this condition unfolds from first symptoms through treatment and beyond.
        </motion.p>

        {/* Success message after pre-assessment */}
        {preDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6 text-primary"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm md:text-base font-medium">
              Great — your pre-assessment is complete. Continue to the next step.
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {preDone ? (
            <button
              onClick={() => navigate("/about-depression")}
              className="nav-button-primary group text-lg px-8 py-3"
            >
              Continue to Learn About Depression
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <a
              href={PRE_ASSESSMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-button-primary group text-lg px-8 py-3"
            >
              Start Pre-Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Credits */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Project by <span className="font-medium">Dhruvi Swadia</span> and{" "}
          <span className="font-medium">Nivedita Kowlagi</span>
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
