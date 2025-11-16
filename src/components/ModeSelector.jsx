import { FileCode, BookOpen, Calculator, Server } from 'lucide-react';

function ModeSelector({ onSelectMode }) {
  const modes = [
    {
      id: 'analyze',
      icon: FileCode,
      title: 'Analyze Your Code',
      description: 'Upload code for review and get production-ready feedback',
      cta: 'Get Started',
      bgColor: 'bg-card-beige',
      iconBg: 'bg-accent-primary'
    },
    {
      id: 'learn',
      icon: BookOpen,
      title: 'Learn Algorithms',
      description: 'Master algorithms with interactive practice and visual diagrams',
      cta: 'Start Learning',
      bgColor: 'bg-card-sage',
      iconBg: 'bg-accent-primary'
    },
    {
      id: 'math',
      icon: Calculator,
      title: 'Math Concepts',
      description: 'Probability, statistics, and game theory for tech interviews',
      cta: 'Explore Questions',
      bgColor: 'bg-card-blueGray',
      iconBg: 'bg-accent-primary'
    },
    {
      id: 'technical',
      icon: Server,
      title: 'Technical Concepts',
      description: 'System design, databases, networking, and cloud fundamentals',
      cta: 'Learn Concepts',
      bgColor: 'bg-card-grayGreen',
      iconBg: 'bg-accent-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`group ${mode.bgColor} border border-border-light rounded-xl p-10 md:p-12 flex flex-col items-start gap-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-border-medium cursor-pointer`}
          >
            {/* Icon */}
            <div className={`${mode.iconBg} w-16 h-16 md:w-18 md:h-18 rounded-lg flex items-center justify-center`}>
              <Icon className="w-8 h-8 md:w-9 md:h-9 text-white" />
            </div>

            {/* Content */}
            <div className="text-left space-y-2.5">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">
                {mode.title}
              </h2>
              <p className="text-text-secondary text-base leading-relaxed">
                {mode.description}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <span className="text-accent-primary font-medium text-base group-hover:text-accent-hover transition-colors">
                {mode.cta} →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ModeSelector;
