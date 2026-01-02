# Camera Example

This example shows how to capture webcam frames and display them using dora-rs.

## Overview

The dataflow defines a simple graph with two nodes:

- **camera**: Captures frames from your webcam using `opencv-video-capture`
- **plot**: Displays the captured frames in a window using `opencv-plot`

## Getting Started

Make sure to have `dora` installed.

```bash
pip install dora-rs
```

### Build and Run

```bash
cd examples/camera
dora build dataflow.yml
dora up
dora start dataflow.yml
```

## Dataflow Configuration

```yaml
nodes:
  - id: camera
    build: pip install opencv-video-capture
    path: opencv-video-capture
    inputs:
      tick: dora/timer/millis/20
    outputs:
      - image
    env:
      CAPTURE_PATH: 0
      IMAGE_WIDTH: 640
      IMAGE_HEIGHT: 480

  - id: plot
    build: pip install opencv-plot
    path: opencv-plot
    inputs:
      image:
        source: camera/image
        queue_size: 1
```

## Configuration Options

You can configure the camera node via environment variables:

- `CAPTURE_PATH`: Camera device index (default: `0`)
- `IMAGE_WIDTH`: Output image width (default: `640`)
- `IMAGE_HEIGHT`: Output image height (default: `480`)

## Jupyter Notebook Variant

A Jupyter notebook variant is available with `dataflow_jupyter.yml` and `notebook.ipynb`.

```bash
dora build dataflow_jupyter.yml
dora up
dora start dataflow_jupyter.yml
# Then open notebook.ipynb in Jupyter
```

## Source Code

For complete source code, see: [dora-examples/camera](https://github.com/dora-rs/dora-examples/tree/main/examples/camera)
