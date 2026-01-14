import { ReactNode, useEffect } from 'react';
import Navigation from './Navigation';

interface PageWrapperProps {
  children: ReactNode;
  backPath?: string;
  nextPath?: string;
  backLabel?: string;
  nextLabel?: string;
  showNav?: boolean;
}

const PageWrapper = ({ 
  children, 
  backPath, 
  nextPath, 
  backLabel, 
  nextLabel,
  showNav = true 
}: PageWrapperProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      {showNav && (
        <Navigation 
          backPath={backPath} 
          nextPath={nextPath} 
          backLabel={backLabel}
          nextLabel={nextLabel}
        />
      )}
      <main className={showNav ? 'pt-20' : ''}>
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
