# Installation

## Clone the Repository

```bash
git clone git@github.com:dora-rs/dora-drives.git
cd dora-drives
```

## Install Dependencies

```bash
# Create conda environment
conda create -n dora3.7 python=3.7 -y
conda activate dora3.7

# Install PyTorch
conda install pytorch=1.11.0 torchvision=0.12.0 cudatoolkit=11.3 -c pytorch -y

# Install Python dependencies
pip install --upgrade pip
pip install -r install_requirements.txt
pip install -r requirements.txt
```

## Install dora

If dora is not already installed, you can use the following command:

```bash
sudo wget https://github.com/dora-rs/dora/releases/download/v0.2.5/dora-v0.2.5-x86_64-Linux.zip && sudo unzip dora-v0.2.5-x86_64-Linux.zip -d /usr/local/bin
```

## More Information

For more detailed installation instructions, see: https://dora-rs.ai/docs/guides/dora-drives/installation
