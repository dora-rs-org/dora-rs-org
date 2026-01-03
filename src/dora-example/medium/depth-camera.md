# 深度相机


本示例演示如何从深度相机捕获RGB图像和深度数据，并在[Rerun](https://rerun.io/)中进行可视化。

## 概述

数据流从深度相机（Intel RealSense或iOS LiDAR）捕获帧，输出RGB图像和深度数据，并在Rerun查看器中显示。

```
depth_camera -> rerun (显示 RGB + 深度)
```

### 支持的设备

- **Intel RealSense**：D400系列深度相机（D415、D435、D455等）
- **iOS LiDAR**：带有LiDAR扫描仪的iPhone Pro / iPad Pro

### 节点

- **camera**：从深度相机捕获RGB图像和深度数据
  - Intel RealSense使用`dora-pyrealsense`
  - iOS设备使用`dora-ios-lidar`
- **plot**：使用`dora-rerun`在Rerun查看器中可视化RGB图像和深度数据

## 前置条件

- Python 3.8+
- 以下深度相机之一：
  - Intel RealSense D400系列相机
  - 带有LiDAR的iPhone Pro / iPad Pro

### Intel RealSense

- 安装[librealsense2](https://github.com/IntelRealSense/librealsense) SDK

### iOS LiDAR

- 带有LiDAR的iOS设备（iPhone 12 Pro或更新版本，iPad Pro 2020或更新版本）
- 在iOS设备上安装[Record3D](https://record3d.app/)应用

## 开始使用

### 1. 安装dora

```bash
# 安装dora CLI
cargo install dora-cli

# 安装Python包（必须与CLI版本匹配）
pip install dora-rs
```

**重要**：确保`dora` CLI版本与`dora-rs` Python包版本匹配：

```bash
dora --version      # 检查CLI版本
pip show dora-rs    # 检查Python包版本
```

### 2. 运行数据流

#### Intel RealSense

```bash
cd examples/depth_camera

# 启动dora守护进程
dora up

# 构建并启动数据流
dora build realsense.yaml
dora start realsense.yaml
```

#### iOS LiDAR

1. 在iOS设备上打开Record3D应用
2. 在Record3D设置中启用USB流模式
3. 通过USB连接iOS设备

```bash
cd examples/depth_camera

# 启动dora守护进程
dora up

# 构建并启动数据流
dora build ios.yaml
dora start ios.yaml
```

### 3. 查看输出

连接Rerun查看器以查看RGB和深度流：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

### 4. 停止数据流

```bash
dora stop
```

## 配置

### iOS LiDAR节点

通过`ios.yaml`或`ios-dev.yaml`中的环境变量进行配置：

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `IMAGE_WIDTH` | 输出图像宽度 | `640` |
| `IMAGE_HEIGHT` | 输出图像高度 | `480` |

## 数据流变体

本示例包含多个数据流配置：

- **realsense.yaml**：Intel RealSense相机（生产环境）
- **realsense-dev.yaml**：Intel RealSense相机（开发环境，可编辑安装）
- **ios.yaml**：iOS LiDAR相机（生产环境）
- **ios-dev.yaml**：iOS LiDAR相机（开发环境，可编辑安装）

## 故障排除

### Intel RealSense未检测到

- 确保已安装librealsense2 SDK
- 检查USB连接（使用USB 3.0端口以获得最佳性能）
- 如果权限被拒绝，尝试使用sudo运行：使用包含sudo的`realsense-dev.yaml`

### iOS设备未检测到

- 确保Record3D应用正在运行且USB流已启用
- 检查iOS设备与计算机之间的USB连接
- 在出现提示时信任计算机

### 版本不匹配错误

如果看到类似`invalid type: map, expected a YAML tag starting with '!'`的错误：

```bash
# 检查版本是否匹配
dora --version
pip show dora-rs

# 如需升级
cargo install dora-cli --version X.Y.Z
pip install dora-rs==X.Y.Z
```

## 架构

```
+---------------+     +------+
| depth_camera  | --> | plot |
| (image+depth) |     +------+
+---------------+
```

## 源码

完整源码请参考：[dora-examples/depth_camera](https://gitcode.com/dora-org/dora-examples/tree/main/examples/depth_camera)

- [dora-pyrealsense](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-pyrealsense) - Intel RealSense相机节点
- [dora-ios-lidar](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-ios-lidar) - iOS LiDAR相机节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun可视化节点
