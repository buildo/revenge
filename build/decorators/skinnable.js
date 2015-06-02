'use strict';

exports.__esModule = true;
exports['default'] = skinnable;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function skinnable(template) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert(_tcomb2['default'].maybe(_tcomb2['default'].Func).is(template), '@skinnable decorator can only be configured with a function');
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@skinnable decorator can only be applied to React.Component(s). Maybe did you type @skinnable instead of @skinnable()?');
    }

    if (template) {
      Component.prototype.template = template;
    }

    if (process.env.NODE_ENV !== 'production') {
      var example = '\n\nExample:\n\n@skinnable()\nexport default class MyClass extends React.Component {\n\n  getLocals() {\n    return {\n      title: \'My title\'\n    };\n  }\n\n  template(locals) {\n    return (\n      <DocumentTitle title={locals.title}>\n        ...\n      </DocumentTitle>\n    );\n  }\n\n}\n      ';

      _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.prototype.render), '@skinnable decorator can only be applied to components not implementing the render() method. Remove the render() method of component ' + Component.name + '. ' + example);
      _tcomb2['default'].assert(_tcomb2['default'].Func.is(Component.prototype.getLocals), '@skinnable decorator requires a getLocals() method, add it to component ' + Component.name + '. ' + example);
      _tcomb2['default'].assert(_tcomb2['default'].Func.is(Component.prototype.template), '@skinnable decorator requires a template(locals) method, add it to component ' + Component.name + '. ' + example);
    }

    Component.prototype.render = function () {
      return this.template(this.getLocals());
    };
  };
}

module.exports = exports['default'];