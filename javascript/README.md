Consistent message digest for JSON object
=====

[![npm version](https://badge.fury.io/js/json-structure-digest.svg)](https://badge.fury.io/js/json-structure-digest)
[![Dependency Status](https://david-dm.org/quvox/json-digest.svg)](https://david-dm.org/quvox/json-digest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This module creates structured digests based on a given JSON data for consistent message digest calculation. The procedure of digest calculation is described below.

This repository also includes [Python version](https://github.com/quvox/json-digest/tree/develop/python/README.md).



## Environment and install
* Support
  - Nodejs 10.0 or later
  - Browsers (chrome, firefox, safari, edge)
* install the module
```bash
yarn add json-structure-digest
```
or
```bash
npm install json-structure-digest
```


## Usage

A basic usage is like as follows:
```javascript
const jsd = require('json-structure-digest');

const testFunc = async () => {
    const obj = {
        "digest_version": 1,
        "key1": 1,
        "key2": 2.34,
        "key3": "VALUE3",
        "key4": {
            "key4-1": 2,
            "key4-2": [1, 2, 3, false, "xyz"]
        },
        "key5": ["VALUE5", 5.55, true, ["VALUE5-2", null], {"key5-2": 123}]
    };
    const jsonString = JSON.stringify(obj);
    
    const result = await jsd.digest(jsonString);
    const sha256Hex = result.digest;
    const digestStructure = result.digestStructure;
};

testFunc();
```

Only "digest()" is exposed in this module. Note that digest() accepts string params only.
  
In the case that you have the above *digestStructure* and partial object, you can also calculate the digest using these two information and will obtain the same result as above.

```javascript
const jsd = require('json-structure-digest');

const testFunc2 = async () => {
    const objPartial = {
        "digest_version": 1,
        "key1": 1,
        "key2": 2.34,
        "key3": "VALUE3",
    };
    const jsonStringPartial = JSON.stringify(objPartial)
    
    const result2 = await jsd.digest(jsonStringPartial, JSON.stringify(digestStructure))
    const sha256Hex2 = result2.digest;
    const digestStructure2 = result2.digestStructure;
};
testFunc2();
```

sha256Hex and sha256Hex2, digestStructure and digestStructure2 are identical, respectively.



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


See [here](https://github.com/quvox/json-digest/blob/develop/README.md) in detail.


## License
MIT
