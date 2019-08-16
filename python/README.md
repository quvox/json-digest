Consistent message digest for JSON object
=====

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintainability](https://api.codeclimate.com/v1/badges/c89648224f4636fa8529/maintainability)](https://codeclimate.com/github/quvox/json-digest/maintainability)
[![CircleCI](https://circleci.com/gh/quvox/json-digest/tree/develop.svg?style=shield)](https://circleci.com/gh/quvox/json-digest/tree/develop)

This module is a python module that creates structured digests based on a given JSON data for consistent message digest calculation. The procedure of digest calculation is described below.

This repository also includes [Javascript version](../javascript/README.md).


## Environment and install
* version
  - 3.5 or later
* install the module
```bash
pip install json-structure-digest
```
* command line tool
  - json_digest.py

## Usage

A basic usage is like as follows:
```python
import json
from jsondigest import digest

obj = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key3": "VALUE3",
    "key4": {
        "key4-1": 2,
        "key4-2": [1, 2, 3, False, "xyz"]
    },
    "key5": ["VALUE5", 5.55, True, ["VALUE5-2", None], {"key5-2": 123}]
}
json_string = json.dumps(obj)

result = digest(json_string)
sha256_hex = result["digest"]
digest_structure = result["digest_structure"]
```

In the case that you have the above *digest_structure* and partial object, you can also calculate the digest using these two information and will obtain the same result as above.

```python
obj_partial = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key3": "VALUE3",
}
json_string_partial = json.dumps(obj_partial)

result2 = digest(json_string_partial, digest_structure=json.dumps(digest_structure))
sha256_hex2 = result2["digest"]
digest_structure2 = result2["digest_structure"]
```

sha256_hex and sha256_hex2, digest_structure and digest_structure2  are identical, respectively. Note that the digest method accepts string params only. 


## Command line tool

```json_digest.py``` is available after pip install. The usage is very simple.
```bash
$ json_digest.py -j path_to_jsonfile
```
or
```bash
$ cat path_to_jsonfile | json_digest.py
```
You will get a json string of the digest and the digest structure of the given json file. 



## Requirements
* JSON string must comply with [RFC8259](https://tools.ietf.org/html/rfc8259).
  - The JSON string must be encoded with UTF-8 and no BOM.
  - Supported types of value are string, number (integer, float), object, array, boolean and null. 
* "digest_version" must be included in the JSON.



## Spec of version 1
### Summary
* ```digest_version: 1```
* A digest is calculated for each value in a JSON object.
* The digest function in this version is SHA256.
* To achieve consistency, the keys at each level in the JSON object are sorted in increasing order of the ASCII value in the digest calculation procedure.
* The following conversions before digest calculation are performed:
  - An integer value is converted in 8-byte array in little-endian. 
  - A float value is converted in 8-byte array in little-endian.
  - A boolean value is converted to either "true" or "false".
  - A null value is converted to "null".
* All digests are expressed in HEX string in little endian.



See [here](../README.md) in detail.


## License
MIT
