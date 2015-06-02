'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _fetchOptimizer = require('fetch-optimizer');

var App = (function () {
  function App() {
    _classCallCheck(this, App);

    this.emitter = new _eventemitter32['default']();
  }

  App.prototype.update = function update(f) {
    if (process.env.NODE_ENV !== 'production') {
      _tcomb2['default'].assert(_tcomb2['default'].Func.is(f), '' + this.constructor.name + '.update(f) expects a function');
    }
    this.emitter.emit('stateWillChange');
    f();
    this.emitter.emit('stateDidChange');
  };

  App.prototype.fetch = function fetch(routes, params, query) {
    var _this = this;

    // retrieve all queries
    var queries = routes.reduce(function (acc, route) {
      return route.handler.getQueries ? _tcomb2['default'].mixin(acc, route.handler.getQueries(_this, params, query)) : acc;
    }, {});

    // retrieve fetchers
    var fetchers = {};
    for (var prop in queries) {
      var q = queries[prop];
      if (q.fetch) {
        if (process.env.NODE_ENV !== 'production') {
          _tcomb2['default'].assert(!fetchers.hasOwnProperty(q.id), 'duplicated query id: ' + q.id);
        }
        fetchers[q.id] = q.fetch;
      }
    }

    // retrieve poset
    var poset = new _fetchOptimizer.Poset();
    for (var prop in queries) {
      var q = queries[prop];
      if (q.fetch) {
        poset.addNode(q.id);
        if (q.dependencies) {
          for (var i = 0, len = q.dependencies.length; i < len; i++) {
            if (process.env.NODE_ENV !== 'production') {
              _tcomb2['default'].assert(fetchers.hasOwnProperty(q.dependencies[i]), 'unknown query id: ' + q.dependencies[i]);
            }
            poset.addEdge(q.id, q.dependencies[i]);
          }
        }
      }
    }

    return (0, _fetchOptimizer.optimize)(poset, fetchers);
  };

  App.prototype.on = function on(event, listener) {
    var _this2 = this;

    this.emitter.on(event, listener);
    return function () {
      return _this2.emitter.off(event, listener);
    };
  };

  _createClass(App, null, [{
    key: 'AUTH_KEY',
    value: 'AUTH_KEY',
    enumerable: true
  }]);

  return App;
})();

exports['default'] = App;
module.exports = exports['default'];