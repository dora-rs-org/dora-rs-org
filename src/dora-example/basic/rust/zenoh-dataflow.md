# Dora-Zenoh集成示例

本示例展示如何将Dora与[Zenoh](https://zenoh.io/)连接进行双向通信。

## 概述

两个组件相互通信：

1. **Dora节点**：向Zenoh主题发布和订阅消息
2. **Zenoh应用**：通过Zenoh与Dora节点交换消息

## 结构

- `dataflow.yml`：Dora数据流配置
- `dora-node/`：集成Zenoh的Dora节点实现
- `zenoh-app/`：订阅数据的独立Zenoh应用程序
- `main.rs`：Dora数据流运行器

## 前置条件

- Rust和Cargo
- Dora已安装并在PATH中可用，或通过`DORA`环境变量设置
- Zenoh依赖已安装

确保DORA环境变量设置正确：
```bash
export DORA=/Users/demo/dora
```

## 工作原理

```yaml
nodes:
    - id: dora-zenoh-publisher
      build: bash -c "cd dora-node && cargo build --release"
      path: ./dora-node/target/aarch64-apple-darwin/release/dora-node
      inputs:
          tick: dora/timer/millis/500
```

- `id`：节点标识符
- `build`：编译节点的命令
- `path`：编译后二进制文件的位置
- `inputs`：Dora提供一个每500ms发送tick的定时器给此节点

**Dora节点**：
- 向`dora/data`发布"Hello"消息
- 订阅`zenoh/data`上的消息

**Zenoh应用**：
- 订阅`zenoh/data`
- 向`dora/data`发布消息

## 运行示例

```bash
cargo run --release --example zenoh-dataflow
```

## 预期输出

```
2025-11-02T18:10:49.943542Z  INFO dora_daemon::log:    Initializing Zenoh session... build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
2025-11-02T18:10:49.951918Z  INFO dora_daemon::log:    Declaring Zenoh publisher for 'dora/data'... build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #1')
2025-11-02T18:10:49.962553Z  INFO dora_daemon::log:    Declaring Zenoh subscriber for 'zenoh/data'... build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
2025-11-02T18:10:49.972699Z  INFO dora_daemon::log:    Dora node with Zenoh integration started! build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
2025-11-02T18:10:49.977408Z  INFO dora_daemon::log:    Publishing message: Hello from Dora node! Message #1 build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
2025-11-02T18:10:50.444696Z  INFO dora_daemon::log:    Publishing message: Hello from Dora node! Message #2 build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #2')
2025-11-02T18:10:50.944559Z  INFO dora_daemon::log:    Publishing message: Hello from Dora node! Message #3 build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #3')
2025-11-02T18:10:51.445510Z  INFO dora_daemon::log:    Publishing message: Hello from Dora node! Message #4 build_id=None dataflow_id=Some("019a45c3-c5d2-7725-85d1-e741573b765e") node_id=Some("dora-zenoh-publisher")
```

## 源码

完整源码请参考：[dora-examples/rust-zenoh-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/rust-zenoh-dataflow)
