<h1 align="center">PyNetworkD3</h1>

<p align="center">
    <em>
        Create D3 visualization networks with Python
    </em>
</p>

<p align="center">
<a href="https://colab.research.google.com/drive/1AwtW-FDAaTh_RMBKj4CJYcyKP2xnOanK?usp=sharing"><img src="https://img.shields.io/badge/example-Open%20in%20colab-hsl(30%2C%20100%25%2C%2048%25)?logo=googlecolab" /></a>
<!-- 
<a href="https://pypi.org/project/iic2343" target="_blank">
    <img src="https://img.shields.io/pypi/v/iic2343?label=version&logo=python&logoColor=%23fff&color=306998" alt="PyPI - Version">
</a>

<a href="https://github.com/daleal/iic2343/actions?query=workflow%3Atests" target="_blank">
    <img src="https://img.shields.io/github/workflow/status/daleal/iic2343/tests?label=tests&logo=python&logoColor=%23fff" alt="Tests">
</a>

<a href="https://codecov.io/gh/daleal/iic2343" target="_blank">
    <img src="https://img.shields.io/codecov/c/gh/daleal/iic2343?label=coverage&logo=codecov&logoColor=ffffff" alt="Coverage">
</a>

<a href="https://github.com/daleal/iic2343/actions?query=workflow%3Alinters" target="_blank">
    <img src="https://img.shields.io/github/workflow/status/daleal/iic2343/linters?label=linters&logo=github" alt="Linters">
</a> 
-->
</p>

## Installation

Install using `pip`!

```sh
$ pip install pynetworkd3
```

## Usage

To use the library, import the `Graph` object directly and use the `export` method
to create a `.html` with the visualization. 


```python
from PyNetworkD3 import Graph

dataset = {
    "nodes": [{"id": 1},{"id": 2},{"id": 3},{"id": 4},{"id": 5}],
    "links": [
        {"source": 1, "target": 3},
        {"source": 2, "target": 3},
        {"source": 1, "target": 3},
        {"source": 5, "target": 3},
        {"source": 4, "target": 1},
    ]
}

graph = Graph(dataset, width=300, height=200, radio=10, tooltip=["id"])

graph.export("output.html)
```

Also you can write the instance in the last line of the notebook's cell (view the <a href="https://colab.research.google.com/drive/1AwtW-FDAaTh_RMBKj4CJYcyKP2xnOanK?usp=sharing"> example in colab</a>) to view the visualization.

<!-- 
### Methods

Here, a `Basys3` instance has 3 methods:

#### `begin`

The method receives an optional `port_number` parameter (in needs to be an `int`). If the parameter is not present and there is only one available serial port on your machine, the `Basys3` instance will use that serial port. Otherwise, it will raise an exception. The method initializes a port to `write` to.

#### `write`

The method receives an `address` parameter (an `int`) and a `word` parameter (a `bytearray`). It then attempts to write the `word` on the specified `address`. If the `Basys3` instance fails, it returns a `0`. Otherwise, it returns an `int`.

#### `end`

The method receives no parameters, and simply closes the port initialized on the `begin` method.

### Attributes

The `Basys3` instance also has 1 attribute:

#### `available_ports`

This attribute has a list with all the available ports (the ports are [`ListPortInfo`](https://pythonhosted.org/pyserial/tools.html#serial.tools.list_ports.ListPortInfo) objects). You don't **need** to use this attribute, but it might come in handy if you want to generate a GUI for your users or something like that.

## CLI

This module also includes a CLI! It is quite simple, but it might be useful to see ports on your machine. The CLI works as follows:

```sh
$ iic2343 --help
usage: iic2343 [-h] [-v] {ports} ...

Command line interface tool for iic2343.

positional arguments:
  {ports}        Action to be executed.

optional arguments:
  -h, --help     show this help message and exit
  -v, --version  show program's version number and exit
```

That was the `--help` flag. Use it when you're not sure how something works! To see a list of your available ports, run the following command on your terminal:

```sh
$ iic2343 ports
(0) ttyS0
      desc: ttyS0
(1) ttyUSB0
      desc: n/a
(2) ttyUSB1
      desc: CP2102 USB to UART Bridge Controller
3 ports found
```

You can also use the `--verbose` flag to get a bit more information about each port:

```sh
$ iic2343 ports --verbose
(0) /dev/ttyS0
      desc: ttyS0
      hwid: PNP0501
(1) /dev/ttyUSB0
      desc: n/a
      hwid: PNP0502
(2) /dev/ttyUSB1
      desc: CP2102 USB to UART Bridge Controller
      hwid: USB VID:PID=10C4:EA60 SER=0001 LOCATION=2-1.6
3 ports found
```

## Developing

This library uses `PyTest` as the test suite runner, and `PyLint`, `Flake8`, `Black`, `ISort` and `MyPy` as linters. It also uses `Poetry` as the default package manager.

The library includes a `Makefile` that has every command you need to start developing. If you don't have it, install `Poetry` using:

```sh
make get-poetry
```

Then, create a virtualenv to use throughout the development process, using:

```sh
make build-env
```

Activate the virtualenv using:

```sh
. .venv/bin/activate
```

Deactivate it using:

```sh
deactivate
```

To add a new package, use `Poetry`:

```sh
poetry add <new-package>
```

To run the linters, you can use:

```sh
# The following commands auto-fix the code
make black!
make isort!

# The following commands just review the code
make black
make isort
make flake8
make mypy
make pylint
```

To run the tests, you can use:

```sh
make tests
```

## Releasing

To make a new release of the library, `git switch` to the `master` branch and execute:

```sh
make bump! minor
```

The word `minor` can be replaced with `patch` or `major`, depending on the type of release. The `bump!` command will bump the versions of the library, create a new branch, add and commit the changes. Then, just _merge_ that branch to `master`. Finally, execute a _merge_ to the `stable` branch. Make sure to update the version before merging into `stable`, as `PyPi` will reject packages with duplicated versions. -->
