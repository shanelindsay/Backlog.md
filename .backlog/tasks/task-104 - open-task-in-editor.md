---
id: task-104
title: "Open task in editor from task view"
status: To Do
assignee: []
created_date: '2025-06-30'
labels: []
dependencies: []
---

## Description

Add keyboard shortcut support in the interactive task view so that pressing `E` opens the currently viewed task markdown file in the user's preferred editor. The editor command should be configurable via environment variable and default to the system's `EDITOR` or `VISUAL` variables.

## Acceptance Criteria

- [ ] Pressing `E` in the task view opens the current task file in the configured editor.
- [ ] Supports configuration through `BACKLOG_EDITOR` environment variable, falling back to `VISUAL` then `EDITOR`.
- [ ] If no editor is configured, display an error message in the UI.
- [ ] Works on Windows, macOS and Linux.

## Implementation Plan
1. Detect editor command using `BACKLOG_EDITOR`, `VISUAL`, then `EDITOR`.
2. Add an `openFileInEditor` utility that spawns the editor detached.
3. In `viewTaskEnhanced`, bind `E` key to invoke this utility with the current task's markdown file path.
4. Show an error message in the footer if no editor is configured or the spawn fails.
