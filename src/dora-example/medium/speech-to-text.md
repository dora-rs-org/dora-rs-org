# 语音到文字


## 概述

此数据流创建一个完整的语音转文字流水线：

```
麦克风 -> VAD -> Whisper (STT) -> Rerun (显示)
```

流水线从麦克风捕获音频，检测您何时在说话，使用 Whisper 模型将语音转录为文字，并在 Rerun 查看器中显示结果。

## 节点

- **dora-microphone**：从麦克风捕获音频
- **dora-vad**：语音活动检测 - 检测您何时在说话
- **dora-distil-whisper**：使用 Distil-Whisper 模型进行语音转文字
- **dora-rerun**：在 Rerun 查看器中可视化转录结果

## 先决条件

- Python 3.11+
- dora-rs
- 麦克风
- uv（Python 包管理器）

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 或安装 Python 包（必须与 CLI 版本匹配）
pip install dora-rs
```

### 2. 构建和运行

```bash
cd examples/speech-to-text

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build whisper.yml --uv

# 运行数据流
dora run whisper.yml --uv
```

### 3. 查看结果

```bash
# 连接到 Rerun 查看器
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

## 配置

### Whisper 节点配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `TARGET_LANGUAGE` | 转录目标语言 | `english` |

## 数据流变体

- `whisper.yml`：使用预打包节点的生产版本
- `whisper-dev.yml`：用于本地开发的开发版本

## 架构

```
+------------+     +---------+     +------------------+
|   麦克风   | --> |   VAD   | --> | distil-whisper   |
+------------+     +---------+     | (语音转文字)     |
                                   +------------------+
                                            |
                                            v
                                       +--------+
                                       | rerun  |
                                       | (显示) |
                                       +--------+
```

## 故障排除

### 麦克风问题
- 检查系统麦克风权限
- 验证是否选择了正确的音频输入设备
- 首先在其他应用程序中测试麦克风

### 模型下载缓慢
- 首次运行需要下载 Whisper 模型，可能需要一些时间
- 确保网络连接稳定
- 模型在首次下载后会被缓存

中国用户可以使用 [hf-mirror](https://hf-mirror.com) 镜像加速模型下载：
```bash
HF_ENDPOINT=https://hf-mirror.com dora build whisper.yml --uv
```

### Rerun 版本不匹配
- 如果看到版本警告，请安装匹配的 Rerun SDK：
  ```bash
  pip install rerun-sdk==<version>
  ```

## 源码

完整源码请参考：[dora-examples/speech-to-text](https://gitcode.com/dora-org/dora-examples/tree/main/examples/speech-to-text)

- [dora-microphone](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-microphone)
- [dora-vad](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-vad)
- [dora-distil-whisper](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-distil-whisper)
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun)
