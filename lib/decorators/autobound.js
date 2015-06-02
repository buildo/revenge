'use strict';

exports.__esModule = true;
exports['default'] = autobound;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

function autobound(target, key, descriptor) {
  var value = descriptor.value;

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert(_tcomb2['default'].Func.is(value), '@autobound decorator can only be applied to methods');
  }

  return {
    configurable: true,
    get: function get() {
      var boundValue = value.bind(this);
      Object.defineProperty(this, key, {
        value: boundValue,
        configurable: true,
        writable: true
      });
      return boundValue;
    }
  };
}

module.exports = exports['default'];