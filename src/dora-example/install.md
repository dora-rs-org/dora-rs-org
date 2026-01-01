# 安装
Dora 提供了多种安装方式
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
docker pull ghcr.io/dora-rs/dora-slim #拉取镜像
docker run ghcr.io/dora-rs/dora-slim dora --help #运行容器
```
```Latest
git clone https://github.com/dora-rs/dora.git
cd dora
cargo build --release -p dora-cli
PATH=$PATH:$(pwd)/target/release
```
<!-- langtabs-end -->

> [!IMPORTANT]
> 本文主要围绕主分支的最新代码展开，如果想获得完全相同体验请尽量使用主分支上的Dora。
> 所有的样例以及部分多编程语言涉及到的特定包（Rust Crates）只在源码中给出，现阶段推荐从源码安装

确认完成安装
```bash
$ dora --version
dora-cli 0.3.11
```

# 从源码安装dora（以Ubuntu24.04为例）

## 安装Rust
安装rustup，rustup是管理Rust版本、编译工具链的重要工具
``` bash
$ sudo apt install curl -y # 安装curl，如果未安装
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh # 弹出选项，回车选择默认安装即可
$ export PATH=$PATH:$HOME/.cargo/bin # 设置环境变量
```

<p style="text-align:center"><img src="images/rustup-installation.png" alt="rustup安装画面" width="75%"></p>

## 获取Dora源代码
```bash
$ sudo apt install git -y # 安装git，如果未安装
$ git clone https://github.com/dora-rs/dora.git
$ cd dora
```

## 编译Dora-CLI
Dora-CLI是非常实用的命令行工具，它提供了许多方便的命令来管理Dora项目。
```bash
$ sudo apt install build-essential -y # 安装C/C++编译环境相关的包（包括g++等），如果未安装
$ cargo build --release --package dora-cli
```
## 添加到环境变量
```bash
$ export PATH=$PATH:$(pwd)/target/release # 添加到环境变量
```
或者可以选择官方提供的脚本
```bash
$ ./install.sh
```
