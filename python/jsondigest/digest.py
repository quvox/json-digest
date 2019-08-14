import json
import struct
import hashlib


def _serialize(value):
    dt = None
    if isinstance(value, str):
        d = hashlib.sha256(value.encode()).hexdigest()
    elif isinstance(value, bool):
        if value:
            d = hashlib.sha256("true".encode()).hexdigest()
        else:
            d = hashlib.sha256("false".encode()).hexdigest()
    elif isinstance(value, dict):
        dt, d = _make_digest_tree_v1(value)
    elif isinstance(value, list):
        dt, d = _make_digest_array_v1(value)
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


def _make_digest_tree_v1(jsondat):
    """Create digest tree structure (version 1)
    Args:
        jsondat (dict): input dictionary object
    Returns:
        dict: Digest tree structure (the values are the digests of the corresponding values)
        string: HEX string of the SHA256 digest of the tree
    """
    res = dict()
    str_to_evaluate = ""
    for k in sorted(jsondat.keys()):
        dt, d = _serialize(jsondat[k])
        if dt is None:
            res[k] = d
        else:
            res[k] = dt
        str_to_evaluate += "%s%s" % (k, d)
    #print(str_to_evaluate)
    return res, hashlib.sha256(str_to_evaluate.encode()).hexdigest()


def _make_digest_array_v1(jsondat):
    """Create digest array structure (version 1)
    Args:
        jsondat (dict): input array object
    Returns:
        list: Digest array structure (the values are the digests of the corresponding values)
        string: HEX string of the SHA256 digest of the tree
    """
    res = list()
    str_to_evaluate = ""
    for v in jsondat:
        dt, d = _serialize(v)
        if dt is None:
            res.append(d)
        else:
            res.append(dt)
        str_to_evaluate += "%s" % d
    #print(str_to_evaluate)
    return res, hashlib.sha256(str_to_evaluate.encode()).hexdigest()


def digest_tree(jsonstr):
    """API for creating digest tree structure
    Args:
        jsonstr (string): input json string (must be UTF-8 with no BOM)
    Returns:
        dict|None: result of digest {digest: SHA256-based digest, digest_tree: tree-structured digests}
    """
    jsondat = json.loads(jsonstr)

    if 'digest_version' not in jsondat:
        return None
    if jsondat['digest_version'] == 1:
        dt, d = _make_digest_tree_v1(jsondat)
        return {"digest": d, "digest_tree": dt}
    else:
        return None
