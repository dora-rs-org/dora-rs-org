# Development Environment Setup
## Dora Environment
> For dora environment installation, see [dora official documentation](https://dora-rs.ai/zh-CN/)
---
## Openloong Microservice Framework gRPC Installation
1. **Dependencies**

- Python 3.7 or higher
- pip 9.0.1 or higher
- Install grpc:
    ```
    python -m pip install grpcio
    # Or install system-wide
    sudo python -m pip install grpcio
    ```
2. **Install gRPC tools**
    ```
    python -m pip install grpcio-tools
    ```
    Download the official latest version code and related examples from the GitHub repository
    ```
    git clone -b v1.73.0 --depth 1 --shallow-submodules https://github.com/grpc/grpc
    ```
    Run in the ```examples/python/helloworld``` directory:
    ```
    python greeter_server.py
    ```
    In another terminal, run in the ```examples/python/helloworld``` directory:
    ```
    python greeter_client.py
    ```
    If the above completes successfully, the gRPC service can be started
3. **Potential Pitfalls**

    When recursively cloning the gRPC repository, it is easy to fail when cloning submodules, resulting in missing modules. Although subsequent compilation (C++ version) may pass smoothly, some functionality will be missing and the gRPC framework cannot be run;

