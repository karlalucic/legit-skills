import { useState } from 'react';
import { Send } from 'lucide-react';

function ChatInput({ onSubmit, isLoading = false }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2 md:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-surfaceRaised border border-surfaceRaised rounded-xl text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 md:px-6 py-2 md:py-3 bg-primary hover:bg-primaryHover disabled:bg-surfaceRaised disabled:text-textSecondary disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 text-sm md:text-base"
        >
          <Send className={`w-4 h-4 md:w-5 md:h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Ask'}</span>
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
