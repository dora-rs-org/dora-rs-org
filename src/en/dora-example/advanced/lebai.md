# Lebai

This documentation describes how to control Lebai robotic arms using Dora.

The Lebai client is an experimental Dora node for interacting with Lebai robotic arms, supporting motion control, pose recording, and playback.

## Features

- Connect to Lebai robot arm via IP
- Cartesian and joint coordinate motion control
- Record and playback robot arm trajectories
- Save and load predefined poses
- Gripper control

## Dependencies

```
lebai_sdk
numpy
pyarrow
dora
```

## Configuration

Configure the robot arm IP address using an environment variable:

```bash
export LEBAI_IP="10.42.0.253"  # default value
```

## Commands

The Lebai client supports the following commands:

| Command | Description |
|---------|-------------|
| `claw` | Control gripper |
| `movec` | Move in Cartesian coordinates |
| `movej` | Move joints |
| `stop` | Stop movement |
| `save` | Save current pose |
| `go_to` | Move to saved pose |
| `record` | Start recording movements |
| `play` | Replay recorded movements |

## Dataflow Configuration Example

```yaml
nodes:
  - id: lebai-client
    path: lebai-client
    inputs:
      command: keyboard/command
    outputs:
      - position
```

## Source Code

For complete source code, see: [dora-lerobot/lebai-client](https://github.com/dora-rs/dora-lerobot/tree/main/node-hub/lebai-client)
