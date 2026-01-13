## 运行示例

示例代码位置：

`https://github.com/dora-rs/dora-examples/tree/main/examples/echo`

```powershell
# 激活 rust 环境
PS E:\projects\Dora\dora-examples\examples\echo> rustup default stable
info: using existing install for 'stable-x86_64-pc-windows-msvc'
info: default toolchain set to 'stable-x86_64-pc-windows-msvc'

  stable-x86_64-pc-windows-msvc unchanged - rustc 1.92.0 (ded5c06cf 2025-12-08)

# 创建 python 环境
PS E:\projects\Dora\dora-examples\examples\echo> uv venv -p 3.11 --seed
Using CPython 3.11.14
Creating virtual environment with seed packages at: .venv
 + pip==25.3
 + setuptools==80.9.0
 + wheel==0.45.1
Activate with: .venv\Scripts\activate

# 手动安装依赖（方便使用国内源加速）
PS E:\projects\Dora\dora-examples\examples\echo> uv pip install dora-echo -i https://pypi.tuna.tsinghua.edu.cn/simple/
Resolved 5 packages in 543ms
Prepared 2 packages in 796ms
Installed 2 packages in 113ms
 + dora-echo==0.4.0
 + numpy==1.26.4
PS E:\projects\Dora\dora-examples\examples\echo> uv pip install  pyarrow-assert  pyarrow-sender -i https://pypi.tuna.tsinghua.edu.cn/simple/
Resolved 6 packages in 171ms
Prepared 2 packages in 38ms
Installed 2 packages in 77ms
 + pyarrow-assert==0.4.0
 + pyarrow-sender==0.4.0

# dora 构建dataflow，这一步会自动安装依赖
PS E:\projects\Dora\dora-examples\examples\echo> dora build dataflow.yml --uv
dora-echo: DEBUG    building node
dora-echo: INFO     running build command: `pip install dora-echo` in E:\projects\Dora\dora-examples\examples\echo
dora-echo: stdout   Audited 1 package in 1ms
pyarrow-assert: DEBUG    building node
pyarrow-assert: INFO     running build command: `pip install pyarrow-assert` in E:\projects\Dora\dora-examples\examples\echo
pyarrow-assert: stdout   Audited 1 package in 1ms
pyarrow-sender: DEBUG    building node
pyarrow-sender: INFO     running build command: `pip install pyarrow-sender` in E:\projects\Dora\dora-examples\examples\echo

# dora 运行dataflow
PS E:\projects\Dora\dora-examples\examples\echo> dora run dataflow.yml --uv
```

> [!TIP] ℹ️ <span data-type="code">uv venv -p 3.11 --seed</span>
> 在当前目录下安装虚拟环境
>
> `venv` uv 的核心子命令，用于创建 Python 虚拟环境，等价于 `python -m venv`
>
> `-p` 是 --python 的简写，指定虚拟环境使用的 Python 版本为 3.11
>
> `--seed` 作用是自动为新虚拟环境安装最新版的核心工具：

> [!TIP] ℹ️ <span data-type="code">dora build dataflow.yml --uv</span>
> 构建 / 编译 dataflow.yml 中定义的所有 Dora 节点（如 Python/Rust 节点），完成依赖安装、代码编译等前置准备
> `build` 触发节点构建流程（如执行 pip install 安装 Python 节点依赖、编译 Rust 节点）
> `dataflow.yml` 指定数据流应用的配置文件（定义节点、数据流、依赖等）
> `--uv` 强制使用 uv 替代原生 pip/venv 管理 Python 依赖 / 虚拟环境，提升安装 / 构建速度

> [!TIP] ℹ️ <span data-type="code">dora run dataflow.yml --uv</span>
> 启动 dataflow.yml 定义的完整数据流应用（先自动触发 build 构建，再运行 coordinator / 节点）
> `run` 启动数据流运行时，加载所有节点并执行数据流逻辑
> `--uv` 运行时仍用 uv 管理 Python 环境，保证与构建阶段环境一致
> 特性：无需先手动执行 build，run 会自动完成构建后再启动应用

## 日志分析

