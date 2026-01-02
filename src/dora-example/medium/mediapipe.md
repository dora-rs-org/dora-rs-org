# MediaPipe 姿态识别

本示例演示使用 [MediaPipe](https://developers.google.com/mediapipe) 和 dora-rs 进行人体姿态检测，并通过 [Rerun](https://rerun.io/) 进行可视化。

> 源代码：[mediapipe](https://github.com/dora-rs/dora-examples/tree/main/examples/mediapipe)

## 概述

该数据流从摄像头捕获画面，使用 MediaPipe 检测人体姿态关键点，并在 Rerun 中可视化结果。

```
camera -> dora-mediapipe (姿态检测) -> rerun (显示)
```

### 节点

- **camera**：使用 `opencv-video-capture` 从摄像头捕获画面
- **dora-mediapipe**：处理画面以检测人体姿态关键点
- **plot**：使用 `dora-rerun` 可视化摄像头画面和检测到的姿态点

## 前置条件

- 连接到电脑的摄像头
- Python 3.8+
- dora-rs

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

### 2. 构建并运行

```bash
cd examples/mediapipe

# 构建数据流
dora build dataflow.yml

# 启动 dora 守护进程
dora up

# 启动数据流
dora start dataflow.yml
```

### 3. 查看输出

连接 Rerun 查看器以查看带有姿态关键点的视频流：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

如果默认未显示姿态点，请尝试在 Rerun 界面中添加 2D 查看器。

### 4. 停止数据流

```bash
dora stop
```

## 演示

![演示视频](https://github.com/user-attachments/assets/8cabeb13-b9a7-480f-b526-7889304d7228)

## 配置

### 相机节点

通过 `dataflow.yml` 中的环境变量进行配置：

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CAPTURE_PATH` | 相机设备索引 | `0` |
| `IMAGE_WIDTH` | 输出图像宽度 | `640` |
| `IMAGE_HEIGHT` | 输出图像高度 | `480` |
| `ENCODING` | 图像编码格式 | `rgb8` |

## 输出

`dora-mediapipe` 节点输出：

- **points2d**：每帧检测到的 2D 姿态关键点坐标

## RealSense 变体

提供 RealSense 深度相机变体用于 3D 姿态估计。详情请参阅 [dora-hub](https://github.com/dora-rs/dora-hub/tree/main/examples/mediapipe) 中的原始示例。

## 架构

```
+--------+     +----------------+     +------+
| camera | --> | dora-mediapipe | --> | plot |
+--------+     +----------------+     +------+
```

## 源代码

- [dora-mediapipe](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-mediapipe) - MediaPipe 姿态检测节点
- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture) - 相机捕获节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun 可视化节点
