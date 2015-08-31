import EventEmitter3 from 'eventemitter3';
import assign from 'lodash/object/assign';
import t from 'tcomb';
import Avenger from 'avenger';
import debug from 'debug';
import axios from 'axios';

const log = debug('revenge:App');

export default class App {

  static AUTH_KEY = 'AUTH_KEY';

  constructor({ queries = {}, data = {}, state = {}, remote }) {
    // TODO(gio): app itself is an emitter.. not needed
    // except for manual updates in db using update()
    this.emitter = new EventEmitter3();

    this.remote = remote;
    this.avenger = new Avenger(queries, data, {
      queries,
      state
    });

    this.updateWithData(this.avenger.queries)(data);
  }

  on(event, listener) {
    this.emitter.on(event, listener);
    return () => this.emitter.off(event, listener);
  }

  update(f) {
    if (process.env.NODE_ENV !== 'production') {
      t.assert(t.Func.is(f), `${this.constructor.name}.update(f) expects a function`);
    }
    this.emitter.emit('stateWillChange');
    f();
    this.emitter.emit('stateDidChange');
  }

  getState() {
    throw new Error(`App must implement 'getState()'`);
  }

  getCache() {
    return this.avenger.cache.state;
  }

  fetch(routes, params, query): Promise {

    // retrieve all queries
    const queries = routes.reduce((acc, route) => {
      log(`${route.handler.name}: %o %o %o %o`, route, route.handler, route.handler.prototype, route.handler.queries ? route.handler.queries : 'no qs');
      return route.handler.queries ?
        assign(acc, route.handler.queries) :
        acc;
    }, {});

    // FIXME(gio): this is totally not safe
    const state = {
      ...params,
      ...query,
      ...this.getState()
    };
    log(`fetching queries: %o, state: %o`, queries, state);

    if (Object.keys(queries).length === 0) {
      // TODO(gio): hack, empty query set case
      this.updateWithData({})({});
      return Promise.resolve({});
    } else {
      return this.runOrRemote(state, queries);
    }
  }

  updateWithData(queries) {
    return data => {
      this._get = Object.keys(queries).reduce((ac, qId) => assign(ac, {
        // TODO(gio): breaks return null in lol
        [qId]: data[qId] && Object.keys(data[qId]).length === 1 && data[qId][qId] ? data[qId][qId] : data[qId] || null
      }), {});
      this._get._meta = data._meta;
      setTimeout(this.update.bind(this, () => {}));
    };
  }

  runOrRemote(state, queries) {
    if (this.qs) {
      this.qs.off('change');
    }

    // TODO(gio): assuming an unique query set per
    // per instance simultaneously
    this.qs = this.avenger.querySet({
      queries,
      state
    });

    const updateWithData = this.updateWithData(queries);
    this.qs.on('change', updateWithData);

    if (!this.remote) {
      // execute locally
      return this.qs.run();
    } else {
      // emit changes for cached values
      this.qs.cached();

      // execute on remote
      const recipe = this.qs.toRecipe();

      log(`executing recipe on remote ${this.remote}`, recipe);

      return axios.post(this.remote, recipe).then(({ data }) => {
        this.avenger.patchCache({
          queries,
          state
        }, data);
        log('data from remote', data);
        return data;
      }).then(updateWithData);
    }
  }

  get() {
    // hack: work around the fact that
    // @listener and @queries are two distinct entities
    // listener update event handler already has access to this data
    return this._get || {};
  }

}
