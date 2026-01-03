# 快速开始

本教程将引导您逐步运行自动驾驶数据流，从简单的物体检测到完整的自动驾驶系统。

## 启动 CARLA 模拟器

首先，使用 Docker 启动 CARLA 模拟器：

```bash
# 拉取 CARLA Docker 镜像
docker pull carlasim/carla:0.9.13

# 启动 CARLA 模拟器
docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.13 /bin/bash ./CarlaUE4.sh -carla-server -world-port=2000 -RenderOffScreen
```

模拟器将在 `localhost:2000` 运行。

---

## 数据流配置文件

`graphs/oasis/` 目录包含多个数据流配置文件，每个文件展示自动驾驶的不同功能层级：

| 配置文件 | 功能 | 复杂度 |
|---------|------|--------|
| `oasis_agent_yolov5.yaml` | 物体检测 | 入门 |
| `oasis_agent_obstacle_location.yaml` | 障碍物定位 | 中级 |
| `oasis_agent_planning.yaml` | 路径规划 | 中级 |
| `oasis_full.yaml` | 完整自动驾驶 | 高级 |

---

## 1. 物体检测 (oasis_agent_yolov5.yaml)

这是最简单的数据流，演示如何使用 YOLOv5 检测 CARLA 模拟器中的物体。

### 数据流结构

```
┌─────────────┐     ┌─────────┐     ┌──────┐
│ oasis_agent │────▶│ yolov5  │────▶│ plot │
│  (相机图像) │     │(物体检测)│     │(可视化)│
└─────────────┘     └─────────┘     └──────┘
```

### 节点说明

| 节点 | 功能 | 输入 | 输出 |
|-----|------|------|------|
| `oasis_agent` | 从 CARLA 获取传感器数据 | tick | image, position, speed, lidar_pc |
| `yolov5` | YOLOv5 物体检测 | image | bbox (边界框) |
| `plot` | 可视化检测结果 | image, bbox, position | - |

### 运行命令

```bash
dora up
dora start graphs/oasis/oasis_agent_yolov5.yaml --attach
```

### 预期输出

运行后会显示一个窗口，展示 CARLA 模拟器的相机画面，检测到的物体会用边界框标注。

