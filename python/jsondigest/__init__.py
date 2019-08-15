"""
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
"""
import json
import struct
import hashlib


def _serialize(value):
    d = None
    dt = None
    if isinstance(value, str):
        d = hashlib.sha256(value.encode()).hexdigest()
    elif isinstance(value, bool):
        if value:
            d = hashlib.sha256("true".encode()).hexdigest()
        else:
            d = hashlib.sha256("false".encode()).hexdigest()
    elif isinstance(value, dict):
        dt = _make_structure_digest_v1(value)
    elif isinstance(value, list):
        dt = _make_array_digest_v1(value)
    elif isinstance(value, int):
        d = hashlib.sha256(struct.pack("<q", value)).hexdigest()
    elif isinstance(value, float):
        d = hashlib.sha256(struct.pack("<d", value)).hexdigest()
    elif value is None:
        d = hashlib.sha256("null".encode()).hexdigest()
    else:
        import sys
        sys.stderr("Invalid value type: %s" % value)
        sys.exit(1)
    return dt, d


def _make_structure_digest_v1(jsondat):
    """Create tree structure of digests (version 1)
    Args:
        jsondat (dict): input dictionary object
    Returns:
        dict: tree-structured digests (the values are the digests of the corresponding values)
    """
    res = dict()
    for k in sorted(jsondat.keys()):
        dt, d = _serialize(jsondat[k])
        if dt is None:
            res[k] = d
        else:
            res[k] = dt
    return res


def _make_array_digest_v1(jsondat):
    """Create array structure of digests (version 1)
    Args:
        jsondat (dict): input array object
    Returns:
        list: Array-structured digests
    """
    res = list()
    for v in jsondat:
        dt, d = _serialize(v)
        if dt is None:
            res.append(d)
        else:
            res.append(dt)
    return res


def _calc_structure_digest(structure_digest):
    str_to_digest = ""
    for k in sorted(structure_digest.keys()):
        if isinstance(structure_digest[k], str):
            str_to_digest += "%s%s" % (k, structure_digest[k])
        elif isinstance(structure_digest[k], dict):
            str_to_digest += "%s%s" % (k, _calc_structure_digest(structure_digest[k]))
        else:
            str_to_digest += "%s%s" % (k, _calc_array_digest(structure_digest[k]))
    return hashlib.sha256(str_to_digest.encode()).hexdigest()


def _calc_array_digest(array_digest):
    str_to_digest = ""
    for v in array_digest:
        if isinstance(v, str):
            str_to_digest += "%s" % v
        elif isinstance(v, dict):
            str_to_digest += _calc_structure_digest(v)
        else:
            str_to_digest += _calc_array_digest(v)
    return hashlib.sha256(str_to_digest.encode()).hexdigest()


def _deep_update(dict_base, other):
    for k, v in other.items():
        if isinstance(v, dict) and k in dict_base:
            _deep_update(dict_base[k], v)
        else:
          dict_base[k] = v


def digest(jsonstr, digest_structure=None):
    """API for creating digest tree structure
    Args:
        jsonstr (string): input json string (must be UTF-8 with no BOM)
        digest_structure (dict|None): string of digest_structure (if this param is given, calculate digest with overlaying the given digest_structure)
    Returns:
        dict|None: result of digest {digest: SHA256-based digest, digest_tree: tree-structured digests}
    """
    jsondat = json.loads(jsonstr)

    if "digest_version" not in jsondat:
        return None
    if jsondat["digest_version"] == 1:
        ds = _make_structure_digest_v1(jsondat)
        if digest_structure is not None:
            tmp = json.loads(digest_structure)
            _deep_update(tmp, ds)
            ds = tmp
        d = _calc_structure_digest(ds)
        return {"digest": d, "digest_structure": ds}
    else:
        return None
