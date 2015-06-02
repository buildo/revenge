import Cookies from 'cookies-js';
import App from './App';

export default {

  serialize(state) {
    Cookies.set(App.AUTH_KEY, JSON.stringify(state));
  },

  deserialize() {
    return JSON.parse(Cookies.get(App.AUTH_KEY) || 'null');
  }

};

