# C/C++

## Prerequisites
To implement C/C++ multilingual programming, you need to prepare the relevant packages.
You need to install Dora from source and build the related packages:
- Runtime
```bash
$ cargo build -p dora-runtime # --release
```
- If you need to use the C API
```bash
$ cargo build -p dora-node-api-c # --release
$ cargo build -p dora-operator-api-c # --release
```
- If you need to use the Rust API
```bash
$ cargo build -p dora-node-api-cxx # --release
$ cargo build -p dora-operator-api-cxx # --release
```

When compiling with `release` enabled, note that you need to replace the linked path `target/debug` with `target/release`
If you're interested in mixed Rust and C++ compilation, you can refer to [cxx.rs](https://cxx.rs/)

## C++ Examples
- [C++ Dataflow](./cpp/dataflow.md)
- [Low-Cost Communication Using Arrow](./cpp/arrow-dataflow.md)
- [Building with CMake](./cpp/cmake-dataflow.md)
- [C Language Dataflow](./cpp/c-dataflow.md)
- [Integration with ROS2](./cpp/ros2-dataflow.md)
