import assert from 'assert';
import log from '../../src/decorators/log';

describe('@log decorator', () => {

  it('test 1', () => {

    class A {
      @log()
      sum(a, b) {
        return a + b;
      }
    }

    const a = new A();
    assert.strictEqual(a.sum(1, 2), 3);
  });

});