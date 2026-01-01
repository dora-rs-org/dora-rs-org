# Dataflow

> Location: examples/python-dataflow
>
> Keywords: Python, Dataflow

The official Node Hub folder provides many ready-to-use nodes.
The ones used in this example are:
- `opencv-video-capture` for reading from camera
- `dora-yolo` for object detection
- `dora-rerun` for visualization

In addition to describing inputs and outputs, `dataflow.yml` can also perform simple builds or installations through the `build` field.

## Prepare Python Environment
```bash
$ uv venv -p 3.10 --seed
```
## Install Corresponding Packages
When adding the `--uv` flag to `dora build`, it will automatically prepend `uv` before `pip` to use the Python version managed by `uv`.
```bash
$ dora build dataflow.yml --uv
```
## Run
```bash
$ dora run dataflow.yml --uv
```

The default view may only contain the photo item. In the `rerun` window that pops up, right-click the `/` item on the timeline and click to add it to a new view.

<p style="text-align:center"><img src="../../images/python-dataflow.png" alt="Running Effect" width="75%"></p>

### Dynamic Nodes
```bash
$ dora build dataflow_dynamic.yml --uv # Install required nodes
$ dora up # Start local daemon and coordinator
$ dora start dataflow_dynamic.yml --uv
```
Run in another terminal window
```bash
$ uv run opencv-plot --name plot
```
