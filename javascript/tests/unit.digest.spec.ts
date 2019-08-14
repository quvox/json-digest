import {getTestEnv} from './prepare';
import { expect } from 'chai';
import {digest} from '../src/digest';
const env = getTestEnv();
const envName = env.envName;


const sample1 = {
    "aaaa": 1,
    "bbbb": 2.34,
    "cccc": "xxxxxx",
    "ddd": true
};

const sample2 = {
  "digest_version": 1,
  "aaaa": -10000000007,
  "bbbb": 2.34,
  "cccc": "xxxxxx",
  "ddd": false,
  "fff": null,
  "ggg": "う"
};

const sample3 = {
  "digest_version": 1,
  "aaaa": 1,
  "bbbb": 2.34,
  "cccc": "xxxxxx",
  "dddd": {
    "a2": 2,
    "b2": 4.55324121,
    "c2": "あああああああああ"
  },
  "eeee": "yyyyyy"
};

const sample4 = {
  "digest_version": 1,
  "aaaa": 1,
  "bbbb": 2.34,
  "cccc": "xxxxxx",
  "いいいいいい": {
    "a2": 2,
    "b2": 4.55324121,
    "c2": "あああああああああ",
    "d2": [1, 2, 3, false, "xxyyzz"]
  },
  "お1A": "yyyyyy",
  "ffff": ["1", 2, 3.3, true, false, ["aaa", "bbb", 3], {"a3": 123, "b3": "YYYY"}]
};


describe(`${envName}: Tree structure-based JSON digest calculator`, () => {
  it('Simple test: no version', async () => {
    const ret = await digest(JSON.stringify(sample1));
    expect(ret == null).to.be.true;
  });

  it('Simple test: simple object', async () => {
    const ret = await digest(JSON.stringify(sample2));
    expect(ret != null).to.be.true;
    expect(ret.digest === '8933faac4f301af8d0f564b76fa120d1352d37e47b74ab4c3d1fdc602a633800').to.be.true; // from a test of python module
    //console.log(ret);
  });

  it('Simple test: nested object', async () => {
    const ret = await digest(JSON.stringify(sample3));
    expect(ret != null).to.be.true;
    expect(ret.digest === 'fd1770b7fc72d495e6825f73b0479e3db6373aba5c366c18fb4df9a84b43af28').to.be.true; // from a test of python module
    //console.log(ret);
  });

  it('Simple test: nested object with array', async () => {
    const ret = await digest(JSON.stringify(sample4));
    expect(ret != null).to.be.true;
    expect(ret.digest === '04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c').to.be.true; // from a test of python module
    //console.log(ret);
  });

});
