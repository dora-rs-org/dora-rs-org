## 基础环境

操作系统：Windows 11系统

终端：我们的教程使用的终端都是PowerShell，不是CMD，也不是WSL。

我这里使用的是当前最新的版本：1.23.13503.0

查看版本命令：`$PSVersionTable.PSVersion`

```powershell
PS E:\projects\Dora> $PSVersionTable.PSVersion

Major  Minor  Patch  PreReleaseLabel BuildLabel
-----  -----  -----  --------------- ----------
7      5      4

PS E:\projects\Dora> $PSVersionTable

Name                           Value
----                           -----
PSVersion                      7.5.4
PSEdition                      Core
GitCommitId                    7.5.4
OS                             Microsoft Windows 10.0.26200
Platform                       Win32NT
PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0…}
PSRemotingProtocolVersion      2.3
SerializationVersion           1.1.0.1
WSManStackVersion              3.0
```

如果你还没有最新版的PowerShell，在Microsoft Store中进行下载或更新。


## 安装 Rustup

Dora 是基于 Rust 开发的，安装 Dora 之前，先安装 Rust 环境。

Rustup 是 Rust 官方的跨平台 Rust 安装工具，同时提供了 Rust 版本管理能力。

要将程序编译为 exe 文件，Rust 需要一个链接器、库和 Windows API 导入库。需要安装 Visual Studio。

如果你还没有安装 Visual Studio，可以使用自动安装，那么 rustup-init 将会提供自动安装前置条件的选项。它会安装 Visual Studio Community 版，该版本对个人、学术及开源用途是免费的，非常合适。如果你希望根据自己的 Visual Studio 来安装，可以参考 `https://rust-lang.github.io/rustup/installation/windows-msvc.html` 完整的安装说明。

从 `https://rustup.rs/` 下载 `rustup-init.exe`。

如果你想自定义安装位置，可以在执行之前设置环境变量。

```powershell
# 1. 定义路径
# 定义目标路径，这里根据需要修改成自己的路径
$rustupPath = "E:\Dev\SDK\Rustup"
$cargoPath = "E:\Dev\SDK\Cargo"
$cargoBin = "E:\Dev\SDK\Cargo\bin"

# 2. 写入用户环境变量
[Environment]::SetEnvironmentVariable("RUSTUP_HOME", $rustupPath, "User")
[Environment]::SetEnvironmentVariable("CARGO_HOME", $cargoPath, "User")

# 3. 安全地添加 Path（防止重复并确保分号正确）
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($oldPath -notlike "*$cargoBin*") {
    $newPath = $oldPath.TrimEnd(';') + ";" + $cargoBin
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}
```

执行 `rustup-init.exe` 命令开始安装。

```powershell
PS C:\Users\dora> rustup-init.exe
```

重新启动终端，验证 Rustup 安装。

```powershell
PS C:\Users\dora> rustup -V
rustup 1.28.2 (e4f3ad6f8 2025-04-28)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: No `rustc` is currently active
```

使用 `rustup default stable` 命令安装默认版本的 Rust。

```powershell
PS C:\Users\dora> rustup default stable
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
763.9 KiB / 1012.7 KiB ( 75 %)  17.8 KiB/s in  1m 45s ETA: 13s
error: could not download file from 'https://static.rust-lang.org/dist/channel-rust-stable.toml' to 'C:\Users\Miao\.rustup\tmp\u71xqzsnptzibr6m_file.toml': error decoding response body: request or response body error: operation timed out
PS C:\Users\dora> rustup default stable
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
1012.7 KiB / 1012.7 KiB (100 %)  15.6 KiB/s in  2m 22s
info: latest update on 2025-12-11, rust version 1.92.0 (ded5c06cf 2025-12-08)
info: downloading component 'cargo'
  9.4 MiB /   9.4 MiB (100 %)   1.3 MiB/s in 31s
...
info: installing component 'rustc'
 68.6 MiB /  68.6 MiB (100 %)  24.6 MiB/s in  2s
info: installing component 'rustfmt'
info: default toolchain set to 'stable-x86_64-pc-windows-msvc'

  stable-x86_64-pc-windows-msvc installed - rustc 1.92.0 (ded5c06cf 2025-12-08)
```

