import React from 'react';
import t from 'tcomb';
import listener from './listener';
import isReactComponent from '../isReactComponent';

export default function queries(getQueries) {

  if (process.env.NODE_ENV !== 'production') {
    const example = `

Example:

@queries(app => {
  return {
    propA: app.queryA(),
    propB: app.queryB()
  };
})
    `;
    t.assert(t.Func.is(getQueries), `@queries decorator can only be configured with a function. ${example}`);
  }

  return (Component) => {

    if (process.env.NODE_ENV !== 'production') {
      t.assert(isReactComponent(Component), `@queries decorator can only be applied to React.Component(s)`);
    }

    @listener
    class QueriesWrapper extends React.Component {

      getData() {
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
        return <Component {...this.props} {...this.getData()} />;
      }

    }

    QueriesWrapper.getQueries = getQueries;

    return QueriesWrapper;
  };
}