```powershell
# 执行命令：运行 dataflow.yml 配置文件，并使用 uv 管理 Python 环境
PS E:\projects\Dora\dora\examples\echo> dora run dataflow.yml --uv

# --- 阶段 1：描述符校验 (Descriptor Validation) ---
# 系统检查配置文件。由于节点定义了 build 命令，dora 默认这些节点是动态生成的，跳过静态路径检查。
2026-01-07T03:20:29.980024Z  INFO dora_core::descriptor::validate: skipping path check for node with build command
2026-01-07T03:20:29.980398Z  INFO dora_core::descriptor::validate: skipping path check for node with build command
2026-01-07T03:20:29.980638Z  INFO dora_core::descriptor::validate: skipping path check for node with build command

# --- 阶段 2：通信基础设施初始化 (Zenoh Runtime) ---
# 初始化底层通信中间件 Zenoh。ZID 是当前节点在分布式网络中的唯一身份标识。
2026-01-07T03:20:29.980995Z  INFO zenoh::net::runtime: Using ZID: 2147f674895baddd40cbe90101a9a508
# Zenoh 正在尝试绑定本地所有可用的网络接口（IPv6/IPv4），监听 5053 端口用于节点间发现。
2026-01-07T03:20:29.984823Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/[fe80::4e53:daaa:1c91:ae52]:5053
2026-01-07T03:20:29.984939Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/192.168.2.52:5053
2026-01-07T03:20:29.985032Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/172.17.128.1:5053
# 开启组播监听，用于自动发现局域网内的其他机器。
2026-01-07T03:20:29.985273Z  INFO zenoh::net::runtime::orchestrator: zenohd listening scout messages on 224.0.0.224:7446

# --- 阶段 3：进程启动与孵化 (Node Spawning) ---
# 调度器 (Spawner) 准备启动 YAML 中定义的各个节点。
11:20:30 DEBUG   dora-echo: daemon::spawner  spawning node
11:20:30 DEBUG   pyarrow-assert: daemon::spawner  spawning node
11:20:30 DEBUG   pyarrow-sender: daemon::spawner  spawning node
11:20:30 INFO    dora daemon  finished building nodes, spawning...

# 节点 1 (dora-echo): 启动进程。注意这里通过 uv 运行，PID 为 38632。
11:20:30 INFO    dora-echo: spawner  spawning `uv` in `E:\projects\Dora\dora\examples\echo`
11:20:30 DEBUG   dora-echo: spawner  spawned node with pid 38632

# 节点 2 (pyarrow-assert): 启动进程，用于断言/验证数据。PID 为 57420。
11:20:30 INFO    pyarrow-assert: spawner  spawning `uv` in `E:\projects\Dora\dora\examples\echo`
11:20:30 DEBUG   pyarrow-assert: spawner  spawned node with pid 57420

# 节点 3 (pyarrow-sender): 启动进程，负责发送测试数据。PID 为 53296。
11:20:30 INFO    pyarrow-sender: spawner  spawning `uv` in `E:\projects\Dora\dora\examples\echo`
11:20:30 DEBUG   pyarrow-sender: spawner  spawned node with pid 53296

# --- 阶段 4：运行就绪与数据传输 (Dataflow Active) ---
# 节点依次报告 Ready 状态，表明内部逻辑已加载完成并成功挂载到 dora 运行时。
11:20:30 INFO    dora-echo: daemon  node is ready
11:20:32 INFO    pyarrow-sender: daemon  node is ready
11:20:32 INFO    pyarrow-assert: daemon  node is ready
# 全员就绪，数据流正式“开闸”运行。
11:20:32 INFO    daemon  all nodes are ready, starting dataflow

# 各个 Python 进程初始化 OpenTelemetry，用于导出监控和指标数据。
11:20:32 INFO    pyarrow-sender: opentelemetry  Global meter provider is set...
11:20:32 INFO    dora-echo: opentelemetry  Global meter provider is set...
11:20:32 INFO    pyarrow-assert: opentelemetry  Global meter provider is set...

# --- 阶段 5：任务结束与清理 (Teardown) ---
# pyarrow-sender 发送完数据后首先完成任务，正常退出。
11:20:32 stdout  pyarrow-sender:
11:20:32 DEBUG   pyarrow-sender: daemon  handling node stop with exit status Success
11:20:32 INFO    pyarrow-sender: daemon  pyarrow-sender finished successfully

# dora-echo 处理完回传数据并退出。
11:20:32 stdout  dora-echo:
11:20:32 stdout  pyarrow-assert:
11:20:32 DEBUG   dora-echo: daemon  handling node stop with exit status Success
11:20:32 INFO    dora-echo: daemon  dora-echo finished successfully

# 核心守护进程 (Daemon) 检测到所有必需节点已完成。
2026-01-07T03:20:32.994153Z  INFO run_inner: dora_daemon: exiting daemon because all required dataflows are finished...

# 最后完成校验的 pyarrow-assert 退出，标志着整个逻辑链条验证通过。
11:20:32 DEBUG   pyarrow-assert: daemon  handling node stop with exit status Success
2026-01-07T03:20:32.994325Z  INFO run_inner: zenoh::api::session: close session zid=2147...
11:20:32 INFO    pyarrow-assert: daemon  pyarrow-assert finished successfully

# 最终报告：数据流在当前机器 ID 下运行圆满结束。
11:20:32 INFO    daemon  dataflow finished on machine `d26831a9-90a8-4593-a48c-d51b960c55f2`
```

