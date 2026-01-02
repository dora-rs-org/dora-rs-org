# Python Dora-Zenoh集成示例

本示例展示如何使用Python将Dora与[Zenoh](https://zenoh.io/)连接进行双向通信。

## 概述

两个组件相互通信：

1. **Dora节点**（Python）：向Zenoh主题发布和订阅消息
2. **Zenoh应用**（Python）：通过Zenoh与Dora节点交换消息

## 结构

- `dataflow.yml`：Dora数据流配置
- `dora_node.py`：集成Zenoh的Dora节点实现
- `zenoh_app.py`：独立的Zenoh应用程序
- `requirements.txt`：Python依赖

## 前置条件

- Python 3.8+
- Dora已安装并在PATH中可用，或通过`DORA`环境变量设置
- Python包：`dora-rs`和`eclipse-zenoh`

## 安装

安装所需的Python包：

```bash
pip install -r requirements.txt
```

## 工作原理

- **Dora节点**：
  - 每500ms向`dora/data`发布"Hello"消息
  - 订阅`zenoh/data`上的消息
  - 持续运行直到按Ctrl+C

- **Zenoh应用**：
  - 订阅`dora/data`
  - 接收5条消息后，开始向`zenoh/data`发布
  - 继续双向收发直到按Ctrl+C

## 运行示例

### 方式1：手动运行（推荐用于测试）

**终端1 - 启动Dora数据流：**
```bash
dora up
dora start dataflow.yml
```

**终端2 - 运行Zenoh应用：**
```bash
python3 zenoh_app.py
```

停止：
- 在终端2按`Ctrl+C`停止Zenoh应用
- 在终端1按`Ctrl+C`停止Dora节点，或运行：
```bash
dora destroy dataflow.yml
```

### 方式2：使用Dora Daemon

```bash
dora daemon --run-dataflow dataflow.yml
```

然后在另一个终端：
```bash
python3 zenoh_app.py
```

## 预期输出

**来自dora_node.py：**
```
Initializing Zenoh session...
Declaring Zenoh publisher for 'dora/data'...
Declaring Zenoh subscriber for 'zenoh/data'...
Dora node with Zenoh integration started!
Press Ctrl+C to stop...
Publishing message: Hello from Dora node! Message #1
Publishing message: Hello from Dora node! Message #2
Publishing message: Hello from Dora node! Message #3
...
>> [Subscriber] Received PUT ('zenoh/data': 'Hello from Zenoh app, payload counter: 0')
>> [Subscriber] Received PUT ('zenoh/data': 'Hello from Zenoh app, payload counter: 1')
...
(持续运行直到按Ctrl+C)
```

**来自zenoh_app.py：**
```
Opening Zenoh session...
Subscribing to dora/data...
Waiting for 5 messages from Dora node before publishing...
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #1')
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #2')
...
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #5')

Received 5 messages! Creating publisher for 'zenoh/data'...
Publishing to Dora node (Press Ctrl+C to stop)...

<< [Publisher] Sent payload(counter = 0)
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #6')
<< [Publisher] Sent payload(counter = 1)
>> [Subscriber] Received PUT ('dora/data': 'Hello from Dora node! Message #7')
...
(持续双向通信直到按Ctrl+C)
```

## 故障排除

- 确保Zenoh可以通信（检查防火墙设置）
- 确保已安装`dora-rs`和`eclipse-zenoh`
- 检查是否使用Python 3.8+

## 源码

完整源码请参考：[dora-examples/python-zenoh-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/python-zenoh-dataflow)
