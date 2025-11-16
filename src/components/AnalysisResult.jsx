import { AlertCircle, Lightbulb, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { MarkdownText } from '../utils/parseMarkdown';

function AnalysisResult({ data }) {
  const { score, summary, issues = [], strengths = [] } = data;

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 71) return 'text-success';
    if (score >= 41) return 'text-warning';
    return 'text-error';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 71) return 'border-success';
    if (score >= 41) return 'border-warning';
    return 'border-error';
  };

  const getSeverityStyles = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-error/10',
          border: 'border-error/30',
          text: 'text-error',
          badge: 'bg-error text-white'
        };
      case 'medium':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          text: 'text-warning',
          badge: 'bg-warning text-background'
        };
      case 'low':
        return {
          bg: 'bg-accent/10',
          border: 'border-accent/30',
          text: 'text-accent',
          badge: 'bg-accent text-background'
        };
      default:
        return {
          bg: 'bg-surfaceRaised',
          border: 'border-surfaceRaised',
          text: 'text-textSecondary',
          badge: 'bg-surfaceRaised text-textPrimary'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Section */}
      <div className="bg-surfaceRaised rounded-2xl p-6 md:p-8 border border-surfaceRaised">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Circular Score */}
          <div className="relative">
            <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-surfaceRaised"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                className={`${getScoreColor(score)} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl md:text-5xl font-bold ${getScoreColor(score)} animate-count-up`}>
                  {score}
                </div>
                <div className="text-textSecondary text-sm">/ 100</div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-textPrimary mb-2">
              Code Quality Analysis
            </h3>
            {summary && (
              <p className="text-textSecondary leading-relaxed">
                <MarkdownText>{summary}</MarkdownText>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Issues Section */}
      {issues.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Issues Found ({issues.length})
          </h4>

          <div className="space-y-4">
            {issues.map((issue, index) => {
              const styles = getSeverityStyles(issue.severity);
              return (
                <div
                  key={index}
                  className={`${styles.bg} border ${styles.border} rounded-xl p-4 md:p-6 space-y-4 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${styles.badge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                          {issue.severity}
                        </span>
                      </div>
                      <h5 className="text-lg font-bold text-textPrimary">
                        {issue.principle}
                      </h5>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <p className="text-textSecondary leading-relaxed text-sm md:text-base">
                      <MarkdownText>{issue.explanation}</MarkdownText>
                    </p>
                  </div>

                  {/* Code Snippet */}
                  {issue.line_content && (
                    <div className="bg-background rounded-lg overflow-hidden">
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-xs md:text-sm text-textPrimary font-mono">
                          {issue.line_content}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Impact */}
                  {issue.impact && (
                    <div className="flex gap-3 items-start p-3 bg-background/50 rounded-lg">
                      <TrendingUp className={`w-5 h-5 ${styles.text} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-1">
                          Impact
                        </p>
                        <p className="text-sm text-textPrimary">
                          <MarkdownText>{issue.impact}</MarkdownText>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hint */}
                  {issue.hint && (
                    <div className="flex gap-3 items-start p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                          How to Fix
                        </p>
                        <p className="text-sm text-textPrimary">
                          <MarkdownText>{issue.hint}</MarkdownText>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths Section */}
      {strengths.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Strengths
          </h4>

          <div className="bg-success/5 border border-success/20 rounded-xl p-4 md:p-6">
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-textPrimary animate-slide-up"
                  style={{ animationDelay: `${(issues.length + index) * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base leading-relaxed">
                    <MarkdownText>{strength}</MarkdownText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;
