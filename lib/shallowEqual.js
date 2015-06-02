'use strict';

exports.__esModule = true;
exports['default'] = shallowEqual;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var log = (0, _debug2['default'])('framework:shallowEqual');

function shallowEqual(objA, objB, section, displayName) {
  if (objA === objB) {
    return true;
  }
  var key = undefined;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      if (process.env.NODE_ENV !== 'production') {
        log('component ' + displayName + ' will update since ' + section + ' key ' + key + ' is changed');
      }
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      if (process.env.NODE_ENV !== 'production') {
        log('component ' + displayName + ' will update since ' + section + ' key ' + key + ' is new');
      }
      return false;
    }
  }
  return true;
}

module.exports = exports['default'];