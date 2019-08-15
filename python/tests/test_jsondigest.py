import json
import pprint
import sys
sys.path.extend(["../"])
from jsondigest import digest

digest_result = None


class TestJsonDigest(object):

    def test_01_simple_json_no_version(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "ddd": True
        }
        res = digest(json.dumps(dat))
        assert res is None

    def test_02_simple_json(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": -10000000007,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "ddd": False,
            "fff": None,
            "ggg": "う"
        }
        res = digest(json.dumps(dat))
        assert len(res['digest']) == 64
        assert res['digest'] == "8933faac4f301af8d0f564b76fa120d1352d37e47b74ab4c3d1fdc602a633800"
        print(res['digest'])
        pprint.pprint(res['digest_structure'])

    def test_03_2lv_nested_json(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
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
        }
        res = digest(json.dumps(dat))
        assert len(res['digest']) == 64
        print(res['digest'])
        pprint.pprint(res['digest_structure'])
        assert res['digest'] == "fd1770b7fc72d495e6825f73b0479e3db6373aba5c366c18fb4df9a84b43af28"

    def test_04_2lv_nested_json_with_array(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "いいいいいい": {
                "a2": 2,
                "b2": 4.55324121,
                "c2": "あああああああああ",
                "d2": [1, 2, 3, False, "xxyyzz"]
            },
            "お1A": "yyyyyy",
            "ffff": ["1", 2, 3.3, True, False, ["aaa", "bbb", 3], {"a3": 123, "b3": "YYYY"}]
        }
        global digest_result
        digest_result = digest(json.dumps(dat))
        assert len(digest_result['digest']) == 64
        assert digest_result['digest'] == "04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c"
        print(digest_result['digest'])
        pprint.pprint(digest_result['digest_structure'])

    def test_05_2lv_nested_json_with_digest_structure_param(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": 1,
            "bbbb": 2.34,
            "お1A": "yyyyyy",
            "cccc": "xxxxxx",
        }
        res = digest(json.dumps(dat), digest_structure=json.dumps(digest_result["digest_structure"]))
        assert len(res['digest']) == 64
        assert res['digest'] == "04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c"
        print(res['digest'])
        pprint.pprint(res['digest_structure'])

    def test_05_2lv_nested_json_with_digest_structure_param2(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "いいいいいい": {
                "a2": 2,
                "d2": [1, 2, 3, False, "xxyyzz"]
            },
            "お1A": "yyyyyy",
            "ffff": ["1", 2, 3.3, True, False, ["aaa", "bbb", 3], {"a3": 123, "b3": "YYYY"}]
        }
        res = digest(json.dumps(dat), digest_structure=json.dumps(digest_result["digest_structure"]))
        assert len(res['digest']) == 64
        assert res['digest'] == "04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c"
        print(res['digest'])
        pprint.pprint(res['digest_structure'])

    def test_05_2lv_nested_json_with_digest_structure_param3(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "いいいいいい": {
                "a2": 2,
            },
            "ffff": ["1", 2, 3.3, True, False, ["aaa", "bbb", 3], {"a3": 123, "b3": "YYYY"}]
        }
        res = digest(json.dumps(dat), digest_structure=json.dumps(digest_result["digest_structure"]))
        assert len(res['digest']) == 64
        assert res['digest'] == "04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c"
        print(res['digest'])
        pprint.pprint(res['digest_structure'])

    def test_06_2lv_nested_json_with_digest_structure_param_failure(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "digest_version": 1,
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "いいいいいい": {
                "a2": 2,
                "d2": [1, 2, 3, False, "xxyyzz"]
            },
            "お1A": "yyyyyy",
            "ffff": ["1", 2, 3.3, True, False, ["aaa", "bbb", 3], {"a3": 123}]  # cannot omit data inside array (support only for all or nothing)
        }
        res = digest(json.dumps(dat), digest_structure=json.dumps(digest_result["digest_structure"]))
        assert len(res['digest']) == 64
        assert res['digest'] != "04566ecddb289a481a700f8bc1a58d64e4b60a757fc1f61d71b22fa21602df0c"


if __name__ == '__main__':
    pytest.main()
