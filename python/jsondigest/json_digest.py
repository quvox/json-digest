import sys
import os
from argparse import ArgumentParser
from digest import digest_tree


def parser():
    usage = 'python {} [--json filename] [--help]'.format(__file__)
    argparser = ArgumentParser(usage=usage)
    argparser.add_argument('-j', '--json', type=str, default='-', help='input json file')
    args = argparser.parse_args()
    return args


if __name__ == "__main__":
    argresult = parser()
    filename = argresult.json
    if filename is None:
        filename = "-"

    if filename == "-":
        dat = sys.stdin.read()
    else:
        if not os.path.exists(filename):
            sys.stderr("No such file [%s]" % filename)
            sys.exit(1)
        with open(argresult.json, "r") as f:
            dat = f.read()

    try:
        print(digest_tree(dat))
    except Exception as e:
        print(e)
        print("Invalid input", file=sys.stderr)
