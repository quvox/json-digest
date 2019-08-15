#!/bin/bash

if [[ $1 != "upload" ]]; then
  echo "If you really want to upload the package to PyPI, $0 upload"
  exit 1
fi

python3 -mvenv venv
. venv/bin/activate
pip install -r requirements-pypi.txt

cd ..
rm -rf dist/ json_structure_digest.egg-info/
python setup.py sdist
python setup.py bdist_wheel

twine upload --repository pypi dist/*

deactivate
mkdir temp_xxxxx
cd temp_xxxxx
python3 -mvenv venv
. venv/bin/activate
pip --no-cache-dir install --upgrade json-structure-digest

json_digest.py -h

deactivate
cd ../
rm -rf temp_xxxxx
