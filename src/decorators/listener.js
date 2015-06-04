import t from 'tcomb';
import isReactComponent from '../isReactComponent';

export default function listener(callback) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.Func.is(callback), `@listener decorator can only be configured with a function`);
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      t.assert(isReactComponent(Component), `@listener decorator can only be applied to React.Component(s)`);
    }

    const { componentWillMount, componentWillUnmount } = Component.prototype;

    Component.prototype.componentWillMount = function () {
      if (process.env.NODE_ENV !== 'production') {
        t.assert(t.Obj.is(this.props.app), `@listener decorator: missing app prop in component ${Component.name}`);
      }
      this.unobserve = this.props.app.on('stateDidChange', callback.bind(this));
      if (componentWillMount) {
        componentWillMount.call(this);
      }
    };

    Component.prototype.componentWillUnmount = function () {
      if (componentWillUnmount) {
        componentWillUnmount.call(this);
      }
      this.unobserve();
    };

  };
}
