import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import mermaid from 'mermaid';

function SchemaViewer({ schemaData }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const mermaidRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialize mermaid only once
    if (!isInitialized.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
      });
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (schemaData?.type === 'mermaid' && mermaidRef.current && isInitialized.current && isExpanded) {
      const renderDiagram = async () => {
        try {
          // Generate unique ID for this diagram
          const id = `mermaid-${Date.now()}`;

          // Clear previous content
          mermaidRef.current.innerHTML = '';
          mermaidRef.current.removeAttribute('data-processed');

          // Render mermaid diagram
          const { svg } = await mermaid.render(id, schemaData.diagram);

          // Only update if ref still exists
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<div class="text-red-400 text-sm p-4">Failed to render diagram. Please check the diagram syntax.</div>`;
          }
        }
      };

      renderDiagram();
    }
  }, [schemaData, isExpanded]);

  if (!schemaData) {
    return null;
  }

  const { type, diagram, explanation, key_points } = schemaData;

  return (
    <div className="bg-surface border border-surfaceRaised rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-surfaceRaised cursor-pointer hover:bg-surfaceRaised/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-textPrimary">Visual Diagram</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-textSecondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-textSecondary" />
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Diagram Container */}
          <div className="rounded-lg overflow-hidden">
            {type === 'mermaid' ? (
              <div className="bg-gray-800 p-8 rounded-lg min-h-[400px] flex items-center justify-center">
                <div ref={mermaidRef} className="mermaid w-full flex justify-center">
                  {/* Mermaid diagram will be rendered here */}
                </div>
              </div>
            ) : type === 'ascii' ? (
              <pre className="bg-gray-800 p-8 rounded-lg overflow-x-auto">
                <code className="text-gray-100 font-mono text-base md:text-lg leading-loose whitespace-pre" style={{ fontFamily: 'Monaco, "Courier New", Consolas, monospace' }}>
                  {diagram}
                </code>
              </pre>
            ) : null}
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                Explanation
              </h4>
              <p className="text-textSecondary leading-relaxed">{explanation}</p>
            </div>
          )}

          {/* Key Points */}
          {key_points && key_points.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                Key Points
              </h4>
              <ul className="space-y-2">
                {key_points.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-textSecondary"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SchemaViewer;
