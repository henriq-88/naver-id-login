"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaverAuth = void 0;

var $ = require('./jquery-only-ajax');

var util = require('./util');

var NaverAuth = function NaverAuth() {
  this.login = function (clientId, callbackURL) {
    if (!clientId || !callbackURL) {
      console.error('invalid client id and/or callback url ' + clientId + ', ' + callbackURL);
      return;
    }

    var baseURL = 'https://nid.naver.com/oauth2.0/authorize';
    var responseType = 'token';
    var state = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    var params = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: callbackURL,
      state: state
    };
    var paramString = util.parameterize(params);
    var url = baseURL + '?' + paramString;
    var popupWindow = window.open(url, 'naverloginpop', 'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550');
    return new Promise(function (resolve) {
      function receiveMessage(event) {
        if (event.source !== popupWindow) {
          return;
        }

        if (event.origin !== window.location.origin) {
          return;
        }

        window.removeEventListener('message', receiveMessage, false);
        var tokenData = event.data;
        resolve(tokenData);
      }

      window.addEventListener('message', receiveMessage, false);
    });
  };

  this.handleTokenResponse = function () {
    var params = util.parseParams(window.location.hash);
    window.opener.postMessage(params, window.location.origin);
    window.close();
  };

  this.getProfile = function (token) {
    if (!token) {
      console.error('invalid token: ' + token);
      return;
    }

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
};

exports.NaverAuth = NaverAuth;