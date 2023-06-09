"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useLocalStorage(key, defaultValue, options) {
    var opts = react_1.useMemo(function () {
        return __assign({ serializer: JSON.stringify, parser: JSON.parse, logger: console.log, syncData: true }, options);
    }, [options]);
    var serializer = opts.serializer, parser = opts.parser, logger = opts.logger, syncData = opts.syncData;
    var _a = react_1.useState(function () {
        if (typeof window === "undefined")
            return defaultValue;
        try {
            var item = window.localStorage.getItem(key);
            var res = item ? parser(item) : defaultValue;
            return res;
        }
        catch (e) {
            logger(e);
            return defaultValue;
        }
    }), storedValue = _a[0], setValue = _a[1];
    react_1.useEffect(function () {
        if (typeof window === "undefined")
            return;
        var updateLocalStorage = function () {
            if (storedValue !== undefined) {
                window.localStorage.setItem(key, serializer(storedValue));
            }
            else {
                window.localStorage.removeItem(key);
            }
        };
        try {
            updateLocalStorage();
        }
        catch (e) {
            logger(e);
        }
    }, [storedValue]);
    react_1.useEffect(function () {
        if (!syncData)
            return;
        var handleStorageChange = function (e) {
            if (e.key !== key || e.storageArea !== window.localStorage)
                return;
            try {
                setValue(e.newValue ? parser(e.newValue) : undefined);
            }
            catch (e) {
                logger(e);
            }
        };
        if (typeof window === "undefined")
            return;
        window.addEventListener("storage", handleStorageChange);
        return function () { return window.removeEventListener("storage", handleStorageChange); };
    }, [key, syncData]);
    return [storedValue, setValue];
}
exports.default = useLocalStorage;
