# ROS2 Dataflow

## Prepare Related Dependencies
Since the example is related to `turtlesim` and `AddTwoInts`
```bash
$ sudo apt install ros-jazzy-turtlesim ros-jazzy-examples-rclcpp-minimal-service
```

## Prepare Python Environment
```bash
$ uv venv -p 3.10 --seed
$ uv pip install -e ../../apis/node
```

## Launch
### Launch turtlesim
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run turtlesim turtlesim_node
```
### Launch AddTwoInts Service
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run examples_rclcpp_minimal_service service_main
```

```bash
$ source /opt/ros/jazzy/setup.bash
$ dora run dataflow.yml --uv
```
