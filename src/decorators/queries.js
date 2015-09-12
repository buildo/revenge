import React from 'react';
import t from 'tcomb';
import assign from 'lodash/object/assign';
import partialRight from 'lodash/function/partialRight';
import debug from 'debug';
import listener from './listener';
import isReactComponent from '../isReactComponent';

const hasOneKey = v => Object.keys(v).length === 1;
const StringDict = t.subtype(t.dict(t.Str, t.Str), hasOneKey, 'StringDict');
const FilterStateFn = t.Func; // revenge State -> t.Bool
const FilterDict = t.subtype(t.dict(t.Str,
  t.subtype(t.Obj, ({ query, filter }) => t.Str.is(query) && t.maybe(FilterStateFn).is(filter))
  // TODO(gio): not sure why this doesn't work:
  // t.struct({
  //   query: t.Str,
  //   filter: t.maybe(FilterStateFn)
  // })
), hasOneKey, 'FilterDict');
const DeclaredQ = t.union([
  t.Str, StringDict, FilterDict
], 'DeclaredQ');
DeclaredQ.dispatch = v => t.match(v,
  t.Str, () => t.Str,
  StringDict, () => StringDict,
  FilterDict, () => FilterDict
);
const Declared = t.list(DeclaredQ, 'Declared');

const log = debug('revenge:@queries');

export default function queries(declared) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(Declared.is(declared), `@queries decorator can only be configured with a list of query ids. Optionally rename a query like this: { propName: queryId }`);
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      const name = Component.name;
      t.assert(isReactComponent(Component), `@queries decorator can only be applied to React.Component(s)`);
      t.assert(!Component.queries, `@queries decorator can not be applied to component ${name}, queries are already defined`);
    }

    const shouldHaveAppProp = ctx => {
      t.assert(t.Obj.is(ctx.props.app), `@queries decorator: missing app prop in component ${Component.name}`);
    };

    const filterDeclared = (obj, defaultValue) => {
      return declared.reduce((ac, q) => {
        const query = t.Str.is(q) ? { [q]: q } : q;
        const propName = Object.keys(query)[0];
        const queryId = query[propName];

        return assign(ac, {
          [propName]: obj[queryId] || defaultValue
        });
      }, {});
    };

    @listener(QueriesWrapper.prototype.forceUpdate)
    class QueriesWrapper extends React.Component {

      get() {
        if (process.env.NODE_ENV !== 'production') {
          shouldHaveAppProp(this);
        }

        return filterDeclared(this.props.app.get(), null);
      }

      readyState() {
        if (process.env.NODE_ENV !== 'production') {
          shouldHaveAppProp(this);
        }

        const data = this.props.app.get();
        const filteredMeta = data ? filterDeclared(data._meta, {
          loading: false, cached: false
        }) : {};
        return {
          readyState: assign(filteredMeta, {
            loading: Object.keys(filteredMeta).filter(({ loading }) => loading).length === declared.length,
            cached: Object.keys(filteredMeta).filter(({ cached }) => cached).length === declared.length
          })
        };
      }

      render() {
        return <Component {...this.props} {...this.get()} {...this.readyState()} />;
      }

    }

    const defaultFilter = () => true;
    const getFilter = partialRight(t.match,
      t.Str, query => ({ query, filter: defaultFilter }),
      StringDict, query => ({ query: query[Object.keys(query)[0]], filter: defaultFilter }),
      FilterDict, q => {
        const qq = q[Object.keys(q)[0]];
        const { query, filter } = qq;
        return { query, filter: FilterStateFn.is(filter) ? filter : defaultFilter };
      }
    );

    QueriesWrapper.queries = declared.reduce((ac, q) => {
      const query = t.Str.is(q) ? q : t.Str.is(q[Object.keys(q)[0]]) ? q[Object.keys(q)[0]] : q[Object.keys(q)[0]].query;
      return assign(ac, {
        [query]: getFilter(q)
      });
    }, {});
    log(`${Component.name} cleaned up queries: %o`, QueriesWrapper.queries);

    return QueriesWrapper;
  };
}