完成后确认安装是否成功。

```powershell
PS C:\Users\dora> rustup default stable
info: using existing install for 'stable-x86_64-pc-windows-msvc'
info: default toolchain set to 'stable-x86_64-pc-windows-msvc'

  stable-x86_64-pc-windows-msvc unchanged - rustc 1.92.0 (ded5c06cf 2025-12-08)
PS C:\Users\dora> rustc -V
rustc 1.92.0 (ded5c06cf 2025-12-08)
PS C:\Users\dora> cargo -V
cargo 1.92.0 (344c4567c 2025-10-21)
```

## 安装 uv

必要步骤。

`uv` 是使用 Rust 构建的一款高性能 Python 版本管理工具。

uv 源码仓库：`https://github.com/astral-sh/uv`

我们已经安装了 Rust，所以使用 cargo 进行安装：

```powershell
PS C:\Users\dora> rustup default stable
info: using existing install for 'stable-x86_64-pc-windows-msvc'
info: default toolchain set to 'stable-x86_64-pc-windows-msvc'

  stable-x86_64-pc-windows-msvc unchanged - rustc 1.92.0 (ded5c06cf 2025-12-08)

PS C:\Users\dora> cargo install --locked uv
    Updating crates.io index
  Downloaded uv v0.9.24
  Downloaded 1 crate (2.0MiB) in 4.38s
  Installing uv v0.9.24
    Updating crates.io index
    Updating crates.io index
  Downloaded adler2 v2.0.1
...
   Compiling uv-requirements v0.0.13
    Finished `release` profile [optimized] target(s) in 3m 52s
  Installing E:\Dev\SDK\Cargo\bin\uv.exe
  Installing E:\Dev\SDK\Cargo\bin\uvx.exe
   Installed package `uv v0.9.24` (executables `uv.exe`, `uvx.exe`)

PS C:\Users\dora> uv -V
uv 0.9.24

PS C:\Users\dora> Get-Command uv
CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     uv.exe                                             0.0.0.0    E:\Dev\SDK\Cargo\bin\uv.exe

PS C:\Users\dora>
```

如果想自定义安装位置，需要修改以下环境变量再安装：

| 用途 | 目标路径 | 对应环境变量 |
| --- | --- | --- |
| uv 自身安装路径 | `E:\Dev\SDK\uv\bin` | `UV_INSTALL_DIR` |
| uv 下载缓存路径 | `E:\Dev\SDK\uv\cache` | `UV_CACHE_DIR` |
| uv 全局 Python 安装路径 | `E:\Dev\SDK\uv\python` | `UV_PYTHON_INSTALL_DIR` |
| uv 项目依赖下载路径 | `E:\Dev\SDK\uv\downloads` | `UV_DOWNLOAD_DIR` |

```powershell
# 定义目标路径，这里根据需要修改成自己的路径
$baseDir = "E:\Dev\SDK\uv"
$envMap = @{
    "UV_INSTALL_DIR"         = "$baseDir\bin"
    "UV_CACHE_DIR"           = "$baseDir\cache"
    "UV_PYTHON_INSTALL_DIR"  = "$baseDir\python"
    "UV_DOWNLOAD_DIR"        = "$baseDir\downloads"
}

# 1. 批量创建目录
foreach ($path in $envMap.Values) {
    if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

# 2. 批量设置用户环境变量
foreach ($name in $envMap.Keys) {
    [Environment]::SetEnvironmentVariable($name, $envMap[$name], "User")
}

# 3. 将 uv 目录加入 Path
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
$binPath = $envMap["UV_INSTALL_DIR"]
if ($oldPath -notlike "*$binPath*") {
    $newPath = $oldPath.TrimEnd(';') + ";" + $binPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}
```

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```powershell
# 永久添加 uv 可执行文件路径到当前用户的 PATH 环境变量
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:UV_INSTALL_DIR",
    "User"
)
```

