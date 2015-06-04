import React from 'react';
import t from 'tcomb';
import listener from './listener';
import isReactComponent from '../isReactComponent';

export default function queries(getQueries) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.Func.is(getQueries), `@queries decorator can only be configured with a function.`);
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      const name = Component.name;
      t.assert(isReactComponent(Component), `@queries decorator can only be applied to React.Component(s)`);
      t.assert(!(t.Func.is(Component.getQueries)), `@queries decorator can only be applied to component ${name}, queries are already defined`);
    }

    @listener(QueriesWrapper.prototype.forceUpdate)
    class QueriesWrapper extends React.Component {

      get() {
        if (process.env.NODE_ENV !== 'production') {
          t.assert(t.Obj.is(this.props.app), `@queries decorator: missing app prop in component ${Component.name}`);
          t.assert(t.Func.is(this.props.router), `@queries decorator: missing router prop in component ${Component.name}`);
        }
        const app = this.props.app;
        const params = this.props.router.getCurrentParams();
        const query = this.props.router.getCurrentQuery();
        const queries = getQueries(app, params, query);
        const data = {};
        for (let k in queries) {
          if (queries[k].get) {
            data[k] = queries[k].get();
          }
        }
        return data;
      }

      render() {
        return <Component {...this.props} {...this.get()} />;
      }

    }

    QueriesWrapper.getQueries = getQueries;

    return QueriesWrapper;
  };
}
