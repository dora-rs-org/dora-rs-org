# 基准测试

## 源码

完整源码请参考：[dora-examples/cuda-benchmark](https://github.com/dora-rs/dora-examples/tree/main/examples/cuda-benchmark)

## 概述

使用 CUDA Zero Copy 代替常规共享内存 (CPU) 的延迟测试示例。

## 安装

```bash
pip install dora-rs-cli # if not already present

# Install pyarrow with gpu support
conda install pyarrow "arrow-cpp-proc=*=cuda" -c conda-forge

## Test installation with
python -c "import pyarrow.cuda"

# Install numba for translation from arrow to torch
pip install numba

## Test installation with
python -c "import numba.cuda"

# Install torch if it's not already present
pip install torch

## Test installation with
python -c "import torch; assert torch.cuda.is_available()"
```

## 运行

```bash
dora run cpu_bench.yml

dora run cuda_bench.yml

cat benchmark_data.csv
```

## 运行演示代码

```bash
dora up
dora start demo_bench.yml --detach
python demo_receiver.py
dora destroy
```