## 讲解 Dataflow

```yaml
# dataflow.yml

nodes:
  # 节点 1: 数据源发送者
  - id: pyarrow-sender
    build: pip install pyarrow-sender  # 运行前自动安装依赖包
    path: pyarrow-sender               # 寻找 entry_points 中注册的可执行命令
    outputs:
      - data                           # 定义输出端口：向外广播数据
    env:
      DATA: "[1, 2, 3, 4, 5]"          # 通过环境变量设置要发送的初始测试数据

  # 节点 2: 中转转发者 (即你之前看的 main.py 逻辑)
  - id: dora-echo
    build: pip install dora-echo
    path: dora-echo
    inputs:
      data: pyarrow-sender/data        # 订阅输入：接收来自 pyarrow-sender 的 data 输出
    outputs:
      - data                           # 将接收到的数据原样转发给下游

  # 节点 3: 数据校验者
  - id: pyarrow-assert
    build: pip install pyarrow-assert
    path: pyarrow-assert
    inputs:
      data: dora-echo/data             # 订阅输入：接收来自 dora-echo 的转发数据
    env:
      DATA: "[1, 2, 3, 4, 5]"          # 预期数据值，用于与接收到的数据进行比对断言
```

## 讲解 Node

搜索Python官方源：https://pypi.org/

Dora Node Hub：https://dora-rs.ai/docs/nodes/

echo sample node的源码：https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-echo

```python
# dora-hub/node-hub/dora-echo/dora_echo/main.py

"""TODO: Add docstring."""

import argparse
import os

from dora import Node

# 检测是否在持续集成 (CI) 环境中运行
RUNNER_CI = True if os.getenv("CI") == "true" else False


def main():
    # 配置命令行参数，允许动态指定节点名称（默认为 "echo"）
    parser = argparse.ArgumentParser(description="Simple arrow sender")

    parser.add_argument(
        "--name",
        type=str,
        required=False,
        help="The name of the node in the dataflow.",
        default="echo",
    )
    args = parser.parse_args()

    # 初始化 dora 节点，建立与守护进程 (Daemon) 的连接
    node = Node(
        args.name,
    )

    # 核心事件循环：迭代处理来自数据流的所有事件
    for event in node:
        # 仅处理类型为 "INPUT" 的事件（即上游发送的数据）
        if event["type"] == "INPUT":
            # 零拷贝转发：将接收到的 ID、值和元数据原样送出到下游
            node.send_output(event["id"], event["value"], event["metadata"])


if __name__ == "__main__":
    main()
```


```python
# node-hub/dora-echo/tests/test_dora_echo.py

"""TODO: Add docstring."""

import pytest


def test_import_main():
    """验证 main 函数可以被正常导入并执行基础运行时检查"""
    from dora_echo.main import main

    # 预期抛出 RuntimeError：因为 main() 内部会初始化 Node()，
    # 而当前环境缺少 dora daemon 守护进程，这是验证环境隔离性的常见手段。
    with pytest.raises(RuntimeError):
        main()
```


