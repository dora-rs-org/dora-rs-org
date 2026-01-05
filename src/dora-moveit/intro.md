# 介绍

## 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    GEN72 System Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   multi_view_capture_node.py (Workflow Controller)             │
│       │                                                          │
│       ├──► ik_op.py (TracIK Solver)                            │
│       │         └──► Cartesian pose → Joint angles             │
│       │                                                          │
│       ├──► planner_ompl_with_collision_op.py (RRT-Connect)     │
│       │         ├──► Collision-free path planning              │
│       │         └──► Point cloud + geometric collision         │
│       │                                                          │
│       ├──► trajectory_executor.py (Interpolation)              │
│       │         └──► Smooth waypoint interpolation             │
│       │                                                          │
│       └──► Robot Control Node                                   │
│             ├──► MuJoCo Simulator (main.py)                    │
│             └──► Real GEN72 Robot (gen72_robot_node.py)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 文件结构

```
dora-moveit/
├── run_mujoco.bat                    # 启动 MuJoCo 仿真
├── run_real_robot.bat                # 启动真实机器人控制
│
├── dataflow_gen72_mujoco.yml         # MuJoCo 数据流配置
├── dataflow_gen72_real.yml           # 真实机器人数据流配置
│
├── multi_view_capture_node.py        # 主工作流控制器
├── trajectory_executor.py            # 轨迹插值
├── ik_op.py                          # TracIK 逆运动学
├── planner_ompl_with_collision_op.py # RRT-Connect 运动规划器
├── planning_scene_op.py              # 场景管理
│
├── gen72_robot_node.py               # 真实机器人控制（Realman SDK）
├── robot_config.py                   # GEN72 参数与碰撞几何
│
├── rm_robot_interface.py             # Realman SDK 接口
├── rm_ctypes_wrap.py                 # Realman SDK C 包装器
├── api_c.dll                         # Realman SDK 库
│
├── requirements.txt                  # Python 依赖
├── README.md                         # 说明文件
└── RELEASE.md                        # 版本历史
```

## 性能指标

| 指标 | MuJoCo | 真实机器人 |
|------|--------|------------|
| IK 成功率 | ~95% | ~95% |
| 规划时间 | 0.05-0.15s | 0.05-0.15s |
| 运动速度 | 1.0 waypoint/s | 0.25 waypoint/s |
| 控制频率 | 20 Hz | 5 Hz |
| 典型工作流时间 | ~30s | ~60s |
