# CXX数据流

本示例展示如何使用C++创建dora算子（operator）和自定义节点（node）。

Dora目前尚未提供原生C++ API，但我们可以为C或Rust API创建适配器。`operator-rust-api`和`node-rust-api`文件夹实现了基于dora Rust API的示例算子和节点，使用`cxx` crate进行桥接。`operator-c-api`和`node-c-api`展示了如何基于dora的C API创建算子和节点。

## 项目结构

```
cxx-dataflow/
├── dataflow.yml          # 数据流定义文件
├── node-c-api/           # 基于C API的节点实现
├── node-rust-api/        # 基于Rust API的节点实现
├── operator-c-api/       # 基于C API的算子实现
└── operator-rust-api/    # 基于Rust API的算子实现
```

## 数据流配置

```yaml
nodes:
  - id: cxx-node-rust-api
    path: build/node_rust_api
    inputs:
      tick: dora/timer/millis/300
    outputs:
      - counter

  - id: cxx-node-c-api
    path: build/node_c_api
    inputs:
      tick: cxx-node-rust-api/counter
    outputs:
      - counter
```

## 编译和运行

### 快速运行

使用`run.rs`二进制文件可以自动执行所有构建步骤并启动数据流：

```bash
cargo run --example cxx-dataflow
```

### 手动构建

如果需要手动构建，请按以下步骤操作：

1. 创建`build`文件夹
2. 使用`cargo build`构建Rust API crates
3. 编译C节点和算子库
4. 构建dora coordinator和runtime
5. 使用dora-daemon运行数据流

## 源码

完整源码请参考：[dora-examples/cxx-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-dataflow)
