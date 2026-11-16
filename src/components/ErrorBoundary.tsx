import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Do not log personal data. */ }
  render() { return this.state.failed ? <main className="container section"><h1>Let's try that again.</h1><p>The page could not be displayed. Reload to start a fresh session.</p><button className="button" onClick={() => window.location.assign('/')}>Return home</button></main> : this.props.children; }
}
