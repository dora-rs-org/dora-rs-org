# Component Details

## multi_view_capture_node.py

Workflow controller that coordinates the entire capture sequence.

### Inputs

- `joint_positions`: Current robot state
- `ik_solution`, `ik_status`: IK solver results
- `trajectory`, `plan_status`: Motion planner results
- `execution_status`: Trajectory execution feedback

### Outputs

- `ik_request`: Target pose for IK
- `plan_request`: Motion planning request
- `scene_command`: Scene updates

### State Machine

1. `idle` → Request IK for viewpoint
2. `waiting_for_ik` → Request motion planning
3. `waiting_for_planning` → Wait for trajectory
4. `waiting_for_execution` → Monitor execution
5. `capturing` → Capture image
6. Repeat for all viewpoints
7. `returning_home` → Return to HOME
8. `idle` → Complete

---

## trajectory_executor.py

Interpolates between waypoints for smooth motion.

### Key Parameters

- `interpolation_speed`: 0.05 (5% progress per cycle)
- `tick_rate`: 50ms (MuJoCo) / 200ms (real robot)

### Features

- Linear interpolation between waypoints
- HOLD mode: Returns current joint state when idle
- Prevents control drift after trajectory completion

---

## ik_op.py

Inverse kinematics solver based on TracIK.

**Solver**: TracIK (Advanced, ~95% success rate)

**Fallback**: Numerical IK (Damped Least Squares)

**Input**: 6D pose `[x, y, z, roll, pitch, yaw]`

**Output**: 7D joint configuration

---

## planner_ompl_with_collision_op.py

RRT-Connect motion planner with collision detection.

**Algorithm**: RRT-Connect (Bidirectional RRT)

**Collision Margin**: 10mm safety buffer

**Maximum Planning Time**: 5 seconds

### Collision Detection

- Self-collision checking (skip adjacent links)
- Environment collision (obstacles, ground plane)
- Point cloud collision (framework ready)

---

## gen72_robot_node.py

Real robot control via Realman SDK.

### Connection

- IP: 192.168.1.19:8080
- Thread mode: Three-thread (mode=2)
- Level: 3

### Unit Conversion

- System uses radians internally
- SDK uses degrees
- Automatic conversion: `np.deg2rad()` / `np.rad2deg()`

### Control

- Command: `rm_movej(joints_deg, speed=10%, r=0, connect=0, block=1)`
- Update frequency: 5 Hz (200ms tick)

---

## robot_config.py

GEN72 robot configuration:

### Parameters

- Joint limits, HOME position, URDF path
- Collision geometry (spheres per link)
- Link dimensions and offsets

---

## Key Fix History

### 1. MuJoCo Control Drift (Fixed)

**Issue**: Joint1 continues to rotate after workflow completion.

**Root Cause**: MuJoCo's PD controller uses stale target positions, causing continuous error accumulation.

**Solution**: Implement timeout-based HOLD logic in `main.py:127-137`:

```python
if now - self.last_cmd_time > self.cmd_timeout:
    self.data.ctrl[:self.num_joints] = current_q  # Force HOLD
```

### 2. Trajectory Executor Drift (Fixed)

**Issue**: Executor returns stale waypoint positions when idle.

**Solution**: Modified `trajectory_executor.py:step()` to return current joint state:

```python
if not self.is_executing:
    return self.current_joints.copy()  # Not last_command
```

### 3. Real Robot API Integration (Fixed)

**Issue**: Connection failures and incorrect API usage.

**Solution**:

- Use `rm_thread_mode_e(2)` for thread mode
- Check `handle.id == -1` to detect connection errors
- Parse tuple return value: `result[1].joint`
- Add degree/radian conversion

---

## References

- [Dora-rs Documentation](https://github.com/dora-rs/dora)
- [MuJoCo Documentation](https://mujoco.readthedocs.io/)
- [TracIK Paper](https://ieeexplore.ieee.org/document/7363472)
- [RRT-Connect Algorithm](http://msl.cs.illinois.edu/~lavalle/papers/LavKuf01.pdf)
- [Realman Robotics](https://www.realman-robotics.com/)
