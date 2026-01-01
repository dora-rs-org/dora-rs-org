# ROS2数据流

## 准备相关依赖
由于例子与`turtlesim`和`AddTwoInts`相关
```bash
$ sudo apt install ros-jazzy-turtlesim ros-jazzy-examples-rclcpp-minimal-service
```

## 准备Python环境
```bash
$ uv venv -p 3.10 --seed
$ uv pip install -e ../../apis/node
```

## 启动
### 启动turtlesim
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run turtlesim turtlesim_node
```
### 启动AddTwoInts服务
```bash
$ source /opt/ros/jazzy/setup.bash
$ ros2 run examples_rclcpp_minimal_service service_main
```

```bash
$ source /opt/ros/jazzy/setup.bash
$ dora run dataflow.yml --uv
```
