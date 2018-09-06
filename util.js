"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowCloserListener = exports.parameterize = exports.parseParams = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    var _ref2 = _slicedToArray(_ref, 2),
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
          return reject('popup-closed');
        }, 100);
      }
    }, 100);
  });
};

exports.windowCloserListener = windowCloserListener;