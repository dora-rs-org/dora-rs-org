# MediaPipe Pose Detection

This example demonstrates human pose detection using [MediaPipe](https://developers.google.com/mediapipe) and dora-rs, with visualization in [Rerun](https://rerun.io/).

> Source code: [mediapipe](https://github.com/dora-rs/dora-examples/tree/main/examples/mediapipe)

## Overview

The dataflow captures frames from your webcam, processes them to detect human pose landmarks using MediaPipe, and visualizes the results in Rerun.

```
camera -> dora-mediapipe (pose detection) -> rerun (display)
```

### Nodes

- **camera**: Captures frames from your webcam using `opencv-video-capture`
- **dora-mediapipe**: Processes frames to detect human pose landmarks
- **plot**: Visualizes the camera feed and detected pose points using `dora-rerun`

## Prerequisites

- A webcam connected to your computer
- Python 3.8+
- dora-rs

## Getting Started

### 1. Install dora

```bash
# Install dora CLI
cargo install dora-cli

# Install Python package (must match CLI version)
pip install dora-rs
```

**Important**: Ensure the `dora` CLI version matches the `dora-rs` Python package version:

```bash
dora --version      # Check CLI version
pip show dora-rs    # Check Python package version
```

### 2. Build and Run

```bash
cd examples/mediapipe

# Build the dataflow
dora build dataflow.yml

# Start dora daemon
dora up

# Start the dataflow
dora start dataflow.yml
```

### 3. View the output

Connect Rerun viewer to see the video stream with pose landmarks:

```bash
rerun --connect rerun+http://127.0.0.1:9876/proxy
```

If the points are not plotted by default, try adding a 2D viewer within the Rerun interface.

### 4. Stop the dataflow

```bash
dora stop
```

## Demo

![Demo Video](https://github.com/user-attachments/assets/8cabeb13-b9a7-480f-b526-7889304d7228)

## Configuration

### Camera Node

Configure via environment variables in `dataflow.yml`:

| Variable | Description | Default |
|----------|-------------|---------|
| `CAPTURE_PATH` | Camera device index | `0` |
| `IMAGE_WIDTH` | Output image width | `640` |
| `IMAGE_HEIGHT` | Output image height | `480` |
| `ENCODING` | Image encoding format | `rgb8` |

## Outputs

The `dora-mediapipe` node outputs:

- **points2d**: 2D pose landmark coordinates detected in each frame

## RealSense Variant

A RealSense depth camera variant is available for 3D pose estimation. See the original example in [dora-hub](https://github.com/dora-rs/dora-hub/tree/main/examples/mediapipe) for details.

## Architecture

```
+--------+     +----------------+     +------+
| camera | --> | dora-mediapipe | --> | plot |
+--------+     +----------------+     +------+
```

## Source Code

- [dora-mediapipe](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-mediapipe) - MediaPipe pose detection node
- [opencv-video-capture](https://github.com/dora-rs/dora-hub/tree/main/node-hub/opencv-video-capture) - Camera capture node
- [dora-rerun](https://github.com/dora-rs/dora-hub/tree/main/node-hub/dora-rerun) - Rerun visualization node
