# 欢迎使用 Dora-rs

Dora 是一个用于构建**响应式数据流应用**的轻量级框架，专为机器人、边缘计算和实时系统设计。

## 为什么选择 Dora？
- **模块化**：通过 Operator 组合复杂流水线
- **低延迟**：Rust 核心 + 零拷贝通信
- **多语言**：Rust 与 Python 节点无缝协作
- **轻量部署**：无中心调度器，单二进制即可运行

## 快速体验（需 Rust）
```bash
cargo install dora-cli
dora new hello-dora && cd hello-dora
dora run
```

## 项目文档

- [Dora样例](./dora-example/menu.md) - 通过例子学习Dora的使用方法
- [OpenLoong样例](./openloong/intro.md) - OpenLoong机器人相关文档

## 外部资源

- [dora-rs书](https://dora-rs.ai/dora) - 这本书包含了Dora的设计理念，可能部分内容较旧，但仍具参考价值
