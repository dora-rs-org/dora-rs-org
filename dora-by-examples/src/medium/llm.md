# LLM 语音助手示例

本示例演示使用 [Qwen](https://github.com/QwenLM/Qwen) 大语言模型和 dora-rs 构建语音交互 AI 助手。它可以捕获语音、转录文字、使用 Qwen 生成回复，并将回复朗读出来。

> 源代码：[llm](https://gitcode.com/dora-org/dora-examples/tree/main/examples/llm)

## 概述

该数据流创建了一个完整的语音助手管道：

```
麦克风 -> VAD -> Whisper (语音转文字) -> Qwen (LLM) -> Kokoro (文字转语音) -> 扬声器
                                             |
                                             v
                                          rerun (显示)
```

### 节点

- **dora-microphone**：从麦克风捕获音频
- **dora-vad**：语音活动检测 - 检测你何时在说话
- **dora-distil-whisper**：使用 Distil-Whisper 模型进行语音转文字
- **dora-qwen**：大语言模型 (Qwen) 用于生成回复
- **dora-kokoro-tts**：使用 Kokoro 进行文字转语音
- **dora-pyaudio**：通过扬声器播放音频
- **plot**：使用 `dora-rerun` 在 Rerun 查看器中可视化对话

## 前置条件

- Python 3.11+
- dora-rs
- 麦克风和扬声器
- 足够的 GPU/RAM 用于本地运行 LLM（或 API 访问）

### 系统依赖

#### macOS

```bash
brew install portaudio
brew install espeak-ng
```

#### Linux

```bash
sudo apt-get install portaudio19-dev
sudo apt-get install espeak
```

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 安装 Python 包（版本必须与 CLI 匹配）
pip install dora-rs
```

**重要**：确保 `dora` CLI 版本与 `dora-rs` Python 包版本匹配：

```bash
dora --version      # 检查 CLI 版本
pip show dora-rs    # 检查 Python 包版本
```

### 2. 构建并运行

```bash
cd examples/llm

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build qwen-dev.yml --uv

# 运行数据流
dora run qwen-dev.yml --uv
```

### 3. 查看输出

连接 Rerun 查看器以查看对话：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

### 4. 交互

直接对着麦克风说话。助手会：
1. 检测你何时开始/停止说话 (VAD)
2. 将你的语音转录为文字 (Whisper)
3. 使用 Qwen LLM 生成回复
4. 将回复朗读给你 (Kokoro TTS)

### 5. 停止数据流

```bash
dora stop
```

## 配置

### Whisper 节点

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `TARGET_LANGUAGE` | 转录目标语言 | `english` |

### TTS 节点

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `ACTIVATION_WORDS` | 触发 TTS 回复的关键词 | `you` |

## 数据流变体

- **qwen-dev.yml**：标准语音助手
- **qwen-dev-interruption.yml**：支持打断的语音助手（当你开始说话时会停止朗读）

## 架构

```
+------------+     +---------+     +------------------+
|   麦克风   | --> |   VAD   | --> | distil-whisper   |
+------------+     +---------+     | (语音转文字)     |
                                   +------------------+
                                            |
                                            v
+------------+     +-------------+     +---------+
|  pyaudio   | <-- | kokoro-tts  | <-- |  qwen   |
| (扬声器)   |     | (文字转     |     |  (LLM)  |
+------------+     |   语音)     |     +---------+
                   +-------------+          |
                                            v
                                       +--------+
                                       |  plot  |
                                       | (rerun)|
                                       +--------+
```

## 故障排除

### 麦克风无法工作

- 在系统设置中检查麦克风权限
- 确保选择了正确的音频输入设备
- 先用其他应用测试麦克风

### 没有音频输出

- 检查扬声器/耳机连接
- 验证音频输出设备设置
- 确保 portaudio 安装正确

### 模型下载

首次运行时，模型（Whisper、Qwen、Kokoro）会自动下载。根据网络连接和模型大小，这可能需要一些时间。

### 版本不匹配错误

如果出现类似 `invalid type: map, expected a YAML tag starting with '!'` 的错误：

```bash
# 检查版本是否匹配
dora --version
pip show dora-rs

# 如需升级
cargo install dora-cli --version X.Y.Z
pip install dora-rs==X.Y.Z
```

## 源代码

- [dora-microphone](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-microphone) - 麦克风捕获节点
- [dora-vad](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-vad) - 语音活动检测节点
- [dora-distil-whisper](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-distil-whisper) - 语音转文字节点
- [dora-qwen](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-qwen) - Qwen LLM 节点
- [dora-kokoro-tts](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-kokoro-tts) - 文字转语音节点
- [dora-pyaudio](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-pyaudio) - 音频播放节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun 可视化节点
