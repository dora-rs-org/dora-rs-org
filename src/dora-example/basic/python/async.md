# 异步

> 地址：examples/python-async
>
> 关键词：异步

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
