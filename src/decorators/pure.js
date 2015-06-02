import t from 'tcomb';
import shallowEqual from '../shallowEqual';
import isReactComponent from '../isReactComponent';

export default function pure(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@pure decorator can only be applied to React.Component(s)`);
    t.assert(!(t.Func.is(Component.prototype.shouldComponentUpdate)), `cannot apply @pure decorator to component ${Component.name}: a shouldComponentUpdate method is already defined`);
  }

  Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return !shallowEqual(this.props, nextProps, 'props', this.constructor.name) ||
           !shallowEqual(this.state, nextState, 'state', this.constructor.name);
  };
}
