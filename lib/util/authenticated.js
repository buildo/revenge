'use strict';

exports.__esModule = true;
exports['default'] = authenticated;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _decoratorsListener = require('../decorators/listener');

var _decoratorsListener2 = _interopRequireDefault(_decoratorsListener);

var log = (0, _debug2['default'])('util:@authenticated');

function authenticated() {
  var Login = arguments[0] === undefined ? 'Login' : arguments[0];

  return function (Component) {

    (0, _decoratorsListener2['default'])(function () {
      var app = this.props.app;
      if (!app.isAuthenticated()) {
        log('listening... user is not authenticated, redirecting to %s...', Login);
        this.props.router.transitionTo(Login);
      }
    })(Component);

    Component.willTransitionTo = function (transition) {
      var app = transition.context;
      if (!app.isAuthenticated()) {
        log('transition to `%s` aborted (user is not authenticated), redirecting to %s...', transition.path, Login);
        transition.redirect(Login, {}, {
          nextPath: transition.path
        });
      }
    };
  };
}

module.exports = exports['default'];