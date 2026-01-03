# Build and Launch

## Common Commands in Dora-CLI
The Dora command-line tool provides commands such as `build` and `start`.

- `coordinator` starts a coordinator process for scheduling and coordination.
- `daemon` starts a daemon process locally for running dataflows, can be configured to connect to any coordinator.
- `start` launches a dataflow, can be configured to connect to any coordinator.
- `run` is equivalent to creating a coordinator and daemon locally and loading the corresponding dataflow.yml on them.
- ...

## YAML Configuration File

Dora describes dataflows using YAML configuration files.
Example format:
```yaml
nodes:
    - id: rust-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-node
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-node
      inputs:
          tick: dora/timer/millis/10
      outputs:
          - random

    - id: rust-status-node
      _unstable_deploy:
          machine: A
      build: cargo build --release -p rust-dataflow-example-status-node
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-status-node
      inputs:
          tick: dora/timer/millis/100
          random: rust-node/random
      outputs:
          - status

    - id: rust-sink
      _unstable_deploy:
          machine: B
      build: cargo build --release -p rust-dataflow-example-sink
      path: $DORA_EXAMPLES/target/release/rust-dataflow-example-sink
      inputs:
          message: rust-status-node/status
```
### More Flexible Startup Through Environment Variables
Environment variables can be used in both the build and path fields, such as `$DORA_EXAMPLES`.
This allows for more flexible placement of node locations.
It's worth noting that the environment variables in these two fields will use the environment variables from the daemon's runtime environment.

### Tips for the Build Field
Dora's build field is inspired by GitHub Actions' design, but its functionality is not complete.
The build field allows declaring builds that require multiple commands through multiple lines.
If you need to use scripts or more complex parameters, you can use `bash -c "..."`
