import { useEffect, useRef, useState } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'tableau-viz': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          id?: string;
          src?: string;
          toolbar?: string;
          'hide-tabs'?: boolean | string;
          width?: string;
          height?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface TableauEmbedProps {
  src: string;
  /** Optional fixed height override. If omitted, height adapts to viewport. */
  height?: string;
}

const computeResponsiveHeight = (): string => {
  if (typeof window === 'undefined') return '800px';
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Aim for ~85% of viewport height, clamped per breakpoint
  if (w < 640) return `${Math.round(Math.min(Math.max(h * 0.8, 520), 720))}px`;
  if (w < 1024) return `${Math.round(Math.min(Math.max(h * 0.82, 640), 880))}px`;
  return `${Math.round(Math.min(Math.max(h * 0.85, 720), 1100))}px`;
};

const TableauEmbed = ({ src, height }: TableauEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoHeight, setAutoHeight] = useState<string>(() =>
    height ?? computeResponsiveHeight()
  );

  // Recompute on resize when no fixed height provided
  useEffect(() => {
    if (height) return;
    const onResize = () => setAutoHeight(computeResponsiveHeight());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [height]);

  const effectiveHeight = height ?? autoHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    const viz = document.createElement('tableau-viz');
    viz.id = 'depressionDashboard';
    viz.setAttribute('src', src);
    viz.setAttribute('toolbar', 'bottom');
    viz.setAttribute('hide-tabs', '');
    viz.setAttribute('width', '100%');
    viz.setAttribute('height', effectiveHeight);
    container.appendChild(viz);
  }, [src, effectiveHeight]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
      style={{ minHeight: effectiveHeight }}
    />
  );
};

export default TableauEmbed;
