# av1编码

> 地址：./examples/av1-encoding/
> 关键词：AV1

使用AV1编码在不同的主机中进行图像编码后传输，优化传输效率

# 配置
1. 在两台主机上配置好Dora环境并启动一个coordinator分别启动两个daemon，参考[多守护进程](../basic/multiple-daemons.md)
2. `dora build dataflow.yml --uv`以构建
3. `dora run dataflow.yml --uv`以运行

# 补充
[基于AV1编码的AI](https://huggingface.co/blog/haixuantao/av1-for-ai-and-robotics)
