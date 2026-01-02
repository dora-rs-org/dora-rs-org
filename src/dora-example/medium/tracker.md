# 物体追踪

> 地址：./examples/tracker/
> 关键词：AI，物体追踪，CoTracker

## 概述

此数据流使用 Facebook 的 CoTracker 创建实时物体追踪流水线：

```
相机 -> 物体检测 -> CoTracker -> Rerun (显示)
```

流水线从相机捕获视频，使用 YOLO 检测物体，使用 CoTracker 在帧之间追踪检测到的物体，并在 Rerun 查看器中显示结果。

## 节点

- **opencv-video-capture**：从相机捕获视频
- **dora-yolo**：使用 YOLOv8 进行物体检测
- **dora-cotracker**：使用 Facebook CoTracker3 进行点追踪
- **dora-rerun**：在 Rerun 查看器中可视化追踪结果

## 先决条件

- Python 3.10+
- dora-rs
- 相机（摄像头）
- 推荐 GPU（CUDA、MPS 或 CPU 回退）

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 或安装 Python 包（必须与 CLI 版本匹配）
pip install dora-rs
```

### 2. 构建和运行

```bash
cd examples/tracker

# 构建数据流
dora build facebook_cotracker.yml

# 运行数据流
dora run facebook_cotracker.yml
```

### 3. 查看结果

```bash
# 连接到 Rerun 查看器
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

## 配置

### CoTracker 节点配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `DEVICE` | 推理设备 (cuda/mps/cpu) | 自动检测 |
| `COTRACKER_WINDOW_SIZE` | 追踪帧缓冲区大小 | `16` |
| `INTERACTIVE_MODE` | 启用交互模式 | `false` |
| `COTRACKER_CHECKPOINT` | 自定义模型检查点路径 | `None` |

### 相机节点配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CAPTURE_PATH` | 相机设备索引或视频路径 | `0` |
| `IMAGE_WIDTH` | 捕获宽度 | `640` |
| `IMAGE_HEIGHT` | 捕获高度 | `480` |
| `ENCODING` | 图像编码 (rgb8/bgr8) | `rgb8` |

## 数据流变体

- `facebook_cotracker.yml`：使用 YOLO 进行物体检测 + CoTracker 进行追踪
- `qwenvl_cotracker.yml`：使用 Qwen2.5-VL（视觉语言模型）进行检测 + CoTracker 进行追踪

## 架构

### YOLO + CoTracker 流水线

```
+--------+     +------+     +-----------+     +--------+
|  相机  | --> | YOLO | --> | CoTracker | --> | Rerun  |
+--------+     +------+     +-----------+     +--------+
     |                            ^
     |____________________________|
              (图像流)
```

### VLM + CoTracker 流水线

```
+--------+     +---------+     +------------+     +-----------+     +--------+
|  相机  | --> | Qwen-VL | --> | parse_bbox | --> | CoTracker | --> | Rerun  |
+--------+     +---------+     +------------+     +-----------+     +--------+
     |                                                   ^
     |___________________________________________________|
                        (图像流)
```

## 工作原理

1. **物体检测**：YOLO（或 VLM）检测每帧中的物体并输出边界框
2. **点生成**：CoTracker 将边界框转换为追踪点（每个框 5 个点）
3. **点追踪**：CoTracker 使用深度学习在连续帧之间追踪这些点
4. **可视化**：追踪点绘制在帧上并在 Rerun 中显示

## 故障排除

### 相机问题
- 检查系统相机权限
- 验证 `CAPTURE_PATH` 中的相机设备索引是否正确
- 首先在其他应用程序中测试相机

### 模型下载缓慢
- 首次运行需要下载 CoTracker 和 YOLO 模型，可能需要一些时间
- 确保网络连接稳定
- 模型在首次下载后会被缓存

### GPU 内存问题
- 减小 `IMAGE_WIDTH` 和 `IMAGE_HEIGHT` 以降低内存使用
- 设置 `DEVICE=cpu` 使用 CPU（较慢但内存占用较少）
- 减小 `COTRACKER_WINDOW_SIZE` 以减少帧缓冲

### Rerun 版本不匹配
- 如果看到版本警告，请安装匹配的 Rerun SDK：
  ```bash
  pip install rerun-sdk==<version>
  ```

## 源码

完整源码请参考：[dora-examples/tracker](https://github.com/dora-rs/dora-examples/tree/main/examples/tracker)

- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture)
- [dora-yolo](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-yolo)
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun)
- [CoTracker (Facebook Research)](https://github.com/facebookresearch/co-tracker)
