# CMake Dataflow

> Location: ./examples/cmake-dataflow
>
> Keywords: CMake, Dataflow

CMake is a cross-platform build system that allows developers to use simple scripts to describe project dependencies and build rules, thereby enabling cross-platform builds. C/C++ Dora projects can also be built using CMake.

## Build
```bash
$ cmake -DDORA_ROOT_DIR=../../ -B./build . # Specify the root directory of the Dora project via the DORA_ROOT_DIR variable
$ cmake --build ./build
$ cmake --install ./build
```

## Run
```bash
$ dora run dataflow.yml
```

## Source Code

For complete source code, see: [dora-examples/cmake-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cmake-dataflow)
