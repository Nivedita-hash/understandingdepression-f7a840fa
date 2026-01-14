import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';

const Transition = () => {
  return (
    <PageWrapper 
      backPath="/case/4"
      backLabel="Case 4"
      nextPath="/compare"
      nextLabel="Compare Journeys"
    >
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/90"
          >
            These are real journeys.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/70 mt-4"
          >
            They are not universal.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-primary mt-4"
          >
            Let's explore how they differ.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-24 h-1 bg-primary/30 mx-auto mt-12 rounded-full"
          />
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Transition;
