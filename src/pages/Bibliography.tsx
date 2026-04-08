import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';

const Bibliography = () => {
  const additionalSources = [
    {
      title: "Diagnostic and Statistical Manual of Mental Disorders (DSM-5)",
      authors: "American Psychiatric Association",
      year: "2013",
      type: "Reference",
      url: "https://psychiatry.org/psychiatrists/practice/dsm"
    },
    {
      title: "World Health Organization: Depression Fact Sheet",
      authors: "WHO",
      year: "2023",
      type: "Health Information",
      url: "https://www.who.int/news-room/fact-sheets/detail/depression"
    },
    {
      title: "The lived experience of depression: A narrative review",
      authors: "Various Authors",
      year: "2020",
      type: "Review Article",
      url: "https://pubmed.ncbi.nlm.nih.gov/"
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
    <PageWrapper showNav={false}>
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
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-6">References</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            All case studies and information presented are based on peer-reviewed research.
          </p>
        </motion.header>

        {/* Case Study Sources */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="heading-section">Case Study Sources</h2>
          </div>
          
          <div className="space-y-4">
            {caseStudies.map((study, index) => (
              <motion.a
                key={study.id}
                href={study.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="block section-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-primary mb-1 block">
                      Case {study.id}
                    </span>
                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Source: {study.source}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Additional Sources */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="heading-section">Additional References</h2>
          </div>
          
          <div className="space-y-4">
            {additionalSources.map((source, index) => (
              <motion.a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="block section-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-block">
                      {source.type}
                    </span>
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {source.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {source.authors} ({source.year})
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-6 rounded-2xl bg-sage-light/30 border border-sage/20"
        >
          <h3 className="font-medium mb-2">A Note on Case Studies</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All case studies presented in this visualization are adapted from real, peer-reviewed 
            clinical research. Names and identifying details have been changed to protect privacy. 
            These narratives represent actual experiences documented in clinical literature and 
            are intended to foster understanding of the diverse ways depression manifests and 
            resolves over time.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 pt-8 border-t border-border text-center"
        >
          <p className="text-muted-foreground mb-2">
            Project by <strong>Dhruvi Swadia</strong> and <strong>Nivedita Kowlagi</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            A narrative visualization exploring depression journeys over time.
          </p>
        </motion.footer>
      </div>
    </PageWrapper>
  );
};

export default Bibliography;