重启 PowerShell，执行 `uv -V` 验证 uv 是否安装成功。

```powershell
(dora) PS E:\projects\Dora> uv -V
uv 0.9.21 (0dc9556ad 2025-12-30)
```

## 安装 Git

必要步骤。

从 `https://git-scm.com/` 下载最新版本的 Git 安装程序。

一路默认安装。

完成后重新打开 PowerShell。

验证 Git 安装成功。

```powershell
PS C:\Windows\System32> git -v
git version 2.47.1.windows.1
```

## 准备工程文件

必要步骤。

### 克隆 Dora 源码

源码安装方式需要。

从 `https://github.com/dora-rs/dora` 克隆 Dora 的源代码工程。

通过编译源码的方式安装 Dora 时需要用到这个工程。

### 克隆 dora-examples 工程

从 `https://github.com/dora-rs/dora-examples`

或者 `https://gitcode.com/dora-org/dora-examples`

克隆示例工程。


## 安装 Dora

我们这里会使用两种方式安装Dora，一种是从源码安装，一种是从Python安装。

通过源码安装的Dora是全局的，当环境变量设置正确的时候，你可以随时在任何目录下使用Dora的命令。

由于我们使用了uv作为Python版本管理工具，所以从Python安装的Dora是安装到uv的Python环境中的，只有当你激活的Python环境安装了Dora，你才能在该环境下使用Python安装的Dora的命令。

同时，通过Python安装Dora时，也会安装Python操作Dora的Api依赖，这些依赖是运行Python实现的Node所必要的。


### 通过源码安装

```bash
PS E:\projects\Dora>  git clone https://github.com/dora-rs/dora.git
Cloning into 'dora'...
remote: Enumerating objects: 41094, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (492/492), done.
remote: Total 41094 (delta 1029), reused 754 (delta 740), pack-reused 39860 (from 4)
Receiving objects: 100% (41094/41094), 13.69 MiB | 4.32 MiB/s, done.
Resolving deltas: 100% (24984/24984), done.
PS E:\projects\Dora> cd dora
PS E:\projects\Dora\dora> dir

    Directory: E:\projects\Dora\dora

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          2026-01-06    12:46                .github
d----          2026-01-06    12:46                apis
d----          2026-01-06    12:46                binaries
d----          2026-01-06    12:46                docker
d----          2026-01-06    12:46                docs
d----          2026-01-06    12:46                examples
d----          2026-01-06    12:46                libraries
d----          2026-01-06    12:46                tests
-a---          2026-01-06    12:46            161 _typos.toml
-a---          2026-01-06    12:46           3040 .gitignore
-a---          2026-01-06    12:46         207024 Cargo.lock
-a---          2026-01-06    12:46           5674 Cargo.toml
-a---          2026-01-06    12:46          56777 Changelog.md
-a---          2026-01-06    12:46           3142 CONTRIBUTING.md
-a---          2026-01-06    12:46           1373 dist-workspace.toml
-a---          2026-01-06    12:46           1495 flake.nix
-a---          2026-01-06    12:46           4167 install.ps1
-a---          2026-01-06    12:46           4899 install.sh
-a---          2026-01-06    12:46          11554 LICENSE
-a---          2026-01-06    12:46            574 NOTICE.md
-a---          2026-01-06    12:46          17370 README.md

PS E:\projects\Dora\dora>
```

进入工程目录，执行编译命令：`cargo build --release --package dora-cli`。

```powershell
PS E:\projects\Dora\dora> cargo build --release --package dora-cli
    Updating crates.io index
  Downloaded aligned-vec v0.5.0
  Downloaded cipher v0.4.4
  Downloaded dirs v4.0.0
...
warning: `dora-cli` (lib) generated 6 warnings (run `cargo fix --lib -p dora-cli` to apply 2 suggestions)
    Finished `release` profile [optimized] target(s) in 3m 09s
```

