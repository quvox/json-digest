/**
 * digest.ts
 */

import hash from 'js-crypto-hash';
import * as i64 from 'int64-buffer';

/**
 * Calculate tree structure-based digest
 * @param jsonString
 * @returns Promise<{digest: string, digestTree: object}|null>
 */
export const digest = async (jsonString: string): Promise<{digest: string, digestTree: object}|null> => {
  const jsonDat = JSON.parse(jsonString);
  if (!jsonDat.hasOwnProperty('digest_version')) {
    return null;
  }
  if (jsonDat['digest_version'] === 1) {
    return await _make_digest_tree_v1(jsonDat);
  } else {
    return null;
  }
};


/**
 * Calculate tree structure-based digest
 * @param jsonDat
 */
const _make_digest_tree_v1 = async (jsonDat: object): Promise<{digest: string, digestTree: object}> => {
  const keys = [];
  for (const k in jsonDat) {
    if (jsonDat.hasOwnProperty(k)) {
      keys.push(k);
    }
  }
  keys.sort();

  let stringToHash = '';
  const digestTree = {};
  for (const k in keys) {
    const res = await _serialize(jsonDat[keys[k]]);
    if (! res.digestTree) {
      digestTree[keys[k]] = res.digest;
    } else {
      digestTree[keys[k]] = res.digestTree;
    }
    stringToHash = `${stringToHash}${keys[k]}${res.digest}`;
  }

  const d = _toHex(await hash.compute(_toUTF8Array(stringToHash)));
  return { digest: d, digestTree: digestTree };
};


/**
 * Calculate array structure-based digest
 * @param jsonDat
 */
const _make_digest_array_v1 = async (jsonDat: object): Promise<{digest: string, digestTree: object}> => {
  let stringToHash = '';
  const digestArray = [];
  for (const i in jsonDat) {
    const res = await _serialize(jsonDat[i]);
    if (! res.digestTree) {
      digestArray.push(res.digest);
    } else {
      digestArray.push(res.digestTree);
    }
    stringToHash = `${stringToHash}${res.digest}`;
  }

  const d = _toHex(await hash.compute(_toUTF8Array(stringToHash)));
  return { digest: d, digestTree: digestArray };
};


const _serialize = async (value: any): Promise<{digest: string, digestTree: object}|null> => {
  let d;
  let dt;
  switch (typeof value) {
    case "object":
      let r;
      if (_isArray(value)) {
        r = await _make_digest_array_v1(value);
        d = r.digest;
        dt = r.digestTree;
      } else if (value == null) {
        d = await hash.compute(_toUTF8Array('null'), 'SHA-256');
      } else {
        r = await _make_digest_tree_v1(value);
        d = r.digest;
        dt = r.digestTree;
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

  if (typeof dt === 'undefined') {
    d = _toHex(d);
  }
  return { digest: d, digestTree: dt };
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

const _toHex = (buf: Uint8Array[]): string => {
  const result = [];
  for (const i in buf) {
    const val = "00" + Number(buf[i]).toString(16);
    result.push(val.substr(val.length-2))
  }
  return result.join('');
};