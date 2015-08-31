import React from 'react';
import t from 'tcomb';
import isReactComponent from '../isReactComponent';

export default function readyState(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@readyState decorator can only be applied to React.Component(s)`);
    t.assert(!Component.__readyState, `@readyState decorator should only be applied once`);
  }

  const { componentWillMount, componentWillUnmount } = Component.prototype;

  class ReadyStateWrapper extends React.Component {

    componentWillMount() {
      this.__readyState = { loading: false };

      if (process.env.NODE_ENV !== 'production') {
        t.assert(t.Obj.is(this.props.app), `@readyState decorator: missing app prop in component ${Component.name}`);
      }

      const app = this.props.app;
      this.unobserveFetchStart = app.on('fetchStart', () => {
        this.__readyState.loading = true;
      });
      this.unobserveFetchEnd = app.on('fetchEnd', () => {
        this.__readyState.loading = false;
      });

      if (componentWillMount) {
        componentWillMount.call(this);
      }
    }

    componentWillUnmount() {
      if (componentWillUnmount) {
        componentWillUnmount.call(this);
      }
      this.unobserveFetchEnd();
      this.unobserveFetchStart();
    }

    render() {
      return <Component {...this.props} {...this.__readyState} />;
    }

  }

  return ReadyStateWrapper;
}
