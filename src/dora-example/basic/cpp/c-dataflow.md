# C数据流


## 构建C API相关包
```bash
$ cargo build -p dora-node-api-c
$ cargo build -p dora-operator-api-c
```
## Node

### Source
```bash
$ alias C=gcc # 用clang亦可以
$ C node.c -lm -lrt -ldl -pthread -ldora_node_api_c -L../../target/debug/ -o ./build/c_node
```
### Sink
```bash
$ C sink.c -lm -lrt -ldl -pthread -ldora_node_api_c -L../../target/debug/ -o ./build/c_sink
```
## Operator
```bash
$ C -c operator.c -o build/operator.o -fPIC # 编译
$ C -shared build/operator.o -L../../target/debug/ -ldora_operator_api_c -o ./build/liboperator.so
```

## 源码

完整源码请参考：[dora-examples/c-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/c-dataflow)
