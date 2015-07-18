import Cookies from 'cookies-js';
import App from './App';

export default {

  serialize(state, cookieSetter = null) {
    (cookieSetter || Cookies.set)(App.AUTH_KEY, JSON.stringify(state));
  },

  deserialize(cookieGetter = null) {
    return JSON.parse((cookieGetter || Cookies.get)(App.AUTH_KEY) || 'null');
  }

};

