'use strict';

exports.__esModule = true;
exports['default'] = anonymous;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _decoratorsListener = require('../decorators/listener');

var _decoratorsListener2 = _interopRequireDefault(_decoratorsListener);

var log = (0, _debug2['default'])('util:@anonymous');

function anonymous() {
  var Home = arguments[0] === undefined ? 'Home' : arguments[0];

  return function (Component) {

    (0, _decoratorsListener2['default'])(function () {
      if (this.props.app.isAuthenticated()) {
        var _props$router$getCurrentQuery = this.props.router.getCurrentQuery();

        var _props$router$getCurrentQuery$nextPath = _props$router$getCurrentQuery.nextPath;
        var nextPath = _props$router$getCurrentQuery$nextPath === undefined ? Home : _props$router$getCurrentQuery$nextPath;

        log('listening... user is authenticated, redirecting to %s...', nextPath);
        this.props.router.transitionTo(nextPath);
      }
    })(Component);

    Component.willTransitionTo = function (transition) {
      var app = transition.context;
      if (app.isAuthenticated()) {
        log('transition to `%s` aborted (user is authenticated), redirecting to %s...', transition.path, Home);
        transition.redirect(Home);
      }
    };
  };
}

module.exports = exports['default'];