import t from 'tcomb';
import isReactComponent from '../isReactComponent';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

const testLogsMap = {};
const log = (rootNodeID, displayName, key) => {
  const component = `${displayName}-${rootNodeID}-${key}`;
  if (!testLogsMap[component]) {
    testLogsMap[component] = true;
    console.warn(`Update avoidable! (component: ${displayName}, key: ${key}, rootNodeID: ${rootNodeID})`);
  }
};

function _logAvoidableReRenders(objA, objB, section, component) {
  if (objA === objB) {
    return false;
  }

  const displayName = component.constructor.name;
  const rootNodeID = (component._reactInternalInstance || {})._rootNodeID;

  if (!objA || typeof objA !== 'object') {
    // the opposite should never happen here, since we are using this as
    // `shallowEqual(prevProps, nextProps)` or `shallowEqual(prevState, nextState)`
    return false;
  }

  const deepEqual = isEqual(objA, objB);

  let key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      log(rootNodeID, displayName, key);
      return true;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      log(rootNodeID, displayName, key);
      return true;
    }
  }
  return false;
}

export function logAvoidableReRenders(nextProps, nextState, _this) {
  _logAvoidableReRenders(_this.props, nextProps, 'props', _this) ||
  _logAvoidableReRenders(_this.state, nextState, 'state', _this);
}

export default function pureLog(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@pureLog decorator can only be applied to React.Component(s)`);

    const originalScu = Component.prototype.shouldComponentUpdate;

    Component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
      const _scu = () => {
        logAvoidableReRenders(nextProps, nextState, this);
        return true;
      };
      return originalScu ? originalScu(nextProps, nextState, _scu) : _scu();
    };
  }
}
