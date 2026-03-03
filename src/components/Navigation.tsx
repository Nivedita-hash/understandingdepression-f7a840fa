import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleNavigate = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const isHome = path === '/';
  const isAbout = path === '/about-depression';
  const isCases = path === '/cases';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-end gap-3">
        {!isHome && (
          <button onClick={() => handleNavigate('/')} className="nav-button-secondary">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}

        {!isAbout && (
          <button onClick={() => handleNavigate('/about-depression')} className="nav-button-secondary">
            <span>About Depression</span>
          </button>
        )}

        {!isCases && (
          <button onClick={() => handleNavigate('/cases')} className="nav-button-secondary">
            <span>Case Stories</span>
          </button>
        )}

        {isCases && (
          <button onClick={() => handleNavigate('/case/1')} className="nav-button-primary">
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
