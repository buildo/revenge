import t from 'tcomb';

export default class Query {

  constructor(id, get, fetch, dependencies) {
    if (process.env.NODE_ENV !== 'production') {
      const example = `

Example:

new Query(
  'querySomething',
  () => this.db.getSomething(),
  () => { // optional
    return this.API.fetchSomething().then(
      something => this.update(db => db.setSomething(new Something(something)))
    );
  },
  ['dependency1', 'dependency2'] // optional
);
      `;
      t.assert(t.Str.is(id), `a Query must have a id: t.Str field. ${example}`);
      t.assert(t.Func.is(get), `a Query must have a get: t.Func field. ${example}`);
      t.assert(t.maybe(t.Func).is(fetch), `a Query may have a fetch: t.maybe(t.Func) field. ${example}`);
      t.assert(t.maybe(t.list(t.Str)).is(dependencies), `a Query may have a dependencies: t.maybe(t.list(t.Str)) field. ${example}`);
    }
    this.id = id;
    this.get = get;
    this.fetch = fetch;
    this.dependencies = dependencies;
  }

}
