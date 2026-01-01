# echo

> Path: ./examples/echo
>
> Keywords: Node, Dataflow

In Dora, a logical function is typically implemented as a node (Node). The interaction between different logical functions relies on information flow (Dataflow). To facilitate the combination of different nodes, Dora uses YAML files to declare the "flow" of messages.

YAML not only declares the inputs and outputs of messages between different nodes, but can also declare the process of node building (compilation, installation). These nodes need to be built before use.

## Build
> [!TIP]
> If using Python managed by [uv](https://github.com/astral-sh/uv), you can add the `--uv` parameter to the command
Enter the `examples/echo` folder and execute the command
```bash
$ dora build dataflow.yaml # --uv
```
Output:
```text
Using Python 3.11.12 environment at: ...
Resolved 4 packages in 1.20s
      Built pyarrow-sender @ ...
Prepared 1 package in 693ms
Installed 1 package in 1ms
 ~ pyarrow-sender==0.3.11 (...)
Using Python 3.11.12 environment at: ...
Resolved 4 packages in 4ms
      Built dora-echo @ ...
Prepared 1 package in 507ms
Installed 1 package in 1ms
 + dora-echo==0.3.11 (...)
Using Python 3.11.12 environment at: ...
Resolved 4 packages in 3ms
      Built pyarrow-assert @ ...
Prepared 1 package in 499ms
Installed 1 package in 1ms
 ~ pyarrow-assert==0.3.11 (...)
```

# Run
Run the Dora framework based on the YAML file:
```bash
$ dora run dataflow.yaml # --uv
```
Output:
```text
... INFO run_inner: dora_daemon::log:     pyarrow-assert finished successfully...
```

## The Role of Each Node
node-hub provides many ready-made nodes that are convenient for reuse

In Dora, parameters are provided to nodes through environment variables
- `pyarrow-sender` node: generates a message with content `DATA`
- `dora-echo` node: sends the input content out
- `pyarrow-assert` node: checks if the received message matches `DATA`

## Additional Experiments
Modify the `DATA` parameter of `pyarrow-sender` or `pyarrow-assert`. When they are inconsistent, running will produce an error
Output:
```text
... [ERROR]
Dataflow failed:

Node `pyarrow-assert` failed: exited with code 1 with stderr output: ...
```
