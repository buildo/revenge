'use strict';

exports.__esModule = true;
exports['default'] = skinnable;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function skinnable(template) {

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      var _name = Component.name;
      _tcomb2['default'].assert(_tcomb2['default'].maybe(_tcomb2['default'].Func).is(template), '@skinnable decorator can only be configured with a function');
      _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@skinnable decorator can only be applied to React.Component(s). Maybe did you type @skinnable instead of @skinnable()?');
      _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.prototype.render), '@skinnable decorator can only be applied to components not implementing the render() method. Please remove the render method of component ' + _name);
      _tcomb2['default'].assert(_tcomb2['default'].Func.is(Component.prototype.getLocals), '@skinnable decorator requires a getLocals() method, add it to component ' + _name);
      if (template) {
        _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.prototype.template), '@skinnable decorator can only be applied to components not implementing the template(locals) method. Please remove the template method of component ' + _name);
      } else {
        _tcomb2['default'].assert(_tcomb2['default'].Func.is(Component.prototype.template), '@skinnable decorator requires a template(locals) method, add it to component ' + _name);
      }
    }

    if (template) {
      Component.prototype.template = template;
    }

    Component.prototype.render = function () {
      return this.template(this.getLocals());
    };
  };
}

module.exports = exports['default'];