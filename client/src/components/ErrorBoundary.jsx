import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Something went wrong</h1>
                            <p className="text-gray-500 text-center mb-8">
                                The application encountered an unexpected error. Please show this to the developer.
                            </p>

                            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto mb-6">
                                <p className="text-red-400 font-mono text-sm mb-2 font-bold">
                                    {this.state.error && this.state.error.toString()}
                                </p>
                                <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all"
                                >
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
