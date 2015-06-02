import t from 'tcomb';

export default function autobound(target, key, descriptor) {
  const { value } = descriptor;

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.Func.is(value), `@autobound decorator can only be applied to methods`);
  }

  return {
    configurable: true,
    get() {
      const boundValue = value.bind(this);
      Object.defineProperty(this, key, {
        value: boundValue,
        configurable: true,
        writable: true
      });
      return boundValue;
    }
  };
}

