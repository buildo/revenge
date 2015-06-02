'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _decoratorsPure = require('./decorators/pure');

var _decoratorsPure2 = _interopRequireDefault(_decoratorsPure);

var PureComponent = (function (_React$Component) {
  function PureComponent() {
    _classCallCheck(this, _PureComponent);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(PureComponent, _React$Component);

  var _PureComponent = PureComponent;
  PureComponent = (0, _decoratorsPure2['default'])(PureComponent) || PureComponent;
  return PureComponent;
})(_react2['default'].Component);

exports['default'] = PureComponent;
module.exports = exports['default'];