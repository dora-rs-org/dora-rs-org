# C Dataflow

> Location: ./examples/c-dataflow
>
> Keywords: Dataflow, C

## Build C API Related Packages
```bash
$ cargo build -p dora-node-api-c
$ cargo build -p dora-operator-api-c
```
## Node

### Source
```bash
$ alias C=gcc # clang can also be used
$ C node.c -lm -lrt -ldl -pthread -ldora_node_api_c -L../../target/debug/ -o ./build/c_node
```
### Sink
```bash
$ C sink.c -lm -lrt -ldl -pthread -ldora_node_api_c -L../../target/debug/ -o ./build/c_sink
```
## Operator
```bash
$ C -c operator.c -o build/operator.o -fPIC # Compile
$ C -shared build/operator.o -L../../target/debug/ -ldora_operator_api_c -o ./build/liboperator.so
```
