Consistent message digest for JSON object
=====

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This module creates structured digests based on a given JSON data for consistent message digest calculation. The procedure of digest calculation is described below.

This repository also includes [Python version](../python/README.md).



# Environment and install
* Support
  - Nodejs 0.10 or later
  - Browsers (chrome, firefox, safari, edge)
* install the module
```bash
yarn add json-structure-digest
```
or
```bash
npm install json-structure-digest
```


# Usage

A basic usage is like as follows:
```javascript
import { digest } from json-structure-digest;

const obj = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key3": "VALUE3",
    "key4": {
        "key4-1": 2,
        "key4-2": [1, 2, 3, False, "xyz"]
    },
    "key5": ["VALUE5", 5.55, True, ["VALUE5-2", None], {"key5-2": 123}]
};
const jsonString = JSON.stringify(obj);

const result = digest(jsonString);
const sha256Hex = result.digest;
const digestStructure = result.digestStructure;
```

In the case that you have the above *digestStructure* and partial object, you can also calculate the digest using these two information and will obtain the same result as above.

```javascript
const objPartial = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key3": "VALUE3",
};
const jsonStringPartial = JSON.stringify(objPartial)

const result2 = digest(jsonStringPartial, JSON.stringify(digestStructure))
const sha256Hex2 = result2.digest;
const digestStructure2 = result2.digestStructure;
```

sha256Hex and sha256Hex2, digestStructure and digestStructure2  are identical, respectively. Note that the digest method accepts string params only.



# Requirements
* JSON string must comply with [RFC8259](https://tools.ietf.org/html/rfc8259).
  - The JSON string must be encoded with UTF-8 and no BOM.
  - Supported types of value are string, number (integer, float), object, array, boolean and null. 
* "digest_version" must be included in the JSON.



# Spec of version 1
## Summary
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
