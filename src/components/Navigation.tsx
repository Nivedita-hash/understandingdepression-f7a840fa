import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  backPath?: string;
  nextPath?: string;
  backLabel?: string;
  nextLabel?: string;
}

const Navigation = ({ backPath, nextPath, backLabel = 'Back', nextLabel = 'Next' }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = location.pathname === '/';

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backPath && (
            <button
              onClick={() => handleNavigate(backPath)}
              className="nav-button-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isHome && (
            <>
              <button
                onClick={() => handleNavigate('/cases')}
                className="nav-button-secondary"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Case Stories</span>
              </button>
              <button
                onClick={() => handleNavigate('/about-depression')}
                className="nav-button-secondary"
              >
                <span className="hidden sm:inline">About Depression</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {nextPath && (
            <button
              onClick={() => handleNavigate(nextPath)}
              className="nav-button-primary"
            >
              <span className="hidden sm:inline">{nextLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
