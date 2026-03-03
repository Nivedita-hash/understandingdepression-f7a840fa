import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

// Ordered learning flow (excluding Home)
const flowOrder = [
  '/about-depression',
  '/cases',
  '/case/1',
  '/case/2',
  '/case/3',
  '/case/4',
  '/transition',
  '/compare',
  '/learned',
  '/bibliography',
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleNavigate = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Don't render nav on Home page
  if (path === '/') return null;

  // Find current index in flow to determine "Next"
  const currentIndex = flowOrder.indexOf(path);
  const nextPath = currentIndex >= 0 && currentIndex < flowOrder.length - 1
    ? flowOrder[currentIndex + 1]
    : null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('/')}
          className="nav-button-secondary"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {nextPath && (
          <button
            onClick={() => handleNavigate(nextPath)}
            className="nav-button-primary"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
