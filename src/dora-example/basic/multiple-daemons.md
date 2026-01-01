# 多守护进程（Daemon）

> 地址：examples/multiple-daemons
> 关键词：Daemon, Coordinator

Dora通过Coordinator来协调多个Daemon的运行。Daemon可以来自不同的机器。这是Dora分布式的基础。

## 启动准备
### 启动一个协调器（Coordinator）
```bash
$ dora coordinator
```
其运行ip与端口的绑定设置，可通过添加`--help`参数来查看，样例中用默认的设置即可。

### 启动守护进程（Daemon）
```bash
$ dora daemon --machine-id A
$ dora daemon --machine-id B
```
分别启动两个分别名为A和B的守护进程。
可以通过`--coordinator-addr`和`--coordinator-port`来指定协调器的地址和端口。
具体可以参考`dora daemon --help`。

## 构建
```bash
$ dora build dataflow.yml
```
可以通过`--coordinator-addr`和`--coordinator-port`来指定协调器的地址和端口。
具体可以参考`dora build --help`。

## 运行
``` bash
$ dora start dataflow.yml
```
可以通过`--coordinator-addr`和`--coordinator-port`来指定协调器的地址和端口。
具体可以参考`dora start --help`。
