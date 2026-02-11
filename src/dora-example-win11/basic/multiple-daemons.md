# 多守护进程（Daemon）- Windows版本

Dora通过Coordinator来协调多个Daemon的运行。Daemon可以来自不同的机器。这是Dora分布式的基础。

## Windows 特有注意事项

在Windows系统上运行Dora时，需要注意以下几点：

1. **权限问题**：PowerShell默认位置（如`C:\Windows\System32`）可能没有创建目录的权限，会导致启动Coordinator失败
2. **路径选择**：建议在用户有写入权限的目录下运行Dora命令
3. **端口占用**：如果提示端口已被占用，可能是已经有Daemon在运行

## 启动准备

### 步骤1：选择合适的工作目录

由于权限原因，建议在用户目录或其他有写入权限的位置运行Dora：

```powershell
PS C:\> cd E:\projects\Dora
PS E:\projects\Dora> dir

    Directory: E:\projects\Dora

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          2026-01-27     1:23                dora
d----          2026-01-07    14:30                dora-examples
d----          2026-01-24    12:53                dora-hub
d----          2026-01-13     5:38                dora-rs-org
```

### 步骤2：启动一个协调器（Coordinator）

在有权限的目录下运行：

```powershell
PS E:\projects\Dora> dora coordinator
Listening for incoming daemon connection on 53290
```

**运行结果**：
- 协调器成功启动并监听在默认端口53290
- 会在当前目录创建一个`out`文件夹用于存储日志等信息
- 按下Ctrl+C可以停止协调器

```powershell
2026-02-11T04:03:33.496507Z  INFO dora_coordinator: received ctrlc signal
2026-02-11T04:03:33.496707Z  INFO dora_coordinator: Destroying coordinator after receiving Ctrl-C signal
2026-02-11T04:03:33.496830Z  INFO dora_coordinator: stopped
```

### 步骤3：启动守护进程（Daemon）

在新的PowerShell窗口中启动第一个守护进程：

```powershell
PS C:\Users\Miao> dora daemon --machine-id A
2026-02-11T03:11:02.115272Z  INFO dora_daemon::coordinator: Connected to dora-coordinator at 127.0.0.1:53290
2026-02-11T03:11:02.633802Z  WARN zenoh::net::runtime::orchestrator: Scouting delay elapsed before start conditions are met.
```

在另一个新的PowerShell窗口中启动第二个守护进程：

```powershell
PS C:\Users\Miao> dora daemon --machine-id B
2026-02-11T03:11:21.143322Z  INFO dora_daemon::coordinator: Connected to dora-coordinator at 127.0.0.1:53290
2026-02-11T03:11:21.143498Z  WARN dora_daemon::local_listener: Daemon listen port already in use. There might be another daemon running already.
2026-02-11T03:11:21.658234Z  WARN zenoh::net::runtime::orchestrator: Scouting delay elapsed before start conditions are met.
```

**注意**：如果看到"Daemon listen port already in use"警告，可能是因为端口冲突，但守护进程仍然可以正常连接到协调器。

## 构建前的准备工作

在运行数据流之前，需要确保节点使用与本地dora仓库匹配的API版本。

### 配置依赖指向本地dora仓库

修改 `E:\projects\Dora\dora-examples\Cargo.toml` 文件，在文件末尾添加 patch 配置：

```toml
[patch."https://github.com/dora-rs/dora.git"]
dora-node-api = { path = "../dora/apis/rust/node" }
dora-operator-api = { path = "../dora/apis/rust/operator" }
dora-tracing = { path = "../dora/libraries/extensions/telemetry/tracing" }
```

**配置说明**：
- `[patch."https://github.com/dora-rs/dora.git"]`：告诉Cargo当遇到来自GitHub的dora依赖时，使用本地路径替代
- `dora-node-api`：节点API库，指向 `../dora/apis/rust/node`
- `dora-operator-api`：操作符API库，指向 `../dora/apis/rust/operator`
- `dora-tracing`：追踪库，指向 `../dora/libraries/extensions/telemetry/tracing`

这样配置后，编译节点时会使用本地dora仓库的API，确保与本地运行的daemon版本一致。

### 删除Cargo.lock并重新构建

修改配置后，需要删除lockfile让Cargo重新解析依赖：

```powershell
# 删除workspace级别的Cargo.lock
PS E:\projects\Dora\dora-examples> del Cargo.lock
```

然后进入各个节点目录手动构建：

```powershell
# 构建random-node
PS E:\projects\Dora\dora-examples> cd nodes\random-node
PS E:\projects\Dora\dora-examples\nodes\random-node> cargo build --release

# 构建sink-node
PS E:\projects\Dora\dora-examples> cd ..\sink-node
PS E:\projects\Dora\dora-examples\nodes\sink-node> cargo build --release

# 构建status-node
PS E:\projects\Dora\dora-examples> cd ..\status-node
PS E:\projects\Dora\dora-examples\nodes\status-node> cargo build --release
```

