# 数据流


## Dora相关包的准备
[需要预先准备的包](/basic/cpp.md#需要预先准备的包)
官方样例中使用clang++进行编译，实测g++也是可以使用的，对于大部分的Linux发行版（如Ubuntu等）使用默认安装的g++即可。

## C API
### 构建
<!-- langtabs-start -->
```Linux
alias CXX='clang++' # CXX='g++'
mkdir build

# 构建算子
CXX -c operator-c-api/operator.cc -std=c++17 -o operator-c-api/operator.o -fPIC
CXX -shared operator-c-api/operator.o -ldora_operator_api_c -L../../target/debug/ -o ./build/liboperator_c_api.so

# 构建节点
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
### 构建
<!-- langtabs-start -->
```Linux
alias CXX='clang++' # CXX='g++'
mkdir -p build

# 构建算子
cp ../../target/cxxbridge/dora-operator-api-cxx/src/lib.rs.h ./build/dora-operator-api.h
cp ../../target/cxxbridge/dora-operator-api-cxx/src/lib.rs.cc ./build/operator-bridge.cc
CXX -c ./operator-rust-api/operator.cc -std=c++17 -I./operator-rust-api -o operator-rust-api/operator.o -fPIC
CXX -c ./build/operator-bridge.cc -std=c++17 -I./operator-rust-api -o ./build/operator-bridge.o -fPIC
CXX -shared ./operator-rust-api/operator.o ./build/operator-bridge.o -ldora_operator_api_cxx -L../../target/debug/ -o ./build/liboperator_rust_api.so

# 构建节点
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

## 运行
```bash
$ dora run dataflow.yaml
```

## 相关节点功能概览
- `node-c-api`：使用C API对接收到的数据进行计数，并返回计数
- `node-rust-api`： 使用Rust API对接收到的数据进行计数，并返回计数
- `operator-c-api`：使用C API接受数据并除以2后发出
- `operator-rust-api`：使用Rust API对接收到的所有消息进行计数，并将收到的消息发出

## 源码

完整源码请参考：[dora-examples/c++-dataflow](https://gitcode.com/dora-org/dora-examples/tree/main/examples/c++-dataflow)