![物体检测结果](https://dora-rs.ai/img/carla.png)

---

## 2. 障碍物定位 (oasis_agent_obstacle_location.yaml)

在物体检测的基础上，结合 LIDAR 点云数据计算障碍物的全局坐标。

### 数据流结构

```
┌─────────────┐     ┌─────────┐     ┌────────────────────┐     ┌──────┐
│ oasis_agent │────▶│ yolov5  │────▶│ obstacle_location  │────▶│ plot │
│ (相机+LIDAR)│     │(物体检测)│     │    (障碍物定位)     │     │(可视化)│
└─────────────┘     └─────────┘     └────────────────────┘     └──────┘
```

### 节点说明

| 节点 | 功能 | 输入 | 输出 |
|-----|------|------|------|
| `oasis_agent` | 获取相机和 LIDAR 数据 | tick | image, lidar_pc, position |
| `yolov5` | 物体检测 | image | bbox |
| `obstacle_location_op` | 融合 LIDAR 计算障碍物位置 | lidar_pc, bbox, position | obstacles (全局坐标) |
| `plot` | 可视化障碍物位置 | image, bbox, obstacles, position | - |

### 工作原理

1. 计算点云中每个点的角度
2. 将边界框像素角度映射到实际点
3. 将 LIDAR 相对坐标转换为全局坐标

### 坐标系统

使用 Unreal Engine 坐标系：
- Z 轴：向上
- X 轴：向前
- Y 轴：向右

### 运行命令

```bash
dora up
dora start graphs/oasis/oasis_agent_obstacle_location.yaml --attach
```

### 预期输出

检测到的障碍物会在边界框中显示一个点，表示其估计的全局坐标位置。

![障碍物定位](https://dora-rs.ai/img/obstacle_location.png)

---

## 3. 路径规划 (oasis_agent_planning.yaml)

添加 GPS 路由和运动规划功能，使车辆能够规划避障路径。

### 数据流结构

```
                                    ┌────────────┐
                              ┌────▶│ carla_gps  │────┐
┌─────────────┐     ┌─────────┐     │  (GPS路由)  │    │     ┌─────────┐
│ oasis_agent │────▶│ yolov5  │     └────────────┘    ├────▶│  fot_op │
│             │     └─────────┘                       │     │(轨迹规划)│
│             │────▶│obstacle_location│───────────────┘     └─────────┘
└─────────────┘     └─────────────────┘
```

### 节点说明

| 节点 | 功能 | 输入 | 输出 |
|-----|------|------|------|
| `carla_gps_op` | 使用 GlobalRoutePlanner 计算 GPS 路由 | opendrive, objective_waypoints, position | gps_waypoints |
| `fot_op` | Frenet 最优轨迹规划器 | position, speed, obstacles, gps_waypoints | waypoints |

### GPS 路由

使用 CARLA 的 `GlobalRoutePlanner` 计算两点间的路线，航点格式为 `[x, y, speed]`。

### 运动规划

Frenet Optimal Trajectory (FOT) 规划器综合考虑：
- 当前位置和速度
- 障碍物位置
- GPS 航点

生成最优的避障轨迹。

### 运行命令

```bash
dora up
dora start graphs/oasis/oasis_agent_planning.yaml --attach
```

### 预期输出

可视化窗口会显示规划的路径轨迹，包括 GPS 航点和避障路径。

![路径规划](https://dora-rs.ai/img/planning.png)

---

## 4. 完整自动驾驶 (oasis_full.yaml)

完整的自动驾驶系统，包含感知、规划和控制三个模块。

### 数据流结构

```
┌─────────────┐
│ oasis_agent │◀──────────────────────────────────────────┐
│  (传感器)   │                                           │
└──────┬──────┘                                           │
       │                                                  │
       ▼                                                  │
┌─────────────┐     ┌────────────────────┐               │
│   yolov5    │────▶│ obstacle_location  │               │
│ (物体检测)  │     │   (障碍物定位)      │               │
└─────────────┘     └─────────┬──────────┘               │
                              │                          │
       ┌──────────────────────┼──────────────────┐       │
       │                      │                  │       │
       ▼                      ▼                  ▼       │
┌─────────────┐     ┌─────────────┐     ┌──────────────┐ │
│ carla_gps   │────▶│   fot_op    │────▶│ pid_control  │─┘
│  (GPS路由)  │     │ (轨迹规划)   │     │  (PID控制)   │
└─────────────┘     └─────────────┘     └──────────────┘
```

### 新增节点

| 节点 | 功能 | 输入 | 输出 |
|-----|------|------|------|
| `pid_control_op` | PID 控制器 | position, speed, waypoints | control (throttle, steering, brake) |

### PID 控制器

将规划的航点转换为车辆控制命令：
- **throttle**: 油门 (0-1)
- **steering**: 转向 (-1 到 1)
- **brake**: 刹车 (0-1)

控制命令发送回 `oasis_agent`，形成闭环控制。

### 运行命令

```bash
dora up
dora start graphs/oasis/oasis_full.yaml --attach
```

### 预期输出

车辆将自动行驶，实时检测障碍物、规划路径并控制车辆。可视化窗口显示完整的感知和规划信息。

![完整自动驾驶](https://dora-rs.ai/img/full_pipeline.png)

---

## 进阶扩展

可以添加更多功能节点：

| 功能 | 操作符 | 说明 |
|-----|--------|------|
| 车道检测 | `yolop_op.py` | 检测道路车道线 |
| 目标跟踪 | `strong_sort.py` | 多目标跟踪 |
| 交通标志识别 | `traffic_sign.py` | 识别交通标志 |

---

## 故障排除

### 模拟器连接失败

确保 CARLA 在 `localhost:2000` 运行：
```bash
# 检查容器状态
docker ps

# 查看容器日志
docker logs <container_id>
```

### GPU 内存不足

调整 YOLOv5 配置：
```yaml
env:
  PYTORCH_DEVICE: cpu  # 使用 CPU 而非 GPU
```

### 显示问题

如果使用无头模式，确保设置了正确的 DISPLAY 环境变量。

---

## 源代码

- [GitCode 仓库](https://gitcode.com/dora-rs/dora-drives)

## 完整文档

- [CARLA 集成指南](https://dora-rs.ai/docs/guides/dora-drives/carla)
- [障碍物定位](https://dora-rs.ai/docs/guides/dora-drives/obstacle_location)
- [路径规划](https://dora-rs.ai/docs/guides/dora-drives/planning)
- [车辆控制](https://dora-rs.ai/docs/guides/dora-drives/control)
