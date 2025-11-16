import ReactMarkdown from 'react-markdown';
import SchemaViewer from './SchemaViewer';
import AnalysisResult from './AnalysisResult';

function Message({ message }) {
  const { role, content, type, data } = message;
  const isTutor = role === 'tutor';

  const renderContent = () => {
    switch (type) {
      case 'text':
        return isTutor ? (
          <div className="text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold text-orange-200 mt-4 mb-2" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-base font-semibold text-orange-100 mt-3 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold text-orange-200 mt-5 mb-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-3 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="mb-3 ml-4 space-y-1 list-disc list-outside" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="mb-3 ml-4 space-y-1 list-decimal list-outside" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="px-1.5 py-0.5 bg-white/15 text-orange-100 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-sm font-mono" {...props} />
                  ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 rounded-lg p-3 my-2 overflow-x-auto" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-white" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic text-orange-100" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2">
            {content && <div className="text-sm leading-relaxed mb-3">{content}</div>}
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-gray-100 text-xs font-mono">{data?.code}</code>
            </pre>
          </div>
        );

      case 'schema':
        return (
          <div className="space-y-3">
            {content && <div className="text-sm leading-relaxed mb-3">{content}</div>}
            <SchemaViewer schemaData={data} />
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-3">
            {content && <div className="text-sm leading-relaxed mb-3">{content}</div>}
            <AnalysisResult data={data} />
          </div>
        );

      case 'score':
        return (
          <div className="space-y-4">
            {content && <div className="text-sm leading-relaxed mb-4">{content}</div>}
            <div className="bg-surfaceRaised rounded-xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2 animate-count-up">
                  {data?.score || 0}
                  <span className="text-2xl text-textSecondary">/100</span>
                </div>
                <p className="text-textSecondary text-sm">Code Quality Score</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${data?.score || 0}%` }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-sm leading-relaxed">{content}</div>;
    }
  };

  return (
    <div className={`flex mb-4 animate-slide-up ${isTutor ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 shadow-lg ${
          isTutor
            ? 'bg-primary text-white rounded-tl-sm'
            : 'bg-surfaceRaised text-textPrimary rounded-tr-sm'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default Message;
