# 环境配置

## 依赖环境

- ROS2 Humble
- dora v0.3.9
- rust v1.91.1
- rerun 0.27.2

## 安装 dora v0.3.9

参考官方文档：[https://github.com/dora-rs/dora](https://github.com/dora-rs/dora)

### dora-api 编译

`/dora/apis` 目录下有C、C++、python、rust语言的桥接库，需要手动编译：

```bash
cargo build -p dora-node-api-cxx --release
```

> `dora-node-api-cxx` 是 cargo.toml 中定义的 name

编译产物在 `/target/release` 目录下，不加 `--release`，编译的是测试版本，编译产物在 `/target/debug` 目录下。

编译完成之后先运行一个示例，验证桥接库可用，参考官方文档：[https://dora-rs.org/dora-by-examples/basic/cpp/ros2-dataflow.html](https://dora-rs.org/dora-by-examples/basic/cpp/ros2-dataflow.html)

桥接库的使用案例：[https://github.com/dora-rs/dora/tree/zenoh/examples](https://github.com/dora-rs/dora/tree/zenoh/examples)

> **注意**：dora v0.3.9的桥接库只能通过循环语句，不使用回调函数。
>
> 仓库一段时间会有更新。C++-ROS2-DORA桥接库，2025.11，13号前更新过仓库，有调整文件名，编译产物现在是 `dora-ros2-bindings.h`，`dora-ros2-bindings.cc`。

## 安装 RoboScience lidar SDK

参考官方文档：[https://github.com/RoboSense-LiDAR/rslidar_sdk](https://github.com/RoboSense-LiDAR/rslidar_sdk)

## 安装 rerun

与rust有依赖关系，先确认rust版本再确定rerun的版本：

```bash
git clone https://github.com/rerun-io/rerun.git
cd rerun
mkdir build && cd build
cmake .. -DBUILD_CPP_SDK=ON -DBUILD_SHARED_LIBS=ON  # 启用动态库和C++ SDK
make
sudo make install
```

> `/rerun/Cmakelists.txt` 同时链接了 Dora（libdora_node_api_c.a）和 Rerun（rerun_sdk）两个含 Rust 运行时的静态库，导致符号重复定义，通过将 Rerun 改为动态库解决了编译链接冲突。

## 安装依赖库

```bash
# pcl库
sudo apt-get install libpcl-dev
# eigen库
sudo apt install libeigen3-dev
```

yaml-cpp: [https://github.com/jbeder/yaml-cpp](https://github.com/jbeder/yaml-cpp)
