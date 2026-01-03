# 可视化


[Rerun](https://rerun.io)为多种物理AI数据提供了非常优秀的可视化方案，
本例中用`dora-rerun`节点可视化`opencv-video-capture`节点采集到的图像。

## 概述

[`dataflow.yml`](https://github.com/dora-rs/dora-examples/blob/main/examples/rerun-viewer/dataflow.yml) 定义了一个简单的数据流图，包含两个节点：

- **camera**: 使用 `opencv-video-capture` 从摄像头捕获视频帧
- **rerun**: 使用 `dora-rerun` 在 Rerun 可视化工具中显示捕获的帧

## 开始使用

确保已安装 `dora`：

```bash
pip install dora-rs
```

## 构建和运行

```bash
cd examples/rerun-viewer
dora build dataflow.yml
dora up
dora start dataflow.yml
```

## 配置

可以通过 `dataflow.yml` 中的环境变量配置 camera 节点：

- `CAPTURE_PATH`: 相机设备索引（默认：`0`）
- `IMAGE_WIDTH`: 输出图像宽度（默认：`640`）
- `IMAGE_HEIGHT`: 输出图像高度（默认：`480`）
- `ENCODING`: 图像编码格式（默认：`rgb8`）

## 源码

完整源码请参考：[dora-examples/rerun-viewer](https://github.com/dora-rs/dora-examples/tree/main/examples/rerun-viewer)
