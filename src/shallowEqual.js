import debug from 'debug';

const log = debug('framework:shallowEqual');

export default function shallowEqual(objA, objB, section, displayName) {
  if (objA === objB) {
    return true;
  }
  let key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} will update since ${section} key ${key} is changed`);
      }
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`component ${displayName} will update since ${section} key ${key} is new`);
      }
      return false;
    }
  }
  return true;
}

