# Python Arrow 测试

本文档介绍 dora-rs 中 Apache Arrow 数据格式的使用方法。

## 什么是 Arrow？

dora-rs 使用 **Apache Arrow** 作为数据通信格式。Arrow 是一种跨语言的列式内存数据格式，具有以下特点：

- **零拷贝读取** - 高效的数据传输，无需复制数据
- **跨语言支持** - Rust、Python、C++ 等语言无缝协作
- **标准化格式** - 统一的数据表示方式

## 核心概念

在 Arrow 中，**所有数据都是数组**。即使是标量值，也必须封装在列表中：

```python
import pyarrow as pa

# 标量值也需要封装为数组
value = pa.array([42])  # 不是 42，而是 [42]
```

---

## 数据类型转换

### 从 Arrow 数组转换

```python
# 获取 dora 事件中的 Arrow 数组
arrow_array = dora_event["value"]

# 转换为 Python 列表
list_data = arrow_array.to_pylist()

# 转换为 NumPy 数组（零拷贝，只读）
numpy_array = arrow_array.to_numpy()

# 转换为 Pandas Series
pandas_series = arrow_array.to_pandas()
```

### 转换为 Arrow 数组

```python
import pyarrow as pa
import numpy as np
import pandas as pd

# 从 Python 列表创建
numeric_array = pa.array([1, 2, 3])

# 从字符串列表创建
string_array = pa.array(["Hello", "World"])

# 从字典/结构体创建
struct_array = pa.array([{"a": 1, "b": 2, "c": [1, 2, 3]}])

# 从 NumPy 数组创建
numpy_array = pa.array(np.array([1, 2, 3]))

# 从 Pandas Series 创建
df = pd.DataFrame({'col1': [1, 2, 3]})
pandas_array = pa.array(df["col1"])
```

---

## 支持的数据类型

| 数据类型 | 示例 | 说明 |
|---------|------|------|
| 数值列表 | `pa.array([1, 2, 3])` | 整数、浮点数 |
| 字符串数组 | `pa.array(["Hello"])` | 文本数据 |
| 字典/结构体 | `pa.array([{"a": 1}])` | 嵌套数据结构 |
| NumPy 数组 | `pa.array(np.array([1, 2]))` | 科学计算数据 |
| Pandas Series | `pa.array(df["col"])` | 数据分析数据 |

---

## 在 dora 节点中使用

### 发送数据

```python
from dora import Node
import pyarrow as pa

node = Node()

# 发送数值数组
node.send_output("numbers", pa.array([1, 2, 3, 4, 5]))

# 发送字符串
node.send_output("message", pa.array(["Hello from dora!"]))

# 发送图像数据（NumPy 数组）
import numpy as np
image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
node.send_output("image", pa.array(image.flatten()))
```

### 接收数据

```python
from dora import Node

node = Node()

for event in node:
    if event["type"] == "INPUT":
        # 获取 Arrow 数组
        arrow_array = event["value"]

        # 转换为需要的格式
        data = arrow_array.to_numpy()

        # 处理数据...
```

---

## 零拷贝优势

Arrow 的零拷贝特性使得数据传输非常高效：

```python
# 零拷贝读取 - 直接访问内存，不复制数据
numpy_array = arrow_array.to_numpy()  # 只读访问

# 如果需要修改，需要显式复制
numpy_array_copy = arrow_array.to_numpy().copy()  # 可写
```

---

## 最佳实践

1. **使用原生类型** - 尽量使用 Arrow 原生支持的类型
2. **批量处理** - 将多个值打包成数组，而非单独发送
3. **零拷贝** - 尽量使用零拷贝读取，避免不必要的内存分配
4. **类型一致** - 保持发送和接收端的数据类型一致

---

## 源码

完整源码请参考：[dora-examples/pyarrow-test](https://gitcode.com/dora-org/dora-examples/tree/main/examples/pyarrow-test)

## 参考文档

- [Apache Arrow Python 文档](https://arrow.apache.org/docs/python/)
- [dora-rs Arrow 指南](https://dora-rs.ai/docs/guides/Development/Arrow/)
