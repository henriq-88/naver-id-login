"use strict";
exports.__esModule = true;
exports.uriParams = {
    parse: function (paramString) {
        var params = {};
        var regex = /([^#?&=]+)=([^&]*)/g;
        var match = null;
        while ((match = regex.exec(paramString)) !== null) {
            var key = decodeURIComponent(match[1]);
            var value = decodeURIComponent(match[2]);
            params[key] = value;
        }
        return params;
    },
    stringify: function (params) {
        return Object
            .entries(params)
            .map(function (_a) {
            var key = _a[0], val = _a[1];
            return key + "=" + encodeURIComponent(val);
        })
            .join("&");
    }
};
exports.windowCloserListener = function (popupWindow, windowHandler) {
    return new Promise(function (resolve, reject) {
        windowHandler.interval = setInterval(function () {
            if (!popupWindow.closed)
                return;
            setTimeout(function () {
                clearInterval(windowHandler.interval);
                return reject({ code: "popup-closed", message: "The popup has been closed by the user before finalizing the operation" });
            }, 100);
        }, 100);
    });
};
