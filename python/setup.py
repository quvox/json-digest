import subprocess
from os import path
from setuptools import setup
from setuptools.command.install import install


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


jsondigest_requires = [
]

jsondigest_packages = ['jsondigest']

jsondigest_commands = []

jsondigest_classifiers = [
                    'Development Status :: 4 - Beta',
                    'Programming Language :: Python :: 3.5',
                    'Programming Language :: Python :: 3.6',
                    'Programming Language :: Python :: 3.7',
                    'Topic :: Software Development']

setup(
    name='json-digest',
    version='0.0.1',
    description='A library and tool for calculating digest of a json data string',
    long_description=readme,
    long_description_content_type='text/markdown',
    url='',
    author='quvox.net',
    author_email='',
    license='Apache License 2.0',
    classifiers=jsondigest_classifiers,
    cmdclass={'install': MyInstall},
    packages=jsondigest_packages,
    scripts=jsondigest_commands,
    install_requires=jsondigest_requires,
    zip_safe=False)

