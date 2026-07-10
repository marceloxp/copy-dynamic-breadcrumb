# Changelog

All notable changes to the **Copy Dynamic Breadcrumb** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.5] - 2026-07-10

### Fixed

- Exclude `.cursor/` and `.fact-factory/` from the published VSIX (local dev files were accidentally bundled in 0.0.4).

## [0.0.4] - 2026-07-10

### Added

- **JSON multi-line selection.** When the editor selection spans more than one line, JSON copy commands emit a `selection` object with 1-based `start_line` and `end_line` instead of `line`. Symbols are resolved from the top of the range; line numbers are always in ascending order, even when the user selects bottom-up.

  ```json
  { "file_path": "packages/actions/src/ImportAction.php", "code_path": ["ImportAction"], "selection": { "start_line": 528, "end_line": 533 } }
  ```

## [0.0.3] - 2026-07-05

### Changed

- Marketplace banner image updated to `banner-v2.png`.

## [0.0.2] - 2026-07-04

### Added

- **JSON copy commands.** `JSON Relative Path` and `JSON Absolute Path` copy structured breadcrumb output:

  ```json
  { "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }
  ```

- Extension icon for the Marketplace.

### Changed

- README documents JSON copy options and examples.

## [0.0.1] - 2026-07-04

### Added

- Copy the editor's dynamic breadcrumb to the clipboard: file path plus symbol hierarchy at the cursor.
- **Text format:** `file_path:symbol > symbol` (relative and absolute path variants).
- Editor context submenu and Command Palette entries for relative and absolute path copy.
- Symbol resolution via the VS Code `DocumentSymbolProvider` (language-agnostic).
- README, LICENSE, and Marketplace banner.
