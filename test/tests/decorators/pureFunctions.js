import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import pure from '../../../src/decorators/pure';
import pureFunctions, { pureFunctionProp } from '../../../src/decorators/pureFunctions';

describe('@pureFunctions decorator', () => {

  it('should fail when no shouldComponentUpdate is defined on decorated Component', () => {

    expect(() => {
      @pureFunctions
      class A extends React.Component {}
    }).toThrow();
  });

  it('should map PureFunctions props to cached bound function props', () => {
    @pureFunctions
    @pure
    class A extends React.Component {
      getProps() { return this.props; }
    }

    const a1 = 1, a2 = 'foo';
    const fn = (a1, a2) => a1 + a2;
    const PF = pureFunctionProp(fn, a1, a2);
    const a = new A({
      onClick: PF,
      foo: 'bar'
    });

    expect(a.getProps().foo).toBe('bar');
    expect(a.getProps().onClick).toBeA(Function);
    expect(a.getProps().onClick()).toBe('1foo');
  });

  it('should work only with pureFunctionProp-wrapped props', () => {
    @pureFunctions
    @pure
    class A extends React.Component {
      getProps() { return this.props; }
    }

    const a1 = 1, a2 = 'foo';
    const fn = (a1, a2) => a1 + a2;
    const PF = [fn, a1, a2];
    const a = new A({
      onClick: PF,
      foo: 'bar'
    });

    expect(a.getProps().foo).toBe('bar');
    expect(a.getProps().onClick).toBe(PF);
  });

});
