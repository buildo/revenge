import debug from 'debug';
import stringify from '../stringify';

export default function log(namespace) {

  if (process.env.NODE_ENV === 'production') {
    return function (target, name, descriptor) {
      return target[name] = f;
    };
  }

  const logger = debug(namespace || 'revenge:@log');
  return function (target, name, descriptor) {
    const f = descriptor.value;
    return target[name] = function (...args) {
      const ret = f.apply(this, args);
      const message = `${name}(${args.map(stringify).join(', ')}) => ${stringify(ret)}`;
      logger(message);
      return ret;
    };
  };
}
