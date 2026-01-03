# 算子（Operator）


Operator提供了更加轻量化的方案，并且有更多Dora的高级功能，拥有更快的通信速度。

## 安装依赖
```bash
$ uv venv -p 3.11 --seed # 创建环境
$ uv pip install -e ../../apis/python/node # 安装Dora Python API
$ source .venv/bin/activate
$ pip install -r requirements.txt # 安装依赖，如果要体验dataflow_llm，则使用requirements_llm.txt
```

由于Operator暂未适配`--uv`标签作为启动参数，为了使用`uv`管理的Python，所以要在终端中`source .venv/bin/activate`
```bash
$ dora run dataflow.yml
```

<p style="text-align:center"><img src="../../images/python-operator.png" alt="运行效果" width="75%"></p>

## 源码

完整源码请参考：[dora-examples/python-dataflow](https://gitcode.com/dora-org/dora-examples/tree/main/examples/python-dataflow)
