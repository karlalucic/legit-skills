import { useState } from 'react';
import { Lightbulb, Sparkles, Dices, Calculator, Server } from 'lucide-react';

function AlgorithmInput({ onSubmit, isLoading = false, mode = 'algorithms' }) {
  const [topic, setTopic] = useState('');

  const algorithmSuggestions = [
    'Binary Search',
    'Merge Sort',
    'Quicksort',
    'BFS',
    'DFS',
    'Dynamic Programming'
  ];

  const mathSuggestions = [
    'Monty Hall Problem',
    'Birthday Paradox',
    'Expected Value',
    'Bayes\' Theorem',
    'Secretary Problem',
    'Coupon Collector'
  ];

  const technicalSuggestions = [
    'CAP Theorem',
    'Database Indexing',
    'TCP vs UDP',
    'Load Balancing',
    'Caching Strategies',
    'Microservices'
  ];

  // Get configuration based on mode
  const getModeConfig = () => {
    switch (mode) {
      case 'algorithms':
        return {
          icon: Lightbulb,
          title: 'Choose an Algorithm',
          subtitle: 'Learn with visual explanations and practice',
          placeholder: 'What algorithm do you want to learn? (e.g., binary search, merge sort)',
          buttonText: 'Start Learning',
          sections: [
            {
              label: 'Popular Algorithms:',
              icon: Lightbulb,
              suggestions: algorithmSuggestions,
              chipClass: 'bg-surfaceRaised hover:bg-primary/20 text-textSecondary hover:text-accent border-surfaceRaised hover:border-primary/30'
            }
          ]
        };
      case 'math':
        return {
          icon: Calculator,
          title: 'Choose a Question',
          subtitle: 'Probability, statistics, and game theory',
          placeholder: 'What probability concept? (e.g., Monty Hall, Birthday Paradox)',
          buttonText: 'Explore Question',
          sections: [
            {
              label: 'Popular Questions:',
              icon: Calculator,
              suggestions: mathSuggestions,
              chipClass: 'bg-surfaceRaised hover:bg-primary/20 text-textSecondary hover:text-accent border-surfaceRaised hover:border-primary/30'
            }
          ]
        };
      case 'technical':
        return {
          icon: Server,
          title: 'Choose a Concept',
          subtitle: 'System design, databases, networking & more',
          placeholder: 'What concept do you want to learn? (e.g., CAP theorem, load balancing)',
          buttonText: 'Learn Concept',
          sections: [
            {
              label: 'Popular Concepts:',
              icon: Server,
              suggestions: technicalSuggestions,
              chipClass: 'bg-surfaceRaised hover:bg-primary/20 text-textSecondary hover:text-accent border-surfaceRaised hover:border-primary/30'
            }
          ]
        };
      default:
        return getModeConfig(); // Default to algorithms
    }
  };

  const config = getModeConfig();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const handleChipClick = (suggestion) => {
    setTopic(suggestion);
  };

  const Icon = config.icon;

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
      <div className="bg-surface border border-surfaceRaised rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-textPrimary">
              {config.title}
            </h2>
            <p className="text-textSecondary text-xs md:text-sm">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={config.placeholder}
              disabled={isLoading}
              className="w-full px-4 sm:px-5 md:px-6 py-3 md:py-4 bg-surfaceRaised border border-surfaceRaised rounded-xl text-sm md:text-base text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="w-full py-3 md:py-4 bg-primary hover:bg-primaryHover disabled:bg-surfaceRaised disabled:text-textSecondary disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 text-sm md:text-base"
          >
            <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Starting...' : config.buttonText}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="pt-3 md:pt-4 border-t border-surfaceRaised space-y-4">
          {config.sections.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <div key={idx}>
                <p className="text-textSecondary text-xs md:text-sm mb-2 md:mb-3 flex items-center gap-2">
                  <SectionIcon className="w-3 h-3 md:w-4 md:h-4" />
                  {section.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleChipClick(suggestion)}
                      disabled={isLoading}
                      className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-full text-xs md:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${section.chipClass}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AlgorithmInput;
