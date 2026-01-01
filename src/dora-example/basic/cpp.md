# C/C++

## 需要预先准备的包
为了实现C/C++多语言混合编程，需要准备好相关的包。
需要从源码安装Dora，并且构建相关包：
- 运行时
```bash
$ cargo build -p dora-runtime # --release
```
- 如果需要使用C API
```bash
$ cargo build -p dora-node-api-c # --release
$ cargo build -p dora-operator-api-c # --release
```
- 如果需要使用Rust API
```bash
$ cargo build -p dora-node-api-cxx # --release
$ cargo build -p dora-operator-api-cxx # --release
```

当使用启用`release`编译时，需注意将连接的地址`target/debug`替换为`target/release`
如果对Rust与C++的混合编译感兴趣，可以参阅[cxx.rs](https://cxx.rs/)

## C++ 样例
- [C++数据流](./cpp/dataflow.md)
- [使用Arrow进行低成本的通信](./cpp/arrow-dataflow.md)
- [使用CMake构建](./cpp/cmake-dataflow.md)
- [C语言数据流](./cpp/c-dataflow.md)
- [结合ROS2](./cpp/ros2-dataflow.md)
