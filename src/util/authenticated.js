import React from 'react';
import debug from 'debug';
import { listener } from 'web-framework';

const log = debug('util:@authenticated');

export default function authenticated(loginState?: string) {

  const login = loginState || 'Login';

  return function(Component) {

    @listener
    class AuthenticatedWrapper extends React.Component {

      static willTransitionTo(transition) {
        const app = transition.context;
        if (!app.isAuthenticated()) {
          log(`transition to \`%s\` aborted (user is not authenticated), redirecting to ${login}...`, transition.path);
          transition.redirect(login, {}, {
            nextPath: transition.path
          });
        }
      };

      checkAuthentication() {
        const app = this.props.app;
        if (!app.isAuthenticated()) {
          log(`user is not authenticated, redirecting to ${login}...`);
          this.props.router.transitionTo(login);
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

    return AuthenticatedWrapper;
  };

}
