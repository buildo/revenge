import EventEmitter3 from 'eventemitter3';
import assign from 'lodash/object/assign';
import t from 'tcomb';
import Avenger from 'avenger';

export default class App {

  constructor(queries = {}, cacheInitialState = {}) {
    // TODO(gio): app itself is an emitter.. not needed
    // except for manual updates in db using update()
    this.emitter = new EventEmitter3();
    this.avenger = new Avenger(queries, cacheInitialState);
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
      return route.handler.queries ?
        assign(acc, route.handler.queries) :
        acc;
    }, {});

    if (this.qs) {
      this.qs.off('change');
    }

    // TODO(gio): assuming an unique query set per
    // per instance simultaneously
    this.qs = this.avenger.querySet({
      queries,
      state: {
        params, query
      }
    });

    this.qs.on('change', data => {
      this._get = data;
      this.update(() => {});
    });

    return this.qs.run();
  }

  get() {
    // hack: work around the fact that
    // @listener and @queries are two distinct entities
    // listener update event handler already has access to this data
    return this._get || {};
  }

}
