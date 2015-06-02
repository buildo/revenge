import t from 'tcomb';
import isReactComponent from '../isReactComponent';

export default function skinnable(template?: Function): Function {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.maybe(t.Func).is(template), `@skinnable decorator can only be configured with a function`);
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      t.assert(isReactComponent(Component), `@skinnable decorator can only be applied to React.Component(s). Maybe did you type @skinnable instead of @skinnable()?`);
    }

    if (template) {
      Component.prototype.template = template;
    }

    if (process.env.NODE_ENV !== 'production') {
  const example = `

Example:

@skinnable()
export default class MyClass extends React.Component {

  getLocals() {
    return {
      title: 'My title'
    };
  }

  template(locals) {
    return (
      <DocumentTitle title={locals.title}>
        ...
      </DocumentTitle>
    );
  }

}
      `;

      t.assert(!t.Func.is(Component.prototype.render), `@skinnable decorator can only be applied to components not implementing the render() method. Remove the render() method of component ${Component.name}. ${example}`);
      t.assert(t.Func.is(Component.prototype.getLocals), `@skinnable decorator requires a getLocals() method, add it to component ${Component.name}. ${example}`);
      t.assert(t.Func.is(Component.prototype.template), `@skinnable decorator requires a template(locals) method, add it to component ${Component.name}. ${example}`);
    }

    Component.prototype.render = function () {
      return this.template(this.getLocals());
    };
  };
}
