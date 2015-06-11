import t from 'tcomb';

const Query = t.struct({
  id: t.Str,
  get: t.Func,
  fetch: t.maybe(t.Func),
  dependencies: t.maybe(t.list(t.Str))
}, 'Query');

export default Query;
