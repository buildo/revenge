import expect from 'expect';
import { Query } from '../../src';

describe('avenger export', () => {
  it('should export Query', () => {
    expect(Query).toExist();
  });
})