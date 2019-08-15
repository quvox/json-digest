import subprocess
import os
import sys
from os import path
from setuptools import setup
from setuptools.command.install import install

VERSION = "0.9.0"

here = path.abspath(path.dirname(__file__))

with open('README.rst') as f:
    readme = f.read()


class MyInstall(install):
    def run(self):
        try:
            subprocess.call(['python', 'prepare.py'], cwd=here)
        except Exception as e:
            print(e)
            print("Error compiling openssl.")
            exit(1)
        else:
            install.run(self)


class VerifyVersionCommand(install):
    """Custom command to verify that the git tag matches our version"""
    description = 'verify that the git tag matches our version'

    def run(self):
        tag = os.getenv('CIRCLE_TAG')

        if tag != "py-v%s" % VERSION:
            info = "Git tag: {0} does not match the version of this app: {1}".format(
                tag, "py-v%s" % VERSION
            )
            sys.exit(info)


jsondigest_requires = []

jsondigest_packages = ['jsondigest']

jsondigest_commands = ['jsondigest/json_digest.py']

jsondigest_classifiers = [
                    'Development Status :: 4 - Beta',
                    'Programming Language :: Python :: 3.5',
                    'Programming Language :: Python :: 3.6',
                    'Programming Language :: Python :: 3.7',
                    'Topic :: Software Development']

setup(
    name='json-structure-digest',
    version=VERSION,
    description='A library and tool for calculating consistent digest of a json data string',
    long_description=readme,
    long_description_content_type='text/markdown',
    url='',
    author='Takeshi Kubo',
    author_email='',
    license='MIT',
    classifiers=jsondigest_classifiers,
    cmdclass={'install': MyInstall, 'verify': VerifyVersionCommand},
    packages=jsondigest_packages,
    scripts=jsondigest_commands,
    install_requires=jsondigest_requires,
    zip_safe=False)
