# CMake数据流

> 地址：./examples/cmake-dataflow
>
> 关键词：CMake, Dataflow

CMake是一个跨平台的构建系统，它允许开发者使用简单的脚本来描述项目的依赖关系和构建规则，从而实现跨平台的构建。C/C++ Dora项目也可以使用CMake来构建。

## 构建
```bash
$ cmake -DDORA_ROOT_DIR=../../ -B./build . # 通过DORA_ROOT_DIR变量指定Dora项目的根目录
$ cmake --build ./build
$ cmake --install ./build
```

## 运行
```bash
$ dora run dataflow.yml
```
