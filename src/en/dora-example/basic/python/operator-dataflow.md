# Operator

Operator provides a more lightweight solution with more advanced Dora features and faster communication speed.

## Install Dependencies
```bash
$ uv venv -p 3.11 --seed # Create environment
$ uv pip install -e ../../apis/python/node # Install Dora Python API
$ source .venv/bin/activate
$ pip install -r requirements.txt # Install dependencies, use requirements_llm.txt for dataflow_llm
```

Since Operator does not yet support the `--uv` flag as a startup parameter, to use the Python managed by `uv`, you need to `source .venv/bin/activate` in the terminal.
```bash
$ dora run dataflow.yml
```

<p style="text-align:center"><img src="../../images/python-operator.png" alt="Running Effect" width="75%"></p>

## Source Code

For complete source code, see: [dora-examples/python-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/python-dataflow)
