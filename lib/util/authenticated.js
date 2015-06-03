'use strict';

exports.__esModule = true;
exports['default'] = authenticated;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _webFramework = require('web-framework');

var log = (0, _debug2['default'])('util:@authenticated');

function authenticated(loginState) {

  var login = loginState || 'Login';

  return function (Component) {
    var AuthenticatedWrapper = (function (_React$Component) {
      function AuthenticatedWrapper() {
        _classCallCheck(this, _AuthenticatedWrapper);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(AuthenticatedWrapper, _React$Component);

      var _AuthenticatedWrapper = AuthenticatedWrapper;

      _AuthenticatedWrapper.willTransitionTo = function willTransitionTo(transition) {
        var app = transition.context;
        if (!app.isAuthenticated()) {
          log('transition to `%s` aborted (user is not authenticated), redirecting to ' + login + '...', transition.path);
          transition.redirect(login, {}, {
            nextPath: transition.path
          });
        }
      };

      _AuthenticatedWrapper.prototype.checkAuthentication = function checkAuthentication() {
        var app = this.props.app;
        if (!app.isAuthenticated()) {
          log('user is not authenticated, redirecting to ' + login + '...');
          this.props.router.transitionTo(login);
        }
      };

      _AuthenticatedWrapper.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
        this.checkAuthentication();
      };

      _AuthenticatedWrapper.prototype.componentWillMount = function componentWillMount() {
        this.checkAuthentication();
      };

      _AuthenticatedWrapper.prototype.render = function render() {
        return _react2['default'].createElement(Component, this.props);
      };

      AuthenticatedWrapper = (0, _webFramework.listener)(AuthenticatedWrapper) || AuthenticatedWrapper;
      return AuthenticatedWrapper;
    })(_react2['default'].Component);

    return AuthenticatedWrapper;
  };
}

module.exports = exports['default'];