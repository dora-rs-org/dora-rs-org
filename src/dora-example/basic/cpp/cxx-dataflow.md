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

### 预期输出

运行成功后，你将看到类似以下的输出：

```
2026-01-02T00:55:11.194863Z  INFO dora_daemon::log:    Received input tick (counter: 1) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
2026-01-02T00:55:11.195698Z  INFO dora_daemon::log:    Received input  (counter: 1) data: [1, ] build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-c-api")
2026-01-02T00:55:11.494528Z  INFO dora_daemon::log:    Received input tick (counter: 2) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
2026-01-02T00:55:11.495464Z  INFO dora_daemon::log:    Received input  (counter: 2) data: [2, ] build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-c-api")
2026-01-02T00:55:11.794526Z  INFO dora_daemon::log:    Received input tick (counter: 3) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
2026-01-02T00:55:11.795299Z  INFO dora_daemon::log:    Received input  (counter: 3) data: [3, ] build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-c-api")
2026-01-02T00:55:12.094486Z  INFO dora_daemon::log:    Received input tick (counter: 4) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
2026-01-02T00:55:12.095222Z  INFO dora_daemon::log:    Received input  (counter: 4) data: [4, ] build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-c-api")
2026-01-02T00:55:12.394238Z  INFO dora_daemon::log:    Received input tick (counter: 5) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
2026-01-02T00:55:12.395092Z  INFO dora_daemon::log:    Received input  (counter: 5) data: [5, ] build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-c-api")
2026-01-02T00:55:12.694241Z  INFO dora_daemon::log:    Received input tick (counter: 6) build_id=None dataflow_id=Some("019b7c33-867d-7a38-ae09-3d76187688f0") node_id=Some("cxx-node-rust-api")
```

日志显示了两个节点之间的数据流：`cxx-node-rust-api`接收定时器tick，然后将计数器值发送给`cxx-node-c-api`。

### 手动构建

如果需要手动构建，请按以下步骤操作：

1. 创建`build`文件夹
2. 使用`cargo build`构建Rust API crates
3. 编译C节点和算子库
4. 构建dora coordinator和runtime
5. 使用dora-daemon运行数据流

## 源码

完整源码请参考：[dora-examples/cxx-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-dataflow)
