'use strict';

exports.__esModule = true;
exports['default'] = anonymous;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _webFramework = require('web-framework');

var log = (0, _debug2['default'])('util:@anonymous');

function anonymous(homeState) {

  var home = homeState || 'Home';

  return function (Component) {
    var AnonymousWrapper = (function (_React$Component) {
      function AnonymousWrapper() {
        _classCallCheck(this, _AnonymousWrapper);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(AnonymousWrapper, _React$Component);

      var _AnonymousWrapper = AnonymousWrapper;

      _AnonymousWrapper.willTransitionTo = function willTransitionTo(transition) {
        var app = transition.context;
        if (app.isAuthenticated()) {
          log('user is authenticated, redirecting to ' + home + '...');
          transition.redirect(home);
        }
      };

      _AnonymousWrapper.prototype.checkAuthentication = function checkAuthentication() {
        if (this.props.app.isAuthenticated()) {
          var _props$router$getCurrentQuery = this.props.router.getCurrentQuery();

          var _props$router$getCurrentQuery$nextPath = _props$router$getCurrentQuery.nextPath;
          var nextPath = _props$router$getCurrentQuery$nextPath === undefined ? home : _props$router$getCurrentQuery$nextPath;

          log('user is authenticated, redirecting to %s...', nextPath);
          this.props.router.transitionTo(nextPath);
        }
      };

      _AnonymousWrapper.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
        this.checkAuthentication();
      };

      _AnonymousWrapper.prototype.componentWillMount = function componentWillMount() {
        this.checkAuthentication();
      };

      _AnonymousWrapper.prototype.render = function render() {
        return _react2['default'].createElement(Component, this.props);
      };

      AnonymousWrapper = (0, _webFramework.listener)(AnonymousWrapper) || AnonymousWrapper;
      return AnonymousWrapper;
    })(_react2['default'].Component);

    return AnonymousWrapper;
  };
}

module.exports = exports['default'];