# Introduction

## System Architecture

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

## File Structure

```
dora-moveit/
├── run_mujoco.bat                    # Start MuJoCo simulation
├── run_real_robot.bat                # Start real robot control
│
├── dataflow_gen72_mujoco.yml         # MuJoCo dataflow configuration
├── dataflow_gen72_real.yml           # Real robot dataflow configuration
│
├── multi_view_capture_node.py        # Main workflow controller
├── trajectory_executor.py            # Trajectory interpolation
├── ik_op.py                          # TracIK inverse kinematics
├── planner_ompl_with_collision_op.py # RRT-Connect motion planner
├── planning_scene_op.py              # Scene management
│
├── gen72_robot_node.py               # Real robot control (Realman SDK)
├── robot_config.py                   # GEN72 parameters and collision geometry
│
├── rm_robot_interface.py             # Realman SDK interface
├── rm_ctypes_wrap.py                 # Realman SDK C wrapper
├── api_c.dll                         # Realman SDK library
│
├── requirements.txt                  # Python dependencies
├── README.md                         # Documentation
└── RELEASE.md                        # Version history
```

## Performance Metrics

| Metric | MuJoCo | Real Robot |
|--------|--------|------------|
| IK Success Rate | ~95% | ~95% |
| Planning Time | 0.05-0.15s | 0.05-0.15s |
| Motion Speed | 1.0 waypoint/s | 0.25 waypoint/s |
| Control Frequency | 20 Hz | 5 Hz |
| Typical Workflow Time | ~30s | ~60s |
