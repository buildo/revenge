import React from 'react';
import t from 'tcomb';
import isReactComponent from '../isReactComponent';

export default function listener(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@listener decorator can only be applied to React.Component(s)`);
  }

  class ListenerWrapper extends React.Component {

    componentWillMount() {
      if (process.env.NODE_ENV !== 'production') {
        t.assert(t.Obj.is(this.props.app), `@listener decorator: missing app prop in component ${Component.name}`);
      }
      this.unlistenStateDidChange = this.props.app.on('stateDidChange', this.forceUpdate.bind(this));
    }

    componentWillUnmount() {
      this.unlistenStateDidChange();
    }

    render() {
      return <Component {...this.props} />;
    }

  }

  return ListenerWrapper;
}

