"use strict";
/**
 The MIT License (MIT)

 Copyright (c) 2019 Takeshi Kubo.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_crypto_hash_1 = __importDefault(require("js-crypto-hash"));
var i64 = __importStar(require("int64-buffer"));
/**
 * Calculate tree structure-based digest
 * @param jsonString
 * @param digestStructure
 * @returns Promise<{digest: string, digestStructure: object}|null>
 */
exports.digest = function (jsonString, digestStructure) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonDat, ds, tmp, d;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonDat = JSON.parse(jsonString);
                if (!jsonDat.hasOwnProperty('digest_version')) {
                    return [2 /*return*/, null];
                }
                if (!(jsonDat['digest_version'] === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, _make_structure_digest_v1(jsonDat)];
            case 1:
                ds = _a.sent();
                if (digestStructure !== undefined) {
                    tmp = JSON.parse(digestStructure);
                    ds = _mergeDeep(tmp, ds);
                }
                return [4 /*yield*/, _calc_structure_digest(ds)];
            case 2:
                d = _a.sent();
                return [2 /*return*/, { digest: d, digestStructure: ds }];
            case 3: return [2 /*return*/, null];
        }
    });
}); };
/**
 * Calculate tree structure-based digest
 * @param jsonDat
 */
var _make_structure_digest_v1 = function (jsonDat) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, k, digestTree, _a, _b, _i, k, res;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                keys = [];
                for (k in jsonDat) {
                    if (jsonDat.hasOwnProperty(k)) {
                        keys.push(k);
                    }
                }
                keys.sort();
                digestTree = {};
                _a = [];
                for (_b in keys)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                k = _a[_i];
                return [4 /*yield*/, _serialize(jsonDat[keys[k]])];
            case 2:
                res = _c.sent();
                if (!res.digestStructure) {
                    digestTree[keys[k]] = res.digest;
                }
                else {
                    digestTree[keys[k]] = res.digestStructure;
                }
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, digestTree];
        }
    });
}); };
/**
 * Calculate array structure-based digest
 * @param jsonDat
 */
