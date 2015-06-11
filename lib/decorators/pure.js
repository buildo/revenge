'use strict';

exports.__esModule = true;
exports['default'] = pure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var log = (0, _debug2['default'])('spyro:@pure');

function stringify(x) {
  try {
    // handle "Converting circular structure to JSON" error
    return JSON.stringify(x);
  } catch (e) {
    return String(x);
  }
}

function shallowEqual(objA, objB, section, component) {
  if (objA === objB) {
    return true;
  }
  var displayName = component.constructor.name;
  var rootNodeID = component._reactInternalInstance._rootNodeID;
  var key = undefined;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      if (process.env.NODE_ENV !== 'production') {
        log('component ' + displayName + ' with rootNodeID ' + rootNodeID + ' will re-render since ' + section + ' key ' + key + ' is changed from ' + stringify(objA[key]) + ' to ' + stringify(objB[key]));
      }
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      if (process.env.NODE_ENV !== 'production') {
        log('component ' + displayName + ' with rootNodeID ' + rootNodeID + ' will re-render since ' + section + ' key ' + key + ' with value ' + stringify(objB[key]) + ' is new');
      }
      return false;
    }
  }
  return true;
}

function pure(Component) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@pure decorator can only be applied to React.Component(s)');
    _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.prototype.shouldComponentUpdate), 'cannot apply @pure decorator to component ' + Component.name + ': a shouldComponentUpdate method is already defined');
  }

  Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return !shallowEqual(this.props, nextProps, 'props', this) || !shallowEqual(this.state, nextState, 'state', this);
  };
}

module.exports = exports['default'];