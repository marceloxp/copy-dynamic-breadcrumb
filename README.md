# Copy Dynamic Breadcrumb

![banner](https://github.com/marceloxp/copy-dynamic-breadcrumb/raw/main/images/banner.png)

A Visual Studio Code extension that copies the editor's **dynamic breadcrumb** to the clipboard — the file path combined with the symbol hierarchy at the current cursor position.

Instead of sharing only a file name, you paste precise context: **where the file lives** and **which code region the cursor is in**. This is especially useful when working with AI tools, because it reduces unnecessary exploration, saves context, and lowers the chance of analyzing the wrong part of a file.

## What gets copied

The breadcrumb always reflects the **active editor** and the **primary cursor position** (`selection.active`). There is no cache: every run recalculates the result from the current state.

Copied text uses this format:

```
{file_path}:{code_path}
```

| Part        | Description                    | Separator |
| ----------- | ------------------------------ | --------- |
| `file_path` | File path                      | `/`       |
| `code_path` | Symbol hierarchy at the cursor | ` > `     |

When no symbols are recognized at the cursor position, only the file path is copied (no `:`).

## Usage

### Editor context menu

Right-click in the editor and open the **Copy Dynamic Breadcrumb** submenu:

```
Copy Dynamic Breadcrumb  ▶
                          ├── Relative Path
                          └── Absolute Path
```

### Command Palette

- `Copy Dynamic Breadcrumb: Relative Path`
- `Copy Dynamic Breadcrumb: Absolute Path`

## Copy options

### Relative Path

Uses the file path **relative to the workspace folder** that contains the file (supports multi-root workspaces).

**Example:**

```
data/feeds/catalog.xml:rss > channel > item > customfields
```

### Absolute Path

Uses the file's **absolute path** on the system.

**Example:**

```
/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > customfields
```

## Examples

| Scenario                         | Relative Path                                             | Absolute Path                                                                          |
| -------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Root file, no symbols            | `README.md`                                               | `/home/dev/projects/my-app/README.md`                                                  |
| Nested file, no symbols          | `config/routes.php`                                       | `/home/dev/projects/my-app/config/routes.php`                                          |
| Class and method at cursor       | `src/Services/UserService.php:createUser > validateEmail` | `/home/dev/projects/my-app/src/Services/UserService.php:createUser > validateEmail`    |
| Nested XML elements              | `data/feeds/catalog.xml:rss > channel > item > comments`  | `/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > comments`     |
| File outside workspace (relative) | `draft.php`                                               | `/tmp/draft.php`                                                                       |

## How it works

VS Code does not expose a public API to read the breadcrumb shown in the editor title bar. This extension reconstructs it using public APIs only:

1. **File path** — relative to `WorkspaceFolder` or absolute via `Uri.fsPath`
2. **Cursor symbols** — `DocumentSymbolProvider` (`vscode.executeDocumentSymbolProvider`)

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
