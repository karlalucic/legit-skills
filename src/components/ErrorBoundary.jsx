import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-surface border border-surfaceRaised rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>

            <h1 className="text-2xl font-bold text-textPrimary mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-textSecondary mb-6">
              The application encountered an unexpected error. Don't worry, your work is safe.
            </p>

            {this.state.error && (
              <div className="bg-background rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-mono text-error break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-primary hover:bg-primaryHover text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </button>

            <p className="text-textSecondary text-sm mt-4">
              If this problem persists, please try clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