看到这个说明编译成功了，中间可能会看到一些warning，不用管。

验证一下编译结果

```bash
PS E:\projects\Dora\dora> .\target\release\dora.exe -V
dora-cli 0.4.0
```

出现版本号，说明程序编译正常

接下来我们将dora命令加入到环境变量，方便使用

```bash
# 执行结果
# 永久添加目标目录到当前用户的 PATH 环境变量
PS E:\projects\Dora\dora\target\release> [Environment]::SetEnvironmentVariable(
>>     "Path",
>>     [Environment]::GetEnvironmentVariable("Path", "User") + ";E:\projects\Dora\dora\target\release",
>>     "User"
>> )
PS E:\projects\Dora\dora\target\release>
```

重新启动Powershell测试`dora -V`命令，显示版本号说明环境变量设置成功。

恭喜你，完成dora的安装。

### 通过Python安装

```pip
# 创建 python 环境
PS E:\projects\Dora\dora-examples\examples\echo> uv venv -p 3.11 --seed
Using CPython 3.11.14
Creating virtual environment with seed packages at: .venv
 + pip==25.3
 + setuptools==80.9.0
 + wheel==0.45.1
Activate with: .venv\Scripts\activate

# 查看虚拟环境安装位置（.venv文件夹就是虚拟环境存放的位置）
PS E:\projects\Dora\dora-examples\examples\echo> dir

    Directory: E:\projects\Dora\dora-examples\examples\echo

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          2026-01-12    19:44                .venv
d----          2026-01-11    10:15                out
-a---          2026-01-07    14:30              4 .gitignore
-a---          2026-01-10     3:22            489 dataflow.yml
-a---          2026-01-07    14:30            225 README.md

# 安装Dora-rs-cli
# 如果使用国内源可以加上（推荐） -i https://pypi.tuna.tsinghua.edu.cn/simple/
PS E:\projects\Dora\dora-examples\examples\echo> uv pip install dora-rs-cli -i https://pypi.tuna.tsinghua.edu.cn/simple/
Resolved 5 packages in 589ms
Prepared 5 packages in 1.04s
Installed 5 packages in 114ms
 + dora-rs==0.4.0
 + dora-rs-cli==0.4.0
 + pyarrow==22.0.0
 + pyyaml==6.0.3
 + uv==0.9.24

# 查看已经安装的包
PS E:\projects\Dora\dora-examples\examples\echo> uv pip list
Package     Version
----------- -------
dora-rs     0.4.0
dora-rs-cli 0.4.0
pip         25.3
pyarrow     22.0.0
pyyaml      6.0.3
setuptools  80.9.0
uv          0.9.24
wheel       0.45.1
```

确认完成安装

```bash
# 通过 uv 执行虚拟环境中安装的dora命令
PS E:\projects\Dora\dora-examples\examples\echo> uv run dora -V
dora-cli 0.4.0

# 激活虚拟环境
PS E:\projects\Dora\dora-examples\examples\echo> .\.venv\Scripts\activate

# 查看dora命令的位置，发现它来自我们的虚拟环境
(echo) PS E:\projects\Dora\dora-examples\examples\echo> Get-Command dora

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     dora.exe                                           0.0.0.0    E:\projects\Dora\dora-examples\examples\echo\.venv/Scripts…


# 离开虚拟环境
(echo) PS E:\projects\Dora\dora-examples\examples\echo> deactivate

# 查看dora命令的位置，发现它来自我们之前通过源码编译的发布位置
PS E:\projects\Dora\dora-examples\examples\echo> Get-Command dora

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     dora.exe                                           0.0.0.0    E:\projects\Dora\dora\target\release\dora.exe
                                          0.0.0.0    E:\Dev\SDK\Cargo\bin\uv.exe

```