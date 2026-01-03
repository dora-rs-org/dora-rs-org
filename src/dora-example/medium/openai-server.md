# OpenAI服务器示例


本示例演示如何使用`dora-openai-server`在Dora数据流中创建一个OpenAI兼容的API服务器。

## 概述

`dora-openai-server`节点暴露一个OpenAI兼容的HTTP API，可以接收来自标准OpenAI客户端的请求，并通过Dora数据流进行路由。这使得LLM功能可以与其他Dora节点无缝集成。

**注意**：Dora OpenAI Server仍处于实验阶段，未来可能会有变化。

```
OpenAI客户端 -> dora-openai-server -> dora-echo -> 响应
```

### 节点

- **dora-openai-server**：在`http://localhost:8000`暴露OpenAI兼容的API
  - 处理`/v1/chat/completions`端点
  - 支持文本和图像输入（URL和base64）
- **dora-echo**：简单的回显节点，将接收到的输入作为响应返回

## 前置条件

- Python 3.11+
- [uv](https://github.com/astral-sh/uv)包管理器
- 已安装[dora-cli](https://github.com/dora-rs/dora)
- Cargo（用于构建Rust组件）

## 开始使用

### 1. 设置环境

```bash
cd examples/openai-server

# 创建虚拟环境
uv venv -p 3.11 --seed

# 安装dora Python API（本地开发时）
uv pip install -e ../../apis/python/node --reinstall
```

### 2. 构建并运行数据流

```bash
# 构建数据流
dora build dataflow.yml --uv

# 启动dora守护进程
dora up

# 运行数据流
dora run dataflow.yml --uv
```

### 3. 使用OpenAI客户端测试

在另一个终端中：

```bash
python openai_api_client.py
```

### 4. 停止数据流

```bash
dora stop
```

## API功能

OpenAI服务器支持：

### 聊天补全

标准聊天补全请求：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy_api_key")

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)
```

### 图像输入（URL）

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"},
                },
            ],
        }
    ],
)
```

### 图像输入（Base64）

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/png;base64,iVBORw0KGgo..."},
                },
            ],
        }
    ],
)
```

## 数据流配置

默认的`dataflow.yml`：

```yaml
nodes:
  - id: dora-openai-server
    build: pip install dora-openai-server
    path: dora-openai-server
    outputs:
      - v1/chat/completions
    inputs:
      v1/chat/completions: dora-echo/echo

  - id: dora-echo
    build: pip install dora-echo
    path: dora-echo
    inputs:
      echo: dora-openai-server/v1/chat/completions
    outputs:
      - echo
```

## 数据流变体

- **dataflow.yml**：基本回显示例（Python）
- **dataflow-rust.yml**：Rust变体
- **qwenvl.yml**：与Qwen VL模型集成

## 架构

```
+----------------+     +------------------+     +-----------+
| OpenAI客户端   | --> | dora-openai-     | --> | dora-echo |
| (HTTP请求)     |     | server           |     |           |
+----------------+     | (localhost:8000) |     +-----------+
                       +------------------+           |
                              ^                       |
                              +-----------------------+
                                   (响应)
```

## 源码

完整源码请参考：[dora-examples/openai-server](https://github.com/dora-rs/dora-examples/tree/main/examples/openai-server)

- [dora-openai-server](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-openai-server) - OpenAI兼容API服务器节点
- [dora-echo](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-echo) - 简单回显节点
