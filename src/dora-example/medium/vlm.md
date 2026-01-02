# 视觉语言模型 (VLM) 示例

## 概述

此数据流使用 Qwen2.5-VL 创建视觉语言交互管道：

```
相机 -> Qwen2.5-VL -> Rerun (显示)
```

该管道从相机捕获视频，使用视觉语言模型处理图像以理解和描述所见内容，并在 Rerun 查看器中显示结果。它还可以集成语音功能，实现完整的多模态体验。

## 节点

- **opencv-video-capture**：从相机捕获视频
- **dora-qwen2-5-vl**：视觉语言模型 (Qwen2.5-VL) 用于图像理解
- **dora-qwenvl**：原始 QwenVL 模型（备选）
- **dora-rerun**：可视化相机画面和 VLM 响应
- **dora-microphone**：捕获语音输入的音频（可选）
- **dora-vad**：语音活动检测（可选）
- **dora-distil-whisper**：语音转文字，用于语音提问（可选）
- **dora-kokoro-tts**：文字转语音，用于语音回复（可选）
- **dora-pyaudio**：TTS 音频输出（可选）

## 前置条件

- Python 3.11+
- dora-rs
- 相机（网络摄像头）
- uv（Python 包管理器）
- 推荐使用 GPU（CUDA/MPS 可加速推理）

## 快速开始

### 1. 安装 dora

```bash
# 安装 dora CLI
cargo install dora-cli

# 或安装 Python 包（必须与 CLI 版本匹配）
pip install dora-rs
```

### 2. 构建和运行

#### 仅视觉模式（简单）

```bash
cd examples/vlm

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build qwen2-5-vl-vision-only-dev.yml --uv

# 运行数据流
dora run qwen2-5-vl-vision-only-dev.yml --uv
```

#### 语音到语音模式（完整）

```bash
cd examples/vlm

# 创建虚拟环境
uv venv --seed -p 3.11

# 构建数据流
dora build qwenvl.yml --uv

# 运行数据流
dora run qwenvl.yml --uv
```

#### 无需克隆仓库

```bash
uv venv -p 3.11 --seed
dora build https://raw.githubusercontent.com/dora-rs/dora/main/examples/vlm/qwenvl.yml --uv
dora run https://raw.githubusercontent.com/dora-rs/dora/main/examples/vlm/qwenvl.yml --uv
```

### 3. 查看结果

```bash
# 连接到 Rerun 查看器
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

## 配置

### 相机节点配置

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `CAPTURE_PATH` | 相机设备索引或视频路径 | `0` |
| `IMAGE_WIDTH` | 捕获宽度 | `640` |
| `IMAGE_HEIGHT` | 捕获高度 | `480` |

### VLM 节点配置

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `DEFAULT_QUESTION` | 关于图像的提问 | `Describe the image in three words.` |
| `IMAGE_RESIZE_RATIO` | 输入图像的缩放比例 | `1.0` |
| `USE_MODELSCOPE_HUB` | 使用 ModelScope 代替 HuggingFace | `false` |

### Whisper 节点配置

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `TARGET_LANGUAGE` | 语音识别语言 | `english` |

## 数据流变体

### 仅视觉
- `qwen2-5-vl-vision-only-dev.yml`：相机 + Qwen2.5-VL + Rerun（简单视觉模式）

### 语音到语音
- `qwenvl.yml`：使用 QwenVL + OuteTTS 的完整管道，支持语音输入/输出
- `qwen2-5-vl-speech-to-speech-dev.yml`：使用 Qwen2.5-VL + Kokoro TTS 的完整管道
- `qwenvl-dev.yml`：使用本地节点路径的开发版本

## 架构

### 仅视觉管道

```
+--------+     +-------------+     +--------+
| 相机   | --> | Qwen2.5-VL  | --> | Rerun  |
+--------+     | (VLM)       |     | (显示) |
               +-------------+     +--------+
```

### 语音到语音管道

```
+------------+     +---------+     +---------+
|   麦克风   | --> |   VAD   | --> | Whisper |
+------------+     +---------+     | (STT)   |
                                   +---------+
                                        |
                                        v
+--------+     +-------------+     +---------+     +--------+
| 相机   | --> | Qwen2.5-VL  | <-- |  问题   |     | Rerun  |
+--------+     | (VLM)       |     +---------+     | (显示) |
               +-------------+                     +--------+
                    |                                  ^
                    v                                  |
               +---------+     +---------+             |
               | Kokoro  | --> | PyAudio |-------------+
               | (TTS)   |     | (扬声器)|
               +---------+     +---------+
```

## 功能特性

- **实时视觉理解**：描述场景、识别物体、读取文字
- **语音交互**：使用语音询问相机所见内容
- **语音回复**：通过文字转语音听取 VLM 的回答
- **可定制提示**：配置默认问题用于自动分析
- **多模型支持**：可选择 Qwen2.5-VL 或原始 QwenVL

## 应用场景

- **无障碍辅助**：为视障用户描述周围环境
- **质量检测**：带语音反馈的自动化视觉检测
- **互动演示**：语音控制的图像分析
- **机器人**：自主系统的视觉理解
- **教育**：视觉内容的交互式学习

## 故障排除

### 相机问题
- 检查系统相机权限
- 验证 `CAPTURE_PATH` 中的相机设备索引是否正确
- 先在其他应用中测试相机

### 模型下载慢
- 首次运行需要下载可能数 GB 的 VLM 模型
- 确保网络连接稳定
- 模型在首次下载后会被缓存
- 在中国可使用 `USE_MODELSCOPE_HUB=true` 加速下载

### GPU 内存问题
- Qwen2.5-VL 需要较大的 GPU 内存
- 减小 `IMAGE_RESIZE_RATIO` 以降低内存使用
- 如有可用，使用较小的模型变体

### 麦克风问题（语音到语音）
- 检查系统麦克风权限
- 验证是否选择了正确的音频输入设备
- 先在其他应用中测试麦克风

### Rerun 版本不匹配
- 如果看到版本警告，安装匹配的 Rerun SDK：
  ```bash
  pip install rerun-sdk==<version>
  ```

## 源码

- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture)
- [dora-qwen2-5-vl](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-qwen2-5-vl)
- [dora-qwenvl](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-qwenvl)
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun)
- [dora-distil-whisper](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-distil-whisper)
- [Qwen2.5-VL (Alibaba)](https://github.com/QwenLM/Qwen2.5-VL)
