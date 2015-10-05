import debug from 'debug';
import listener from '../decorators/listener';
import transitionTo from './transitionTo';

const log = debug('revenge:@anonymous');

export default function anonymous(Home = 'Home') {
  return function (Component) {

    listener(function () {
      if (this.props.app.isAuthenticated()) {
        const { nextPath = Home } = this.props.router.getCurrentQuery();
        log('listening... user is authenticated, redirecting to %s...', nextPath);
        transitionTo(this.props.router, nextPath);
      }
    })(Component);

    Component.willTransitionTo = function (transition) {
      const app = transition.context;
      if (app.isAuthenticated()) {
        log('transition to `%s` aborted (user is authenticated), redirecting to %s...', transition.path, Home);
        transition.redirect(Home);
      }
    };

  };
}
