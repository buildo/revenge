import t from 'tcomb';
import isReactComponent from '../isReactComponent';
import debug from 'debug';

const log = debug('revenge:@pure');

function shallowEqual(objA, objB, section, component) {
  if (objA === objB) {
    return true;
  }

  const displayName = component.constructor.name;
  const rootNodeID = component._reactInternalInstance._rootNodeID;

  if (!objA || typeof objA !== 'object') {
    // the opposite should never happen here, since we are using this as
    // `shallowEqual(prevProps, nextProps)` or `shallowEqual(prevState, nextState)`
    if (process.env.NODE_ENV !== 'production') {
      log(`component ${displayName} with rootNodeID ${rootNodeID} will re-render since object has no previous value`);
    }
    return false;
  }

  let key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} with rootNodeID ${rootNodeID} will re-render since ${section} key ${key} is changed from `, objA[key], ' to ', objB[key]);
      }
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} with rootNodeID ${rootNodeID} will re-render since ${section} key ${key} with value `, objB[key], 'is new');
      }
      return false;
    }
  }
  return true;
}

export default function pure(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@pure decorator can only be applied to React.Component(s)`);
  }

  const originalScu = Component.prototype.shouldComponentUpdate;

  Component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    const _scu = () => {
      return !shallowEqual(this.props, nextProps, 'props', this) ||
             !shallowEqual(this.state, nextState, 'state', this);
    };
    return originalScu ? originalScu(nextProps, nextState, _scu) : _scu();
  };
}
