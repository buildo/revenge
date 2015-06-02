import React from 'react';
import t from 'tcomb';

export default function isReactComponent(x) {
  return t.Func.is(x) && (x.prototype instanceof React.Component);
}
