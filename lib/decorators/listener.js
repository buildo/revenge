'use strict';

exports.__esModule = true;
exports['default'] = listener;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function listener(callback) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert(_tcomb2['default'].Func.is(callback), '@listener decorator can only be configured with a function');
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@listener decorator can only be applied to React.Component(s)');
    }

    var _Component$prototype = Component.prototype;
    var componentWillMount = _Component$prototype.componentWillMount;
    var componentWillUnmount = _Component$prototype.componentWillUnmount;

    Component.prototype.componentWillMount = function () {
      if (process.env.NODE_ENV !== 'production') {
        _tcomb2['default'].assert(_tcomb2['default'].Obj.is(this.props.app), '@listener decorator: missing app prop in component ' + Component.name);
      }
      this.unobserve = this.props.app.on('stateDidChange', callback.bind(this));
      if (componentWillMount) {
        componentWillMount.call(this);
      }
    };

    Component.prototype.componentWillUnmount = function () {
      if (componentWillUnmount) {
        componentWillUnmount.call(this);
      }
      this.unobserve();
    };
  };
}

module.exports = exports['default'];