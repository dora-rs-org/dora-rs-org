# DORA-RS Lebai 机械臂驱动

用于控制Lebai LM3机械臂的DORA-RS驱动节点。该驱动通过DORA数据流接收目标关节角度和笛卡尔位姿，并据此控制机器人。

## 前置条件

### 1. Lebai L-Master Docker（仿真器）

启动Lebai仿真器：

```bash
docker run -d --name lebai-master \
  -p 80:80 \
  -p 5180:5180 \
  -p 5181:5181 \
  lebai/lmaster:latest
```

打开以下链接验证仿真器是否运行：http://localhost/dashboard


### 2. 安装Python依赖

**重要**：dora-rs Python包版本必须与dora-cli版本完全匹配。

```bash
pip install -r requirements.txt

# 验证版本是否匹配
dora --version        # 应显示 0.3.11
pip show dora-rs      # 应显示 0.3.11
```

## 项目结构

```
lebai/
├── lebai_driver_node.py   # 主DORA驱动节点
├── goal_publisher_node.py # 用于测试的目标发布节点示例
├── dataflow.yml           # DORA数据流配置
├── requirements.txt       # Python依赖
├── LM3_test.py           # 原始独立测试脚本
└── README.md
```

## 使用方法

### 快速开始

1. 启动Lebai仿真器（参见前置条件）

2. 运行DORA数据流：

```bash
dora up
dora start dataflow.yml
```
运行后，你应该能在仿真器中看到机械臂运动：

![Lebai仿真器界面](./lebai/lebai_simulator_dashboard.png)


3. 查看日志：

```bash
dora logs lebai_driver
```

4. 停止数据流：

```bash
dora stop
dora destroy
```

### 单独运行节点

用于开发/测试，可直接运行节点：

```bash
# 终端1：启动DORA守护进程
dora up

# 终端2：启动数据流
dora start dataflow.yml

# 或独立运行进行测试
python lebai_driver_node.py
```

## 节点接口

### 输入

| 输入ID | 格式 | 描述 |
|--------|------|------|
| `target_joints` | JSON | 目标关节角度（弧度） |
| `target_pose` | JSON | 目标笛卡尔位姿 |
| `command` | String | 控制命令 |

#### target_joints 格式

简单数组：
```json
[0.0, -1.0, 1.0, 0.0, 1.57, 0.0]
```

带参数：
```json
{
  "joints": [0.0, -1.0, 1.0, 0.0, 1.57, 0.0],
  "acceleration": 0.6,
  "velocity": 0.3,
  "wait": true
}
```

#### target_pose 格式

```json
{
  "x": 0.3,
  "y": 0.0,
  "z": 0.4,
  "rx": 3.14,
  "ry": 0.0,
  "rz": 0.0
}
```

#### 命令

| 命令 | 描述 |
|------|------|
| `start` | 连接/重新连接机器人 |
| `stop` | 断开机器人连接 |
| `home` | 移动到初始位置 |
| `get_joints` | 获取当前关节位置 |

### 输出

| 输出ID | 格式 | 描述 |
|--------|------|------|
| `current_joints` | JSON数组 | 当前关节位置（弧度） |
| `status` | String | `idle`、`moving`、`completed`、`error`、`stopped` |
| `error` | JSON | 状态为`error`时的错误详情 |

## 配置

### 环境变量

在`dataflow.yml`中设置或运行前导出：

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `LEBAI_IP` | `127.0.0.1` | 机器人/仿真器IP地址 |
| `LEBAI_SIMULATION` | `true` | 真实机器人设为`false` |
| `LEBAI_ACCELERATION` | `0.6` | 默认加速度（rad/s^2） |
| `LEBAI_VELOCITY` | `0.3` | 默认速度（rad/s） |

### 示例：真实机器人配置

```yaml
nodes:
  - id: lebai_driver
    path: lebai_driver_node.py
    inputs:
      target_joints: planner/joints
    outputs:
      - current_joints
      - status
      - error
    env:
      LEBAI_IP: "192.168.1.100"    # 你的机器人IP
      LEBAI_SIMULATION: "false"    # 真实机器人模式
      LEBAI_ACCELERATION: "0.4"    # 为安全起见降低速度
      LEBAI_VELOCITY: "0.2"
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

  - id: lebai_driver
    path: lebai_driver_node.py
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

  - id: lebai_driver
    path: lebai_driver_node.py
    inputs:
      target_pose: vision/target_pose
    outputs:
      - status
```

## 故障排除

### 连接失败

1. 检查仿真器/机器人是否运行：
   ```bash
   curl http://localhost/dashboard
   ```

2. 验证端口映射（Docker）：
   ```bash
   docker ps
   docker logs lebai-master
   ```

3. 检查环境变量中的IP地址

### 运动不执行

1. 在仪表板中检查机器人状态
2. 确保机器人已启用（调用了start_sys）
3. 检查输出中的错误：
   ```bash
   dora logs lebai_driver
   ```

### DORA无法启动

1. 确保DORA守护进程正在运行：
   ```bash
   dora up
   ```

2. 检查数据流语法：
   ```bash
   dora check dataflow.yml
   ```

### 节点初始化错误

如果看到`RuntimeError: Could not initiate node from environment variable`和`invalid type: map, expected a YAML tag starting with '!'`：

1. **版本不匹配** - dora-rs Python包版本必须与dora-cli匹配：
   ```bash
   # 检查版本
   dora --version
   pip show dora-rs

   # 安装匹配版本修复
   pip install dora-rs==0.3.11  # 匹配你的CLI版本
   ```

2. **修复后重启DORA守护进程**：
   ```bash
   dora destroy
   dora up
   dora start dataflow.yml
   ```

## 源码

完整源码请参考：[dora-examples/lebai](https://github.com/dora-rs/dora-examples/tree/main/examples/lebai)
