# 语音到文字

> 地址：./examples/speech-to-text/
> 关键词：AI，语音识别

```bash
$ dora build whisper.yaml --uv
$ dora run whisper.yaml --uv
```


该样例默认使用[openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo)模型，
如果你想使用其他模型，可以通过为dora-whisper节点添加`MODEL_NAME_OR_PATH`环境变量来更改所使用的模型。


国内用户如果收到网络影响可以使用[hf-mirror](https://hf-mirror.com)镜像来加速模型参数的拉取。
例如可以直接执行
```bash
HF_ENDPOINT=https://hf-mirror.com dora build whisper.yaml --uv
```
