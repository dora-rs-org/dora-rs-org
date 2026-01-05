# 组件详情

## multi_view_capture_node.py

工作流控制器，协调整个拍摄序列。

### 输入

- `joint_positions`：当前机器人状态
- `ik_solution`, `ik_status`：IK 求解器结果
- `trajectory`, `plan_status`：运动规划器结果
- `execution_status`：轨迹执行反馈

### 输出

- `ik_request`：IK 的目标位姿
- `plan_request`：运动规划请求
- `scene_command`：场景更新

### 状态机

1. `idle` → 请求视点的 IK
2. `waiting_for_ik` → 请求运动规划
3. `waiting_for_planning` → 等待轨迹
4. `waiting_for_execution` → 监控执行
5. `capturing` → 拍摄图像
6. 对所有视点重复
7. `returning_home` → 返回 HOME
8. `idle` → 完成

---

## trajectory_executor.py

在航点之间插值以实现平滑运动。

### 关键参数

- `interpolation_speed`：0.05（每个周期 5% 进度）
- `tick_rate`：50ms（MuJoCo）/ 200ms（真实机器人）

### 功能特性

- 航点之间的线性插值
- HOLD 模式：空闲时返回当前关节状态
- 防止轨迹完成后的控制漂移

---

## ik_op.py

基于 TracIK 的逆运动学求解器。

**求解器**：TracIK（高级，成功率约 95%）

**备用**：数值 IK（阻尼最小二乘）

**输入**：6D 位姿 `[x, y, z, roll, pitch, yaw]`

**输出**：7D 关节配置

---

## planner_ompl_with_collision_op.py

带碰撞检测的 RRT-Connect 运动规划器。

**算法**：RRT-Connect（双向 RRT）

**碰撞边距**：10mm 安全缓冲

**最大规划时间**：5 秒

### 碰撞检测

- 自碰撞检查（跳过相邻连杆）
- 环境碰撞（障碍物、地平面）
- 点云碰撞（框架已准备好）

---

## gen72_robot_node.py

通过 Realman SDK 的真实机器人控制。

### 连接

- IP：192.168.1.19:8080
- 线程模式：三线程（mode=2）
- 级别：3

### 单位转换

- 系统内部使用弧度
- SDK 使用角度
- 自动转换：`np.deg2rad()` / `np.rad2deg()`

### 控制

- 命令：`rm_movej(joints_deg, speed=10%, r=0, connect=0, block=1)`
- 更新频率：5 Hz（200ms tick）

---

## robot_config.py

GEN72 机器人配置：

### 参数

- 关节限位、HOME 位置、URDF 路径
- 碰撞几何（每个连杆的球体）
- 连杆尺寸和偏移

---

## 关键修复记录

### 1. MuJoCo 控制漂移（已修复）

**问题**：工作流完成后 Joint1 继续旋转。

**根本原因**：MuJoCo 的 PD 控制器使用过时的目标位置，导致持续的误差累积。

**解决方案**：在 `main.py:127-137` 中实现基于超时的 HOLD 逻辑：

```python
if now - self.last_cmd_time > self.cmd_timeout:
    self.data.ctrl[:self.num_joints] = current_q  # 强制 HOLD
```

### 2. 轨迹执行器漂移（已修复）

**问题**：空闲时执行器返回过时的航点位置。

**解决方案**：修改 `trajectory_executor.py:step()` 以返回当前关节状态：

```python
if not self.is_executing:
    return self.current_joints.copy()  # 不是 last_command
```

### 3. 真实机器人 API 集成（已修复）

**问题**：连接失败和不正确的 API 使用。

**解决方案**：

- 使用 `rm_thread_mode_e(2)` 作为线程模式
- 检查 `handle.id == -1` 以确定连接错误
- 解析元组返回值：`result[1].joint`
- 添加角度/弧度转换

---

## 参考资料

- [Dora-rs 文档](https://github.com/dora-rs/dora)
- [MuJoCo 文档](https://mujoco.readthedocs.io/)
- [TracIK 论文](https://ieeexplore.ieee.org/document/7363472)
- [RRT-Connect 算法](http://msl.cs.illinois.edu/~lavalle/papers/LavKuf01.pdf)
- [睿尔曼机器人](https://www.realman-robotics.com/)
