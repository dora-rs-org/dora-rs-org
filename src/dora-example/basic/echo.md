# echo

Dora中，一个逻辑功能通常作为节点（Node）。不同逻辑功能的交互依赖于信息的交互（Dataflow）。为了方便不同节点之间的组合，Dora使用yaml文件来声明消息的“流动”。

yaml不仅声明了不同节点消息的输入、输出，还可以声明节点构建（编译、安装）的过程。在使用这些节点之前需要先进行构建。

## 构建
> [!TIP]
> 如果使用[uv](https://github.com/astral-sh/uv)管理的python可在命令中加入`--uv`参数
进入`examples/echo`文件夹，执行命令
```bash
# Create a virtual environment if it doesn't exist
$ uv venv -p 3.11 --seed 
$ dora build dataflow.yml --uv
$ dora run dataflow.yml --uv
```
输出：
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

# 运行
依据yaml文件运行Dora框架：
```bash
$ dora run dataflow.yaml # --uv
```
输出：
```text
... INFO run_inner: dora_daemon::log:     pyarrow-assert finished successfully...
```

## 各节点的作用
node-hub提供了很多现成的方便复用的节点

Dora中通过环境变量为节点提供参数
- `pyarrow-sender`节点：生成了内容为`DATA`的信息
- `dora-echo`节点：将输入的内容发送出去
- `pyarrow-assert`节点：判断接收消息与`DATA`是否一致

## 额外的尝试
更改`pyarrow-sender`或`pyarrow-assert`的`DATA`参数，在二者不一致时运行会产生报错
输出：
```text
... [ERROR]
Dataflow failed:

Node `pyarrow-assert` failed: exited with code 1 with stderr output: ...
```

## 源码

完整源码请参考：[dora-examples/echo](https://gitcode.com/dora-org/dora-examples/tree/main/examples/echo)
