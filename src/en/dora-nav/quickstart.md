# Build and Run

## Build Instructions

- Each node has a `readme.md`, please read carefully
- It is recommended to use **vscode** to open DORA_NAV, which is convenient for modifying `includepath` in `./vscode/c_cpp_properties.json`
- It is recommended to modify the path in `CMakeLists.txt` under the folder first
- When header files cannot be found, confirm the `includepath` in `c_cpp_properties.json`. If the path is correct, ctrl+left-click to enter the header file's implementation code and check if there are any missing header files
- Before recompiling, delete all files in the build directory

```bash
cd build && rm -rf *
```

- After all nodes are compiled, confirm the path of executable files in `run-test.yml` (`./` refers to the current directory)
- yml files pay attention to indentation, only space indentation is allowed. For format reference, see [dora Chinese community](https://doracc.com/guide/topics/dataflow.html)

## Compile Each Node

### Compile driver

```bash
cd rslidar_driver
mkdir build && cd build
cmake ..
make
```

### Compile ndt_mapping

```bash
# Compile ndt_cpu
cd mapping/ndt_mapping/ndt_cpu
mkdir build && cd build
cmake ..
make

# Compile ndt_mapping
cd mapping/ndt_mapping
mkdir build && cd build
cmake ..
make
```

### Compile localization

```bash
cd localization/dora-hdl_localization
mkdir build && cd build
cmake ..
make
```

### Compile map

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

### Compile planning

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

### Compile control

```bash
cd control/dora_mickrobot
mkdir build && cd build
cmake ..
make
```

### Compile rerun

```bash
cd rerun
mkdir build && cd build
cmake ..
make
```

## Run

### Run Mapping

```bash
dora up
dora start dataflow_pcap.yml  # If you want to see log output in the terminal, execute dora run dataflow_pcap.yml
```

Log output is in the `ndt_mapping/out` directory, and the saved map is in the `DORA_NAV/mapping/ndt_mapping/saved_map` directory.

View the map:

```bash
sudo apt install pcl-tools
pcl_viewer -multiview 1 path_to_pcd_files
```

### Run Localization

```bash
dora up
dora run path.yml
```

After path.yml starts, it will record path points to `/DORA_NAV/data/path`, and log output is in the `/out` directory at the same level.

Sample the path points at intervals to generate Waypoints.txt:

```bash
python3 sample.py
```

### Run Navigation

```bash
dora up
dora run run.yml
```

## Debugging Suggestions

- If a node reports an error, create a new yml file and debug nodes one by one. Note that the nodes involved in a node's inputs must exist
- Log output is in the `/out` directory at the same level as the yml file
- If a node reports an error, first consider whether the file path is correct and whether the file permissions are correct
- Use `dora graph` to view the input-output relationship between nodes, open it in a browser to view the dataflow graph