```toml
# node-hub/dora-echo/pyproject.toml

[project]
name = "dora-echo"
version = "0.4.0"
authors = [
  { name = "Haixuan Xavier Tao", email = "tao.xavier@outlook.com" },
  { name = "Enzo Le Van", email = "dev@enzo-le-van.fr" },
]
description = "Dora echo"
license = { text = "MIT" }
readme = "README.md"
# 确保环境兼容性，最低支持 Python 3.8
requires-python = ">=3.8"

# 核心依赖：dora-rs 框架、特定版本的 numpy 和高性能数据格式库 pyarrow
dependencies = ["dora-rs >= 0.3.9", "numpy < 2.0.0", "pyarrow >= 5.0.0"]

[dependency-groups]
# 开发环境工具：包含单元测试 (pytest) 和高性能代码规范检查器 (ruff)
dev = ["pytest >=8.1.1", "ruff >=0.9.1"]

[project.scripts]
# 注册终端命令：安装后可直接在命令行输入 `dora-echo` 调用 main 函数
dora-echo = "dora_echo.main:main"

[tool.ruff.lint]
# 代码质量扫描配置：启用文档样式、性能、导入排序等多种 lint 规则
extend-select = [
  "D",    # pydocstyle: 检查文档字符串
  "UP",   # Ruff's UP rule: 升级旧版语法
  "PERF", # Ruff's PERF rule: 性能优化建议
  "RET",  # Ruff's RET rule: 返回值逻辑优化
  "RSE",  # Ruff's RSE rule: 异常处理规范
  "NPY",  # Ruff's NPY rule: NumPy 特定规则
  "N",    # Ruff's N rule: 变量命名规范
  "I",    # Ruff's I rule: 自动排序 import
]
```

## 做一点小修改

修改`dataflow.yml`文件，修改pyarrow-sender节点发送的数据，模拟一个错误数据。

```yaml
# dataflow.yml

nodes:
  - id: pyarrow-sender
    build: pip install pyarrow-sender
    path: pyarrow-sender
    outputs:
      - data
    env:
      DATA: "[1, 2, 3, 4, 0]"          # 模拟错误数据
```

再次运行查看运行日志，可以发现`pyarrow-assert`Node发现了异常数据。

