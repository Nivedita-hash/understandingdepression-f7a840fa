import { useEffect, useRef } from 'react';

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
  height?: string;
}

const TableauEmbed = ({ src, height = '900px' }: TableauEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the custom element is created after mount
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    const viz = document.createElement('tableau-viz');
    viz.id = 'depressionDashboard';
    viz.setAttribute('src', src);
    viz.setAttribute('toolbar', 'bottom');
    viz.setAttribute('hide-tabs', '');
    viz.setAttribute('width', '100%');
    viz.setAttribute('height', height);
    container.appendChild(viz);
  }, [src, height]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
      style={{ minHeight: height }}
    />
  );
};

export default TableauEmbed;
