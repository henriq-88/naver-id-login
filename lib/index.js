"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var jsonp_1 = tslib_1.__importDefault(require("jsonp"));
var util_1 = require("./util");
var NaverAuth = /** @class */ (function () {
    function NaverAuth() {
        this.accessToken = "";
    }
    NaverAuth.prototype.login = function (clientId, callbackUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var baseURL, responseType, state, params, paramString, url, width, height, top, left, popupWindow, windowHandler, windowCloserPromise, tokenHandlerPromise, resp;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!clientId)
                            return [2 /*return*/, Promise.reject({ code: "invalid-client-id", message: "Invalid client id: \"" + clientId + "\"" })];
                        if (!callbackUrl)
                            return [2 /*return*/, Promise.reject({ code: "invalid-callback-url", message: "Invalid callback url: \"" + callbackUrl + "\"" })];
                        baseURL = "https://nid.naver.com/oauth2.0/authorize";
                        responseType = "token";
                        state = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0;
                            var v = c === "x" ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        params = {
                            response_type: responseType,
                            client_id: clientId,
                            redirect_uri: callbackUrl,
                            state: state
                        };
                        paramString = util_1.uriParams.stringify(params);
                        url = baseURL + "?" + paramString;
                        width = 460;
                        height = 629;
                        top = window.screen.height / 2 - height / 2;
                        left = window.screen.width / 2 - width / 2;
                        popupWindow = window.open(url, "naverloginpop", "titlebar=1, resizable=1, scrollbars=yes, width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
                        if (!popupWindow)
                            return [2 /*return*/, Promise.reject({ code: "popup-error", message: "Popup could not be opened" })];
                        windowHandler = { interval: 0 };
                        windowCloserPromise = util_1.windowCloserListener(popupWindow, windowHandler);
                        tokenHandlerPromise = new Promise(function (resolve) {
                            function receiveMessage(event) {
                                if (event.source !== popupWindow)
                                    return;
                                if (event.origin !== window.location.origin)
                                    return;
                                clearInterval(windowHandler.interval);
                                window.removeEventListener("message", receiveMessage, false);
                                resolve(event.data);
                            }
                            window.addEventListener("message", receiveMessage, false);
                        });
                        return [4 /*yield*/, Promise.race([windowCloserPromise, tokenHandlerPromise])];
                    case 1:
                        resp = _a.sent();
                        this.accessToken = resp.access_token;
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    NaverAuth.prototype.handleTokenResponse = function () {
        var params = util_1.uriParams.parse(window.location.hash);
        window.opener.postMessage(params, window.location.origin);
        window.close();
    };
    NaverAuth.prototype.getProfile = function (accessToken) {
        if (accessToken === void 0) { accessToken = this.accessToken; }
        if (!accessToken)
            return Promise.reject({ code: "invalid-token", message: "Invalid access token: \"" + accessToken + "\". login() to retreive a new access token." });
        var baseURL = "https://openapi.naver.com/v1/nid/getUserProfile.json";
        var responseType = "json";
        var url = baseURL;
        var params = {
            access_token: accessToken,
            response_type: responseType,
            oauth_callback: "callback"
        };
        var options = { param: util_1.uriParams.stringify(params) };
        return new Promise(function (resolve, reject) { return jsonp_1["default"](url, options, function (error, data) {
            if (error)
                reject(error);
            resolve(data);
        }); });
    };
    return NaverAuth;
}());
exports["default"] = new NaverAuth();
