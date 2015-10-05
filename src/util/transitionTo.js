import PathUtils from 'react-router-transition-context/lib/PathUtils';

export default function transitionTo(router, path) {
  // TODO(gio): hack
  // see makePath implementation: https://github.com/rackt/react-router/blob/0.13.x/modules/createRouter.js#L231
  const pathWithParams = PathUtils.withoutQuery(path);
  const query = PathUtils.extractQuery(path);
  router.transitionTo(pathWithParams, null, query);
}
