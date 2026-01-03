# Franka Panda 机械臂驱动

用于控制 Franka Panda 机械臂的 DORA-RS 驱动节点。此驱动使用 PyBullet 进行仿真，并通过 DORA 数据流接受目标关节角度和笛卡尔位姿。

## 功能特性

- Franka Panda 机器人 7 自由度关节控制
- 带逆运动学的笛卡尔位姿控制
- 夹爪控制（开/关）
- PyBullet 物理仿真（可选 GUI）
- 兼容真实 Franka 机器人（需要 libfranka）

## 先决条件

### 1. 安装 DORA-RS

安装 DORA CLI：

```bash
cargo install dora-cli

# 检查版本
dora --version
```

### 2. 安装 Python 依赖

**重要**：dora-rs Python 包版本必须与 dora-cli 版本完全匹配。

```bash
pip install -r requirements.txt

# 验证版本匹配
dora --version        # 检查 CLI 版本
pip show dora-rs      # 应与 CLI 版本匹配
```

## 项目结构

```
franka/
├── franka_driver_node.py   # 主 DORA 驱动节点（PyBullet 仿真）
├── goal_publisher_node.py  # 测试用目标发布器示例
├── dataflow.yml            # DORA 数据流配置
├── requirements.txt        # Python 依赖
└── README.md
```

## 使用方法

### 快速开始

1. 运行 DORA 数据流：

```bash
dora up
dora start dataflow.yml
```

![Franka Panda 仿真](./franka/franka.gif)

2. 监控日志：

```bash
dora logs franka_driver
```

3. 停止数据流：

```bash
dora stop
dora destroy
```

### 使用 GUI 运行

在 dataflow.yml 中设置 `FRANKA_GUI: "true"` 以查看 PyBullet 可视化：

```yaml
env:
  FRANKA_GUI: "true"
```

## 节点接口

### 输入

| 输入 ID | 格式 | 描述 |
|----------|--------|-------------|
| `target_joints` | JSON | 目标关节角度（7 个值），单位：弧度 |
| `target_pose` | JSON | 目标笛卡尔位姿 |
| `command` | String | 控制命令 |
| `gripper` | String/Float | 夹爪命令 |

#### target_joints 格式

简单数组：
```json
[0.0, -0.785, 0.0, -2.356, 0.0, 1.571, 0.785]
```

带参数：
```json
{
  "joints": [0.0, -0.785, 0.0, -2.356, 0.0, 1.571, 0.785],
  "velocity": 0.3,
  "wait": true
}
```

#### target_pose 格式

```json
{
  "x": 0.4,
  "y": 0.0,
  "z": 0.5,
  "rx": 3.14,
  "ry": 0.0,
  "rz": 0.0
}
```

#### 命令

| 命令 | 描述 |
|---------|-------------|
| `start` | 连接到仿真 |
| `stop` | 断开仿真连接 |
| `home` | 移动到初始位置 |
| `get_joints` | 获取当前关节位置 |
| `get_pose` | 获取当前末端执行器位姿 |

#### 夹爪命令

| 命令 | 描述 |
|---------|-------------|
| `open` | 打开夹爪（0.04m 宽度） |
| `close` | 关闭夹爪（0.0m 宽度） |
| `0.0-0.04` | 设置特定手指宽度 |

### 输出

| 输出 ID | 格式 | 描述 |
|-----------|--------|-------------|
| `current_joints` | JSON 数组 | 当前 7 个关节位置，单位：弧度 |
| `current_pose` | JSON 对象 | 当前末端执行器位姿 |
| `status` | String | `idle`、`moving`、`completed`、`error`、`stopped` |
| `error` | JSON | 状态为 `error` 时的错误详情 |

## 配置

### 环境变量

在 `dataflow.yml` 中设置或在运行前导出：

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FRANKA_SIMULATION` | `true` | 使用 PyBullet 仿真 |
| `FRANKA_GUI` | `false` | 显示 PyBullet GUI |
| `FRANKA_TIME_STEP` | `0.001` | 仿真时间步长 |
| `FRANKA_MAX_VELOCITY` | `0.5` | 最大关节速度（rad/s） |
| `FRANKA_MAX_FORCE` | `240.0` | 最大关节力（N） |

## Franka Panda 规格

### 关节限位（弧度）

| 关节 | 下限 | 上限 |
|-------|-------------|-------------|
| J1 | -2.8973 | 2.8973 |
| J2 | -1.7628 | 1.7628 |
| J3 | -2.8973 | 2.8973 |
| J4 | -3.0718 | -0.0698 |
| J5 | -2.8973 | 2.8973 |
| J6 | -0.0175 | 3.7525 |
| J7 | -2.8973 | 2.8973 |

### 初始位置

```python
home_position = [0.0, -0.785, 0.0, -2.356, 0.0, 1.571, 0.785]
```

## 集成示例

### 与运动规划器集成

```yaml
nodes:
  - id: motion_planner
    path: your_planner.py
    inputs:
      goal: user_input/goal
    outputs:
      - joints

  - id: franka_driver
    path: franka_driver_node.py
    inputs:
      target_joints: motion_planner/joints
    outputs:
      - current_joints
      - status
```

### 与视觉系统集成

```yaml
nodes:
  - id: camera
    path: camera_node.py
    outputs:
      - image

  - id: vision
    path: vision_node.py
    inputs:
      image: camera/image
    outputs:
      - target_pose

  - id: franka_driver
    path: franka_driver_node.py
    inputs:
      target_pose: vision/target_pose
    outputs:
      - status
```

## 故障排除

### PyBullet 无法启动

1. 确保已安装 pybullet：
   ```bash
   pip install pybullet
   ```

2. 检查显示问题（GUI 模式）：
   ```bash
   export DISPLAY=:0  # Linux
   ```

### DORA 无法启动

1. 确保 DORA 守护进程正在运行：
   ```bash
   dora up
   ```

2. 检查数据流语法：
   ```bash
   dora check dataflow.yml
   ```

### 节点初始化错误

如果看到 `RuntimeError: Could not initiate node from environment variable`：

1. **版本不匹配** - dora-rs Python 包版本必须与 dora-cli 匹配：
   ```bash
   # 检查版本
   dora --version
   pip show dora-rs

   # 安装匹配版本修复
   pip install dora-rs==<version>  # 匹配您的 CLI 版本
   ```

2. **修复后重启 DORA 守护进程**：
   ```bash
   dora destroy
   dora up
   dora start dataflow.yml
   ```

## 真实机器人支持

对于真实 Franka Panda 机器人支持，您需要：
- 安装 libfranka
- Franka 控制接口（FCI）访问权限
- 实时内核（推荐）

将 PyBullet 调用替换为 libfranka 调用以控制真实机器人。

## 源码

完整源码请参考：[dora-examples/franka](https://gitcode.com/dora-org/dora-examples/tree/main/examples/franka)
