import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import pure, { shallowEqual } from '../../../src/decorators/pure';

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

  describe('shallowEqual', () => {

    class Component extends React.Component {};

    it('should work 1', () => {

      expect(shallowEqual(null, null, 'foo', Component)).toBe(true);

    });

    it('should work 2', () => {

      expect(shallowEqual(null, {}, 'foo', Component)).toBe(false);

    });

    it('should work 3', () => {

      expect(shallowEqual({}, {}, 'foo', Component)).toBe(true);

    });

    it('should work 4', () => {

      expect(shallowEqual({ a: 'a' }, {}, 'foo', Component)).toBe(false);

    });

    it('should work 5', () => {

      expect(shallowEqual({}, { a: 'a' }, 'foo', Component)).toBe(false);

    });

  });

});