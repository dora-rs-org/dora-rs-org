# Release Notes

## v2.5.9 (2026-01-02)

### Changes
- Replace PiPer with UR5 robot driver documentation (section 2.4.4)
- Add UR5 RTDE driver features, URSim Docker setup, node interfaces, and troubleshooting

## v2.5.8 (2026-01-02)

### Changes
- Add Franka simulation GIF to show dataflow result (CN and EN)

## v2.5.7 (2026-01-02)

### Changes
- Add Franka Panda robot driver documentation (CN and EN)
- Include features, prerequisites, node interfaces, configuration, and troubleshooting

## v2.5.6 (2026-01-02)

### Changes
- Remove path/address and keywords metadata lines from all example docs (CN and EN)
- Clean up 38 example documentation files

## v2.5.5 (2026-01-02)

### Changes
- Rename "Dora样例" to "教程" in Chinese
- Rename "DORA Examples" to "Hands-on Examples" in English

## v2.5.4 (2026-01-02)

### Changes
- Remove "External Resources" section from homepage (CN and EN)

## v2.5.3 (2026-01-02)

### Changes
- Move welcome content to main index page (index.md)
- Remove "Introduction" section from dora-example menu (CN and EN)
- Update both Chinese and English homepages with Dora-rs welcome content

## v2.5.2 (2026-01-02)

### Changes
- Enhance main page (intro.md) with Dora-rs welcome content
- Add feature highlights: modularity, low latency, multi-language, lightweight deployment
- Add quick start guide with cargo install instructions

## v2.5.1 (2026-01-02)

### Changes
- Update Lebai simulator dashboard screenshot (lebai_simulator_dashboard.png)

## v0.1.28 (2026-01-02)

### Changes
- Update VLM documentation with full README content (EN and CN)
- Add Qwen2.5-VL overview, nodes, prerequisites, configuration, and architecture
- Include vision-only and speech-to-speech pipeline variants
- Add troubleshooting guide for camera, GPU memory, and model download issues

## v0.1.27 (2026-01-02)

### Changes
- Update translation documentation with full README content (EN and CN)
- Add Argos Translate and Phi-4 multimodal translation pipelines
- Include supported languages list and dataflow variants
- Add troubleshooting guide for Phi-4 flash-attn and Argos language packages

## v0.1.26 (2026-01-02)

### Changes
- Update tracker documentation with full README content (EN and CN)
- Add CoTracker pipeline overview, nodes, configuration, and architecture
- Include YOLO + CoTracker and VLM + CoTracker pipeline variants
- Add troubleshooting guide for camera, GPU memory, and model download issues

## v0.1.25 (2026-01-02)

### Changes
- Update Chinese speech-to-text documentation with full README content
- Add overview, nodes, prerequisites, configuration, architecture, and troubleshooting sections
- Include hf-mirror instructions for users in China

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
