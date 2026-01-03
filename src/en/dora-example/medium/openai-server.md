# OpenAI Server Example

This example demonstrates how to use the `dora-openai-server` to create an OpenAI-compatible API server within a Dora dataflow.

## Overview

The `dora-openai-server` node exposes an OpenAI-compatible HTTP API that can receive requests from standard OpenAI clients and route them through the Dora dataflow. This enables seamless integration of LLM capabilities with other Dora nodes.

**Note**: Dora OpenAI Server is still experimental and may change in the future.

```
OpenAI Client -> dora-openai-server -> dora-echo -> response
```

### Nodes

- **dora-openai-server**: Exposes an OpenAI-compatible API at `http://localhost:8000`
  - Handles `/v1/chat/completions` endpoint
  - Supports text and image inputs (URL and base64)
- **dora-echo**: Simple echo node that returns the received input as response

## Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) package manager
- [dora-cli](https://github.com/dora-rs/dora) installed
- Cargo (for building Rust components)

## Getting Started

### 1. Set up the environment

```bash
cd examples/openai-server

# Create virtual environment
uv venv -p 3.11 --seed

# Install dora Python API (if developing locally)
uv pip install -e ../../apis/python/node --reinstall
```

### 2. Build and run the dataflow

```bash
# Build the dataflow
dora build dataflow.yml --uv

# Start dora daemon
dora up

# Run the dataflow
dora run dataflow.yml --uv
```

### 3. Test with the OpenAI client

In a separate terminal:

```bash
python openai_api_client.py
```

### 4. Stop the dataflow

```bash
dora stop
```

## API Features

The OpenAI server supports:

### Chat Completions

Standard chat completion requests:

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

### Image Input (URL)

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

### Image Input (Base64)

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

## Dataflow Configuration

The default `dataflow.yml`:

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

## Dataflow Variants

- **dataflow.yml**: Basic echo example (Python)
- **dataflow-rust.yml**: Rust-based variant
- **qwenvl.yml**: Integration with Qwen VL model

## Architecture

```
+----------------+     +------------------+     +-----------+
| OpenAI Client  | --> | dora-openai-     | --> | dora-echo |
| (HTTP request) |     | server           |     |           |
+----------------+     | (localhost:8000) |     +-----------+
                       +------------------+           |
                              ^                       |
                              +-----------------------+
                                   (response)
```

## Source Code

For complete source code, see: [dora-examples/openai-server](https://github.com/dora-rs/dora-examples/tree/main/examples/openai-server)

- [dora-openai-server](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-openai-server) - OpenAI-compatible API server node
- [dora-echo](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-echo) - Simple echo node
