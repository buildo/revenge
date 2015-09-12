import expect from 'expect';
import React from 'react';
import queries from '../../../src/decorators/queries';

class Component extends React.Component {}

describe('@queries', () => {

  it('should export a QueriesWrapper with queries attached', () => {

    const Wrapped = queries(['a'])(Component);

    expect(Wrapped.name).toBe('QueriesWrapper');
    expect(Wrapped.queries).toExist();
    expect(Wrapped.queries.a).toExist();
    expect(Wrapped.queries.a.query).toBe('a');
    expect(Wrapped.queries.a.filter).toBeA(Function);
  });

  it('should support prop renaming', () => {

    const Wrapped = queries([{
      propA: 'queryA'
    }, 'b'])(Component);

    expect(Wrapped.queries).toExist();
    expect(Wrapped.queries.queryA).toExist();
    expect(Wrapped.queries.queryA.query).toBe('queryA');
    expect(Wrapped.queries.queryA.filter).toBeA(Function);
  });

  it('should support filter function', () => {

    const filter = () => true;
    const Wrapped = queries([{
      propA: {
        query: 'queryA',
        filter
      }
    }])(Component);

    expect(Wrapped.queries).toExist();
    expect(Wrapped.queries.queryA).toExist();
    expect(Wrapped.queries.queryA.query).toBe('queryA');
    expect(Wrapped.queries.queryA.filter).toBe(filter);
  });

});