# Getting Started

This tutorial guides you through running autonomous driving dataflows, from simple object detection to a complete self-driving system.

## Start CARLA Simulator

First, launch the CARLA simulator using Docker:

```bash
# Pull CARLA Docker image
docker pull carlasim/carla:0.9.13

# Start CARLA simulator
docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.13 /bin/bash ./CarlaUE4.sh -carla-server -world-port=2000 -RenderOffScreen
```

The simulator will run at `localhost:2000`.

---

## Dataflow Configuration Files

The `graphs/oasis/` directory contains multiple dataflow configurations, each demonstrating different levels of autonomous driving functionality:

| Configuration File | Function | Complexity |
|-------------------|----------|------------|
| `oasis_agent_yolov5.yaml` | Object Detection | Beginner |
| `oasis_agent_obstacle_location.yaml` | Obstacle Localization | Intermediate |
| `oasis_agent_planning.yaml` | Path Planning | Intermediate |
| `oasis_full.yaml` | Complete Autonomous Driving | Advanced |

---

## 1. Object Detection (oasis_agent_yolov5.yaml)

The simplest dataflow, demonstrating YOLOv5 object detection on CARLA simulator images.

### Dataflow Structure

```
┌─────────────┐     ┌─────────┐     ┌──────┐
│ oasis_agent │────▶│ yolov5  │────▶│ plot │
│   (camera)  │     │(detector)│    │(viz) │
└─────────────┘     └─────────┘     └──────┘
```

### Node Description

| Node | Function | Inputs | Outputs |
|------|----------|--------|---------|
| `oasis_agent` | Get sensor data from CARLA | tick | image, position, speed, lidar_pc |
| `yolov5` | YOLOv5 object detection | image | bbox (bounding boxes) |
| `plot` | Visualize detection results | image, bbox, position | - |

### Run Command

```bash
dora up
dora start graphs/oasis/oasis_agent_yolov5.yaml --attach
```

### Expected Output

A window will display the CARLA camera view with detected objects marked by bounding boxes.

