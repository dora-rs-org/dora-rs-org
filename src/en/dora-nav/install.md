# Environment Setup

## Dependencies

- ROS2 Humble
- dora v0.3.9
- rust v1.91.1
- rerun 0.27.2

## Install dora v0.3.9

Refer to official documentation: [https://github.com/dora-rs/dora](https://github.com/dora-rs/dora)

### dora-api Compilation

The `/dora/apis` directory contains bridge libraries for C, C++, python, and rust languages, which need to be compiled manually:

```bash
cargo build -p dora-node-api-cxx --release
```

> `dora-node-api-cxx` is the name defined in cargo.toml

The compilation artifacts are in the `/target/release` directory. Without `--release`, it compiles the test version, and the compilation artifacts are in the `/target/debug` directory.

After compilation is complete, run an example first to verify that the bridge library is available. Refer to official documentation: [https://dora-rs.org/dora-by-examples/basic/cpp/ros2-dataflow.html](https://dora-rs.org/dora-by-examples/basic/cpp/ros2-dataflow.html)

Bridge library usage examples: [https://github.com/dora-rs/dora/tree/zenoh/examples](https://github.com/dora-rs/dora/tree/zenoh/examples)

> **Note**: The bridge library of dora v0.3.9 can only use loop statements, not callback functions.
>
> The repository is updated periodically. The C++-ROS2-DORA bridge library was updated before November 13, 2025, with filename adjustments. The compilation artifacts are now `dora-ros2-bindings.h` and `dora-ros2-bindings.cc`.

## Install RoboScience lidar SDK

Refer to official documentation: [https://github.com/RoboSense-LiDAR/rslidar_sdk](https://github.com/RoboSense-LiDAR/rslidar_sdk)

## Install rerun

It has dependencies with rust, so confirm the rust version first to determine the rerun version:

```bash
git clone https://github.com/rerun-io/rerun.git
cd rerun
mkdir build && cd build
cmake .. -DBUILD_CPP_SDK=ON -DBUILD_SHARED_LIBS=ON  # Enable dynamic libraries and C++ SDK
make
sudo make install
```

> `/rerun/Cmakelists.txt` links both Dora (libdora_node_api_c.a) and Rerun (rerun_sdk) static libraries containing Rust runtime, causing duplicate symbol definitions. This compilation linking conflict was solved by making Rerun a dynamic library.

## Install Dependency Libraries

```bash
# pcl library
sudo apt-get install libpcl-dev
# eigen library
sudo apt install libeigen3-dev
```

yaml-cpp: [https://github.com/jbeder/yaml-cpp](https://github.com/jbeder/yaml-cpp)
