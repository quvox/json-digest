#!/bin/sh
""":" .

exec python "$0" "$@"
"""

"""
The MIT License (MIT)

Copyright (c) 2019 Takeshi Kubo.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""
import sys
import os
from argparse import ArgumentParser
sys.path.append("../")
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
