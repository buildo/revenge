import expect from 'expect';
import React from 'react';
import queries from '../../../src/decorators/queries';

class Component extends React.Component {}

describe('@queries', () => {

  it('should export a QueriesWrapper with queries attached', () => {

    const Wrapped = queries(['a', 'b'])(Component);

    expect(Wrapped.name).toBe('QueriesWrapper');
    expect(Wrapped.queries).toEqual({ a: true, b: true });

  });

  it('should support property renaming', () => {

    const Wrapped = queries([{
      propA: 'queryA'
    }, 'b'])(Component);

    expect(Wrapped.queries).toEqual({ queryA: true, b: true });

  });

});