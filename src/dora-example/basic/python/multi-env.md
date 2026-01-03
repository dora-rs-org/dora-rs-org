# 多Python环境共存


`uv`通过`VIRTUAL_ENV`环境变量可以切换不同的Python的环境，则只需要在`dataflow.yml`中配置即可

## 构建环境
```bash
$ uv venv -p 3.11 -n env_1
$ uv venv -p 3.11 -n env_2
$ dora build dataflow.yml --uv
```
## 运行
```bash
$ dora run dataflow.yml --uv
```


运行效果应与[python-dataflow](./dataflow.md)一致。

## 源码

完整源码请参考：[dora-examples/python-multi-env](https://github.com/dora-rs/dora-examples/tree/main/examples/python-multi-env)
