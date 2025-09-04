

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen w-full bg-brand-bg flex items-center justify-center p-4">
            <div className="z-10 bg-brand-surface/80 backdrop-blur-lg border border-red-500/50 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-brand-text mb-2">
                    Something went wrong.
                </h1>
                <p className="text-brand-text-alt mb-8">
                    An unexpected error occurred. Please try refreshing the page.
                </p>
                <button
                    onClick={this.handleRefresh}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;