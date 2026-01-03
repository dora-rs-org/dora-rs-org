# ROS2数据流


确保ROS2环境已正确[安装和配置](/appendix/ros2-installation.md)

Dora通过[ros2-client](https://crates.io/crates/ros2-client)与ROS进行交互
C++ API为了与ROS通信，需要启用ROS2桥接功能。

## 准备相关依赖
由于例子与`turtlesim`和`AddTwoInts`相关
```bash
$ sudo apt install ros-jazzy-turtlesim ros-jazzy-examples-rclcpp-minimal-service
```
### 生成带有ROS2 message 的 Dora API
```bash
$ source /opt/ros/jazzy/setup.bash
$ cargo build --package dora-node-api-cxx --features ros2-bridge
```
> [!NOTE]
> 1. 当需要使用新的消息接口时，即包更新或`AMENT_PREFIX_PATH`更新时需要重新进行生成
> 2. 在v0.3.13前，环境变量中残留的无消息ROS2 package会导致默认的`--debug`构建失败，请尝试在使用`cargo`生成API时添加`--release`参数

### 整理需要用到的头文件、C++源文件
```bash
$ mkdir build
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-node-api.cc ./build/dora-node-api.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-node-api.h ./build/dora-node-api.h
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-ros2-bindings.cc ./build/dora-ros2-bindings.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/dora-ros2-bindings.h ./build/dora-ros2-bindings.h
```
> [!NOTE]
> 1. 在v0.3.13版本前，所有的消息及与Dora相关的API生成在`dora-node-api.h`和`dora-ros2-bindings.h`中，其对应的`.cc`需要与使用了该接口的C++源文件一起编译
> 2. 在v0.3.13版本后，不同的ROS2消息生成在独立的文件中，具体可以查看生成API后查看`target/cxxbridge/dora-node-api-cxx/install`。请根据需要自行编译需要的C++源文件
> 3. 截至v0.3.13版本（2025-11-24），Dora C++ API尚未支持ROS2中的Action通信机制

## 编译
```bash
$ alias CXX=g++ # clang++ 也可以
$ CXX ./node-rust-api/main.cc ./build/dora-ros2-bindings.cc ./build/dora-node-api.cc -std=c++17 -lm -lrt -ldl -lz -pthread -ldora_node_api_cxx -L ../../target/debug/ -o ./build/node_rust_api
```
> [!NOTE]
> 如果生成时使用了`--release`参数则需将链接目录`target/debug/`改为`target/release`

## 运行
打开另外两个终端

需要使用`rmw_fastrtps_cpp`Jazzy 中应该是默认的，如果在`.bashrc`等地方设置成了别的注意要设置回来。
更改设置后重启daemon，`ros2 daemon stop`, `ros2 daemon start`
### 启动turtlesim
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run turtlesim turtlesim_node
```
### 启动AddTwoInts服务
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run examples_rclcpp_minimal_service service_main
```
### 启动Dora节点
```bash
$ dora run dataflow.yml
```
<p style="text-align:center"><video autoplay src="../../images/c++-ros2.webm" alt="运行画面" width="90%" /></p>

## 源码

完整源码请参考：[dora-examples/cxx-ros2-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-ros2-dataflow)