var _make_array_digest_v1 = function (jsonDat) { return __awaiter(void 0, void 0, void 0, function () {
    var digestArray, _a, _b, _i, i, res;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                digestArray = [];
                _a = [];
                for (_b in jsonDat)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                i = _a[_i];
                return [4 /*yield*/, _serialize(jsonDat[i])];
            case 2:
                res = _c.sent();
                if (!res.digestStructure) {
                    digestArray.push(res.digest);
                }
                else {
                    digestArray.push(res.digestStructure);
                }
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, digestArray];
        }
    });
}); };
var _serialize = function (value) { return __awaiter(void 0, void 0, void 0, function () {
    var d, dt, _a, r, v, buffer, f64;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = typeof value;
                switch (_a) {
                    case "object": return [3 /*break*/, 1];
                    case "string": return [3 /*break*/, 8];
                    case "number": return [3 /*break*/, 10];
                    case "boolean": return [3 /*break*/, 15];
                }
                return [3 /*break*/, 17];
            case 1:
                r = void 0;
                if (!_isArray(value)) return [3 /*break*/, 3];
                return [4 /*yield*/, _make_array_digest_v1(value)];
            case 2:
                dt = _b.sent();
                return [3 /*break*/, 7];
            case 3:
                if (!(value == null)) return [3 /*break*/, 5];
                return [4 /*yield*/, js_crypto_hash_1.default.compute(_toUTF8Array('null'), 'SHA-256')];
            case 4:
                d = _b.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, _make_structure_digest_v1(value)];
            case 6:
                dt = _b.sent();
                _b.label = 7;
            case 7: return [3 /*break*/, 18];
            case 8: return [4 /*yield*/, js_crypto_hash_1.default.compute(_toUTF8Array(value), 'SHA-256')];
            case 9:
                d = _b.sent();
                return [3 /*break*/, 18];
            case 10:
                if (!Number.isInteger(value)) return [3 /*break*/, 12];
                v = (new i64.Int64LE(value)).toArrayBuffer();
                return [4 /*yield*/, js_crypto_hash_1.default.compute(new Uint8Array(v), 'SHA-256')];
            case 11:
                d = _b.sent();
                return [3 /*break*/, 14];
            case 12:
                buffer = new ArrayBuffer(8);
                f64 = new Float64Array(buffer);
                f64[0] = value;
                return [4 /*yield*/, js_crypto_hash_1.default.compute(new Uint8Array(buffer), 'SHA-256')];
            case 13:
                d = _b.sent();
                _b.label = 14;
            case 14: return [3 /*break*/, 18];
            case 15: return [4 /*yield*/, js_crypto_hash_1.default.compute(_toUTF8Array(value ? 'true' : 'false'), 'SHA-256')];
            case 16:
                d = _b.sent();
                return [3 /*break*/, 18];
            case 17: return [2 /*return*/, null];
            case 18:
                if (dt === undefined) {
                    d = _toHex(d);
                }
                return [2 /*return*/, { digest: d, digestStructure: dt }];
        }
    });
}); };
var _calc_structure_digest = function (digestStructure) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, k, stringToHash, d, _a, _b, _i, k, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                keys = [];
                for (k in digestStructure) {
                    if (digestStructure.hasOwnProperty(k)) {
                        keys.push(k);
                    }
                }
                keys.sort();
                stringToHash = '';
                _a = [];
                for (_b in keys)
                    _a.push(_b);
                _i = 0;
                _e.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                k = _a[_i];
                _c = typeof digestStructure[keys[k]];
                switch (_c) {
                    case "object": return [3 /*break*/, 2];
                }
                return [3 /*break*/, 7];
            case 2:
                if (!_isArray(digestStructure[keys[k]])) return [3 /*break*/, 4];
                return [4 /*yield*/, _calc_array_digest(digestStructure[keys[k]])];
            case 3:
                d = _e.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, _calc_structure_digest(digestStructure[keys[k]])];
            case 5:
                d = _e.sent();
                _e.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                d = digestStructure[keys[k]];
                return [3 /*break*/, 8];
            case 8:
                stringToHash = "" + stringToHash + keys[k] + d;
                _e.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10:
                _d = _toHex;
                return [4 /*yield*/, js_crypto_hash_1.default.compute(_toUTF8Array(stringToHash))];
            case 11: return [2 /*return*/, _d.apply(void 0, [_e.sent()])];
        }
    });
}); };
var _calc_array_digest = function (digestStructure) { return __awaiter(void 0, void 0, void 0, function () {
    var d, stringToHash, _a, _b, _i, k, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                stringToHash = '';
                _a = [];
                for (_b in digestStructure)
                    _a.push(_b);
                _i = 0;
                _e.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                k = _a[_i];
                _c = typeof digestStructure[k];
                switch (_c) {
                    case "object": return [3 /*break*/, 2];
                }
                return [3 /*break*/, 7];
            case 2:
                if (!_isArray(digestStructure[k])) return [3 /*break*/, 4];
                return [4 /*yield*/, _calc_array_digest(digestStructure[k])];
            case 3:
                d = _e.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, _calc_structure_digest(digestStructure[k])];
            case 5:
                d = _e.sent();
                _e.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                d = digestStructure[k];
                return [3 /*break*/, 8];
            case 8:
                stringToHash = "" + stringToHash + d;
                _e.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10:
                _d = _toHex;
                return [4 /*yield*/, js_crypto_hash_1.default.compute(_toUTF8Array(stringToHash))];
            case 11: return [2 /*return*/, _d.apply(void 0, [_e.sent()])];
        }
    });
}); };
var _isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
var _toUTF8Array = function (str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80)
            utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return new Uint8Array(utf8);
};
var _toHex = function (buf) {
    var result = [];
    for (var i in buf) {
        var val = "00" + Number(buf[i]).toString(16);
        result.push(val.substr(val.length - 2));
    }
    return result.join('');
};
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
var _isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
};
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
var _mergeDeep = function (target) {
    var _a, _b;
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length)
        return target;
    var source = sources.shift();
    if (_isObject(target) && _isObject(source)) {
        for (var key in source) {
            if (_isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                _mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    return _mergeDeep.apply(void 0, __spreadArrays([target], sources));
};
//# sourceMappingURL=digest.js.map