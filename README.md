A collection of small React Component helpers

## @pure decorator

```js
import { pure } from 'revenge';

@pure // will add a default shouldComponentUpdate implementation
class UserCard extends React.Component {}
```

## @skinnable

```js
import { skinnable } from 'revenge';

@pure
@skinnable() // or @skinnable(mytemplate)
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
