Consistent message digest for JSON object
=====

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintainability](https://api.codeclimate.com/v1/badges/c89648224f4636fa8529/maintainability)](https://codeclimate.com/github/quvox/json-digest/maintainability)
[![CircleCI](https://circleci.com/gh/quvox/json-digest/tree/develop.svg?style=svg)](https://circleci.com/gh/quvox/json-digest/tree/develop)

This module creates structured digests based on a given JSON data for consistent message digest calculation. The procedure of digest calculation is described below.



## Supported Programming languages
### Python
* version
  - 3.5 or later
* install the module
```bash
pip install json-structure-digest
```
* import the module in your program
```python
from jsondigest import digest
```
* command line tool
  - json_digest.py

### Javascript
* environment
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
* import the module in your script
```javascript
import { digest } from json-structure-digest
```



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

### Details

#### Digest calculation

Consider the following JSON object for example:

```javascript
jsonobj = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key3": "VALUE3",
    "key4": {
        "key4-1": 2,
        "key4-2": [1, 2, 3, false, "xyz"]
    },
    "key5": ["VALUE5", 5.55, true, ["VALUE5-2", null], {"key5-2": 123}]
}
```

The digest function in this module will create the following output:
```javascript
result = {
    'digest': 'ff2fcda59bf567c4a735600593df9102d9c19f151b645f95af6cc2adc6d2d592',
    'digest_structure': {  // <-- this is the python case. In javascript, this becomes 'digestStructure'. 
        'digest_version': '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
        'key1': '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
        'key2': '15c0afb7873e0013a76ec7349a0bcacdd4b880e081e769a25dc32bb179a200f9',
        'key3': 'f70ace7c93ad7a33b3269e20185a9a1bff7200098cadb08d5e3d7ae0bd2a195a',
        'key4': {
            'key4-1': 'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',
            'key4-2': [
                '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
                'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',
                '35be322d094f9d154a8aba4733b8497f180353bd7ae7b0a15f90b586b549f28b',
                'fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa',
                '3608bca1e44ea6c4d268eb6db02260269892c0b42b86bbf1e77a6fa16c3c9282']
        },
        'key5': [
            'f15c387bc8bee994e688a6865a65d515799a683c7c1631e92b1b5ff6239f412b',
            '413c760798e28115b495384a62331e9d29458defc0ce4bbc9e3809a395c681d9',
            'b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b',
            [
                '0d6e14813ed7edef13c3be0f8a8e7088c4cf4a85dac3cef674c4e82679f3adef',
                '74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b'],
                {'key5-2': '4f319987a786107dc63b2b70115b3734cb9880b099b70c463c5e1b05521ab764'}
            ]
        }
}
```

The function calculates the digest of a given JSON object for each value. 
```'key1': '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8'``` in 'digest_structure' is the pair of key and SHA256(value). In this case, integer value 1 is converted to 8-byte array in little endian, 0x0000000000000001, then SHA256(0x0000000000000001) is calculated, and finally, the result is expressed in HEX string, i.e., '7c9fa136...'.

In the case that the JSON object is nested like 'key4', 'key5' and so on, the ingredients in the nested object are processed in the same manner. See 'key4' for example.

```text
'key4': {
            'key4-1': 'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',     
            'key4-2': [
                '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
                'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',
                '35be322d094f9d154a8aba4733b8497f180353bd7ae7b0a15f90b586b549f28b',
                'fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa',
                '3608bca1e44ea6c4d268eb6db02260269892c0b42b86bbf1e77a6fa16c3c9282']
}
```

The value of 'key4' has a nested object with 'key4-1' and 'key4-2' in the original JSON. Furthermore, the value of 'key4-2' is an array with 5 items. Each value of 'key4-1' and 'key4-2' is a SHA256 digest calculated in the same manner described above.

Finally, the digest of the whole JSON object, ```result = {
    'digest': 'ff2fcda59bf567c4a735600593df9102d9c19f151b645f95af6cc2adc6d2d592',...}``` is obtained by the following procedure (pseudo-code is described):

```
function digest(digest_structure) {
  string_to_hash = ""
  foreach key, value in digest_structure {
    if (typeof value is object) {
      string_to_hash = concatinate(string_to_hash, key, calc_digest(value))  // recursive
    } else {
	    string_to_hash = concatinate(string_to_hash, key, SHA256(value).hex_string()
	  }
  }
  return SHA256(string_to_hash).hex_string()
}
```

The parameter "digest_structure" is the object with keys and the digests of the values. The idea in the above  procedure is that calculating digest for each nested object, the message of which is the concatinated string of the key and the value's digest hex string. For the value of "key4", the message is 

"**key4-1**d86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4**key4-2**7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8*d86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4*35be322d094f9d154a8aba4733b8497f180353bd7ae7b0a15f90b586b549f28b*fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa*3608bca1e44ea6c4d268eb6db02260269892c0b42b86bbf1e77a6fa16c3c9282", and, in turn, the digest of it (cbf11b07f3a2ca130035c6a02c2730bb3121eac7abdd8bd7ee51ee644dd232f9) is concatinated with "key4" like "**key4**cbf11b07f3a2ca130035c6a02c2730bb3121eac7abdd8bd7ee51ee644dd232f9" to calculate the digest of the upper object.

In this way, the digest ```result = {
    'digest': 'ff2fcda59bf567c4a735600593df9102d9c19f151b645f95af6cc2adc6d2d592',...}``` is obtained finally, which is the digest of the JSON object.

#### Digest calculation with merging digest_structure

If an partial JSON object and the whole digest structure are given, the digest function of this module can merge them and calculate the digest for the merged one.

A partial JSON object is like as follows: (no key3 and key5. please find the difference from that in the previous subsection)

```javascript
partial_jsonobj = {
    "digest_version": 1,
    "key1": 1,
    "key2": 2.34,
    "key4": {
        "key4-1": 2,
        "key4-2": [1, 2, 3, false, "xyz"]
    },
}
```

The digest structure is as follows: (same as that in the previous subsection)

```javascript
result = {
    'digest': 'ff2fcda59bf567c4a735600593df9102d9c19f151b645f95af6cc2adc6d2d592',
    'digest_structure': {  // <-- this is the python case. In javascript, this becomes 'digestStructure'. 
        'digest_version': '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
        'key1': '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
        'key2': '15c0afb7873e0013a76ec7349a0bcacdd4b880e081e769a25dc32bb179a200f9',
        'key3': 'f70ace7c93ad7a33b3269e20185a9a1bff7200098cadb08d5e3d7ae0bd2a195a',
        'key4': {
            'key4-1': 'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',
            'key4-2': [
                '7c9fa136d4413fa6173637e883b6998d32e1d675f88cddff9dcbcf331820f4b8',
                'd86e8112f3c4c4442126f8e9f44f16867da487f29052bf91b810457db34209a4',
                '35be322d094f9d154a8aba4733b8497f180353bd7ae7b0a15f90b586b549f28b',
                'fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa',
                '3608bca1e44ea6c4d268eb6db02260269892c0b42b86bbf1e77a6fa16c3c9282']
        },
        'key5': [
            'f15c387bc8bee994e688a6865a65d515799a683c7c1631e92b1b5ff6239f412b',
            '413c760798e28115b495384a62331e9d29458defc0ce4bbc9e3809a395c681d9',
            'b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b',
            [
                '0d6e14813ed7edef13c3be0f8a8e7088c4cf4a85dac3cef674c4e82679f3adef',
                '74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b'],
                {'key5-2': '4f319987a786107dc63b2b70115b3734cb9880b099b70c463c5e1b05521ab764'}
            ]
        }
}
```

You will get the same result by ```digest(json.dumps(partial_jsonobj), json.dumps(result['digest_structure']))```. Note that the function accepts string data (not object itself).



## Usage

For Python module, see [here](./python/README.md).

For Javascript, see [here](./javascript/README.md).

## License
MIT