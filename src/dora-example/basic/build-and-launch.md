# 构建与加载


## Dora-cli 中常用的命令
Dora命令行工具提供了`build`和`start`等命令。

- `coordinator`启动一个coordinator进程，用于调度协调。
- `daemon`在本地启动一个daemon进程，用于运行dataflow，可以指定连接到任一coordinator。
- `start`启动一份dataflow，可以指定连接到任一coordinator。
- `run`相当于在本地自行创建一个coordinator、daemon并在其上加载对应的dataflow.yml。
- ...

## YAML配置文件

Dora通过使用YAML配置文件来描述dataflow。
形如：
```yaml
nodes:
    - id: rust-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-node
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-node
      inputs:
          tick: dora/timer/millis/10
      outputs:
          - random

    - id: rust-status-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-status-node
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-status-node
      inputs:
          tick: dora/timer/millis/100
          random: rust-node/random
      outputs:
          - status

    - id: rust-sink
      _unstable_deploy:
          machine: B
      build: cargo build --release -p rust-dataflow-example-sink
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-sink
      inputs:
          message: rust-status-node/status
```
### 通过环境变量更灵活的启动
在build和path字段中都可以使用环境变量，例如`$DORA_EXAMPLES`。
这使得节点的位置可以更加灵活的放置。
值得注意的是，这两个字段中的环境变量会使用daemon所处运行环境的环境变量。

### 构建字段的技巧
Dora的build字段参考了Github Action的设计，但是其功能并不完备。
build字段允许通过多行来声明需要多个命令的构建。
如果需要借助脚本或更复杂的参数时可以使用`bash -c "..."`