![Object Detection Results](https://dora-rs.ai/img/carla.png)

---

## 2. Obstacle Localization (oasis_agent_obstacle_location.yaml)

Building on object detection, this dataflow combines LIDAR point cloud data to compute global coordinates of obstacles.

### Dataflow Structure

```
┌─────────────┐     ┌─────────┐     ┌────────────────────┐     ┌──────┐
│ oasis_agent │────▶│ yolov5  │────▶│ obstacle_location  │────▶│ plot │
│(camera+LIDAR)│    │(detector)│    │   (localization)   │     │(viz) │
└─────────────┘     └─────────┘     └────────────────────┘     └──────┘
```

### Node Description

| Node | Function | Inputs | Outputs |
|------|----------|--------|---------|
| `oasis_agent` | Get camera and LIDAR data | tick | image, lidar_pc, position |
| `yolov5` | Object detection | image | bbox |
| `obstacle_location_op` | Fuse LIDAR to compute obstacle position | lidar_pc, bbox, position | obstacles (global coords) |
| `plot` | Visualize obstacle positions | image, bbox, obstacles, position | - |

### How It Works

1. Compute angle of each point in the point cloud
2. Map bounding box pixel angles to real points
3. Transform LIDAR relative coordinates to global coordinates

### Coordinate System

Uses Unreal Engine coordinate system:
- Z-axis: Up
- X-axis: Forward
- Y-axis: Right

### Run Command

```bash
dora up
dora start graphs/oasis/oasis_agent_obstacle_location.yaml --attach
```

### Expected Output

Detected obstacles show a dot within the bounding box representing their estimated global coordinate position.

![Obstacle Localization](https://dora-rs.ai/img/obstacle_location.png)

---

## 3. Path Planning (oasis_agent_planning.yaml)

Adds GPS routing and motion planning capabilities for obstacle avoidance path planning.

### Dataflow Structure

```
                                    ┌────────────┐
                              ┌────▶│ carla_gps  │────┐
┌─────────────┐     ┌─────────┐     │ (GPS route)│    │     ┌─────────┐
│ oasis_agent │────▶│ yolov5  │     └────────────┘    ├────▶│  fot_op │
│             │     └─────────┘                       │     │(planner)│
│             │────▶│obstacle_location│───────────────┘     └─────────┘
└─────────────┘     └─────────────────┘
```

### Node Description

| Node | Function | Inputs | Outputs |
|------|----------|--------|---------|
| `carla_gps_op` | Compute GPS route using GlobalRoutePlanner | opendrive, objective_waypoints, position | gps_waypoints |
| `fot_op` | Frenet Optimal Trajectory planner | position, speed, obstacles, gps_waypoints | waypoints |

### GPS Routing

Uses CARLA's `GlobalRoutePlanner` to compute routes between points. Waypoint format: `[x, y, speed]`.

### Motion Planning

The Frenet Optimal Trajectory (FOT) planner considers:
- Current position and speed
- Obstacle locations
- GPS waypoints

Generates optimal collision-avoidance trajectories.

### Run Command

```bash
dora up
dora start graphs/oasis/oasis_agent_planning.yaml --attach
```

### Expected Output

The visualization window shows planned path trajectories, including GPS waypoints and obstacle avoidance paths.

![Path Planning](https://dora-rs.ai/img/planning.png)

---

## 4. Complete Autonomous Driving (oasis_full.yaml)

The complete autonomous driving system with perception, planning, and control modules.

### Dataflow Structure

```
┌─────────────┐
│ oasis_agent │◀──────────────────────────────────────────┐
│  (sensors)  │                                           │
└──────┬──────┘                                           │
       │                                                  │
       ▼                                                  │
┌─────────────┐     ┌────────────────────┐               │
│   yolov5    │────▶│ obstacle_location  │               │
│ (detection) │     │  (localization)    │               │
└─────────────┘     └─────────┬──────────┘               │
                              │                          │
       ┌──────────────────────┼──────────────────┐       │
       │                      │                  │       │
       ▼                      ▼                  ▼       │
┌─────────────┐     ┌─────────────┐     ┌──────────────┐ │
│ carla_gps   │────▶│   fot_op    │────▶│ pid_control  │─┘
│ (GPS route) │     │  (planner)  │     │ (controller) │
└─────────────┘     └─────────────┘     └──────────────┘
```

### New Node

| Node | Function | Inputs | Outputs |
|------|----------|--------|---------|
| `pid_control_op` | PID controller | position, speed, waypoints | control (throttle, steering, brake) |

### PID Controller

Translates planned waypoints into vehicle control commands:
- **throttle**: Acceleration (0-1)
- **steering**: Steering angle (-1 to 1)
- **brake**: Braking (0-1)

Control commands are sent back to `oasis_agent`, forming a closed-loop control system.

### Run Command

```bash
dora up
dora start graphs/oasis/oasis_full.yaml --attach
```

### Expected Output

The vehicle drives autonomously, detecting obstacles, planning paths, and controlling the vehicle in real-time. The visualization window shows complete perception and planning information.

![Complete Autonomous Driving](https://dora-rs.ai/img/full_pipeline.png)

---

## Advanced Extensions

Additional feature nodes can be added:

| Feature | Operator | Description |
|---------|----------|-------------|
| Lane Detection | `yolop_op.py` | Detect road lane markings |
| Object Tracking | `strong_sort.py` | Multi-object tracking |
| Traffic Sign Recognition | `traffic_sign.py` | Recognize traffic signs |

---

## Troubleshooting

### Simulator Connection Failed

Ensure CARLA is running at `localhost:2000`:
```bash
# Check container status
docker ps

# View container logs
docker logs <container_id>
```

### GPU Memory Insufficient

Adjust YOLOv5 configuration:
```yaml
env:
  PYTORCH_DEVICE: cpu  # Use CPU instead of GPU
```

### Display Issues

If using headless mode, ensure the DISPLAY environment variable is set correctly.

---

## Source Code

- [GitHub Repository](https://github.com/dora-rs/dora-drives)

## Full Documentation

- [CARLA Integration Guide](https://dora-rs.ai/docs/guides/dora-drives/carla)
- [Obstacle Localization](https://dora-rs.ai/docs/guides/dora-drives/obstacle_location)
- [Path Planning](https://dora-rs.ai/docs/guides/dora-drives/planning)
- [Vehicle Control](https://dora-rs.ai/docs/guides/dora-drives/control)
