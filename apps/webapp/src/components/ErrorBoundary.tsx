import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="error-boundary">
          <strong>Etwas ist schiefgelaufen.</strong>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
