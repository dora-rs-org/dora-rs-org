# 数据流


官方的Node Hub文件夹中提供了许多现成的节点
本例中用到的有
- `opencv-video-capture`用于读取摄像头
- `dora-yolo`用于进行目标检测
- `dora-rerun`用于进行可视化

`dataflow.yml`除了用于描述输入输出外，还可以通过`build`字段进行简单的构建或安装

## 准备Python环境
```bash
$ uv venv -p 3.10 --seed
```
## 安装对应的包
当在`dora build`时加上`--uv`标签，会自动在使用`pip`前添加`uv`以使用`uv`管理的Python版本
```bash
$ dora build dataflow.yml --uv
```
## 运行
```bash
$ dora run dataflow.yml --uv
```

默认的视图中可能只包含照片项，在弹出的`rerun`窗口中右键时间轴上的`/`项，点击添加到新的视图中

<p style="text-align:center"><img src="../../images/python-dataflow.png" alt="运行效果" width="75%"></p>

### 动态节点
```bash
$ dora build dataflow_dynamic.yml --uv # 安装所需要的节点
$ dora up # 启动本地的 daemon 和 coordinator
$ dora start dataflow_dynamic.yml --uv
```
在另外一个中端窗口运行
```bash
$ uv run opencv-plot --name plot
```

## 源码

完整源码请参考：[dora-examples/python-dataflow](https://gitcode.com/dora-org/dora-examples/tree/main/examples/python-dataflow)
