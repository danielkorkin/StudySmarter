// src/components/ErrorBoundary.tsx
import React from "react";

interface Props {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="p-4 rounded-md bg-red-50 border border-red-200">
						<h2 className="text-red-800 text-lg font-semibold">
							Something went wrong
						</h2>
						<p className="text-red-600 mt-1">
							{this.state.error?.message}
						</p>
						<button
							className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
							onClick={() => this.setState({ hasError: false })}
						>
							Try again
						</button>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
