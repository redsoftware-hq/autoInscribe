from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in autoinscribe/__init__.py
from autoinscribe import __version__ as version

setup(
	name="autoinscribe",
	version=version,
	description="Seamless automatic data capture and integration solution.",
	author="RedSoft Solutions Pvt. Ltd.",
	author_email="dev@redsoftware.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)