import { Code, ArrowLeft } from 'lucide-react';

function Header({ onBack, showBackButton }) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-background-primary border-b border-border-light">
      <div className="h-full max-w-reading mx-auto px-6 sm:px-8 flex items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-text-primary rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
              legit skills
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
