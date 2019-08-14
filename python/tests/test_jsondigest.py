import json
import pprint
import sys
sys.path.extend(["../"])
from jsondigest import digest


class TestJsonDigest(object):

    def test_01_simple_json_no_version(self):
        print("\n-----", sys._getframe().f_code.co_name, "-----")
        dat = {
            "aaaa": 1,
            "bbbb": 2.34,
            "cccc": "xxxxxx",
            "ddd": True
        }
        digest_tree, d = digest.digest_tree(json.dumps(dat))
        assert digest_tree is None

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
        digest_tree, d = digest.digest_tree(json.dumps(dat))
        assert len(d) == 64
        print(d)
        pprint.pprint(digest_tree)

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
        digest_tree, d = digest.digest_tree(json.dumps(dat))
        assert len(d) == 64
        print(d)
        pprint.pprint(digest_tree)

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
        digest_tree, d = digest.digest_tree(json.dumps(dat))
        assert len(d) == 64
        print(d)
        pprint.pprint(digest_tree)


if __name__ == '__main__':
    pytest.main()
