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

import hash from 'js-crypto-hash';
import * as i64 from 'int64-buffer';

/**
 * Calculate tree structure-based digest
 * @param jsonString
 * @param digestStructure
 * @returns Promise<{digest: string, digestStructure: object}|null>
 */
export const digest = async (jsonString: string, digestStructure?: string): Promise<{digest: string, digestStructure: object}|null> => {
  const jsonDat = JSON.parse(jsonString);
  if (!jsonDat.hasOwnProperty('digest_version')) {
    return null;
  }
  if (jsonDat['digest_version'] === 1) {
    let ds = await _make_structure_digest_v1(jsonDat);
    if (digestStructure !== undefined) {
      const tmp = JSON.parse(digestStructure);
      ds = _mergeDeep(tmp, ds);
    }
    const d = await _calc_structure_digest(ds)
    return {digest: d, digestStructure: ds};
  } else {
    return null;
  }
};


/**
 * Calculate tree structure-based digest
 * @param jsonDat
 */
const _make_structure_digest_v1 = async (jsonDat: object): Promise<object> => {
  const keys = [];
  for (const k in jsonDat) {
    if (jsonDat.hasOwnProperty(k)) {
      keys.push(k);
    }
  }
  keys.sort();

  const digestTree = {};
  for (const k in keys) {
    const res = await _serialize(jsonDat[keys[k]]);
    if (! res.digestStructure) {
      digestTree[keys[k]] = res.digest;
    } else {
      digestTree[keys[k]] = res.digestStructure;
    }
  }
  return digestTree;
};


/**
 * Calculate array structure-based digest
 * @param jsonDat
 */
const _make_array_digest_v1 = async (jsonDat: object): Promise<object> => {
  const digestArray = [];
  for (const i in jsonDat) {
    const res = await _serialize(jsonDat[i]);
    if (! res.digestStructure) {
      digestArray.push(res.digest);
    } else {
      digestArray.push(res.digestStructure);
    }
  }
  return digestArray;
};


const _serialize = async (value: any): Promise<{digest: string, digestStructure: object}|null> => {
  let d;
  let dt;
  switch (typeof value) {
    case "object":
      let r;
      if (_isArray(value)) {
        dt = await _make_array_digest_v1(value);
      } else if (value == null) {
        d = await hash.compute(_toUTF8Array('null'), 'SHA-256');
      } else {
        dt = await _make_structure_digest_v1(value);
      }
      break;

    case "string":
      d = await hash.compute(_toUTF8Array(value), 'SHA-256');
      break;

    case "number":
      if (Number.isInteger(value)) {
        const v = (new i64.Int64LE(value)).toArrayBuffer()
        d = await hash.compute(new Uint8Array(v), 'SHA-256');
      } else {
        const buffer = new ArrayBuffer(8);
        const f64 = new Float64Array(buffer);
        f64[0] = value;
        d = await hash.compute(new Uint8Array(buffer), 'SHA-256');
      }
      break;

    case "boolean":
      d = await hash.compute(_toUTF8Array(value ? 'true': 'false'), 'SHA-256');
      break;

    default:
      return null;
  }

  if (dt === undefined) {
    d = _toHex(d);
  }
  return { digest: d, digestStructure: dt };
};


const _calc_structure_digest = async(digestStructure: any): Promise<string> => {
  const keys = [];
  for (const k in digestStructure) {
    if (digestStructure.hasOwnProperty(k)) {
      keys.push(k);
    }
  }
  keys.sort();

  let stringToHash = '';
  let d;
  for (const k in keys) {
    switch (typeof digestStructure[keys[k]]) {
      case "object":
        if (_isArray(digestStructure[keys[k]])) {
          d = await _calc_array_digest(digestStructure[keys[k]]);
        } else {
          d = await _calc_structure_digest(digestStructure[keys[k]]);
        }
        break;

      default:
        d = digestStructure[keys[k]];
        break;
    }
    stringToHash = `${stringToHash}${keys[k]}${d}`;
  }
  return _toHex(await hash.compute(_toUTF8Array(stringToHash)));
};


const _calc_array_digest = async(digestStructure: any): Promise<string> => {
  let d;
  let stringToHash = '';
  for (const k in digestStructure) {
    switch (typeof digestStructure[k]) {
      case "object":
        if (_isArray(digestStructure[k])) {
          d = await _calc_array_digest(digestStructure[k]);
        } else {
          d = await _calc_structure_digest(digestStructure[k]);
        }
        break;

      default:
        d = digestStructure[k];
        break;
    }
    stringToHash = `${stringToHash}${d}`;
  }
  return _toHex(await hash.compute(_toUTF8Array(stringToHash)));
};


const _isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};


const _toUTF8Array = (str): Uint8Array => {
  const utf8 = [];
  for (let i=0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
        0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
        0x80 | ((charcode>>6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff)<<10)
        | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >>18),
        0x80 | ((charcode>>12) & 0x3f),
        0x80 | ((charcode>>6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
  }
  return new Uint8Array(utf8);
};

const _toHex = (buf: Uint8Array): string => {
  const result = [];
  for (const i in buf) {
    const val = "00" + Number(buf[i]).toString(16);
    result.push(val.substr(val.length-2))
  }
  return result.join('');
};

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const _isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const _mergeDeep = (target, ...sources): any => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (_isObject(target) && _isObject(source)) {
    for (const key in source) {
      if (_isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        _mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return _mergeDeep(target, ...sources);
};
