# Requirements

- React.js
- Type safety (@gabro)
- Isomorphic and declarative (@giogonzo)
- Productive and testable (@gcanti)

# What's a framework?

- design
- list of best practices
- list of suggested libraries
- ...optionally some glue code

# Features

- CQRS (kind of)
- Isomorphic
- Runtime type safety
- Optimized (default `shouldComponentUpdate` implementation)
- Testable
- Productive
- ES6/7
- Lintable

# CQRS

![CQRS](http://martinfowler.com/bliki/images/cqrs/cqrs.png)

# Main abstractions:

- `App` the app manager
- `DB` a database
- `API` handles the server communication
- `Query` the way to retrieve data from the database and the server

![design](https://chart.googleapis.com/chart?chl=digraph+design+%7B%0D%0A++++rankdir+%3D+BT%3B%0D%0A++++UI+-%3E+App+%5Blabel%3D%22queries%22%5D%3B%0D%0A++++App+-%3E+UI+%5Blabel%3D%22send+domain+models%22%5D%3B%0D%0A++++Db+-%3E+App+%5Blabel%3D%22send+get+data%22%5D%3B%0D%0A++++App+-%3E+API+%5Blabel%3D%22request+fetch+data%22%5D%3B%0D%0A++++API+-%3E+App+%5Blabel%3D%22send+fetch+data%22%5D%3B%0D%0A++++App+-%3E+Db+%5Blabel%3D%22request+get+data%22%5D%3B%0D%0A%0D%0A%7D%0D%0A&cht=gv)

> **Rule**. `app` and `router` are injected as props

# Commands

```js
doLogin(...args: any[]): ?Promise;
```

# Queries

```js
type Query = {
  id: string;
  get: () => any;         // data from a database, should ouput domain models
  fetch?: () => Promise;  // data from API
  dependencies?: string[] // this query might depend on other queries
};
```

> **Rule**. All the side effects should be segregated in the database.

# DB

```js
type DB = {
  static getDefaultData(cookieContent): Object;
  new (data: Object);
  toJSON(): Object;

  ... setters and getters
};
```

Such that:

```js
new DB(data).toJSON() ~ data
```

Possible implementations:

- tcomb structs
- immutable.js
- mori.js
- Lokijs database
- SQLite
- ...

# API

```js
class API {

  constructor(implementation) {
    this.implementation = implementation;
  }

  fetchUser(userId) {
    return this.implementation.fetchUser(userId).then(
      ({data}) => new User(data)
    );
  }

}
```

- a contract between frontend and backend
- theoretically could be auto-generated from the scala domain model
- no business logic, only raw comunication
- two default implementations
  - `InMemoryAPI`: development and tests
  - `HttpAPI`: production (also development and tests if there's a fake server)

# App

```js
import { App, Query } from 'revenge';

class MyApp extends App {

  constructor(API, db) {
    super();
    this.API = API;
    this.db = db;
  }

  queryUser(userId) {
    return new Query({
      id: 'queryUser',
      get: () => return this.db.getUser(userId), // get the user from db synchronously
      fetch: () => return this.API.fetchUser(userId) // fetch the user from the server asynchronously
        .then( 
          //...insert data in the database
          this.update(() => ...);
        )
    });
  }

}
```

> **Rule**. When writing components, data dependencies must be declared statically.

```js
import { queries } from 'revenge';

@queries((app, params) => ({
  user: app.queryUser(params.userId) // data will be available in a `user` prop
}))
class MyComponent {

  render() {
    return <p>{this.props.user.name}</p>
  }

}
```

> **Rule**. Required data should be passed in via props.

# Runtime type safety

## tcomb

```js
// domain.js

import t from 'tcomb';

const Int = t.subtype(t.Num, n => n % 1 === 0, 'Int');

const Gender = t.enums.of('Male Female', 'Gender');

export const User = t.struct({
  _id: Int,
  name: t.Str,
  surname: t.maybe(t.Str),
  age: t.Num,
  gender: Gender
}, 'User');
```

1. **immutability**: instances are immutables (using `Object.freeze`) in development
2. **speed**: asserts are active only in development mode and stripped in production code.
3. **DDD**: write complex domain models in a breeze and with a small code footprint
4. **debugging**: you can customize the behaviour when an assert fails leveraging the power of Chrome DevTools
5. **runtime type introspection**: every model written with tcomb is inspectable at runtime
6. **JSON**: encodes/decodes domain models to/from JSON for free

## Props

```js
import { props } from 'revenge';
import { User } from './domain';

@props({
  user: User
})
class UserCard extends React.Component {

  render() {
    return <p>{this.props.user.name}</p>;
  }

}
```

- props are required by default
- if you pass additional props will throw

# Optimizations: @pure decorator

```js
import { @pure } from 'revenge';

@pure // will add a default shouldComponentUpdate implementation
class UserCard extends React.Component {}
```

# Testable

## Components

> **Rule**. Do not use context

```js
import { @pure, queries, skinnable, props } from 'revenge';
import { User } from './domain';

@queries((app, params) => ({
  user: app.queryUser(params.userId)
}))
@pure
@skinnable() // or @skinnable(mytemplate)
@props({
  user: User
})
class UserCard extends React.Component {

  getLocals() { // logic here
    return {
      name: this.props.user.name;
    };
  }

  template(locals) { // rendering here
    return <p>{locals.name}</p>;
  }

}
```

# Fast development

At least 4 people could work in parallel:

1. the backend guy (`API` contract)
2. the App/DB guy (`domain` contract)
3. the Components guy (`props` contract)
4. the template/graphic guy (`locals` contract)

