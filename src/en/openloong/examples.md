# Openloong Examples

> The `Openloong-proto` folder in the [dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong) repository provides the gRPC-proto control interface for openloong
---
## GPS Navigation
Using gRPC microservices to get the robot's current location

> The gps_navigaton_gprc folder in the [dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong) repository provides Python implementations of the robot GPS navigation server and client
1. **Compile proto with gRPC**

    Execute in a Python environment with gRPC installed:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/gps_navigation.proto
    ```
    gRPC will read the proto file `protoFiles/gps_navigation.proto` and place the generated files in the proto directory
2. **Start gRPC server service**

    Execute in a Python environment with gRPC installed
    ```
    python gps_navigation_server.py
    ```
3. **Start gRPC client service**
    Execute in a Python environment with gRPC installed
    ```
    python gps_navigation_client.py
    ```
4. **Expected execution result**
---
## Upper Limb Control
> The `upper_controller` folder in the [dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong) repository provides Python implementations of the robot upper limb controller server and client
1. **Compile proto with gRPC**

    Execute in a Python environment with gRPC installed:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/upper_controller.proto
    ```
    gRPC will read the proto file `protoFiles/upper_controller.proto` and place the generated files in the proto directory
2. **Start gRPC server service**

    Execute in a Python environment with gRPC installed
    ```
    python upper_controller_server.py
    ```
3. **Start gRPC client service**

    Execute in a Python environment with gRPC installed
    ```
    python upper_controller_client.py
    ```
4. **Expected execution result**
---
## Openloong-Dora Workflow
>The openloong-dora-workflow folder in the [dora-rs/ospp2025openloong](https://github.com/dora-rs/ospp2025-openloong) repository provides a Python implementation for controlling robot chassis point-to-point movement and robotic arm grasping using the dora workflow
1. **Compile proto with gRPC**

    Execute the following command in a Python environment with gRPC installed to generate upper limb control related code:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/upper_controller.proto
    ```
    Execute the following command in a Python environment with gRPC installed to generate chassis control related code:
    ```
    python -m grpc_tools.protoc -I./protoFiles --python_out=proto --pyi_out=proto --grpc_python_out=proto protoFiles/chassis_controller.proto
    ```
    gRPC will read the proto files `protoFiles/upper_controller.proto` and `protoFiles/chassis_controller.proto` and place the generated files in the proto directory
2. **Start gRPC server services**

    Execute the following command in a Python environment with gRPC installed to start the upper limb controller
    ```
    python upper_controller_server.py
    ```
    Execute the following command in a Python environment with gRPC installed to start the chassis controller
    ```
    python chassis_controller_server.py
    ```
3. **Start dora workflow**
    Execute in a Python environment with dora and gRPC installed:
    ```
    dora run workflow/dataflow.yml --uv
    ```
4. **Expected execution result**

    The dora dataflow normally prints interaction information, the robot working status is normal. The demo can be viewed in the [Bilibili demo video](https://www.bilibili.com/video/BV1UY8gzvErK/?vd_source=67f358d2eb4055da73b78a31c3eb19cb)
---