# Python Arrow Test

This document explains how to use Apache Arrow data format in dora-rs.

## What is Arrow?

dora-rs uses **Apache Arrow** as its data communication format. Arrow is a cross-language columnar memory data format with the following features:

- **Zero-Copy Read** - Efficient data transfer without copying data
- **Cross-Language Support** - Seamless collaboration between Rust, Python, C++, etc.
- **Standardized Format** - Unified data representation

## Core Concept

In Arrow, **everything is an array**. Even scalar values must be encapsulated in a list:

```python
import pyarrow as pa

# Scalar values must be wrapped as arrays
value = pa.array([42])  # Not 42, but [42]
```

---

## Data Type Conversion

### Converting from Arrow Arrays

```python
# Get Arrow array from dora event
arrow_array = dora_event["value"]

# Convert to Python list
list_data = arrow_array.to_pylist()

# Convert to NumPy array (zero-copy, read-only)
numpy_array = arrow_array.to_numpy()

# Convert to Pandas Series
pandas_series = arrow_array.to_pandas()
```

### Converting to Arrow Arrays

```python
import pyarrow as pa
import numpy as np
import pandas as pd

# From Python list
numeric_array = pa.array([1, 2, 3])

# From string list
string_array = pa.array(["Hello", "World"])

# From dictionary/struct
struct_array = pa.array([{"a": 1, "b": 2, "c": [1, 2, 3]}])

# From NumPy array
numpy_array = pa.array(np.array([1, 2, 3]))

# From Pandas Series
df = pd.DataFrame({'col1': [1, 2, 3]})
pandas_array = pa.array(df["col1"])
```

---

## Supported Data Types

| Data Type | Example | Description |
|-----------|---------|-------------|
| Numeric List | `pa.array([1, 2, 3])` | Integers, floats |
| String Array | `pa.array(["Hello"])` | Text data |
| Dictionary/Struct | `pa.array([{"a": 1}])` | Nested data structures |
| NumPy Array | `pa.array(np.array([1, 2]))` | Scientific computing data |
| Pandas Series | `pa.array(df["col"])` | Data analysis data |

---

## Usage in dora Nodes

### Sending Data

```python
from dora import Node
import pyarrow as pa

node = Node()

# Send numeric array
node.send_output("numbers", pa.array([1, 2, 3, 4, 5]))

# Send string
node.send_output("message", pa.array(["Hello from dora!"]))

# Send image data (NumPy array)
import numpy as np
image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
node.send_output("image", pa.array(image.flatten()))
```

### Receiving Data

```python
from dora import Node

node = Node()

for event in node:
    if event["type"] == "INPUT":
        # Get Arrow array
        arrow_array = event["value"]

        # Convert to desired format
        data = arrow_array.to_numpy()

        # Process data...
```

---

## Zero-Copy Advantage

Arrow's zero-copy feature makes data transfer highly efficient:

```python
# Zero-copy read - directly access memory without copying data
numpy_array = arrow_array.to_numpy()  # Read-only access

# If modification is needed, explicitly copy
numpy_array_copy = arrow_array.to_numpy().copy()  # Writable
```

---

## Best Practices

1. **Use Native Types** - Prefer Arrow's natively supported types
2. **Batch Processing** - Pack multiple values into arrays instead of sending individually
3. **Zero-Copy** - Use zero-copy reads whenever possible to avoid unnecessary memory allocation
4. **Type Consistency** - Keep data types consistent between sender and receiver

---

## Source Code

For complete source code, see: [dora-examples/pyarrow-test](https://github.com/dora-rs/dora-examples/tree/main/examples/pyarrow-test)

## Reference Documentation

- [Apache Arrow Python Documentation](https://arrow.apache.org/docs/python/)
- [dora-rs Arrow Guide](https://dora-rs.ai/docs/guides/Development/Arrow/)
