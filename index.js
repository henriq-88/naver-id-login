"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var $ = require('./jquery-only-ajax');

var util = require('./util');

function _default() {
  this.token = null;

  this.login =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(clientId, callbackURL) {
      var baseURL, responseType, state, params, paramString, url, width, height, top, left, popupWindow, windowHandler, windowCloserPromise, tokenHandlerPromise, token;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (clientId) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", Promise.reject({
                code: 'invalid-client-id',
                message: "Invalid client id: '".concat(clientId, "'")
              }));

            case 2:
              if (callbackURL) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", Promise.reject({
                code: 'invalid-callback-url',
                message: "Invalid callback url: '".concat(callbackURL, "'")
              }));

            case 4:
              baseURL = 'https://nid.naver.com/oauth2.0/authorize';
              responseType = 'token';
              state = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0;
                var v = c === 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
              });
              params = {
                response_type: responseType,
                client_id: clientId,
                redirect_uri: callbackURL,
                state: state
              };
              paramString = util.parameterize(params);
              url = "".concat(baseURL, "?").concat(paramString);
              width = 460;
              height = 629;
              top = window.screen.height / 2 - height / 2;
              left = window.screen.width / 2 - width / 2;
              popupWindow = window.open(url, 'naverloginpop', "titlebar=1, resizable=1, scrollbars=yes, width=".concat(width, ", height=").concat(height, ", top=").concat(top, ", left=").concat(left));
              windowHandler = {
                interval: null
              };
              windowCloserPromise = util.windowCloserListener(popupWindow, windowHandler);
              tokenHandlerPromise = new Promise(function (resolve) {
                function receiveMessage(event) {
                  if (event.source !== popupWindow) return;
                  if (event.origin !== window.location.origin) return;
                  clearInterval(windowHandler.interval);
                  window.removeEventListener('message', receiveMessage, false);
                  resolve(event.data);
                }

                window.addEventListener('message', receiveMessage, false);
              });
              _context.next = 20;
              return Promise.race([windowCloserPromise, tokenHandlerPromise]);

            case 20:
              token = _context.sent;
              this.token = token;
              return _context.abrupt("return", Promise.resolve());

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  this.handleTokenResponse = function () {
    var params = util.parseParams(window.location.hash);
    window.opener.postMessage(params, window.location.origin);
    window.close();
  };

  this.getProfile = function () {
    var token = this.token;
    if (!token) return Promise.reject({
      code: 'invalid-token',
      message: "Invalid token: '".concat(token, "'. login() to retreive a new token.")
    });
    var baseURL = 'https://openapi.naver.com/v1/nid/getUserProfile.json';
    var responseType = 'json';
    var url = baseURL;
    var params = {
      access_token: token.access_token,
      response_type: responseType
    };
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        type: 'GET',
        data: params,
        dataType: 'jsonp',
        jsonp: 'oauth_callback',
        success: resolve,
        error: reject
      });
    });
  };
}