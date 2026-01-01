# Release Notes

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
