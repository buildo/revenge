import t from 'tcomb';
import isReactComponent from '../isReactComponent';
import stringify from '../stringify';
import debug from 'debug';

const log = debug('revenge:@pure');

function shallowEqual(objA, objB, section, component) {
  if (objA === objB) {
    return true;
  }
  const displayName = component.constructor.name;
  const rootNodeID = component._reactInternalInstance._rootNodeID;
  let key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} with rootNodeID ${rootNodeID} will re-render since ${section} key ${key} is changed from ${stringify(objA[key])} to ${stringify(objB[key])}`);
      }
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} with rootNodeID ${rootNodeID} will re-render since ${section} key ${key} with value ${stringify(objB[key])} is new`);
      }
      return false;
    }
  }
  return true;
}

export default function pure(Component) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(isReactComponent(Component), `@pure decorator can only be applied to React.Component(s)`);
    t.assert(!(t.Func.is(Component.prototype.shouldComponentUpdate)), `cannot apply @pure decorator to component ${Component.name}: a shouldComponentUpdate method is already defined`);
  }

  Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return !shallowEqual(this.props, nextProps, 'props', this) ||
           !shallowEqual(this.state, nextState, 'state', this);
  };
}
