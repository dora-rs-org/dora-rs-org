# openloong实例

> 在[dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong)仓库`Openloong-proto`文件夹提供了openloong的gRPC-proto控制接口
---
## GPS导航
使用gRPC微服务获取机器人当前位置

> 在[dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong)仓库gps_navigaton_gprc文件夹提供了机器人GPS导航server和client的python实现
1. **使用gRPC编译proto**

    在安装有gRPC的python环境中执行:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/gps_navigation.proto
    ```
    gRPC会读取proto文件`protoFiles/gps_navigation.proto`并将生成的文件放在proto目录下
2. **启动gRPC server服务**

    在安装有gRPC的python环境下执行
    ```
    python gps_navigation_server.py
    ```
3. **启动gRPC client服务**
    在安装有gRPC的python环境下执行
    ```
    python gps_navigation_client.py
    ```
4. **执行预期效果**
---
## 上肢控制
> 在[dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong)仓库`upper_controller`文件夹提供了机器人上肢控制器server和client的python实现
1. **使用gRPC编译proto**

    在安装有gRPC的python环境中执行:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/upper_controller.proto
    ```
    gRPC会读取proto文件`protoFiles/upper_controller.proto`并将生成的文件放在proto目录下
2. **启动gRPC server服务**

    在安装有gRPC的python环境下执行
    ```
    python upper_controller_server.py
    ```
3. **启动gRPC client服务**

    在安装有gRPC的python环境下执行
    ```
    python upper_controller_client.py
    ```
4. **执行预期效果**
---
## openloong-dora工作流
>在[dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong)仓库openloong-dora-workflow文件夹提供了使用dora工作流控制机器人底盘定点移动和机械臂抓取的python实现
1. **使用gRPC编译proto**

    在安装有gRPC的python环境中执行以下命令生成上肢控制的相关代码:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/upper_controller.proto
    ```
    在安装有gRPC的python环境中执行以下命令生成底盘控制的相关代码:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/chassis_controller.proto
    ```
    gRPC会读取proto文件`protoFiles/upper_controller.proto`和`protoFiles/chassis_controller.proto`并将生成的文件放在proto目录下
2. **启动gRPC server服务**

    在安装有gRPC的python环境下执行以下命令启动上肢控制器
    ```
    python upper_controller_server.py
    ```
    在安装有gRPC的python环境下执行以下命令启动底盘控制器
    ```
    python chassis_controller_server.py
    ```
3. **启动dora工作流**
    在安装有dora和gRPC的python环境执行:
    ```
    dora run workflow/dataflow.yml --uv
    ```
4. **预期执行效果**

    dora数据流正常打印交互信息, 机器人工作状态正常, demo在[B站演示视频](https://www.bilibili.com/video/BV1UY8gzvErK/?vd_source=67f358d2eb4055da73b78a31c3eb19cb)查看
---