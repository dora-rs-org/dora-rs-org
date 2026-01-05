# 编译运行

## 编译说明

- 每个节点下都有一个 `readme.md`，请仔细阅读
- 建议使用 **vscode** 打开 DORA_NAV，方便修改 `./vscode/c_cpp_properties.json` 中的 includepath
- 建议先修改文件夹下的 `CMakeLists.txt` 中的路径
- 找不到头文件时，确认一下 `c_cpp_properties.json` 中 includepath，如果路径正确，ctrl+左键进入头文件的实现代码中，检查是否有未找到的头文件
- 重新编译前先删除 build 目录下所有的文件

```bash
cd build && rm -rf *
```

- 所有节点编译完毕，确认 `run-test.yml` 中可执行文件的路径（`./` 指当前目录）
- yml 文件注重缩进，只能用空格缩进，格式参考 [dora中文社区](https://doracc.com/guide/topics/dataflow.html)

## 编译各节点

### 编译 driver

```bash
cd rslidar_driver
mkdir build && cd build
cmake ..
make
```

### 编译 ndt_mapping

```bash
# 编译 ndt_cpu
cd mapping/ndt_mapping/ndt_cpu
mkdir build && cd build
cmake ..
make

# 编译 ndt_mapping
cd mapping/ndt_mapping
mkdir build && cd build
cmake ..
make
```

### 编译 localization

```bash
cd localization/dora-hdl_localization
mkdir build && cd build
cmake ..
make
```

### 编译 map

```bash
cd map/pub_road
mkdir build && cd build
cmake ..
make
cd ../..
cd road_line_publisher
mkdir build && cd build
cmake ..
make
```

### 编译 planning

```bash
cd planning/mission_planning
mkdir build && cd build
cmake ..
make
cd ../..
cd routing_planning
mkdir build && cd build
cmake ..
make
```

### 编译 control

```bash
cd control/dora_mickrobot
mkdir build && cd build
cmake ..
make
```

### 编译 rerun

```bash
cd rerun
mkdir build && cd build
cmake ..
make
```

## 运行

### 运行建图

```bash
dora up
dora start dataflow_pcap.yml  # 如果想在终端中看日志输出，执行 dora run dataflow_pcap.yml
```

日志输出在 `ndt_mapping/out` 目录下，保存的地图在 `DORA_NAV/mapping/ndt_mapping/saved_map` 目录下。

查看地图：

```bash
sudo apt install pcl-tools
pcl_viewer -multiview 1 path_to_pcd_files
```

### 运行定位

```bash
dora up
dora run path.yml
```

path.yml 启动后，会把路径点记录到 `/DORA_NAV/data/path`，日志输出在同级目录下的 `/out`。

对路径点进行间隔采样生成 Waypoints.txt：

```bash
python3 sample.py
```

### 运行导航

```bash
dora up
dora run run.yml
```

## 调试建议

- 有节点报错，新建一个 yml 文件，依次调试节点，注意一个节点的 inputs 涉及到的节点必须存在
- 日志的输出在 yml 文件同级的 `/out` 目录下
- 哪个节点有报错先考虑读取文件的路径是否正确，文件的权限是否正确
- 节点之间输入输出关系使用 `dora graph` 查看，用浏览器打开，查看数据流图
