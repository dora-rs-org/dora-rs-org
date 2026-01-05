# 节点功能

## driver 驱动节点

主要存放dora支持的传感器驱动节点，`/driver/rslidar_driver` 存放 RoboScience lidar 的驱动。

### 文件清单

| 文件 | 说明 |
|------|------|
| rslidar_driver_pcap.cc | 基于 Dora 框架的 RoboSense 激光雷达驱动节点，核心功能是读取激光雷达的点云数据（支持实时硬件或 PCAP 离线文件），将点云数据标准化打包后，通过 Dora 框架的输出接口发送给下游模块 |
| rslidar_driver.cc | 基于 Dora 框架的 RoboSense 激光雷达驱动增强版节点，优化了配置灵活性、数据打包格式、内存管理，支持实时雷达与离线 PCAP 无缝切换 |

### LiDAR 配置

1. 安装对应版本的 rslidar_sdk，详情参考官方文档：[https://github.com/RoboSense-LiDAR/rslidar_sdk](https://github.com/RoboSense-LiDAR/rslidar_sdk)

2. 确认 lidar 的 ip 地址(10.0.0.200)，详情见 robosense 官网用户手册：[https://cdn.robosense.cn/20240201110717_15556.pdf](https://cdn.robosense.cn/20240201110717_15556.pdf)

3. 设置本机的 ip 为 10.0.0.102，子网掩码为 255.255.255.0，先 ping 通 10.0.0.200

```bash
ping 10.0.0.200
```

> ping 不通时，检查电脑的有线连接是否开启，检查 lidar 与电脑是否直连，检查激光雷达的供电

4. 进入 rslidar_sdk，从 rviz 上看一下点云是否能正常显示

```bash
cd rslidar_ws
source install/setup.bash
ros2 launch rslidar_sdk start.py
```

### 录制 PCAP 文件

确定网卡，使用 tcpdump 抓取点云数据：

```bash
ip address show
sudo tcpdump -i enp131s0 -w env.pcap -c 3000000 'udp dst port 7788 or 6699'
```

参考官方文档：[https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/13_how_to_capture_pcap_file_CN.md](https://github.com/RoboSense-LiDAR/rs_driver/blob/main/doc/howto/13_how_to_capture_pcap_file_CN.md)

---

## mapping 建图节点

### ndt_mapping 建图

基于 NDT (Normal Distributions Transform) 算法的建图模块。

**文件清单**：

| 文件 | 说明 |
|------|------|
| dora_node.cc | ndt建图dora节点 |
| dora_ndt_mapper.cc | ndt建图类 |
| ndt_cpu | ndt算法实现 |
| ndt_mapping_config.yml | ndt建图参数 |
| dataflow_pcap.yml | Dora数据流文件 |

Source: [https://github.com/Kin-Zhang/simple_ndt_slam](https://github.com/Kin-Zhang/simple_ndt_slam)

### ROS 下的 lidarslam 建图

如果 ndt_mapping 建图效果不好，可以使用 ROS 下的 lidarslam 建图：

参考官方文档：[https://github.com/rsasaki0109/lidarslam_ros2](https://github.com/rsasaki0109/lidarslam_ros2)

```bash
cd ros2_ws
source install/setup.bash
ros2 launch lidarslam lidarslam.launch.py
ros2 bag play rslidar_laser_bag_0.db3  # 新开终端，播放rosbag
ros2 service call /map_save std_srvs/Empty  # 新开终端，保存地图
```

---

## localization 定位节点

### dora-hdl_localization

实现小车定位，输出小车轨迹。

**文件清单**：

| 文件 | 说明 |
|------|------|
| dora_hdl_node.cpp | 基于 Dora 框架的 HDL 激光雷达定位节点，接收激光雷达点云数据（可选 IMU 数据），结合预加载的全局 PCD 地图，实现小车的实时定位 |
| pose_estimator.cpp | HDL 定位的核心位姿估计模块 |

---

## map 路径管理节点

基于 Dora 框架的「参考路径管理 + 坐标转换 + 定位信息输出」。

**文件清单**：

| 文件 | 说明 |
|------|------|
| pub_road/src/pubroad.cpp | 从本地文本文件 Waypoints.txt 中读取预定义的参考路径，将路径数据打包为二进制格式后发布给下游模块 |
| road_line_publisher/frenet.cpp | 笛卡尔坐标系与 Frenet 坐标系之间的转换 |
| road_line_publisher/road_lane.cpp | 输入事件处理参考路径和车辆位置数据，输出转换后的定位信息 |

---

## planning 规划节点

道路参数供给 + 任务决策执行。

**文件清单**：

| 文件 | 说明 |
|------|------|
| task_exc/main.cc | 中央控制核心，整合定位等多源数据，执行自动倒车等任务，发布车辆控制指令 |
| task_pub/main.cc | 道路属性发布模块，按 10Hz 频率读取 road_msg.txt 文件中的道路属性键值对 |

---

## control 控制节点

主要基于 C/C++ 实现，读取键盘数据并控制 mickrobot 四轮差速小车移动。

```bash
# 连接小车的串口，加权限
ls /dev/ttyUSB*
sudo chmod 777 /dev/ttyUSB0
```

---

## rerun 可视化节点

点云数据可视化工具。

> 注意：rerun 的读取 map 的路径，按需修改
