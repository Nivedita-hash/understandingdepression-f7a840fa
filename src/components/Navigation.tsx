import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Home, BookOpen, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { caseStudies } from '@/data/caseStudies';

// Short name for the "next case" button
const caseShortNames = ['Sarah', 'Marcus', 'Elena', 'James'];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleNavigate = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Determine which case page we're on (if any)
  const caseMatch = path.match(/^\/case\/(\d+)$/);
  const caseId = caseMatch ? parseInt(caseMatch[1]) : null;

  // Build button configs per page: array of { label, icon?, path, primary?, zone }
  type NavButton = {
    label: string;
    path: string;
    primary?: boolean;
    icon?: React.ReactNode;
  };

  let left: NavButton[] = [];
  let center: NavButton[] = [];
  let right: NavButton[] = [];

  if (path === '/') {
    // Home page: About Depression (left), Case Stories (right)
    left = [{ label: 'About Depression', path: '/about-depression' }];
    right = [{ label: 'Case Stories', path: '/cases' }];
  } else if (path === '/about-depression') {
    left = [{ label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }];
    center = [{ label: 'Case Stories', path: '/cases' }];
  } else if (path === '/cases') {
    left = [{ label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }];
    center = [{ label: 'About Depression', path: '/about-depression' }];
    right = [{ label: 'Start Exploring', path: '/case/1', primary: true, icon: <ArrowRight className="w-4 h-4" /> }];
  } else if (caseId !== null && caseId >= 1 && caseId <= 4) {
    left = [{ label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }];
    
    // Two center buttons
    center = [
      { label: 'About Depression', path: '/about-depression' },
      { label: 'Case Stories', path: '/cases', icon: <LayoutGrid className="w-4 h-4" /> },
    ];

    if (caseId < 4) {
      const nextName = caseShortNames[caseId]; // caseId is 1-indexed, so index caseId = next
      right = [{ label: `Next: ${nextName}'s Story`, path: `/case/${caseId + 1}`, icon: <ArrowRight className="w-4 h-4" /> }];
    } else {
      // Case 4 → Dashboard
      right = [{ label: 'Dashboard', path: '/transition', primary: true, icon: <ArrowRight className="w-4 h-4" /> }];
    }
  } else {
    // All other pages (transition, compare, learned, bibliography)
    left = [{ label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }];
    center = [{ label: 'Case Stories', path: '/cases', icon: <LayoutGrid className="w-4 h-4" /> }];
  }

  const renderButton = (btn: NavButton) => (
    <button
      key={btn.path + btn.label}
      onClick={() => handleNavigate(btn.path)}
      className={btn.primary ? 'nav-button-primary' : 'nav-button-secondary'}
    >
      {btn.icon && !btn.primary && btn.icon}
      <span>{btn.label}</span>
      {btn.icon && btn.primary && btn.icon}
    </button>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
        {/* Left zone */}
        <div className="flex items-center gap-3 justify-start">
          {left.map(renderButton)}
        </div>

        {/* Center zone */}
        <div className="flex items-center gap-3 justify-center">
          {center.map(renderButton)}
        </div>

        {/* Right zone */}
        <div className="flex items-center gap-3 justify-end">
          {right.map(renderButton)}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
