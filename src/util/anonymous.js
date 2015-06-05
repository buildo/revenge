import debug from 'debug';
import { listener } from '../decorator/listener';

const log = debug('util:@anonymous');

export default function anonymous(Home = 'Home') {
  return function (Component) {

    listener(function () {
      if (this.props.app.isAuthenticated()) {
        const { nextPath = Home } = this.props.router.getCurrentQuery();
        log('listening... user is authenticated, redirecting to %s...', nextPath);
        this.props.router.transitionTo(nextPath);
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
