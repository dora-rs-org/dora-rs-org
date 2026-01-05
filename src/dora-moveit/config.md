# 系统配置

## GEN72 机器人参数

- **自由度（DOF）**：7 关节
- **HOME 位置**：`[0.0, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0]`（弧度）
- **IP 地址**：192.168.1.19:8080
- **控制模式**：通过 Realman SDK 的位置控制

## 拍摄视点

在 `multi_view_capture_node.py` 中定义：

```python
targets = [
    CaptureTarget("view1", [0.4, 0.2, 0.5]),   # 右视点
    CaptureTarget("view2", [0.4, -0.2, 0.5]),  # 左视点
    CaptureTarget("view3", [0.5, 0.0, 0.4])    # 中心视点
]
```

### 添加新视点

编辑 `multi_view_capture_node.py`：

```python
self.targets = [
    CaptureTarget("view1", [0.4, 0.2, 0.5]),
    CaptureTarget("view4", [0.3, 0.3, 0.6]),  # 添加新视点
]
```

## 控制频率

| 模式 | 频率 | 插值速度 |
|------|------|----------|
| MuJoCo 仿真 | 20 Hz (50ms) | 0.05 |
| 真实机器人 | 5 Hz (200ms) | 0.05 |

### 调整运动速度

**仿真**（`dataflow_gen72_mujoco.yml`）：

```yaml
tick: dora/timer/millis/50  # 减小以加快速度
```

**真实机器人**（`dataflow_gen72_real.yml`）：

```yaml
tick: dora/timer/millis/200  # 减小以加快速度（最小：50ms）
```

**插值**（`trajectory_executor.py`）：

```python
self.interpolation_speed = 0.05  # 增加以加快速度（最大：0.2）
```

**真实机器人速度**（`gen72_robot_node.py`）：

```python
self.robot.rm_movej(joint_deg, 10, ...)  # 增加 10%（最大：100%）
```

## 碰撞球体配置

在 `robot_config.py` 中定义：

```python
link_spheres = {
    "link1": [([0, 0, 0.1], 0.08)],
    "link2": [([0, 0, 0.15], 0.07)],
    ...
}
```

## 启用点云碰撞

1. 确保点云数据可用
2. 修改 `planner_ompl_with_collision_op.py`：

```python
self.use_point_cloud = True
```

3. 在数据流中连接点云输入
