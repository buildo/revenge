'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = queries;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _listener = require('./listener');

var _listener2 = _interopRequireDefault(_listener);

var _isReactComponent = require('../isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

function queries(getQueries) {

  if (process.env.NODE_ENV !== 'production') {
    _tcomb2['default'].assert(_tcomb2['default'].Func.is(getQueries), '@queries decorator can only be configured with a function.');
  }

  return function (Component) {

    if (process.env.NODE_ENV !== 'production') {
      var _name = Component.name;
      _tcomb2['default'].assert((0, _isReactComponent2['default'])(Component), '@queries decorator can only be applied to React.Component(s)');
      _tcomb2['default'].assert(!_tcomb2['default'].Func.is(Component.getQueries), '@queries decorator can only be applied to component ' + _name + ', queries are already defined');
    }

    var QueriesWrapper = (function (_React$Component) {
      function QueriesWrapper() {
        _classCallCheck(this, _QueriesWrapper);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(QueriesWrapper, _React$Component);

      var _QueriesWrapper = QueriesWrapper;

      _QueriesWrapper.prototype.get = function get() {
        if (process.env.NODE_ENV !== 'production') {
          _tcomb2['default'].assert(_tcomb2['default'].Obj.is(this.props.app), '@queries decorator: missing app prop in component ' + Component.name);
          _tcomb2['default'].assert(_tcomb2['default'].Func.is(this.props.router), '@queries decorator: missing router prop in component ' + Component.name);
        }
        var app = this.props.app;
        var params = this.props.router.getCurrentParams();
        var query = this.props.router.getCurrentQuery();
        var queries = getQueries(app, params, query);
        var data = {};
        for (var k in queries) {
          if (queries[k].get) {
            data[k] = queries[k].get();
          }
        }
        return data;
      };

      _QueriesWrapper.prototype.render = function render() {
        return _react2['default'].createElement(Component, _extends({}, this.props, this.get()));
      };

      QueriesWrapper = (0, _listener2['default'])(QueriesWrapper.prototype.forceUpdate)(QueriesWrapper) || QueriesWrapper;
      return QueriesWrapper;
    })(_react2['default'].Component);

    QueriesWrapper.getQueries = getQueries;

    return QueriesWrapper;
  };
}

module.exports = exports['default'];