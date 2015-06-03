"use strict";

exports.__esModule = true;
exports["default"] = renderif;

function renderif(cond) {
  return function (body) {
    return cond ? body : null;
  };
}

module.exports = exports["default"];