### 修改dataflow.yml的path为相对路径

确保 `E:\projects\Dora\dora-examples\examples\multiple-daemons\dataflow.yml` 中的path字段使用相对路径：

```yaml
nodes:
    - id: rust-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-node
      path: ../../target/release/rust-dataflow-example-node
      inputs:
          tick: dora/timer/millis/10
      outputs:
          - random

    - id: rust-status-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-status-node
      path: ../../target/release/rust-dataflow-example-status-node
      inputs:
          tick: dora/timer/millis/100
          random: rust-node/random
      outputs:
          - status

    - id: rust-sink
      _unstable_deploy:
          machine: B
      build: cargo build --release -p rust-dataflow-example-sink
      path: ../../target/release/rust-dataflow-example-sink
      inputs:
          message: rust-status-node/status
```

**路径说明**：从 `examples/multiple-daemons/dataflow.yml` 出发，`../../target/release/` 指向 `dora-examples` workspace的编译产物目录。

### 注意事项

如果已经启动了daemon A和B，可能需要重新启动整个流程：

1. 终止现有的coordinator和daemon进程
2. 重新启动coordinator
3. 重新启动daemon A和B
4. 再执行构建和运行步骤

## 运行

构建完成后，直接启动数据流（跳过dora build）：

```powershell
PS E:\projects\Dora\dora-examples\examples\multiple-daemons> dora start dataflow.yml
```

可以通过`--coordinator-addr`和`--coordinator-port`来指定协调器的地址和端口：

```powershell
PS E:\projects\Dora\dora-examples\examples\multiple-daemons> dora start dataflow.yml --coordinator-addr 127.0.0.1 --coordinator-port 53290
```

具体参数可以参考：
```powershell
PS E:\projects\Dora\dora-examples\examples\multiple-daemons> dora start --help
```

## 常见问题

### 1. 启动Coordinator时出现权限错误

**错误信息**：
```powershell
[ERROR]
failed to create `out` directory

Caused by:
    拒绝访问。 (os error 5)
```

**解决方案**：切换到有权限的目录后再运行命令。

### 2. 守护进程端口占用

**错误信息**：
```powershell
WARN dora_daemon::local_listener: Daemon listen port already in use. There might be another daemon running already.
```

**解决方案**：这通常不会影响运行，守护进程会自动尝试其他端口。

### 3. 版本不匹配错误

**错误信息**：
```powershell
version mismatch: message format v0.5.0 is not compatible with expected message format v0.7.0
```

**解决方案**：参考"构建前的准备工作"部分，确保正确配置了patch并重新构建了所有节点。

### 4. 程序找不到错误

**错误信息**：
```powershell
program not found
```

**解决方案**：
1. 确认已正确构建所有节点
2. 确认dataflow.yml中的path使用相对路径 `../../target/release/xxx`
3. 确保从 `examples/multiple-daemons` 目录运行 `dora start dataflow.yml`

## 源码

完整源码请参考：[dora-examples/multiple-daemons](https://gitcode.com/dora-org/dora-examples/tree/main/examples/multiple-daemons)

## 完整运行示例

### 1. 修改Cargo.toml配置依赖

```powershell
PS E:\projects\Dora\dora-examples> notepad Cargo.toml
```

在文件末尾添加：
```toml
[patch."https://github.com/dora-rs/dora.git"]
dora-node-api = { path = "../dora/apis/rust/node" }
dora-operator-api = { path = "../dora/apis/rust/operator" }
dora-tracing = { path = "../dora/libraries/extensions/telemetry/tracing" }
```

### 2. 删除Cargo.lock并构建节点

```powershell
PS E:\projects\Dora\dora-examples> del Cargo.lock
PS E:\projects\Dora\dora-examples> cd nodes\random-node
PS E:\projects\Dora\dora-examples\nodes\random-node> cargo build --release
PS E:\projects\Dora\dora-examples> cd ..\sink-node
PS E:\projects\Dora\dora-examples\nodes\sink-node> cargo build --release
PS E:\projects\Dora\dora-examples> cd ..\status-node
PS E:\projects\Dora\dora-examples\nodes\status-node> cargo build --release
```

### 3. 启动协调器

```powershell
PS E:\projects\Dora> dora coordinator
Listening for incoming daemon connection on 53290
```

### 4. 启动守护进程

**守护进程A**：
```powershell
PS C:\Users\Miao> dora daemon --machine-id A
2026-02-11T03:11:02.115272Z  INFO dora_daemon::coordinator: Connected to dora-coordinator at 127.0.0.1:53290
```

**守护进程B**：
```powershell
PS C:\Users\Miao> dora daemon --machine-id B
2026-02-11T03:11:21.143322Z  INFO dora_daemon::coordinator: Connected to dora-coordinator at 127.0.0.1:53290
```

### 5. 启动数据流

```powershell
PS E:\projects\Dora\dora-examples\examples\multiple-daemons> dora start dataflow.yml
```
