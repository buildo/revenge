import React from 'react';
import t from 'tcomb';
import assign from 'lodash/object/assign';
import partialRight from 'lodash/function/partialRight';
import debug from 'debug';
import listener from './listener';
import isReactComponent from '../isReactComponent';

export default function mapProps(map) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.Function.is(map), `@mapProps requires a map fn`);
  }

  return function (Component) {
    if (process.env.NODE_ENV !== 'production') {
      const name = Component.name;
      t.assert(isReactComponent(Component), `@mapProps decorator can only be applied to React.Component(s)`);
    }

    class MapPropsWrapper extends React.Component {
      render() {
        return <Component {...map(this.props)} />;
      }
    }

    return MapPropsWrapper;
  };
}
