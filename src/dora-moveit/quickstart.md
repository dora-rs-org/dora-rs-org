# 快速开始

## 环境准备

```bash
# Python 环境
conda create -n dora-moveit python=3.9
conda activate dora-moveit

# 安装依赖
pip install -r requirements.txt

# 安装 Dora
pip install dora-rs

# 安装 MuJoCo（用于仿真）
pip install mujoco
pip install -e dora-mujoco/
```

## 运行仿真

```bash
# 启动 MuJoCo 仿真
./run_mujoco.bat

# 或手动执行：
dora up
dora build dataflow_gen72_mujoco.yml
dora start dataflow_gen72_mujoco.yml
```

**运行效果**：

1. MuJoCo 窗口打开，GEN72 机器人在 HOME 位置
2. 系统规划到 3 个视点的无碰撞路径
3. 机器人在每个视点拍摄图像
4. 返回 HOME 并进入空闲状态

## 运行真实机器人

> **重要**：确保机器人已上电，工作区域清空，紧急停止按钮可触及。

```bash
# 启动真实机器人控制
./run_real_robot.bat

# 或手动执行：
dora up
dora build dataflow_gen72_real.yml
dora start dataflow_gen72_real.yml
```

## 故障排除

### MuJoCo 问题

**问题**："Model not found" 错误

```bash
# 解决方案：设置 MODEL_NAME 环境变量
export MODEL_NAME="path/to/GEN72_with_actuators.xml"
```

**问题**：Joint1 在完成后仍然旋转

```bash
# 解决方案：检查 HOLD 逻辑超时
# 在 main.py 中: self.cmd_timeout = 0.2  # 如需增加
```

### 真实机器人问题

**问题**：连接失败

```bash
# 检查：
# 1. 机器人已上电
# 2. 网络连接（ping 192.168.1.19）
# 3. 防火墙设置
# 4. SDK DLL 在正确路径
```

**问题**：机器人运动不平滑

```bash
# 解决方案：调整控制频率
# 在 dataflow_gen72_real.yml 中：
tick: dora/timer/millis/200  # 增加以获得更平滑的运动
```

## 安全指南

### 运行真实机器人前

1. **电源检查**：确保机器人已上电并初始化
2. **工作区域**：清除机器人工作区域内的所有障碍物
3. **紧急停止**：确认紧急停止按钮可触及
4. **限位**：确认关节限位正确配置
5. **速度**：测试时从低速（10%）开始

### 紧急程序

- **立即停止**：按紧急停止按钮
- **软件停止**：在终端按 `Ctrl+C`
- **断电**：使用主电源开关

### 碰撞避免

- 系统使用 10mm 安全边距
- 地平面在 z=-0.05m
- 自碰撞检查已启用
- 相邻连杆（±1）跳过以增加灵活性
