# Copy Dynamic Breadcrumb

## Goal

Build a Visual Studio Code extension that copies the breadcrumb currently shown in the editor title bar to the clipboard.

This extension is also useful as an AI assistant tool. Instead of sharing only a file name, the developer can paste the full breadcrumb for the current cursor position, pointing exactly where the AI should focus. That lets the AI jump straight to the relevant context (file, class, method, XML element, etc.), reducing or eliminating the need to explore the file to find the right region. Interactions become faster, context usage drops, and the AI is less likely to analyze the wrong area.

The breadcrumb must reflect the exact current cursor position in the file.

Example:

```
.ai
└── Jira
    └── open
        └── VM-2973
            └── related-cards
                └── VM-2978.xml
                    └── rss
                        └── channel
                            └── item
                                └── comments
```

Copied text (relative path):

```
data/feeds/catalog.xml:rss > channel > item > comments
```

---

# Features

## Commands

Provide copy commands via a **Copy Dynamic Breadcrumb** submenu:

- **Relative Path** — workspace-relative file path
- **Absolute Path** — absolute file path on disk

Both use the format `{file_path}:{code_path}`.

When executed, the command copies the breadcrumb for the current cursor position to the clipboard.

If there is no active editor, show an appropriate message.

---

## Context menu

Add the submenu to the editor context menu.

It must be available when a text editor is active.

---

## Behavior

The breadcrumb is composed of:

1. the file path (relative or absolute, depending on the command);
2. symbols that represent the cursor context.

Examples:

```
src/Services/UserService.php:createUser > validateEmail
```

```
README.md
```

```
config/routes.php
```

```
data/feeds/catalog.xml:rss > channel > item > comments
```

---

## Freshness

The command must always use:

* the currently active file;
* the current cursor position.

Moving the cursor must change the copied breadcrumb.

There must be no cache.

---

## Clipboard

The command copies plain text only.

Do not add:

* quotes;
* line breaks;
* extra characters.

Format:

```
{file_path}:{code_path}
```

Where `code_path` segments are joined with ` > `.

---

# Implementation

Implementation is flexible, but must use only public Visual Studio Code APIs.

If VS Code does not expose the breadcrumb directly, reconstruct it using:

* file path (relative or absolute);
* `DocumentSymbolProvider`;
* current cursor position.

The reconstruction should match the breadcrumb shown by VS Code.

---

# Edge cases

## File outside the workspace

For relative path, copy only the file name (or absolute path when that is the only option).

Example:

```
draft.php
```

---

## No symbols

If the file has no recognized symbols:

```
README.md
```

---

## Multiple cursors

Use only the primary cursor (`selection.active`).

---

## Multi-root workspace

For relative paths, use the path relative to the `WorkspaceFolder` that contains the file.

---

## Nested symbols

The breadcrumb must include the full hierarchy.

Example:

```
Class
 └── method
      └── local function
           └── variable
```

Result:

```
Class > method > local function > variable
```

---

# Acceptance criteria

* Copied text matches the VS Code breadcrumb for the cursor position.
* Works for any language with a `DocumentSymbolProvider`.
* Works regardless of theme.
* Does not depend on language-specific parsing.
* Does not depend on VS Code UI internals.
* Works on Windows, Linux, and macOS.

---

# Suggested structure

```
extension.ts
commands/
    copyDynamicBreadcrumb.ts
services/
    BreadcrumbService.ts
utils/
    SymbolFinder.ts
```
