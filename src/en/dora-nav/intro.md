# Introduction

DORA_NAV is a navigation framework based on the open-source robot middleware DORA. This navigation framework implements environment mapping and indoor/outdoor localization based on laser point clouds, and uses trajectory tracking methods to achieve path-following navigation.

## Hardware Configuration

- LiDAR: RoboScience Helios 16
- Chassis: mickrobot four-wheel differential drive robot

## Directory Structure

| Directory/File | Description |
|-----------------|-------------|
| include | Header files |
| driver | Sensor driver nodes supported by dora, mainly using rslidar_driver |
| mapping | NDT mapping node |
| localization | Robot localization node, implements robot localization and outputs robot trajectory |
| planning | Road parameter supply + task decision execution |
| map | Reference path management + coordinate transformation + localization information output |
| control | Mobile robot and chassis nodes supported by dora |
| rerun | Multimodal data visualization tool |
| data | Stores output of path.yml |
| out | Stores logs of path.yml and run.yml |
| path.yml | Dora dataflow framework node configuration file, complete dataflow chain from LiDAR data collection to pose estimation output |
| run.yml | Dora dataflow framework node configuration file, defines runtime parameters, data dependencies, and dataflow chain for 11 core nodes in the system |
| road_msg.txt | Defined road properties |

## Dataflow Architecture

run.yml defines the end-to-end full process from "sensor data collection" → "localization and path processing" → "planning and decision" → "vehicle control" → "data visualization", allowing each module to automatically coordinate according to configuration.
