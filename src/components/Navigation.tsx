import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
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

  // Case story pages get Back/Next between cases
  const caseMatch = path.match(/^\/case\/(\d+)$/);
  const caseNum = caseMatch ? parseInt(caseMatch[1]) : null;
  const isCase = caseNum !== null && caseNum >= 1 && caseNum <= 4;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate('/')}
            className="nav-button-secondary"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          {isCase && caseNum! > 1 && (
            <button
              onClick={() => handleNavigate(`/case/${caseNum! - 1}`)}
              className="nav-button-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          {path === '/transition' && (
            <button
              onClick={() => handleNavigate('/case/4')}
              className="nav-button-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isCase && (
            <button
              onClick={() => handleNavigate(caseNum! < 4 ? `/case/${caseNum! + 1}` : '/transition')}
              className="nav-button-primary"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {!isCase && nextPath && (
            <button
              onClick={() => handleNavigate(nextPath)}
              className="nav-button-primary"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
