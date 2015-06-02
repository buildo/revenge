'use strict';

exports.__esModule = true;
exports['default'] = pure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _shallowEqual = require('../shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function pure(Component) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@pure decorator can only be applied to React.Component(s)');
    _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.prototype.shouldComponentUpdate), 'cannot apply @pure decorator to component ' + Component.name + ': a shouldComponentUpdate method is already defined');
  }

  Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return !(0, _shallowEqual2['default'])(this.props, nextProps, 'props', this.constructor.name) || !(0, _shallowEqual2['default'])(this.state, nextState, 'state', this.constructor.name);
  };
}

module.exports = exports['default'];