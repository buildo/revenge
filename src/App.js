import t from 'tcomb';
import EventEmitter3 from 'eventemitter3';
import { Poset, optimize } from 'fetch-optimizer';

export default class App {

  static AUTH_KEY = 'AUTH_KEY';

  constructor() {
    this.emitter = new EventEmitter3();
  }

  update(f) {
    if (process.env.NODE_ENV !== 'production') {
      t.assert(t.Func.is(f), `${this.constructor.name}.update(f) expects a function`);
    }
    this.emitter.emit('stateWillChange');
    f();
    this.emitter.emit('stateDidChange');
  }

  fetch(routes, params, query): Promise {

    // retrieve all queries
    const queries = routes.reduce((acc, route) => {
      return route.handler.getQueries ?
        t.mixin(acc, route.handler.getQueries(this, params, query), true) :
        acc;
    }, {});

    // retrieve fetchers
    const fetchers = {};
    for (let prop in queries) {
      let q = queries[prop];
      if (q.fetch) {
        if (process.env.NODE_ENV !== 'production') {
          t.assert(!fetchers.hasOwnProperty(q.id), `duplicated query id: ${q.id}`);
        }
        fetchers[q.id] = q.fetch;
      }
    }

    // retrieve poset
    const poset = new Poset();
    for (let prop in queries) {
      let q = queries[prop];
      if (q.fetch) {
        poset.addNode(q.id);
        if (q.dependencies) {
          for (let i = 0, len = q.dependencies.length; i < len; i++ ) {
            if (process.env.NODE_ENV !== 'production') {
              t.assert(fetchers.hasOwnProperty(q.dependencies[i]), `unknown query id: ${q.dependencies[i]}`);
            }
            poset.addEdge(q.id, q.dependencies[i]);
          }
        }
      }
    }

    this.emitter.emit('fetchStart');
    return optimize(poset, fetchers).then(() => {
      this.emitter.emit('fetchEnd');
    });
  }

  on(event, listener) {
    this.emitter.on(event, listener);
    return () => this.emitter.off(event, listener);
  }

}