```powershell
PS E:\projects\Dora\dora-examples\examples\echo> dora run .\dataflow.yml --uv
2026-01-12T18:42:00.240647Z  INFO dora_core::descriptor::validate: skipping path check for node with build command
2026-01-12T18:42:00.240777Z  INFO dora_core::descriptor::validate: skipping path check for node with build command
2026-01-12T18:42:00.240856Z  INFO dora_core::descriptor::validate: skipping path check for node with build command
2026-01-12T18:42:00.241187Z  INFO zenoh::net::runtime: Using ZID: 8aae42e2236f709b07e9eb1a86b8ee90
2026-01-12T18:42:00.244888Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/[fe80::c2f2:9df0:d13:8a7d]:12927
2026-01-12T18:42:00.244991Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/192.168.2.52:12927
2026-01-12T18:42:00.245128Z  INFO zenoh::net::runtime::orchestrator: Zenoh can be reached at: tcp/172.17.128.1:12927
2026-01-12T18:42:00.245377Z  INFO zenoh::net::runtime::orchestrator: zenohd listening scout messages on 224.0.0.224:7446
02:42:00 DEBUG   dora-echo: daemon::spawner  spawning node
02:42:00 DEBUG   pyarrow-assert: daemon::spawner  spawning node
02:42:00 DEBUG   pyarrow-sender: daemon::spawner  spawning node
02:42:00 INFO    dora daemon  finished building nodes, spawning...
02:42:00 INFO    dora-echo: spawner  spawning `uv` in `E:\projects\Dora\dora-examples\examples\echo`
02:42:00 DEBUG   dora-echo: spawner  spawned node with pid 39664
02:42:00 INFO    pyarrow-assert: spawner  spawning `uv` in `E:\projects\Dora\dora-examples\examples\echo`
02:42:00 DEBUG   pyarrow-assert: spawner  spawned node with pid 38992
02:42:00 INFO    pyarrow-sender: spawner  spawning `uv` in `E:\projects\Dora\dora-examples\examples\echo`
02:42:00 INFO    dora-echo: daemon  node is ready
02:42:00 DEBUG   pyarrow-sender: spawner  spawned node with pid 12848
02:42:01 INFO    pyarrow-assert: daemon  node is ready
02:42:01 INFO    pyarrow-sender: daemon  node is ready
02:42:01 INFO    daemon  all nodes are ready, starting dataflow
02:42:01 INFO    dora-echo: opentelemetry  Global meter provider is set. Meters can now be created using global::meter() or global::meter_with_scope().
02:42:01 INFO    pyarrow-assert: opentelemetry  Global meter provider is set. Meters can now be created using global::meter() or global::meter_with_scope().
02:42:01 stdout  pyarrow-sender:
02:42:01 stdout  pyarrow-sender:
02:42:01 DEBUG   pyarrow-sender: daemon  handling node stop with exit status Success (restart: false)
02:42:01 INFO    pyarrow-sender: daemon  pyarrow-sender finished successfully
02:42:01 stdout  pyarrow-assert:  Traceback (most recent call last):
02:42:01 stdout  dora-echo:
02:42:01 stdout  pyarrow-assert:    File "<frozen runpy>", line 198, in _run_module_as_main
02:42:01 stdout  dora-echo:
02:42:01 DEBUG   dora-echo: daemon  handling node stop with exit status Success (restart: false)
02:42:01 INFO    dora-echo: daemon  dora-echo finished successfully
02:42:01 stdout  pyarrow-assert:    File "<frozen runpy>", line 88, in _run_code
02:42:01 stdout  pyarrow-assert:    File "E:\projects\Dora\dora-examples\examples\echo\.venv\Scripts\pyarrow-assert.exe\__main__.py", line 10, in <module>
02:42:01 stdout  pyarrow-assert:    File "E:\projects\Dora\dora-examples\examples\echo\.venv\Lib\site-packages\pyarrow_assert\main.py", line 52, in main
02:42:01 stdout  pyarrow-assert:      assert value == data, f"Expected {data}, got {value}"
02:42:01 stdout  pyarrow-assert:             ^^^^^^^^^^^^^
02:42:01 stdout  pyarrow-assert:  AssertionError: Expected [
02:42:01 stdout  pyarrow-assert:    1,
02:42:01 stdout  pyarrow-assert:    2,
02:42:01 stdout  pyarrow-assert:    3,
02:42:01 stdout  pyarrow-assert:    4,
02:42:01 stdout  pyarrow-assert:    5
02:42:01 stdout  pyarrow-assert:
02:42:01 stdout  pyarrow-assert:  ], got [
02:42:01 stdout  pyarrow-assert:    1,
02:42:01 stdout  pyarrow-assert:    2,
02:42:01 stdout  pyarrow-assert:    3,
02:42:01 stdout  pyarrow-assert:    4,
02:42:01 stdout  pyarrow-assert:    0
02:42:01 stdout  pyarrow-assert:  ]
02:42:01 stdout  pyarrow-assert:
02:42:01 DEBUG   pyarrow-assert: daemon  handling node stop with exit status ExitCode(1) (restart: false)
2026-01-12T18:42:01.574980Z  INFO run_inner: dora_daemon: exiting daemon because all required dataflows are finished self.daemon_id=DaemonId { machine_id: None, uuid: 99c7e046-b3df-4954-aae8-69a8bcf4dfd1 }
02:42:01 ERROR   pyarrow-assert: daemon  exited with code 1 with stderr output:
---------------------------------------------------------------------------------
Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "E:\projects\Dora\dora-examples\examples\echo\.venv\Scripts\pyarrow-assert.exe\__main__.py", line 10, in <module>
  File "E:\projects\Dora\dora-examples\examples\echo\.venv\Lib\site-packages\pyarrow_assert\main.py", line 52, in main
    assert value == data, f"Expected {data}, got {value}"
           ^^^^^^^^^^^^^
AssertionError: Expected [
  1,
  2,
  3,
  4,
  5
], got [
  1,
  2,
  3,
  4,
  0
]
---------------------------------------------------------------------------------

2026-01-12T18:42:01.575162Z  INFO run_inner: zenoh::api::session: close session zid=8aae42e2236f709b07e9eb1a86b8ee90 self.daemon_id=DaemonId { machine_id: None, uuid: 99c7e046-b3df-4954-aae8-69a8bcf4dfd1 }
02:42:01 INFO    daemon  dataflow finished on machine `99c7e046-b3df-4954-aae8-69a8bcf4dfd1`


[ERROR]
Dataflow failed:

Node `pyarrow-assert` failed: exited with code 1 with stderr output:
---------------------------------------------------------------------------------
Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "E:\projects\Dora\dora-examples\examples\echo\.venv\Scripts\pyarrow-assert.exe\__main__.py", line 10, in <module>
  File "E:\projects\Dora\dora-examples\examples\echo\.venv\Lib\site-packages\pyarrow_assert\main.py", line 52, in main
    assert value == data, f"Expected {data}, got {value}"
           ^^^^^^^^^^^^^
AssertionError: Expected [
  1,
  2,
  3,
  4,
  5
], got [
  1,
  2,
  3,
  4,
  0
]
---------------------------------------------------------------------------------



Location:
    binaries\cli\src\common.rs:33:17
```

