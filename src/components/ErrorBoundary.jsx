import { Component } from 'react'

/** If something breaks, show a clear message instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <div className="error-banner">Something went wrong: {String(this.state.error.message || this.state.error)}</div>
    }
    return this.props.children
  }
}
