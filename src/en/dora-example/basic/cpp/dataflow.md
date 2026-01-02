# Dataflow

> Location: ./examples/c++-dataflow
>
> Keywords: C++, Node, Operator

## Preparation of Dora-related Packages
[Packages to Prepare in Advance](/basic/cpp.md#需要预先准备的包)
The official examples use clang++ for compilation, but g++ has been tested and also works. For most Linux distributions (such as Ubuntu), the default installed g++ can be used.

## C API
### Build
<!-- langtabs-start -->
```Linux
alias CXX='clang++' # CXX='g++'
mkdir build

# Build operator
CXX -c operator-c-api/operator.cc -std=c++17 -o operator-c-api/operator.o -fPIC
CXX -shared operator-c-api/operator.o -ldora_operator_api_c -L../../target/debug/ -o ./build/liboperator_c_api.so

# Build node
CXX node-c-api/main.cc -lm -lrt -ldl -pthread -L../../target/debug -ldora_node_api_c -o ./build/node_c_api
```
```Windows
#TBD#
```
```MacOS
#TBD#
```
<!-- langtabs-end -->

## Rust API
### Build
<!-- langtabs-start -->
```Linux
alias CXX='clang++' # CXX='g++'
mkdir -p build

# Build operator
cp ../../target/cxxbridge/dora-operator-api-cxx/src/lib.rs.h ./build/dora-operator-api.h
cp ../../target/cxxbridge/dora-operator-api-cxx/src/lib.rs.cc ./build/operator-bridge.cc
CXX -c ./operator-rust-api/operator.cc -std=c++17 -I./operator-rust-api -o operator-rust-api/operator.o -fPIC
CXX -c ./build/operator-bridge.cc -std=c++17 -I./operator-rust-api -o ./build/operator-bridge.o -fPIC
CXX -shared ./operator-rust-api/operator.o ./build/operator-bridge.o -ldora_operator_api_cxx -L../../target/debug/ -o ./build/liboperator_rust_api.so

# Build node
cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.h ./build/dora-node-api.h
cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.cc ./build/node-bridge.cc
CXX ./node-rust-api/main.cc ./build/node-bridge.cc -lm -lrt -ldl -pthread -L../../target/debug -ldora_node_api_cxx -o ./build/node_rust_api
```
```Windows
#TBD#
```
```MacOS
#TBD#
```
<!-- langtabs-end -->

## Run
```bash
$ dora run dataflow.yaml
```

## Overview of Related Node Functions
- `node-c-api`: Uses C API to count received data and return the count
- `node-rust-api`: Uses Rust API to count received data and return the count
- `operator-c-api`: Uses C API to receive data, divide it by 2, and send it out
- `operator-rust-api`: Uses Rust API to count all received messages and send out the received messages

## Source Code

For complete source code, see: [dora-examples/c++-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/c++-dataflow)
