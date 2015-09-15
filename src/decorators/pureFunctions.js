import React from 'react';
import t from 'tcomb';
import isReactComponent from '../isReactComponent';
import pure from './pure';
import debug from 'debug';
import partial from 'lodash/function/partial';
import find from 'lodash/collection/find';

const log = debug('revenge:@pureFunctions');

// a list in the form `[t.Func \[, ...t.Any\]]`
const PureFunction = t.subtype(t.list(t.Any), ([fn]) => t.Func.is(fn), 'PureFunction');

// TODO(gio): consider specifying and typing `pfProps`
// export default function pureFunctions(/* pfProps */) {
  // return function pureFunctionsInner(Component) {
export default function pureFunctionsInner(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@pureFunctions decorator can only be applied to React.Component(s)`);
  }

  @pure
  class PureFunctionsWrapper extends React.Component {

    fromCacheOrAdd = (fn, ...args) => {
      // pf cache is per component instance
      if (!this._pureFunctionsCache) {
        // TODO(gio):
        // should be something smarter than an array,
        // at least when dealing with primitive arguments..
        this._pureFunctionsCache = [];
      }

      const found = find(this._pureFunctionsCache, ({ name: fname, args: fargs, fn: ffn }) => {
          // same fn :
        return (fn === ffn
          // or same name or .toString() :
          || (fn.name && fname === fn.name) || fname === fn.toString())
          // and same args length :
          && args.length === fargs.length
          // and same args values :
          && args.filter((a, i) => a === fargs[i]).length === args.length;
      });

      if (found) {
        // return old, bound ref
        log(`reusing fn ref for Function ${found.fn} in ${Component.name}`);
        return found.bound;
      }

      // add new bound ref to cache
      this._pureFunctionsCache.push({
        bound: partial(fn, ...args),
        args,
        fn,
        name: fn.name || fn.toString()
      });

      // return freshly bound ref
      return this._pureFunctionsCache[this._pureFunctionsCache.length - 1].bound;
    }

    getProps() {
      const allKeys = Object.keys(this.props);
      const pfKeys = allKeys.filter(k => PureFunction.is(this.props[k]));
      const otherKeys = allKeys.filter(k => !PureFunction.is(this.props[k]));
      return {
        ...otherKeys.reduce((ac, k) => ({
          ...ac, [k]: this.props[k]
        }), {}),
        ... pfKeys.reduce((ac, k) => ({
          ...ac, [k]: this.fromCacheOrAdd(...this.props[k])
        }), {})
      };
    }

    render() {
      return <Component {...this.getProps()} />;
    }

  }

  return PureFunctionsWrapper;
}
  // };
// }
