import t from 'tcomb';
import omit from 'lodash/omit';
import isReactComponent from '../isReactComponent';
import { shallowEqual } from './pure';

const defaultGetLocals = function(props) {
  return props;
};

export default function skinnable(template?: Function): Function {

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      const name = Component.name;
      t.assert(t.maybe(t.Func).is(template), `@skinnable decorator can only be configured with a function`);
      t.assert(isReactComponent(Component), `@skinnable decorator can only be applied to React.Component(s). Maybe did you type @skinnable instead of @skinnable()?`);
      t.assert(!t.Func.is(Component.prototype.render), `@skinnable decorator can only be applied to components not implementing the render() method. Please remove the render method of component ${name}`);
      t.assert(t.maybe(t.Func).is(Component.prototype.getLocals), `@skinnable decorator requires getLocals() to be a function, check the component ${name}`);
      if (template) {
        t.assert(!t.Func.is(Component.prototype.template), `@skinnable decorator can only be applied to components not implementing the template(locals) method. Please remove the template method of component ${name}`);
      }
      else {
        t.assert(t.Func.is(Component.prototype.template), `@skinnable decorator requires a template(locals) method, add it to component ${name}`);
      }
    }

    if (template) {
      Component.prototype.template = template;
    }

    if (!Component.prototype.getLocals) {
      Component.prototype.getLocals = defaultGetLocals;
    }

    const originalCWRP = Component.prototype.componentWillReceiveProps;

    Component.prototype.componentWillReceiveProps = function(nextProps, nextState) {
      this._refreshLocals = !shallowEqual(
        omit(nextProps, 'children'),
        omit(this.props, 'children')
      );
      originalCWRP && originalCWRP(nextProps, nextState);
    }

    Component.prototype.render = function () {
      if (this._refreshLocals || !this._locals) {
        this._locals = this.getLocals(this.props);
      }
      return this.template({ ...this._locals, children: this.props.children });
    };
  };
}
