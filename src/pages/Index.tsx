import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-light/30 via-background to-clay-light/20 pointer-events-none" />
      
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
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground mb-4 tracking-widest uppercase text-sm"
        >
          A Narrative Visualization
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="heading-display mb-6"
        >
          Understanding Depression
          <br />
          <span className="text-primary">Through Real Stories</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="narrative-text mx-auto mb-12 text-muted-foreground"
        >
          An interactive journey exploring how depression unfolds over time, 
          told through the experiences of real individuals.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => handleNavigate('/about-depression')}
            className="nav-button-secondary group"
          >
            <BookOpen className="w-4 h-4" />
            Learn About Depression
          </button>
          <button
            onClick={() => handleNavigate('/cases')}
            className="nav-button-primary group"
          >
            Explore Case Stories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
          Project by <span className="font-medium">Dhruvi Swadia</span> and <span className="font-medium">Nivedita Kowlagi</span>
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
