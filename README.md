# Copy Dynamic Breadcrumb

![banner](https://github.com/marceloxp/copy-dynamic-breadcrumb/raw/main/images/banner-v2.png)

A Visual Studio Code extension that copies the editor's **dynamic breadcrumb** to the clipboard — the file path combined with the symbol hierarchy at the current cursor position.

Instead of sharing only a file name, you paste precise context: **where the file lives** and **which code region the cursor is in**. This is especially useful when working with AI tools, because it reduces unnecessary exploration, saves context, and lowers the chance of analyzing the wrong part of a file.

## What gets copied

The breadcrumb always reflects the **active editor** and the current **selection**. There is no cache: every run recalculates the result from the current state.

For the text format and for JSON with a single-line selection (cursor or partial line), the **primary cursor position** (`selection.active`) drives symbol lookup. When **more than one line** is selected and you copy in JSON format, the output uses a `selection` range instead of a single `line`.

Two output formats are available:

### Text format

Copied by **Relative Path** and **Absolute Path**:

```
{file_path}:{code_path}
```

| Part        | Description                    | Separator |
| ----------- | ------------------------------ | --------- |
| `file_path` | File path                      | `/`       |
| `code_path` | Symbol hierarchy at the cursor | ` > `     |

When no symbols are recognized at the cursor position, only the file path is copied (no `:`).

### JSON format

Copied by **JSON Relative Path** and **JSON Absolute Path**.

**Single line** (cursor or selection on one line) — includes `line`:

```json
{ "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }
```

**Multiple lines selected** — includes `selection` instead of `line`:

```json
{ "file_path": "/home/dev/projects/filament/packages/actions/src/ImportAction.php", "code_path": ["ImportAction"], "selection": { "start_line": 528, "end_line": 533 } }
```

That JSON points an AI (or a human) straight at the `maxRows` method — no need to open the file and hunt for it.

| Field        | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| `file_path`  | File path (relative or absolute, per menu item)                             |
| `code_path`  | Symbol hierarchy at the cursor or at the top of the selection, as an array  |
| `line`       | 1-based line number of the cursor (single-line selection only)              |
| `selection`  | 1-based `start_line` and `end_line` of the selected range (multi-line only) |

When no symbols are recognized, `code_path` is an empty array (`[]`). For multi-line selections, `start_line` is always ≤ `end_line`, even when the user selects bottom-up.

## Usage

### Editor context menu

Right-click in the editor and open the **Copy Dynamic Breadcrumb** submenu:

```
Copy Dynamic Breadcrumb  ▶
                          ├── Relative Path
                          ├── Absolute Path
                          ├── ─────────────
                          ├── JSON Relative Path
                          └── JSON Absolute Path
```

### Command Palette

- `Copy Dynamic Breadcrumb: Relative Path`
- `Copy Dynamic Breadcrumb: Absolute Path`
- `Copy Dynamic Breadcrumb: JSON Relative Path`
- `Copy Dynamic Breadcrumb: JSON Absolute Path`

## Copy options

### Text

#### Relative Path

Uses the file path **relative to the workspace folder** that contains the file (supports multi-root workspaces).

**Example:**

```
data/feeds/catalog.xml:rss > channel > item > customfields
```

#### Absolute Path

Uses the file's **absolute path** on the system.

**Example:**

```
/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > customfields
```

### JSON

#### JSON Relative Path / JSON Absolute Path

Uses `file_path` (relative or absolute) and `code_path` as a symbol array. The location field depends on the selection:

- **One line** — `line` with the cursor's 1-based line number.
- **Multiple lines** — `selection` with `start_line` and `end_line` (1-based, inclusive).

**Single-line example:**

```json
{ "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }
```

**Multi-line example:**

```json
{ "file_path": "/home/dev/projects/filament/packages/actions/src/ImportAction.php", "code_path": ["ImportAction"], "selection": { "start_line": 528, "end_line": 533 } }
```

## Examples

### Text format

| Scenario                         | Relative Path                                             | Absolute Path                                                                          |
| -------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Root file, no symbols            | `README.md`                                               | `/home/dev/projects/my-app/README.md`                                                  |
| Nested file, no symbols          | `config/routes.php`                                       | `/home/dev/projects/my-app/config/routes.php`                                          |
| Class and method at cursor       | `src/Services/UserService.php:createUser > validateEmail` | `/home/dev/projects/my-app/src/Services/UserService.php:createUser > validateEmail`    |
| Nested XML elements              | `data/feeds/catalog.xml:rss > channel > item > comments`  | `/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > comments`     |
| File outside workspace (relative) | `draft.php`                                               | `/tmp/draft.php`                                                                       |

### JSON format

| Scenario                           | JSON Relative Path                                                                                                                             | JSON Absolute Path                                                                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root file, no symbols              | `{ "file_path": "README.md", "code_path": [], "line": 1 }`                                                                                     | `{ "file_path": "/home/dev/projects/my-app/README.md", "code_path": [], "line": 1 }`                                                                                       |
| Class and method at cursor         | `{ "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }`                          | `{ "file_path": "/home/dev/projects/my-app/packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }`                            |
| Nested XML elements                | `{ "file_path": "data/feeds/catalog.xml", "code_path": ["rss", "channel", "item", "comments"], "line": 42 }`                                   | `{ "file_path": "/home/dev/projects/my-app/data/feeds/catalog.xml", "code_path": ["rss", "channel", "item", "comments"], "line": 42 }`                                     |
| Multi-line selection (e.g. method) | `{ "file_path": "packages/actions/src/ImportAction.php", "code_path": ["ImportAction"], "selection": { "start_line": 528, "end_line": 533 } }` | `{ "file_path": "/home/dev/projects/filament/packages/actions/src/ImportAction.php", "code_path": ["ImportAction"], "selection": { "start_line": 528, "end_line": 533 } }` |

## How it works

VS Code does not expose a public API to read the breadcrumb shown in the editor title bar. This extension reconstructs it using public APIs only:

1. **File path** — relative to `WorkspaceFolder` or absolute via `Uri.fsPath`
2. **Cursor symbols** — `DocumentSymbolProvider` (`vscode.executeDocumentSymbolProvider`)
3. **Location (JSON only)** — `line` from `selection.active` when the selection spans one line; `selection.start_line` / `selection.end_line` (1-based) when it spans multiple lines. Symbol lookup uses the cursor for single-line selections and the top of the range for multi-line selections.

It works for any language that provides document symbols (TypeScript, PHP, XML, etc.), without language-specific parsing and independent of theme or VS Code UI.

## Requirements

- Visual Studio Code `^1.125.0`
- Windows, Linux, or macOS

## Development

```bash
npm install
npm run compile
npm test
```

To test locally, open the project in VS Code and press **F5** to launch the Extension Development Host.

## License

See [LICENSE](LICENSE).
