import debug from 'debug';
import listener from '../decorators/listener';
import transitionTo from './transitionTo';

const log = debug('revenge:@authenticated');

export default function authenticated(Login = 'Login') {
  return function (Component) {

    listener(function () {
      const app = this.props.app;
      if (!app.isAuthenticated()) {
        log('listening... user is not authenticated, redirecting to %s...', Login);
        transitionTo(this.props.router, Login);
      }
    })(Component);

    Component.willTransitionTo = function (transition) {
      const app = transition.context;
      if (!app.isAuthenticated()) {
        log('transition to `%s` aborted (user is not authenticated), redirecting to %s...', transition.path, Login);
        transition.redirect(Login, {}, {
          nextPath: transition.path
        });
      }
    };

  };
}
