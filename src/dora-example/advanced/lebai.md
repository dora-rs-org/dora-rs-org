# Lebai

本文档介绍如何使用Dora控制Lebai机械臂。

Lebai客户端是一个实验性的Dora节点，用于与Lebai机械臂进行交互，支持运动控制、位姿录制和回放等功能。

## 功能特性

- 通过IP连接Lebai机械臂
- 笛卡尔坐标和关节坐标运动控制
- 录制和回放机械臂运动轨迹
- 保存和加载预定义位姿
- 夹爪控制

## 依赖

```
lebai_sdk
numpy
pyarrow
dora
```

## 配置

使用环境变量配置机械臂IP地址：

```bash
export LEBAI_IP="10.42.0.253"  # 默认值
```

## 命令

Lebai客户端支持以下命令：

| 命令 | 说明 |
|------|------|
| `claw` | 控制夹爪 |
| `movec` | 笛卡尔坐标运动 |
| `movej` | 关节运动 |
| `stop` | 停止运动 |
| `save` | 保存当前位姿 |
| `go_to` | 移动到保存的位姿 |
| `record` | 开始录制运动 |
| `play` | 回放录制的运动 |

## 数据流配置示例

```yaml
nodes:
  - id: lebai-client
    path: lebai-client
    inputs:
      command: keyboard/command
    outputs:
      - position
```

## 源码

完整源码请参考：[dora-lerobot/lebai-client](https://github.com/dora-rs/dora-lerobot/tree/main/node-hub/lebai-client)
