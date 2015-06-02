'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var Query = function Query(id, get, fetch, dependencies) {
  _classCallCheck(this, Query);

  if (process.env.NODE_ENV !== 'production') {
    var example = '\n\nExample:\n\nnew Query(\n  \'querySomething\',\n  () => this.db.getSomething(),\n  () => { // optional\n    return this.API.fetchSomething().then(\n      something => this.update(db => db.setSomething(new Something(something)))\n    );\n  },\n  [\'dependency1\', \'dependency2\'] // optional\n);\n      ';
    _tcomb2['default'].assert(_tcomb2['default'].Str.is(id), 'a Query must have a id: t.Str field. ' + example);
    _tcomb2['default'].assert(_tcomb2['default'].Func.is(get), 'a Query must have a get: t.Func field. ' + example);
    _tcomb2['default'].assert(_tcomb2['default'].maybe(_tcomb2['default'].Func).is(fetch), 'a Query may have a fetch: t.maybe(t.Func) field. ' + example);
    _tcomb2['default'].assert(_tcomb2['default'].maybe(_tcomb2['default'].list(_tcomb2['default'].Str)).is(dependencies), 'a Query may have a dependencies: t.maybe(t.list(t.Str)) field. ' + example);
  }
  this.id = id;
  this.get = get;
  this.fetch = fetch;
  this.dependencies = dependencies;
};

exports['default'] = Query;
module.exports = exports['default'];