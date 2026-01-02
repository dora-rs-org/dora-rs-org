# 可视化

> 地址：./examples/rerun-viewer/
> 关键词：数据可视化

[rerun](https://rerun.io)为多种物理AI数据提供了非常优秀的可视化方案，
本例中用`dora-rerun`节点可视化`opencv-video-capture`节点采集到的图像。

# UV 环境，安装Python Dora Node
```bash
$ dora build dataflow.yml --uv
```

# 运行
```bash
$ dora run dataflow.yml --uv
```

## 源码

完整源码请参考：[dora-examples/rerun-viewer](https://github.com/dora-rs/dora-examples/tree/main/examples/rerun-viewer)
