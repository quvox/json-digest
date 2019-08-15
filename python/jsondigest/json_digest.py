#!/bin/sh
""":" .

exec python "$0" "$@"
"""

"""
Copyright (c) 2019 quvox.net

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
import sys
import os
from argparse import ArgumentParser
from jsondigest import digest


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
        print(digest(dat))
    except Exception as e:
        print(e)
        print("Invalid input", file=sys.stderr)
