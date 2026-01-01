# 数据流（Arrow Dataflow）

> 地址：./examples/c++-arrow-dataflow
>
> 关键词：Arrow，Dataflow

[Apache Arrow](https://github.com/apache/arrow) 是通用的、列式格式的、*快速数据交换和内存中分析*工具。支持多种语言。

## 安装Arrow
更详细的安装说明与选项请参考[Arrow官方安装文档](https://arrow.apache.org/install/)。
```bash
$ sudo apt update
$ sudo apt install -y -V ca-certificates lsb-release wget
$ wget https://packages.apache.org/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb
$ sudo apt install -y -V ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb
$ sudo apt update
$ sudo apt install -y -V libarrow-dev # For C++
```

## 构建
通过`pkg-config --libs arrow`和`pkg-config --cflags arrow`获得系统安装的Arrow库相关的编译设置

```bash
$ mkdir build
$ cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.cc ./build/node-bridge.cc
$ cp ../../target/cxxbridge/dora-node-api-cxx/src/lib.rs.h ./build/dora-node-api.h
$ alias CXX=g++
$ CXX ./build/node-bridge.cc ./node-rust-api/main.cc -std=c++17 -lm -lrt -ldl -pthread -ldora_node_api_cxx -L../../target/debug/ $(pkg-config --libs arrow) $(pkg-config --cflags arrow) -o ./build/node_rust_api
```

## 运行
```bash
dora run dataflow.yml
```
