import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import pure from '../../../src/decorators/pure';

describe('@pure decorator', () => {

  it('should add shouldComponentUpdate method on Component prototype', () => {

    @pure
    class A extends React.Component {}

    const a = new A();
    expect(a.shouldComponentUpdate).toBeA(Function);
  });

  it('should honor existing shouldComponentUpdate', () => {

    const scu = sinon.spy();

    @pure
    class A extends React.Component {
      shouldComponentUpdate(...args) {
        return scu(...args);
      }
    }

    const a = new A({});
    expect(a.shouldComponentUpdate).toBeA(Function);
    const np = {}, ns = {};
    a.shouldComponentUpdate(np, ns);
    expect(scu.calledOnce).toBe(true);
    expect(scu.getCall(0).args[0]).toBe(np);
    expect(scu.getCall(0).args[1]).toBe(ns);
    expect(scu.getCall(0).args[2]).toBeA(Function);
  });

});