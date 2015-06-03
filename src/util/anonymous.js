import React from 'react';
import debug from 'debug';
import { listener } from 'web-framework';

const log = debug('util:@anonymous');

export default function anonymous(homeState?: string) {

  const home = homeState || 'Home';

  return function(Component) {

    @listener
    class AnonymousWrapper extends React.Component {

      static willTransitionTo(transition) {
        const app = transition.context;
        if (app.isAuthenticated()) {
          log(`user is authenticated, redirecting to ${home}...`);
          transition.redirect(home);
        }
      };

      checkAuthentication() {
        if (this.props.app.isAuthenticated()) {
          const { nextPath = home } = this.props.router.getCurrentQuery();
          log('user is authenticated, redirecting to %s...', nextPath);
          this.props.router.transitionTo(nextPath);
        }
      }

      componentWillReceiveProps() {
        this.checkAuthentication();
      }

      componentWillMount() {
        this.checkAuthentication();
      }

      render() {
        return <Component {...this.props} />;
      }

    }

    return AnonymousWrapper;
  };

}
