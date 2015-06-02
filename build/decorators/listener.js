'use strict';

exports.__esModule = true;
exports['default'] = listener;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function listener(Component) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@listener decorator can only be applied to React.Component(s)');
  }

  var ListenerWrapper = (function (_React$Component) {
    function ListenerWrapper() {
      _classCallCheck(this, ListenerWrapper);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(ListenerWrapper, _React$Component);

    ListenerWrapper.prototype.componentWillMount = function componentWillMount() {
      if (process.env.NODE_ENV !== 'production') {
        _tcomb2['default'].assert(_tcomb2['default'].Obj.is(this.props.app), '@listener decorator: missing app prop in component ' + Component.name);
      }
      this.unlistenStateDidChange = this.props.app.on('stateDidChange', this.forceUpdate.bind(this));
    };

    ListenerWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unlistenStateDidChange();
    };

    ListenerWrapper.prototype.render = function render() {
      return _react2['default'].createElement(Component, this.props);
    };

    return ListenerWrapper;
  })(_react2['default'].Component);

  return ListenerWrapper;
}

module.exports = exports['default'];