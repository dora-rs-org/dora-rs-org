# Quick Start

## Environment Setup

```bash
# Python environment
conda create -n dora-moveit python=3.9
conda activate dora-moveit

# Install dependencies
pip install -r requirements.txt

# Install Dora
pip install dora-rs

# Install MuJoCo (for simulation)
pip install mujoco
pip install -e dora-mujoco/
```

## Run Simulation

```bash
# Start MuJoCo simulation
./run_mujoco.bat

# Or manually:
dora up
dora build dataflow_gen72_mujoco.yml
dora start dataflow_gen72_mujoco.yml
```

**Expected Behavior**:

1. MuJoCo window opens, GEN72 robot at HOME position
2. System plans collision-free path to 3 viewpoints
3. Robot captures images at each viewpoint
4. Returns to HOME and enters idle state

## Run Real Robot

> **Important**: Ensure robot is powered on, work area is clear, and emergency stop button is accessible.

```bash
# Start real robot control
./run_real_robot.bat

# Or manually:
dora up
dora build dataflow_gen72_real.yml
dora start dataflow_gen72_real.yml
```

## Troubleshooting

### MuJoCo Issues

**Issue**: "Model not found" error

```bash
# Solution: Set MODEL_NAME environment variable
export MODEL_NAME="path/to/GEN72_with_actuators.xml"
```

**Issue**: Joint1 continues to rotate after completion

```bash
# Solution: Check HOLD logic timeout
# In main.py: self.cmd_timeout = 0.2  # Increase if needed
```

### Real Robot Issues

**Issue**: Connection failed

```bash
# Check:
# 1. Robot is powered on
# 2. Network connection (ping 192.168.1.19)
# 3. Firewall settings
# 4. SDK DLL in correct path
```

**Issue**: Robot motion is not smooth

```bash
# Solution: Adjust control frequency
# In dataflow_gen72_real.yml:
tick: dora/timer/millis/200  # Increase for smoother motion
```

## Safety Guidelines

### Before Running Real Robot

1. **Power Check**: Ensure robot is powered on and initialized
2. **Work Area**: Clear all obstacles from robot workspace
3. **Emergency Stop**: Confirm emergency stop button is accessible
4. **Limits**: Verify joint limits are correctly configured
5. **Speed**: Start with low speed (10%) during testing

### Emergency Procedures

- **Immediate Stop**: Press emergency stop button
- **Software Stop**: Press `Ctrl+C` in terminal
- **Power Off**: Use main power switch

### Collision Avoidance

- System uses 10mm safety margin
- Ground plane at z=-0.05m
- Self-collision checking enabled
- Adjacent links (±1) skipped for flexibility
