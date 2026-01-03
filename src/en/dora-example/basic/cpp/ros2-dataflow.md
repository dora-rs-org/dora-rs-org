# ROS2 Dataflow

Ensure that the ROS2 environment is properly [installed and configured](/appendix/ros2-installation.md)

Dora interacts with ROS through [ros2-client](https://crates.io/crates/ros2-client)
For the C++ API to communicate with ROS, the ROS2 bridge feature needs to be enabled.

## Prepare Related Dependencies
Since the example is related to `turtlesim` and `AddTwoInts`
```bash
$ sudo apt install ros-jazzy-turtlesim ros-jazzy-examples-rclcpp-minimal-service
```
### Generate Dora API with ROS2 Messages
```bash
$ source /opt/ros/jazzy/setup.bash
$ cargo build --package dora-node-api-cxx --features ros2-bridge
```
> [!NOTE]
> 1. When new message interfaces are needed, i.e., when packages are updated or `AMENT_PREFIX_PATH` is updated, regeneration is required
> 2. Before v0.3.13, residual ROS2 packages without messages in the environment variables would cause the default `--debug` build to fail. Please try adding the `--release` parameter when generating the API with `cargo`

### Organize the Required Header Files and C++ Source Files
```bash
$ mkdir build
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-node-api.cc ./build/dora-node-api.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-node-api.h ./build/dora-node-api.h
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-ros2-bindings.cc ./build/dora-ros2-bindings.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-ros2-bindings.h ./build/dora-ros2-bindings.h
```
> [!NOTE]
> 1. Before v0.3.13, all messages and Dora-related APIs were generated in `dora-node-api.h` and `dora-ros2-bindings.h`, and their corresponding `.cc` files need to be compiled together with C++ source files that use these interfaces
> 2. After v0.3.13, different ROS2 messages are generated in separate files. For specifics, check `target/cxxbridge/dora-node-api-cxx/install` after generating the API. Please compile the required C++ source files according to your needs
> 3. As of v0.3.13 (2025-11-24), the Dora C++ API does not yet support the Action communication mechanism in ROS2

## Compile
```bash
$ alias CXX=g++ # clang++ is also acceptable
$ CXX ./node-rust-api/main.cc ./build/dora-ros2-bindings.cc ./build/dora-node-api.cc -std=c++17 -lm -lrt -ldl -lz -pthread -ldora_node_api_cxx -L ../../target/debug/ -o ./build/node_rust_api
```
> [!NOTE]
> If the `--release` parameter was used during generation, change the link directory from `target/debug/` to `target/release`

## Run
Open two additional terminals

You need to use `rmw_fastrtps_cpp`, which should be the default in Jazzy. If you've set it to something else in `.bashrc` or elsewhere, make sure to set it back.
After changing the settings, restart the daemon: `ros2 daemon stop`, `ros2 daemon start`
### Start turtlesim
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run turtlesim turtlesim_node
```
### Start AddTwoInts Service
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run examples_rclcpp_minimal_service service_main
```
### Start Dora Node
```bash
$ dora run dataflow.yml
```
<p style="text-align:center"><video autoplay src="../../images/c++-ros2.webm" alt="运行画面" width="90%" /></p>

## Source Code

For complete source code, see: [dora-examples/cxx-ros2-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-ros2-dataflow)
