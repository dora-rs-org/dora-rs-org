# 异步


```bash
$ uv venv -p 3.11 --seed # 创建环境
$ uv pip install -e ../../apis/python/node # 安装Dora Python API
$ dora build dataflow.yml --uv # 安装依赖
```

## 运行
```bash
$ dora run dataflow.yml --uv
```

本例较为简单展示了使用Python通过异步方式进行消息IO。
- `receive_data.py` 异步接收数据
- `send_data.py` 发送数据

## 源码

完整源码请参考：[dora-examples/python-async](https://gitcode.com/dora-org/dora-examples/tree/main/examples/python-async)
