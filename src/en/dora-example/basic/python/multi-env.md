# Multi-Python Environment Coexistence

> Location: examples/python-multi-env
>
> Keywords: Multi-environment

`uv` can switch between different Python environments through the `VIRTUAL_ENV` environment variable, so you only need to configure it in `dataflow.yml`.

## Build Environment
```bash
$ uv venv -p 3.11 -n env_1
$ uv venv -p 3.11 -n env_2
$ dora build dataflow.yml --uv
```
## Run
```bash
$ dora run dataflow.yml --uv
```


The running effect should be consistent with [python-dataflow](./dataflow.md).
