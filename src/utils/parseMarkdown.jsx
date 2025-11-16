// Simple markdown parser for inline formatting
export function parseMarkdown(text) {
  if (!text) return '';

  let parsed = text;

  // Convert **bold** to <strong>
  parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-textPrimary">$1</strong>');

  // Convert `code` to <code>
  parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-surfaceRaised text-accent rounded text-sm font-mono">$1</code>');

  // Convert line breaks to <br>
  parsed = parsed.replace(/\n/g, '<br/>');

  return parsed;
}

// Parse markdown and return React component
export function MarkdownText({ children, className = '' }) {
  if (!children) return null;

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(children) }}
    />
  );
}
