# 安装

## 克隆仓库

```bash
git clone https://gitcode.com/dora-rs/dora-drives.git
cd dora-drives
```

## 安装依赖

```bash
# 创建 conda 环境
conda create -n dora3.7 python=3.7 -y
conda activate dora3.7

# 安装 PyTorch
conda install pytorch=1.11.0 torchvision=0.12.0 cudatoolkit=11.3 -c pytorch -y

# 安装 Python 依赖
pip install --upgrade pip
pip install -r install_requirements.txt
pip install -r requirements.txt
```

## 安装 dora

如果尚未安装 dora，可以使用以下命令：

```bash
sudo wget https://github.com/dora-rs/dora/releases/download/v0.2.5/dora-v0.2.5-x86_64-Linux.zip && sudo unzip dora-v0.2.5-x86_64-Linux.zip -d /usr/local/bin
```

## 更多信息

详细安装说明请参见：https://dora-rs.ai/docs/guides/dora-drives/installation
