# Installation
Dora provides multiple installation methods
<!-- langtabs-start -->
```pip
pip install dora-rs-cli
```
```Linux
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/dora-rs/dora/releases/latest/download/dora-cli-installer.sh | sh
```
```MacOS
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/dora-rs/dora/releases/latest/download/dora-cli-installer.sh | sh
```
```Windows
powershell -ExecutionPolicy ByPass -c "irm https://github.com/dora-rs/dorareleases/latest/download/dora-cli-installer.ps1 | iex"
```
```Cargo
cargo install dora-cli
```
```Docker
docker pull ghcr.io/dora-rs/dora-slim # Pull image
docker run ghcr.io/dora-rs/dora-slim dora --help # Run container
```
```Latest
git clone https://github.com/dora-rs/dora.git
cd dora
cargo build --release -p dora-cli
PATH=$PATH:$(pwd)/target/release
```
<!-- langtabs-end -->

> [!IMPORTANT]
> This document mainly focuses on the latest code from the main branch. If you want to have the exact same experience, please use Dora from the main branch.
> All examples and some language-specific packages (Rust Crates) are only provided in the source code. At this stage, it is recommended to install from source.

Confirm installation completion
```bash
$ dora --version
dora-cli 0.3.11
```

# Installing Dora from Source (Using Ubuntu 24.04 as an example)

## Install Rust
Install rustup, which is an important tool for managing Rust versions and compilation toolchains
``` bash
$ sudo apt install curl -y # Install curl if not already installed
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh # When prompted, press Enter to select the default installation
$ export PATH=$PATH:$HOME/.cargo/bin # Set environment variable
```

<p style="text-align:center"><img src="images/rustup-installation.png" alt="rustup installation screen" width="75%"></p>

## Get Dora Source Code
```bash
$ sudo apt install git -y # Install git if not already installed
$ git clone https://github.com/dora-rs/dora.git
$ cd dora
```

## Compile Dora-CLI
Dora-CLI is a very practical command-line tool that provides many convenient commands for managing Dora projects.
```bash
$ sudo apt install build-essential -y # Install C/C++ compilation environment packages (including g++, etc.) if not already installed
$ cargo build --release --package dora-cli
```
## Add to Environment Variables
```bash
$ export PATH=$PATH:$(pwd)/target/release # Add to environment variables
```
Or you can use the official script
```bash
$ ./install.sh
```
