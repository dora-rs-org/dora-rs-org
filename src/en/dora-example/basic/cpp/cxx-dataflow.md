# CXX Dataflow

This example shows how to create dora operators and custom nodes with C++.

Dora does not provide a native C++ API yet, but we can create adapters for either the C or Rust API. The `operator-rust-api` and `node-rust-api` folders implement an example operator and node based on dora's Rust API, using the `cxx` crate for bridging. The `operator-c-api` and `node-c-api` show how to create operators and nodes based on dora's C API.

## Project Structure

```
cxx-dataflow/
├── dataflow.yml          # Dataflow definition file
├── node-c-api/           # Node implementation using C API
├── node-rust-api/        # Node implementation using Rust API
├── operator-c-api/       # Operator implementation using C API
└── operator-rust-api/    # Operator implementation using Rust API
```

## Dataflow Configuration

```yaml
nodes:
  - id: cxx-node-rust-api
    path: build/node_rust_api
    inputs:
      tick: dora/timer/millis/300
    outputs:
      - counter

  - id: cxx-node-c-api
    path: build/node_c_api
    inputs:
      tick: cxx-node-rust-api/counter
    outputs:
      - counter
```

## Compile and Run

### Quick Start

Use the `run.rs` binary to perform all required build steps and start the dataflow automatically:

```bash
cargo run --example cxx-dataflow
```

### Manual Build

For manual build, follow these steps:

1. Create a `build` folder
2. Build Rust API crates with `cargo build`
3. Compile C node and operator libraries
4. Build dora coordinator and runtime
5. Run the dataflow using dora-daemon

## Source Code

For complete source code, see: [dora-examples/cxx-dataflow](https://github.com/dora-rs/dora-examples/tree/main/examples/cxx-dataflow)
