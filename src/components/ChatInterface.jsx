import { useEffect, useRef } from 'react';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import { MessageSquare } from 'lucide-react';

function ChatInterface({ messages, loading }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="bg-surface border border-surfaceRaised rounded-xl overflow-hidden">
      <div
        ref={containerRef}
        className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 md:space-y-4 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4D9078 #ebe8e3'
        }}
      >
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surfaceRaised flex items-center justify-center mb-3 md:mb-4">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <p className="text-textSecondary text-base md:text-lg">
              Start by uploading code or asking a question
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}

            {loading && <LoadingSpinner message="Thinking..." />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Custom scrollbar styling for webkit browsers */}
      <style>{`
        .max-h-\[400px\]::-webkit-scrollbar,
        .max-h-\[500px\]::-webkit-scrollbar,
        .max-h-\[600px\]::-webkit-scrollbar,
        .max-h-\[700px\]::-webkit-scrollbar {
          width: 8px;
        }
        .max-h-\[400px\]::-webkit-scrollbar-track,
        .max-h-\[500px\]::-webkit-scrollbar-track,
        .max-h-\[600px\]::-webkit-scrollbar-track,
        .max-h-\[700px\]::-webkit-scrollbar-track {
          background: #ebe8e3;
        }
        .max-h-\[400px\]::-webkit-scrollbar-thumb,
        .max-h-\[500px\]::-webkit-scrollbar-thumb,
        .max-h-\[600px\]::-webkit-scrollbar-thumb,
        .max-h-\[700px\]::-webkit-scrollbar-thumb {
          background: #4D9078;
          border-radius: 4px;
        }
        .max-h-\[400px\]::-webkit-scrollbar-thumb:hover,
        .max-h-\[500px\]::-webkit-scrollbar-thumb:hover,
        .max-h-\[600px\]::-webkit-scrollbar-thumb:hover,
        .max-h-\[700px\]::-webkit-scrollbar-thumb:hover {
          background: #3d7360;
        }
      `}</style>
    </div>
  );
}

export default ChatInterface;
