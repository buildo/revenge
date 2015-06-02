'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cookiesJs = require('cookies-js');

var _cookiesJs2 = _interopRequireDefault(_cookiesJs);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

exports['default'] = {

  serialize: function serialize(state) {
    _cookiesJs2['default'].set(_App2['default'].AUTH_KEY, JSON.stringify(state));
  },

  deserialize: function deserialize() {
    return JSON.parse(_cookiesJs2['default'].get(_App2['default'].AUTH_KEY) || 'null');
  }

};
module.exports = exports['default'];