# 使用相机

> 地址：./examples/camera/
> 关键词：OpenCV, 相机

# UV 环境，安装Python Dora Node
```bash
$ dora build dataflow.yml --uv
```

# 运行
```bash
$ dora run dataflow.yml --uv
```

# 相关 Node
```yaml
nodes:
  - id: camera
    build: pip install -e ../../node-hub/opencv-video-capture
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
    build: pip install -e ../../node-hub/opencv-plot
    path: opencv-plot
    inputs:
      image:
        source: camera/image
        queue_size: 1
```
## opencv-video-capture
该节点通过OpenCV获取图像，并通过`image` id发布出来
可配置参数：
- CAPTURE_PATH: 相机OpenCV API中的地址
- IMAGE_WIDTH: 图像宽度
- IMAGE_HEIGHT: 图像高度
## opencv-plot
将`inputs`中的`image` id配置为图像源的位置
