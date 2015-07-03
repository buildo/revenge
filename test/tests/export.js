import expect from 'expect';
import { App, Query } from '../../src';

describe('avenger export', () => {
  it('should export Query', () => {
    expect(Query).toExist();
  });

  it('App should be instantiable with named parameters', () => {
    const remote = 'http://endpoint';
    const app = new App({ queries: {
      a: Query({ id: 'a', fetch: () => () => {} })
    }, data: {}, state: {}, remote });

    expect(app.remote).toBe(remote);
  });
})