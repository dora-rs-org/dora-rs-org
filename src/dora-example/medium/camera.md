# 相机示例

本示例展示如何使用 dora-rs 捕获摄像头画面并显示。

## 概述

数据流定义了一个简单的图，包含两个节点：

- **camera**: 使用 `opencv-video-capture` 从摄像头捕获画面
- **plot**: 使用 `opencv-plot` 在窗口中显示捕获的画面

## 开始使用

确保已安装 `dora`。

```bash
pip install dora-rs
```

### 构建和运行

```bash
cd examples/camera
dora build dataflow.yml
dora up
dora start dataflow.yml
```

## 数据流配置

```yaml
nodes:
  - id: camera
    build: pip install opencv-video-capture
    path: opencv-video-capture
    inputs:
      tick: dora/timer/millis/20
    outputs:
      - image
    env:
      CAPTURE_PATH: 0
      IMAGE_WIDTH: 640
      IMAGE_HEIGHT: 480

  - id: plot
    build: pip install opencv-plot
    path: opencv-plot
    inputs:
      image:
        source: camera/image
        queue_size: 1
```

## 配置选项

可以通过环境变量配置相机节点：

- `CAPTURE_PATH`: 相机设备索引（默认: `0`）
- `IMAGE_WIDTH`: 输出图像宽度（默认: `640`）
- `IMAGE_HEIGHT`: 输出图像高度（默认: `480`）

## Jupyter Notebook 变体

提供了 Jupyter notebook 变体，包含 `dataflow_jupyter.yml` 和 `notebook.ipynb`。

```bash
dora build dataflow_jupyter.yml
dora up
dora start dataflow_jupyter.yml
# 然后在 Jupyter 中打开 notebook.ipynb
```

## 源码

完整源码请参考：[dora-examples/camera](https://gitcode.com/dora-org/dora-examples/tree/main/examples/camera)