## 坑1 - uv 和 conda 混用

如果你的环境中还包含conda/miniconda之类的工具，最好卸载或者禁用自动激活。

禁用自动激活执行：`conda config --set auto_activate_base false` 。

关闭所有Powershell，再启动。

验证：

当激活uv管理的环境时，查看python/pip的位置：

```bash
PS E:\projects\Dora\dora\examples\echo> .\.venv\Scripts\activate
(echo) PS E:\projects\Dora\dora\examples\echo> Get-Command pip

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     pip.exe                                            0.0.0.0    E:\projects\Dora\dora\examples\echo\.ven…

(echo) PS E:\projects\Dora\dora\examples\echo> Get-Command python

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     python.exe                                         3.11.1415… E:\projects\Dora\dora\examples\echo\.ven…

(echo) PS E:\projects\Dora\dora\examples\echo> python -m pip -V
pip 25.3 from E:\projects\Dora\dora\examples\echo\.venv\Lib\site-packages\pip (python 3.11)
(echo) PS E:\projects\Dora\dora\examples\echo>
```

可以发现，他们指向的都是虚拟环境所在的位置，这种情况符合预期，如果不一样，需要排查，解决环境问题。

## 坑2 - uv 环境和 pip install

`dora run --uv` 

`--uv` 标志的作用

当你执行 `dora build dataflow.yml --uv` 时，`dora` 会识别到你想使用 `uv` 作为包管理器。

- `dora` 会在当前目录下寻找 `.venv` 文件夹。
- 它会自动设置环境变量（如 `VIRTUAL_ENV`），确保所有的 `build` 指令都在该虚拟环境下执行。

当 `dora build` 运行时，它会执行这个 `build` 字符串。因为你加了 `--uv`，这个 `pip` 实际上等同于调用 `.venv/bin/pip` (Linux/macOS) 或 `.venv\Scripts\pip` (Windows)。


> 💡 可编辑模式 -e
> 在 Python 中，通常你安装一个包时，`pip` 会把代码 复制 到 `.venv/lib/site-packages` 目录下。如果你修改了源代码，安装好的包不会发生变化。
>
> 可编辑模式 (`pip install -e .`) 的区别在于：
>
> 1. 它不会复制文件，而是在 `site-packages` 中创建一个 符号链接（Link） 或一个特殊的 `.pth` 文件，指向你开发目录的代码。
> 2. 实时生效：当你修改了 `../../node-hub/pyarrow-sender` 里的 `.py` 文件，你不需要重新运行 `pip install` 或 `dora build`。下次 `dora run` 时，它直接加载的就是你修改后的代码。
>
> 这种方式非常适合用于开发调试阶段，避免了反复构建和安装的麻烦。