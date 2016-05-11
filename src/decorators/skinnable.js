import t from 'tcomb';
import isReactComponent from '../isReactComponent';

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

    Component.prototype.render = function () {
      return this.template(this.getLocals(this.props));
    };
  };
}
