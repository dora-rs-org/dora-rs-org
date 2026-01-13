# Node Functions

## driver Driver Node

Mainly stores sensor driver nodes supported by dora. `/driver/rslidar_driver` stores the driver for RoboScience lidar.

### File List

| File | Description |
|------|-------------|
| rslidar_driver_pcap.cc | RoboSense LiDAR driver node based on Dora framework. The core function is to read LiDAR point cloud data (supports real-time hardware or PCAP offline files), standardize and package the point cloud data, and send it to downstream modules through Dora framework's output interface |
| rslidar_driver.cc | Enhanced version of RoboSense LiDAR driver node based on Dora framework, optimized for configuration flexibility, data packaging format, and memory management, supporting seamless switching between real-time radar and offline PCAP |

### LiDAR Configuration

1. Install the corresponding version of rslidar_sdk. For details, refer to official documentation: [https://github.com/RoboSense-LiDAR/rslidar_sdk](https://github.com/RoboSense-LiDAR/rslidar_sdk)

2. Confirm the lidar's IP address (10.0.0.200). For details, see the robosense official user manual: [https://cdn.robosense.cn/20240201110717_15556.pdf](https://cdn.robosense.cn/20240201110717_15556.pdf)

3. Set the local machine's IP to 10.0.0.102, subnet mask to 255.255.255.0, and ping 10.0.0.200 first

```bash
ping 10.0.0.200
```

> If ping fails, check if the computer's wired connection is enabled, check if the lidar is directly connected to the computer, and check the lidar's power supply

4. Enter rslidar_sdk and check if the point cloud can be displayed normally from rviz

```bash
cd rslidar_ws
source install/setup.bash
ros2 launch rslidar_sdk start.py
```

### Record PCAP File

Determine the network interface and use tcpdump to capture point cloud data:

```bash
ip address show
sudo tcpdump -i enp131s0 -w env.pcap -c 3000000 'udp dst port 7788 or 6699'
```

Refer to official documentation: [https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/13_how_to_capture_pcap_file_CN.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/13_how_to_capture_pcap_file_CN.md)

---

## mapping Mapping Node

### ndt_mapping Mapping

Mapping module based on NDT (Normal Distributions Transform) algorithm.

**File List**:

| File | Description |
|------|-------------|
| dora_node.cc | ndt mapping dora node |
| dora_ndt_mapper.cc | ndt mapping class |
| ndt_cpu | ndt algorithm implementation |
| ndt_mapping_config.yml | ndt mapping parameters |
| dataflow_pcap.yml | Dora dataflow file |

Source: [https://github.com/Kin-Zhang/simple_ndt_slam](https://github.com/Kin-Zhang/simple_ndt_slam)

### lidarslam Mapping under ROS

If ndt_mapping mapping effect is not good, you can use lidarslam mapping under ROS:

Refer to official documentation: [https://github.com/rsasaki0109/lidarslam_ros2](https://github.com/rsasaki0109/lidarslam_ros2)

```bash
cd ros2_ws
source install/setup.bash
ros2 launch lidarslam lidarslam.launch.py
ros2 bag play rslidar_laser_bag_0.db3  # New terminal, play rosbag
ros2 service call /map_save std_srvs/Empty  # New terminal, save map
```

---

## localization Localization Node

### dora-hdl_localization

Implements robot localization and outputs robot trajectory.

**File List**:

| File | Description |
|------|-------------|
| dora_hdl_node.cpp | HDL LiDAR localization node based on Dora framework, receives LiDAR point cloud data (optional IMU data), combines pre-loaded global PCD map to implement real-time localization of the robot |
| pose_estimator.cpp | HDL localization core pose estimation module |

---

## map Path Management Node

Based on Dora framework's "reference path management + coordinate transformation + localization information output".

**File List**:

| File | Description |
|------|-------------|
| pub_road/src/pubroad.cpp | Reads predefined reference path from local text file Waypoints.txt, packages the path data into binary format and publishes it to downstream modules |
| road_line_publisher/frenet.cpp | Conversion between Cartesian coordinate system and Frenet coordinate system |
| road_line_publisher/road_lane.cpp | Input event handles reference path and vehicle position data, outputs converted localization information |

---

## planning Planning Node

Road parameter supply + task decision execution.

**File List**:

| File | Description |
|------|-------------|
| task_exc/main.cc | Central control core, integrates multi-source data such as localization, executes tasks such as automatic reversing, publishes vehicle control commands |
| task_pub/main.cc | Road property publishing module, reads road property key-value pairs from road_msg.txt file at 10Hz frequency |

---

## control Control Node

Mainly implemented based on C/C++, reads keyboard data and controls mickrobot four-wheel differential drive robot movement.

```bash
# Connect to the robot's serial port and add permissions
ls /dev/ttyUSB*
sudo chmod 777 /dev/ttyUSB0
```

---

## rerun Visualization Node

Point cloud data visualization tool.

> Note: Modify the path where rerun reads the map as needed
