import React from 'react';
import t from 'tcomb';
import assign from 'lodash/object/assign';
import debug from 'debug';
import listener from './listener';
import log from './log';
import isReactComponent from '../isReactComponent';

const Declared = t.list(t.union([
  t.Str,
  t.dict(t.Str, t.Str)
]));

const d = debug('revenge:@queries');

export default function queries(declared) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(Declared.is(declared), `@queries decorator can only be configured with a list of query ids. Optionally rename a single query like this: { propName: queryId }`);
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      const name = Component.name;
      t.assert(isReactComponent(Component), `@queries decorator can only be applied to React.Component(s)`);
      t.assert(!Component.queries, `@queries decorator can not be applied to component ${name}, queries are already defined`);
    }

    @listener(QueriesWrapper.prototype.forceUpdate)
    class QueriesWrapper extends React.Component {

      @log('revenge:@queries');
      get() {
        if (process.env.NODE_ENV !== 'production') {
          t.assert(t.Obj.is(this.props.app), `@queries decorator: missing app prop in component ${Component.name}`);
        }
        const data = this.props.app.get();

        return declared.reduce((ac, q) => {
          const query = t.Str.is(q) ? { q } : q;
          const { propName } = query;
          const qId = query[propName];

          return assign(ac, {
            [propName]: data[qId] || null
          });
        }, {});
      }

      render() {
        return <Component {...this.props} {...this.get()} />;
      }

    }

    QueriesWrapper.queries = declared.reduce((ac, q) => {
      const query = t.Str.is(q) ? q : q[Object.keys(q)[0]];
      return assign(ac, {
        [query]: true
      });
    }, {});
    d(`${Component.name} cleaned up queries: %o`, QueriesWrapper.queries);

    return QueriesWrapper;
  };
}
