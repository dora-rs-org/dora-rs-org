# Release Notes

## v0.1.24 (2026-01-02)

### Changes
- Update speech-to-text documentation with README content
- Add graph visualization with mermaid flowchart

## v0.1.23 (2026-01-01)

### Changes
- Update speech-to-speech documentation with full README content (EN and CN)
- Add real-time STT/TTS pipeline, VAD, Whisper, Kokoro nodes, and troubleshooting

## v0.1.22 (2026-01-01)

### Changes
- Update openai-server documentation with full README content (EN and CN)
- Add API features, chat completions, image input examples, and architecture

## v0.1.21 (2026-01-01)

### Changes
- Update LLM voice assistant documentation with full README content (EN and CN)
- Add complete pipeline overview, system dependencies, configuration, and troubleshooting

## v0.1.20 (2026-01-01)

### Changes
- Update object-detection documentation with full README content (EN and CN)
- Add YOLO overview, nodes, configuration, outputs, and troubleshooting

## v0.1.19 (2026-01-01)

### Changes
- Update mediapipe pose detection documentation with full README content (EN and CN)
- Add overview, nodes, configuration, outputs, and architecture

## v0.1.18 (2026-01-01)

### Changes
- Update depth-camera documentation with full README content (EN and CN)
- Add Intel RealSense and iOS LiDAR support details
- Include prerequisites, configuration, dataflow variants, and troubleshooting

## v0.1.17 (2026-01-01)

### Changes
- Update av1-encoding documentation with full README content (EN and CN)
- Add overview, nodes, prerequisites, configuration, troubleshooting, and architecture

## v0.1.16 (2026-01-01)

### Changes
- Remove alexk-lcr, aloha, and reachy documentation from advanced examples

## v0.1.15 (2026-01-01)

### Changes
- Update camera example documentation with full content (EN and CN)
- Add overview, dataflow configuration, configuration options, and Jupyter notebook variant

## v0.1.14 (2026-01-01)

### Changes
- Update Zenoh dataflow documentation with full content from README.md
- Include overview, structure, prerequisites, and expected output

## v0.1.13 (2026-01-01)

### Changes
- Add Zenoh dataflow examples for Python and Rust
- Python Zenoh linked to python-zenoh-dataflow
- Rust Zenoh linked to rust-zenoh-dataflow

## v0.1.12 (2026-01-01)

### Changes
- Add source code links to all example documentation (CN and EN)
- Link each example doc to corresponding dora-examples GitHub repository

## v0.1.11 (2026-01-01)

### Changes
- Update Lebai documentation with complete driver guide from dora-examples
- Add simulator setup, node interfaces, configuration, and troubleshooting
- Include lebai_simulator_dashboard.png image

## v0.1.10 (2026-01-01)

### Changes
- Add Lebai robot arm documentation for both CN and EN

## v0.1.9 (2026-01-01)

### Changes
- Add expected output section to CXX Dataflow documentation

## v0.1.8 (2026-01-01)

### Changes
- Replace CUDA Benchmark with CXX Dataflow example
- Add documentation for C++ dataflow using cxx crate
- Move cxx-dataflow.md to cpp/ folder

## v0.1.7 (2026-01-01)

### Changes
- Apply Ayu theme as default (light mode)
- Set Navy as preferred dark theme
- Match look and feel of tlborm documentation style

## v0.1.6 (2026-01-01)

### Changes
- Update home page links to point to intro.md instead of menu.md

## v0.1.5 (2026-01-01)

### Fixes
- Fix language toggle button positioning (now properly left of GitHub icon)
- Fix language switching not working (improved URL path handling)

## v0.1.4 (2026-01-01)

### Changes
- Move EN/CN button to left of GitHub icon
- Update GitHub repo link to https://github.com/dora-rs/dora-examples

## v0.1.3 (2026-01-01)

### Improvements
- Replace dropdown with visible EN/CN button (hides print button)
- Fix language toggle not appearing on English pages
- Copy theme files to EN directory for proper loading

## v0.1.2 (2026-01-01)

### Fixes
- Fix empty theme files (language toggle and custom CSS were missing content)

## v0.1.1 (2026-01-01)

### Fixes
- Remove invalid `multilingual` field from book.toml (not supported in mdbook v0.5.2)
- Fix GitHub Actions workflow to properly build both Chinese and English books
- Remove duplicate workflow file

## v0.1.0 (2026-01-01)

### Features
- Add multilingual support (Chinese and English)
- Add language toggle button in the top menu bar
- Restore full table of contents with dora-example and openloong sections
- Change title from "Dora-rs" to "DORA Examples"
- Add GitHub Actions workflow for automated deployment to GitHub Pages

### Structure
- Chinese documentation at `/` (root)
- English documentation at `/en/`
- Custom theme files: `theme/custom.css` and `theme/language-toggle.js`
