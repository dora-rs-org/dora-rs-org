# 教程

欢迎来到 DORA-RS 实践教程！本教程将帮助你从零开始学习如何使用 DORA 构建机器人应用。

## 概述

DORA (Dataflow-Oriented Robotic Architecture) 是一个现代化的机器人框架，提供：

- **模块化设计** - 将复杂系统拆分为独立节点
- **低延迟通信** - 基于共享内存和零拷贝传输
- **多语言支持** - Python、Rust、C/C++ 混合编程
- **轻量级部署** - 无需复杂的依赖配置

## 学习路径

### 新手入门

如果你是 DORA 新手，建议按以下顺序学习：

1. **[安装](./install.md)** - 安装 DORA CLI 和依赖
2. **[echo 示例](./basic/echo.md)** - 了解基本的数据流概念
3. **[Python 数据流](./basic/python/dataflow.md)** - 创建你的第一个 Python 节点
4. **[使用相机](./medium/camera.md)** - 学习处理视频流

### 多语言开发

根据你熟悉的编程语言选择：

- **Python 开发者** - 从 [Python 基础](./basic/python.md) 开始
- **Rust 开发者** - 从 [Rust 数据流](./basic/rust/dataflow.md) 开始
- **C/C++ 开发者** - 从 [C++ 数据流](./basic/cpp.md) 开始

### AI 与感知

对 AI 应用感兴趣？推荐学习：

- [物体识别](./medium/object-detection.md) - YOLO 目标检测
- [视觉语言模型](./medium/vlm.md) - Qwen2.5-VL 多模态理解
- [语音到语音](./medium/speech-to-speech.md) - 实时语音交互

### 机器人控制

需要控制真实机器人？查看：

- [Lebai 机械臂](./advanced/lebai.md) - 乐白机械臂驱动
- [SO-101 机械臂](./advanced/so101.md) - SO-101 MuJoCo 仿真
- [Franka Panda](./advanced/franka.md) - Franka 机械臂驱动
- [UR5](./advanced/ur5.md) - Universal Robots UR5 驱动

## 源码仓库

所有示例的完整源码请访问：[gitcode.com/dora-org/dora-examples](https://gitcode.com/dora-org/dora-examples)

## 获取帮助

- 查阅 [DORA 官方文档](https://dora-rs.ai)
- 在 GitHub 上提交 [Issue](https://github.com/dora-rs/dora/issues)
- 加入社区讨论
