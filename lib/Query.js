'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var Query = _tcomb2['default'].struct({
  id: _tcomb2['default'].Str,
  get: _tcomb2['default'].Func,
  fetch: _tcomb2['default'].maybe(_tcomb2['default'].Func),
  dependencies: _tcomb2['default'].maybe(_tcomb2['default'].list(_tcomb2['default'].Str))
}, 'Query');

exports['default'] = Query;
module.exports = exports['default'];