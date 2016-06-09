import React from 'react';

// to be passed as template to @skinnable
// e.g @skinnable(contains(Component))

export default Component => locals => locals === null ? null : <Component {...locals} />; //eslint-disable-line react/display-name
