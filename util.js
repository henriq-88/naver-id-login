"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowCloserListener = exports.parameterize = exports.parseParams = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var parseParams = function parseParams(paramString) {
  var params = {};
  var regex = /([^#?&=]+)=([^&]*)/g;
  var match = null;

  while ((match = regex.exec(paramString)) !== null) {
    var key = decodeURIComponent(match[1]);
    var value = decodeURIComponent(match[2]);
    params[key] = value;
  }

  return params;
};

exports.parseParams = parseParams;

var parameterize = function parameterize(params) {
  return Object.entries(params).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return key + '=' + encodeURIComponent(val);
  }).join('&');
};

exports.parameterize = parameterize;

var windowCloserListener = function windowCloserListener(popupWindow, windowHandler) {
  return new Promise(function (resolve, reject) {
    windowHandler.interval = setInterval(function () {
      if (popupWindow.closed) {
        setTimeout(function () {
          clearInterval(windowHandler.interval);
          return reject({
            code: 'popup-closed',
            message: 'The popup has been closed by the user before finalizing the operation'
          });
        }, 100);
      }
    }, 100);
  });
};

exports.windowCloserListener = windowCloserListener;