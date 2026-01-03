# Getting Started

You can run a fully looped autonomous vehicle with just the following commands:

## Start CARLA Simulator

```bash
# Pull CARLA Docker image
docker pull carlasim/carla:0.9.13

# Start CARLA simulator
docker run --privileged --gpus all --net=host -e DISPLAY=$DISPLAY carlasim/carla:0.9.13 /bin/bash ./CarlaUE4.sh -carla-server -world-port=2000 -RenderOffScreen
```

## Start dora Dataflow

```bash
# Spawn dora daemon and coordinator
dora up

# Spawn dora dataflow
dora start graphs/oasis/oasis_full.yaml --attach
```

## Step-by-Step Tutorial

To get a step-by-step tutorial, see: https://dora-rs.ai/docs/guides/dora-drives/carla

## Full Documentation

The full documentation can be found here: https://dora-rs.ai/docs/guides/dora-drives

## Source Code

- [GitHub Repository](https://github.com/dora-rs/dora-drives)
