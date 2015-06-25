import EventEmitter3 from 'eventemitter3';
import assign from 'lodash/object/assign';
import Avenger, { QuerySetInput } from 'avenger';

export default class App {

  constructor(queries = {}, cacheInitialState = {}) {
    this.emitter = new EventEmitter3();
    this.avenger = new Avenger(queries, cacheInitialState);
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

    this.qs = this.avenger.querySet({
      queries,
      state: {
        params, query
      }
    });

    this.qs.on('change', data => {
      this._get = data;
      this.emitter.emit('change');
    });

    return qs.run();
  }

  get() {
    return this._get || {};
  }

}
