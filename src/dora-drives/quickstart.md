# 快速开始

只需以下几个命令，您就可以运行一个完整循环的自动驾驶车辆：

## 启动 CARLA 模拟器

```bash
# 拉取 CARLA Docker 镜像
docker pull carlasim/carla:0.9.13

# 启动 CARLA 模拟器
docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.13 /bin/bash ./CarlaUE4.sh -carla-server -world-port=2000 -RenderOffScreen
```

## 启动 dora 数据流

```bash
# 启动 dora 守护进程和协调器
dora up

# 启动 dora 数据流
dora start graphs/oasis/oasis_full.yaml --attach
```

## 循序渐进教程

如需获取循序渐进的教程，请参见：https://dora-rs.ai/docs/guides/dora-drives/carla

## 完整文档

完整文档请访问：https://dora-rs.ai/docs/guides/dora-drives

## 源代码

- [GitCode 仓库](https://gitcode.com/dora-rs/dora-drives)
