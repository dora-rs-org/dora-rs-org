# UR5 机械臂驱动

用于通过 RTDE 协议控制 Universal Robots UR5 机械臂的 DORA-RS 驱动节点。此驱动通过 DORA 数据流接受目标关节角度和笛卡尔位姿，并相应地控制机器人。

## 功能特性

- 纯 Python RTDE 实现（无原生依赖）
- 支持 Apple Silicon（M1/M2/M3/M4）Mac
- 支持 URSim Docker 仿真器和真实 UR5 机器人
- 关节空间（moveJ）和笛卡尔空间（moveL）运动

## 先决条件

### 1. URSim Docker（仿真器）

启动 Universal Robots 仿真器（URSim）：

```bash
# Apple Silicon（M1/M2/M3/M4）- 需要 Rosetta
docker run -d --name ursim \
  -e ROBOT_MODEL=UR5 \
  -p 5900:5900 \
  -p 6080:6080 \
  -p 29999:29999 \
  -p 30001-30004:30001-30004 \
  --platform=linux/amd64 \
  universalrobots/ursim_e-series

# Intel Mac / Linux
docker run -d --name ursim \
  -e ROBOT_MODEL=UR5 \
  -p 5900:5900 \
  -p 6080:6080 \
  -p 29999:29999 \
  -p 30001-30004:30001-30004 \
  universalrobots/ursim_e-series
```

访问仿真器：
- VNC 查看器：`localhost:5900`（密码：`easybot`）
- 网页浏览器：`http://localhost:6080/vnc.html`

**重要**：启动 URSim 后，您必须通过 VNC 完成以下步骤：

1. **启动机器人**：点击红色电源按钮（左下角）-> 点击"ON" -> 点击"START"
2. **确认安全配置**（仅首次）：
   - 进入汉堡菜单（右上角）-> Settings -> System -> Safety
   - 点击底部的"Confirm Safety Configuration"
   - 接受默认配置
3. **验证机器人模式**：机器人应显示绿色的"RUNNING"

### 2. 安装 DORA-RS

安装 DORA CLI：

```bash
cargo install dora-cli

# 检查版本
dora --version
```

### 3. 安装 Python 依赖

**重要**：dora-rs Python 包版本必须与 dora-cli 版本完全匹配。

```bash
pip install -r requirements.txt

# 验证版本匹配
dora --version        # 检查 CLI 版本
pip show dora-rs      # 应与 CLI 版本匹配
```

## 项目结构

```
ur5/
├── ur5_driver_node.py     # 主 DORA 驱动节点（纯 Python RTDE）
├── goal_publisher_node.py # 测试用目标发布器示例
├── test_connection.py     # 连接测试脚本
├── dataflow.yml           # DORA 数据流配置
├── requirements.txt       # Python 依赖
└── README.md
```

## 使用方法

### 快速开始

1. 启动 URSim 仿真器（参见先决条件）

2. 通过 VNC 在 URSim 中启动机器人

3. 运行 DORA 数据流：

```bash
cd ur5
dora up
dora start dataflow.yml
```

4. 监控日志：

```bash
dora logs ur5_driver
```

5. 停止数据流：

```bash
dora stop
dora destroy
```

## 节点接口

### 输入

| 输入 ID | 格式 | 描述 |
|----------|--------|-------------|
| `target_joints` | JSON | 目标关节角度，单位：弧度 |
| `target_pose` | JSON | 目标笛卡尔位姿 |
| `command` | String | 控制命令 |

#### target_joints 格式

简单数组（6 个关节：基座、肩部、肘部、腕1、腕2、腕3）：
```json
[0.0, -1.5708, 1.5708, -1.5708, -1.5708, 0.0]
```

带参数：
```json
{
  "joints": [0.0, -1.5708, 1.5708, -1.5708, -1.5708, 0.0],
  "acceleration": 0.5,
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
|---------|-------------|
| `start` | 连接/重新连接到机器人 |
| `stop` | 停止运动并断开连接 |
| `home` | 移动到初始位置 |
| `get_joints` | 获取当前关节位置 |
| `get_pose` | 获取当前 TCP 位姿 |

### 输出

| 输出 ID | 格式 | 描述 |
|-----------|--------|-------------|
| `current_joints` | JSON 数组 | 当前关节位置，单位：弧度 |
| `current_pose` | JSON 字典 | 当前 TCP 位姿（x, y, z, rx, ry, rz） |
| `status` | String | `idle`、`moving`、`completed`、`error`、`stopped` |
| `error` | JSON | 状态为 `error` 时的错误详情 |

## 配置

### 环境变量

在 `dataflow.yml` 中设置或在运行前导出：

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `UR5_IP` | `127.0.0.1` | 机器人/仿真器 IP 地址 |
| `UR5_ACCELERATION` | `0.5` | 默认加速度（rad/s^2 或 m/s^2） |
| `UR5_VELOCITY` | `0.3` | 默认速度（rad/s 或 m/s） |

### 示例：真实机器人配置

```yaml
nodes:
  - id: ur5_driver
    path: ur5_driver_node.py
    inputs:
      target_joints: planner/joints
    outputs:
      - current_joints
      - current_pose
      - status
      - error
    env:
      UR5_IP: "192.168.1.100"    # 您的机器人 IP
      UR5_ACCELERATION: "0.3"    # 为安全起见减速
      UR5_VELOCITY: "0.2"
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

  - id: ur5_driver
    path: ur5_driver_node.py
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

  - id: ur5_driver
    path: ur5_driver_node.py
    inputs:
      target_pose: vision/target_pose
    outputs:
      - status
```

## 故障排除

### 连接失败

1. 检查 URSim 是否正在运行：
   ```bash
   docker ps | grep ursim
   docker logs ursim
   ```

2. 验证机器人已在 URSim 中启动（通过 VNC 连接到 `localhost:5900`）

3. 检查 RTDE 端口是否可访问：
   ```bash
   nc -zv 127.0.0.1 30004
   ```

4. 检查环境变量中的 IP 地址

### 运动未执行

1. 确保机器人已启动且在 URSim 中释放了制动器
2. 检查机器人是否处于远程控制模式（真实机器人）
3. 检查示教器/URSim 中的保护性停止
4. 检查输出中的错误：
   ```bash
   dora logs ur5_driver
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

### RTDE "Safety Setup Not Confirmed" 错误

如果看到"SafetySetup has not been confirmed yet"错误：

1. 通过 VNC 连接到 URSim（`localhost:5900`）
2. 进入 Settings（汉堡菜单）-> System -> Safety
3. 点击底部的"Confirm Safety Configuration"
4. 重启驱动

### 测试连接脚本

运行包含的测试脚本以验证连接：

```bash
python test_connection.py
```

这将测试：
- Dashboard Server（端口 29999）
- RTDE 接口（端口 30004）
- URScript 接口（端口 30002）

## RTDE 协议说明

UR RTDE（实时数据交换）协议提供：
- 500Hz 实时机器人状态数据流
- 低延迟命令接口
- 同步和异步运动控制

与其他接口的主要区别：
- 比主/辅接口更可靠
- 比 Dashboard Server 延迟更低
- 直接访问伺服控制

## 源码

完整源码请参考：[dora-examples/ur5](https://github.com/dora-rs/dora-examples/tree/main/examples/ur5)
