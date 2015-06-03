import expect from 'expect';

import renderif from '../../src/util/renderif';

describe('renderif', () => {
  it('should return contents if conditional is truthy, null otherwise', () => {
    expect(renderif(true)('contents')).toEqual('contents');
    expect(renderif(false)('contents')).toEqual(null);
  });
});
