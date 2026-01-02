# Dataflow (Arrow Dataflow)

> Location: ./examples/c++-arrow-dataflow
>
> Keywords: Arrow, Dataflow

[Apache Arrow](https://github.com/apache/arrow) is a universal, columnar format for *fast data exchange and in-memory analytics* tools. It supports multiple languages.

## Install Arrow
For more detailed installation instructions and options, please refer to the [Arrow official installation documentation](https://arrow.apache.org/install/).
```bash
$ sudo apt update
$ sudo apt install -y -V ca-certificates lsb-release wget
$ wget https://packages.apache.org/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb
$ sudo apt install -y -V ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb
$ sudo apt update
$ sudo apt install -y -V libarrow-dev # For C++
```

## Build
Obtain compilation settings for the Arrow library installed on the system via `pkg-config --libs arrow` and `pkg-config --cflags arrow`

```bash
$ mkdir build
$ cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.cc ./build/node-bridge.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.h ./build/dora-node-api.h
$ alias CXX=g++
$ CXX ./build/node-bridge.cc ./node-rust-api/main.cc -std=c++17 -lm -lrt -ldl -pthread -ldora_node_api_cxx -L../../target/debug/ $(pkg-config --libs arrow) $(pkg-config --cflags arrow) -o ./build/node_rust_api
```

## Run
```bash
dora run dataflow.yml
```

## Source Code

For complete source code, see: [dora-examples/cxx-arrow-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-arrow-dataflow)
