import { useEffect, useRef } from 'react';

interface TableauEmbedProps {
  /** Tableau workbook/view path, e.g. "NarrativeProj_v1_2/Dashboard1" */
  name?: string;
  /** Static fallback image path under public.tableau.com/static/images */
  staticImage?: string;
  /** Static image used inside <noscript> */
  staticImageRss?: string;
}

/**
 * Embeds a Tableau Public dashboard using the official Share-dialog snippet.
 * Container is responsive and themed to match the site.
 */
const TableauEmbed = ({
  name = 'NarrativeProj_v1_2/Dashboard1',
  staticImage = 'https://public.tableau.com/static/images/Na/NarrativeProj_v1_2/Dashboard1/1.png',
  staticImageRss = 'https://public.tableau.com/static/images/Na/NarrativeProj_v1_2/Dashboard1/1_rss.png',
}: TableauEmbedProps) => {
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divElement = placeholderRef.current;
    if (!divElement) return;

    // Build the <object> Tableau viz
    const vizElement = document.createElement('object');
    vizElement.className = 'tableauViz';
    vizElement.style.display = 'none';

    const params: Record<string, string> = {
      host_url: 'https%3A%2F%2Fpublic.tableau.com%2F',
      embed_code_version: '3',
      site_root: '',
      name,
      tabs: 'no',
      toolbar: 'yes',
      static_image: staticImage,
      animate_transition: 'yes',
      display_static_image: 'yes',
      display_spinner: 'yes',
      display_overlay: 'yes',
      display_count: 'yes',
      language: 'en-US',
    };
    Object.entries(params).forEach(([k, v]) => {
      const p = document.createElement('param');
      p.setAttribute('name', k);
      p.setAttribute('value', v);
      vizElement.appendChild(p);
    });

    divElement.appendChild(vizElement);

    // Responsive sizing per Tableau snippet
    const sizeViz = () => {
      const w = divElement.offsetWidth;
      if (w > 800) {
        vizElement.style.width = '100%';
        vizElement.style.height = `${w * 0.75}px`;
      } else if (w > 500) {
        vizElement.style.width = '100%';
        vizElement.style.height = `${w * 0.75}px`;
      } else {
        vizElement.style.width = '100%';
        vizElement.style.height = '1177px';
      }
    };
    sizeViz();

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode?.insertBefore(scriptElement, vizElement);

    // Reflow on resize
    const onResize = () => sizeViz();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (divElement) divElement.innerHTML = '';
    };
  }, [name, staticImage]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div
        ref={placeholderRef}
        className="tableauPlaceholder w-full"
        style={{ position: 'relative' }}
      >
        <noscript>
          <a href="#">
            <img
              alt="Depression dashboard"
              src={staticImageRss}
              style={{ border: 'none' }}
            />
          </a>
        </noscript>
      </div>
    </div>
  );
};

export default TableauEmbed;
