# System Configuration

## GEN72 Robot Parameters

- **Degrees of Freedom (DOF)**: 7 joints
- **HOME Position**: `[0.0, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0]` (radians)
- **IP Address**: 192.168.1.19:8080
- **Control Mode**: Position control via Realman SDK

## Capture Viewpoints

Defined in `multi_view_capture_node.py`:

```python
targets = [
    CaptureTarget("view1", [0.4, 0.2, 0.5]),   # Right viewpoint
    CaptureTarget("view2", [0.4, -0.2, 0.5]),  # Left viewpoint
    CaptureTarget("view3", [0.5, 0.0, 0.4])    # Center viewpoint
]
```

### Adding New Viewpoints

Edit `multi_view_capture_node.py`:

```python
self.targets = [
    CaptureTarget("view1", [0.4, 0.2, 0.5]),
    CaptureTarget("view4", [0.3, 0.3, 0.6]),  # Add new viewpoint
]
```

## Control Frequency

| Mode | Frequency | Interpolation Speed |
|------|-----------|---------------------|
| MuJoCo Simulation | 20 Hz (50ms) | 0.05 |
| Real Robot | 5 Hz (200ms) | 0.05 |

### Adjusting Motion Speed

**Simulation** (`dataflow_gen72_mujoco.yml`):

```yaml
tick: dora/timer/millis/50  # Decrease to speed up
```

**Real Robot** (`dataflow_gen72_real.yml`):

```yaml
tick: dora/timer/millis/200  # Decrease to speed up (minimum: 50ms)
```

**Interpolation** (`trajectory_executor.py`):

```python
self.interpolation_speed = 0.05  # Increase to speed up (maximum: 0.2)
```

**Real Robot Speed** (`gen72_robot_node.py`):

```python
self.robot.rm_movej(joint_deg, 10, ...)  # Increase 10% (maximum: 100%)
```

## Collision Sphere Configuration

Defined in `robot_config.py`:

```python
link_spheres = {
    "link1": [([0, 0, 0.1], 0.08)],
    "link2": [([0, 0, 0.15], 0.07)],
    ...
}
```

## Enable Point Cloud Collision

1. Ensure point cloud data is available
2. Modify `planner_ompl_with_collision_op.py`:

```python
self.use_point_cloud = True
```

3. Connect point cloud input in dataflow
