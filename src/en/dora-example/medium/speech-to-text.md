# Speech to Text

> Location: ./examples/speech-to-text/
> Keywords: AI, speech recognition

```bash
$ dora build whisper.yaml --uv
$ dora run whisper.yaml --uv
```


This example uses the [openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo) model by default.
If you want to use a different model, you can change the model by adding the `MODEL_NAME_OR_PATH` environment variable to the dora-whisper node.


Users in China who are affected by network restrictions can use the [hf-mirror](https://hf-mirror.com) mirror to accelerate model parameter downloads.
For example, you can directly execute
```bash
HF_ENDPOINT=https://hf-mirror.com dora build whisper.yaml --uv
```

## Source Code

For complete source code, see: [dora-examples/speech-to-text](https://github.com/dora-rs/dora-examples/tree/main/examples/speech-to-text)
