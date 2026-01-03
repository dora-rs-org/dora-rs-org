# 语音到语音示例


本示例演示使用dora-rs构建的实时语音到语音管道。它捕获您的声音，使用Whisper进行转录，并使用Kokoro TTS将转录内容朗读出来。

## 概述

数据流创建了一个完整的语音回声管道：

```
麦克风 -> VAD -> Whisper (STT) -> Kokoro (TTS) -> 扬声器
                                       |
                                       v
                                   rerun (显示)
```

### 节点

- **dora-microphone**：从麦克风捕获音频
- **dora-vad**：语音活动检测 - 检测您何时在说话
- **dora-distil-whisper**：使用Distil-Whisper模型进行语音转文字
- **dora-kokoro-tts**：使用Kokoro进行文字转语音输出
- **dora-pyaudio**：通过扬声器播放音频
- **dora-rerun**：在Rerun查看器中可视化转录内容

## 前置条件

- Python 3.11+
- dora-rs
- 麦克风和扬声器
- 已安装portaudio和espeak-ng

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

## 开始使用

### 1. 安装dora

```bash
# 安装dora CLI
cargo install dora-cli

# 安装Python包（必须与CLI版本匹配）
pip install dora-rs
```

**重要**：确保`dora` CLI版本与`dora-rs` Python包版本匹配：

```bash
dora --version      # 检查CLI版本
pip show dora-rs    # 检查Python包版本
```

### 2. 构建并运行

```bash
cd examples/speech-to-speech

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build kokoro-dev.yml --uv

# 运行数据流
dora run kokoro-dev.yml --uv
```

### 3. 查看输出

连接Rerun查看器以查看转录内容：

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

### 4. 交互

只需对着麦克风说话。管道将：
1. 检测您何时开始/停止说话（VAD）
2. 将您的语音转录为文字（Whisper）
3. 将转录内容朗读给您（Kokoro TTS）

### 5. 停止数据流

```bash
dora stop
```

## 配置

### Whisper节点

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `TARGET_LANGUAGE` | 转录的目标语言 | `english` |

## 数据流变体

- **kokoro-dev.yml**：使用Kokoro TTS进行语音合成
- **outtetts-dev.yml**：使用OuteTTS进行语音合成
- **outtetts.yml**：使用OuteTTS的生产版本

## 架构

```
+------------+     +---------+     +------------------+
|   麦克风   | --> |   VAD   | --> | distil-whisper   |
+------------+     +---------+     | (语音转文字)     |
                                   +------------------+
                                            |
                                            v
+------------+     +-------------+     +---------+
|  pyaudio   | <-- | kokoro-tts  | <-- | whisper |
| (扬声器)   |     | (文字转     |     |  (STT)  |
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
- 先用其他应用程序测试麦克风

### 无音频输出

- 检查扬声器/耳机连接
- 验证音频输出设备设置
- 确保portaudio已正确安装

### PyAudio架构不匹配（macOS Apple Silicon）

如果看到类似`incompatible architecture (have 'x86_64', need 'arm64')`的错误：

```bash
# 删除旧的pyaudio并使用正确的架构重新安装
pip uninstall pyaudio
ARCHFLAGS="-arch arm64" pip install --no-cache-dir --no-binary :all: pyaudio
```

### 模型下载

首次运行时，模型（Whisper、Kokoro）将自动下载。这可能需要一些时间，取决于您的网络连接和模型大小。

### 版本不匹配错误

如果看到类似`invalid type: map, expected a YAML tag starting with '!'`的错误：

```bash
# 检查版本是否匹配
dora --version
pip show dora-rs

# 如需升级
cargo install dora-cli --version X.Y.Z
pip install dora-rs==X.Y.Z
```

## 源码

完整源码请参考：[dora-examples/speech-to-speech](https://gitcode.com/dora-org/dora-examples/tree/main/examples/speech-to-speech)

- [dora-microphone](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-microphone) - 麦克风捕获节点
- [dora-vad](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-vad) - 语音活动检测节点
- [dora-distil-whisper](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-distil-whisper) - 语音转文字节点
- [dora-kokoro-tts](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-kokoro-tts) - 文字转语音节点
- [dora-pyaudio](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-pyaudio) - 音频播放节点
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun可视化节点
