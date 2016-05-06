import expect from 'expect';
import React from 'react';
import mapProps from '../../../src/decorators/mapProps';

class Component extends React.Component {};

describe('@mapProps', () => {
  it('should allow mapping props', () => {
    const mapFn = ({ ...props }) => Object.keys(props).reduce((ac, k) => ({
      ...ac,
      [`my${k}`]: `my${props[k]}`
    }), {});
    const MappedPropsComponent = mapProps(mapFn)(Component);
    const inst = new MappedPropsComponent({ a: 'foo', b: 'bar' });
    expect(inst.render().props).toEqual({ mya: 'myfoo', myb: 'mybar' });
  });

  it('should complain if not given a function', () => {
    expect(() => { mapProps()(Component) }).toThrow();
  });

  it('should complain if not given a valid component to decorate', () => {
    expect(() => { mapProps(v => v)() }).toThrow();
  });
});