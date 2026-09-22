import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Workspace error", error, info);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <div className="max-w-lg rounded-xl border border-border bg-panel p-6 shadow-panel">
          <h1 className="text-lg font-semibold">The workspace hit an unexpected error</h1>
          <p className="mt-2 text-sm text-muted">{this.state.error.message}</p>
          <button
            className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
            onClick={() => this.setState({ error: null })}
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
