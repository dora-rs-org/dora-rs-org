# Multiple Daemons

Dora coordinates the execution of multiple Daemons through the Coordinator. Daemons can come from different machines. This is the foundation of Dora's distributed capabilities.

## Launch Preparation
### Start a Coordinator
```bash
$ dora coordinator
```
The binding settings for its running IP and port can be viewed by adding the `--help` parameter. The default settings are sufficient for the example.

### Start Daemons
```bash
$ dora daemon --machine-id A
$ dora daemon --machine-id B
```
Start two daemons named A and B respectively.
You can specify the coordinator's address and port through `--coordinator-addr` and `--coordinator-port`.
For details, refer to `dora daemon --help`.

## Build
```bash
$ dora build dataflow.yml
```
You can specify the coordinator's address and port through `--coordinator-addr` and `--coordinator-port`.
For details, refer to `dora build --help`.

## Run
``` bash
$ dora start dataflow.yml
```
You can specify the coordinator's address and port through `--coordinator-addr` and `--coordinator-port`.
For details, refer to `dora start --help`.

## Source Code

For complete source code, see: [dora-examples/multiple-daemons](https://github.com/dora-rs/dora-examples/tree/main/examples/multiple-daemons)
