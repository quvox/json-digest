#!/bin/bash

cd ../jsondigest
RET=`python json_digest.py -j ../tests/testdat.json`

if [[ ${RET} == "None" ]]; then
  echo ${RET}
  exit 1
fi
exit 0