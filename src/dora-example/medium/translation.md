# 翻译

> 地址：./examples/translation/
> 关键词：AI，语音翻译，多语言

## 概述

此数据流创建实时语音翻译流水线：

```
麦克风 -> VAD -> Whisper (STT) -> 翻译 -> Rerun (显示)
```

流水线从麦克风捕获音频，检测语音活动，使用 Whisper 转录语音，翻译成另一种语言，并在 Rerun 查看器中显示结果。

## 节点

- **dora-microphone**：从麦克风捕获音频
- **dora-vad**：语音活动检测 - 检测您何时在说话
- **dora-distil-whisper**：使用 Distil-Whisper 模型进行语音转文字
- **dora-argotranslate**：使用 Argos Translate 进行离线翻译
- **dora-phi4**：使用 Microsoft Phi-4 进行多模态翻译（替代方案）
- **dora-rerun**：在 Rerun 查看器中可视化转录和翻译结果
- **dora-kokoro-tts**：翻译输出的文字转语音（可选）
- **dora-pyaudio**：TTS 音频输出（可选）

## 先决条件

- Python 3.11+
- dora-rs
- 麦克风
- uv（Python 包管理器）
- Phi-4 推荐使用 GPU（flash-attn 需要 CUDA）

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 或安装 Python 包（必须与 CLI 版本匹配）
pip install dora-rs
```

### 2. 构建和运行

#### 使用 Phi-4（多模态翻译）

```bash
cd examples/translation

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build phi4-dev.yml --uv

# 运行数据流
dora run phi4-dev.yml --uv

# 开始用英语、中文、德语、法语、意大利语、日语、西班牙语或葡萄牙语说话
```

#### 使用 Argos Translate（离线翻译）

```bash
cd examples/translation

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建英语到中文翻译
dora build dataflow_en_zh.yml --uv

# 运行数据流
dora run dataflow_en_zh.yml --uv
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
| `TARGET_LANGUAGE` | 口语输入的语言 | `english` |
| `TRANSLATE` | 启用 Whisper 翻译 | `false` |

### Argos Translate 配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `SOURCE_LANGUAGE` | 源语言代码（如 en、zh、fr） | 必填 |
| `TARGET_LANGUAGE` | 目标语言代码（如 en、zh、fr） | 必填 |

### Phi-4 配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `LEAD_MODALITY` | 主要输入模态 | `audio` |

## 数据流变体

### Argos Translate 流水线
- `dataflow_en_zh.yml`：英语到中文
- `dataflow_zh_en.yml`：中文到英语
- `dataflow_en_fr.yml`：英语到法语
- `dataflow_fr_en.yml`：法语到英语
- `dataflow_en_zh_terminal.yml`：英语到中文（终端输出）
- `dataflow_zh_en_terminal.yml`：中文到英语（终端输出）
- `dataflow_en_zh_terminal_argo.yml`：英语到中文（终端显示）

### Phi-4 流水线
- `phi4-dev.yml`：带 TTS 输出的多模态翻译（支持 8+ 种语言）

## 架构

### Argos Translate 流水线

```
+------------+     +---------+     +------------------+     +------------------+
|   麦克风   | --> |   VAD   | --> | distil-whisper   | --> | argos-translate  |
+------------+     +---------+     | (语音转文字)     |     | (翻译)           |
                                   +------------------+     +------------------+
                                                                    |
                                                                    v
                                                               +--------+
                                                               | rerun  |
                                                               | (显示) |
                                                               +--------+
```

### Phi-4 流水线（带 TTS）

```
+------------+     +---------+     +------------------+     +------------------+
|   麦克风   | --> |   VAD   | --> |     Phi-4        | --> |   kokoro-tts     |
+------------+     +---------+     | (多模态 AI)      |     | (文字转语音)     |
                                   +------------------+     +------------------+
                                            |                        |
                                            v                        v
                                       +--------+              +-----------+
                                       | rerun  |              | pyaudio   |
                                       | (显示) |              | (扬声器)  |
                                       +--------+              +-----------+
```

## 支持的语言

### Argos Translate
- 英语 (en)
- 中文 (zh)
- 法语 (fr)
- 德语 (de)
- 西班牙语 (es)
- 意大利语 (it)
- 葡萄牙语 (pt)
- 以及更多...

### Phi-4 多模态
- 英语
- 中文
- 德语
- 法语
- 意大利语
- 日语
- 西班牙语
- 葡萄牙语

## 故障排除

### 麦克风问题
- 检查系统麦克风权限
- 验证是否选择了正确的音频输入设备
- 首先在其他应用程序中测试麦克风

### 模型下载缓慢
- 首次运行需要下载 Whisper 和翻译模型，可能需要一些时间
- 确保网络连接稳定
- 模型在首次下载后会被缓存

### Phi-4 Flash Attention 错误
- flash-attn 需要 CUDA 和 Linux
- 安装命令：`pip install flash-attn --no-build-isolation`
- 对于非 CUDA 系统，请使用 Argos Translate 流水线

### Argos 语言包未找到
- 安装语言包：`argospm install translate-en_zh`
- 检查可用包：`argospm search`

### Rerun 版本不匹配
- 如果看到版本警告，请安装匹配的 Rerun SDK：
  ```bash
  pip install rerun-sdk==<version>
  ```

## 源码

完整源码请参考：[dora-examples/translation](https://github.com/dora-rs/dora-examples/tree/main/examples/translation)

- [dora-microphone](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-microphone)
- [dora-vad](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-vad)
- [dora-distil-whisper](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-distil-whisper)
- [dora-argotranslate](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-argotranslate)
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun)
- [Argos Translate](https://github.com/argosopentech/argos-translate)
