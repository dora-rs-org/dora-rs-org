# AV1 编码示例

本示例演示使用 [rav1e](https://github.com/xiph/rav1e)（编码器）和 [dav1d](https://code.videolan.org/videolan/dav1d)（解码器）进行实时 AV1 视频编码和解码，并通过 [Rerun](https://rerun.io/) 进行可视化。

> 源代码：[av1-encoding](https://gitcode.com/dora-org/dora-examples/tree/main/examples/av1-encoding)

## 概述

该数据流捕获摄像头画面，使用 AV1 编码，解码后再次编码，再解码，最后显示结果。这模拟了一个往返编码管道，用于测试视频压缩质量。

```
camera -> rav1e (编码) -> dav1d (解码) -> rav1e (编码) -> dav1d (解码) -> rerun (显示)
```

### 节点

- **camera**：使用 `opencv-video-capture` 从摄像头捕获画面
- **rav1e-local**：使用 `dora-rav1e` 将画面编码为 AV1 格式
- **dav1d-remote**：使用 `dora-dav1d` 解码 AV1 画面
- **rav1e-remote**：对解码后的画面重新编码为 AV1
- **dav1d-local**：最终解码 AV1 画面
- **plot**：使用 `dora-rerun` 在 Rerun 查看器中可视化解码后的画面

## 前置条件

- Rust 工具链（用于构建 rav1e/dav1d 节点）
- Python 3.8+
- 摄像头

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 安装 Python 包（版本必须与 CLI 匹配）
pip install dora-rs
```

**重要**：确保 `dora` CLI 版本与 `dora-rs` Python 包版本匹配：

```bash
dora --version      # 检查 CLI 版本
pip show dora-rs    # 检查 Python 包版本
```

### 2. 克隆 dora-hub（获取节点源码）

```bash
git clone https://github.com/dora-rs/dora-hub.git
cd dora-hub
```

### 3. 构建节点

```bash
# 构建 AV1 编码器/解码器节点
cargo build -p dora-rav1e --release
cargo build -p dora-dav1d --release

# 安装 Python 节点
pip install -e node-hub/opencv-video-capture
pip install -e node-hub/dora-rerun
```

### 4. 运行数据流

```bash
cd examples/av1-encoding

# 启动 dora 守护进程
dora up

# 构建并启动数据流
dora build dataflow.yml
dora start dataflow.yml
```

### 5. 查看输出

连接 Rerun 查看器以查看视频流：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

### 6. 停止数据流

```bash
dora stop
```

## 配置

### 相机节点

通过 `dataflow.yml` 中的环境变量进行配置：

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CAPTURE_PATH` | 相机设备索引 | `0` |
| `IMAGE_WIDTH` | 输出图像宽度 | `1280` |
| `IMAGE_HEIGHT` | 输出图像高度 | `720` |

### AV1 编码器 (rav1e)

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `RAV1E_SPEED` | 编码速度预设（0-10，越高越快） | `10` |

## 数据流变体

本示例包含多种数据流配置：

- **dataflow.yml**：本地机器版本（单机，推荐）
- **dataflow_distributed.yml**：分布式部署版本（需要在 `encoder` 和 `decoder` 机器上运行 dora 守护进程）
- **dataflow_reachy.yml**：Reachy 机器人深度相机配置

## 故障排除

### 版本不匹配错误

如果出现类似 `invalid type: map, expected a YAML tag starting with '!'` 的错误：

```bash
# 检查版本是否匹配
dora --version
pip show dora-rs

# 如需升级
cargo install dora-cli --version X.Y.Z
pip install dora-rs==X.Y.Z
```

### 节点未找到错误

如果节点启动失败并显示 "No such file or directory"：

1. 确保已构建 Rust 节点：`cargo build -p dora-rav1e -p dora-dav1d --release`
2. 检查 dataflow.yml 中的 `path` 是否指向正确的二进制文件位置

### 相机无法工作

- 在 macOS 上检查相机权限：系统偏好设置 > 隐私与安全性 > 相机
- 尝试不同的 `CAPTURE_PATH` 值（0、1、2...）

## 架构

```
+--------+     +-------------+     +-------------+
| camera | --> | rav1e-local | --> | dav1d-remote|
+--------+     +-------------+     +-------------+
                                          |
                                          v
+------+     +------------+     +--------------+
| plot | <-- | dav1d-local| <-- | rav1e-remote |
+------+     +------------+     +--------------+
```

## 源代码

- [dora-rav1e](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rav1e) - AV1 编码器节点
- [dora-dav1d](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-dav1d) - AV1 解码器节点
- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture) - 相机捕获节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun 可视化节点
