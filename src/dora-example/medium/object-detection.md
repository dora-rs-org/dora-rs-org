# 物体识别示例

本示例演示使用 [YOLO](https://docs.ultralytics.com/)（You Only Look Once）和 dora-rs 进行实时物体检测，并通过 [Rerun](https://rerun.io/) 进行可视化。

> 源代码：[object-detection](https://gitcode.com/dora-org/dora-examples/tree/main/examples/object-detection)

## 概述

该数据流从摄像头捕获画面，通过 YOLO 进行物体检测，并在 Rerun 中显示带有边界框的结果。

```
camera -> dora-yolo (物体检测) -> rerun (显示带边界框)
```

### 节点

- **camera**：使用 `opencv-video-capture` 从摄像头捕获画面
- **object-detection**：使用 `dora-yolo` (YOLOv8) 检测画面中的物体
- **plot**：使用 `dora-rerun` 可视化摄像头画面和边界框

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
cd examples/object-detection

# 构建数据流
dora build yolo.yml

# 启动 dora 守护进程
dora up

# 启动数据流
dora start yolo.yml
```

#### 使用 UV（推荐）

```bash
uv venv --seed -p 3.11
dora build yolo.yml --uv
dora run yolo.yml --uv
```

### 3. 查看输出

连接 Rerun 查看器以查看带有检测物体的视频流：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

### 4. 停止数据流

```bash
dora stop
```

## 配置

### 相机节点

通过 `yolo.yml` 中的环境变量进行配置：

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CAPTURE_PATH` | 相机设备索引 | `0` |
| `IMAGE_WIDTH` | 输出图像宽度 | `640` |
| `IMAGE_HEIGHT` | 输出图像高度 | `480` |

### YOLO 节点

`dora-yolo` 节点默认使用 YOLOv8。它可以检测 COCO 数据集中的 80 种常见物体类别，包括：
- 人、车辆（汽车、公交车、卡车、自行车、摩托车）
- 动物（狗、猫、鸟、马等）
- 常见物品（椅子、桌子、笔记本电脑、手机等）

## 输出

`dora-yolo` 节点输出：

- **bbox**：每帧检测到的物体的边界框坐标和类别标签

## 架构

```
+--------+     +------------------+     +------+
| camera | --> | object-detection | --> | plot |
+--------+     | (dora-yolo)      |     +------+
    |          +------------------+         ^
    |                                       |
    +---------------------------------------+
                  (image)
```

## 故障排除

### 模型下载

首次运行时，YOLO 会自动下载模型权重。根据网络连接情况，这可能需要一些时间。

### 相机无法工作

- 在 macOS 上检查相机权限：系统偏好设置 > 隐私与安全性 > 相机
- 尝试不同的 `CAPTURE_PATH` 值（0、1、2...）

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

## 源代码

- [dora-yolo](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-yolo) - YOLO 物体检测节点
- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture) - 相机捕获节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun 可视化节点
