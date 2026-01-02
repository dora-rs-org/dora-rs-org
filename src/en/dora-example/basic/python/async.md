# Async

> Location: examples/python-async
>
> Keywords: Async

```bash
$ uv venv -p 3.11 --seed # Create environment
$ uv pip install -e ../../apis/python/node # Install Dora Python API
$ dora build dataflow.yml --uv # Install dependencies
```

## Run
```bash
$ dora run dataflow.yml --uv
```

This example demonstrates a simple message I/O using Python in an asynchronous manner.
- `receive_data.py` - Asynchronously receive data
- `send_data.py` - Send data

## Source Code

For complete source code, see: [dora-examples/python-async](https://github.com/dora-rs/dora-examples/tree/main/examples/python-async)
