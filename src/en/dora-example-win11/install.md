## Introduction

If you are new to this, please follow the tutorial for installation.

## Basic Environment

Operating System: Windows 11

Terminal: Our tutorials use PowerShell, not CMD or WSL.

I am using the latest version: 1.23.13503.0

Check version command: `$PSVersionTable.PSVersion`

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

If you don't have the latest version of PowerShell, download or update it from the Microsoft Store.

## Install Rustup

Required for source installation and Rust development.

Dora is built with Rust, so install the Rust environment before installing Dora.

Rustup is the official cross-platform Rust installation tool that provides Rust version management capabilities.

To compile programs into exe files, Rust needs a linker, libraries, and Windows API import libraries. Visual Studio needs to be installed.

If you haven't installed Visual Studio yet, you can use automatic installation. The rustup-init will provide an option to automatically install prerequisites. It will install Visual Studio Community, which is free for personal, academic, and open-source use. If you prefer to use your own Visual Studio installation, refer to `https://rust-lang.github.io/rustup/installation/windows-msvc.html` for complete installation instructions.

Download `rustup-init.exe` from `https://rustup.rs/`.

If you want to customize the installation location, you can set environment variables before running the installer.

```powershell
# 1. Define paths
$rustupPath = "E:\Dev\SDK\Rustup"
$cargoPath = "E:\Dev\SDK\Cargo"
$cargoBin = "E:\Dev\SDK\Cargo\bin"

# 2. Write to user environment variables
[Environment]::SetEnvironmentVariable("RUSTUP_HOME", $rustupPath, "User")
[Environment]::SetEnvironmentVariable("CARGO_HOME", $cargoPath, "User")

# 3. Safely add to Path (prevent duplicates and ensure correct semicolons)
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($oldPath -notlike "*$cargoBin*") {
    $newPath = $oldPath.TrimEnd(';') + ";" + $cargoBin
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}
```

Run the `rustup-init.exe` command to start the installation.

```powershell
PS C:\Users\dora> rustup-init.exe
```

Restart the terminal and verify Rustup installation.

```powershell
PS C:\Users\dora> rustup -V
rustup 1.28.2 (e4f3ad6f8 2025-04-28)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: No `rustc` is currently active
```

Use the `rustup default stable` command to install the default version of Rust.

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

After completion, verify that the installation was successful.

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

## Install uv

Required step.

`uv` is a high-performance Python version management tool built with Rust.

uv source repository: `https://github.com/astral-sh/uv`

Since we have already installed Rust, we can use cargo to install it:

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

If you want to customize the installation location, you need to modify the following environment variables before installation:

| Purpose | Target Path | Environment Variable |
| --- | --- | --- |
| uv self installation path | `E:\Dev\SDK\uv\bin` | `UV_INSTALL_DIR` |
| uv download cache path | `E:\Dev\SDK\uv\cache` | `UV_CACHE_DIR` |
| uv global Python installation path | `E:\Dev\SDK\uv\python` | `UV_PYTHON_INSTALL_DIR` |
| uv project dependency download path | `E:\Dev\SDK\uv\downloads` | `UV_DOWNLOAD_DIR` |

```powershell
# Define target paths
$baseDir = "E:\Dev\SDK\uv"
$envMap = @{
    "UV_INSTALL_DIR"         = "$baseDir\bin"
    "UV_CACHE_DIR"           = "$baseDir\cache"
    "UV_PYTHON_INSTALL_DIR"  = "$baseDir\python"
    "UV_DOWNLOAD_DIR"        = "$baseDir\downloads"
}

# 1. Batch create directories
foreach ($path in $envMap.Values) {
    if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

# 2. Batch set user environment variables
foreach ($name in $envMap.Keys) {
    [Environment]::SetEnvironmentVariable($name, $envMap[$name], "User")
}

# 3. Add uv directory to Path
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
# Permanently add uv executable path to current user's PATH environment variable
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:UV_INSTALL_DIR",
    "User"
)
```

Restart PowerShell and run `uv -V` to verify that uv is installed successfully.

```powershell
(dora) PS E:\projects\Dora> uv -V
uv 0.9.21 (0dc9556ad 2025-12-30)
```

## Install Git

Required step.

Download the latest Git installer from `https://git-scm.com/`.

Install with default settings throughout.

After completion, reopen PowerShell.

Verify Git installation was successful.

```powershell
PS C:\Windows\System32> git -v
git version 2.47.1.windows.1
```

## Prepare Project Files

Required step.

### Clone Dora Source Code (Required for Source Installation)

Clone the Dora source code project from `https://github.com/dora-rs/dora`.

This project is needed when installing Dora by compiling from source.

### Clone dora-examples Project

Clone the example project from `https://github.com/dora-rs/dora-examples`

or `https://gitcode.com/dora-org/dora-examples`.
