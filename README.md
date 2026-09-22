# Structural Workspace

A desktop and web workspace for everyday civil and structural engineering checks. Calculations run locally. Diagrams are live SVG, not static images.

## Overview

Structural Workspace provides a professional calculator suite for:

- steel H-beam and angle catalogs
- rectangular reinforced-concrete flexural capacity
- two-way slab design (Marcus coefficients)
- ASCE 7 design response spectra
- retaining-wall surcharge pressures
- engineering unit conversion

The React frontend runs in the browser. The same UI is packaged as an Electron desktop app with sandboxed file dialogs.

## Features

- Interactive steel section table with sortable columns, search, CSV export, and SVG cross-sections
- Flexural analysis with Whitney stress block, strain classification, and a live section diagram
- Two-way slab moments, bar spacing, and a plan diagram of support conditions
- Design response spectrum with hover readout and CSV export
- Point and strip surcharge heatmaps plus wall schematics
- Distance, force, pressure, area, and moment converters
- Light and dark themes
- Project files (`.swproj` JSON), drag-and-drop open, and recent-file list
- Keyboard shortcuts and a command palette

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Electron (optional desktop shell)
- Vitest

## Installation

```bash
npm install
```

## Development

Web:

```bash
npm run dev
```

Desktop:

```bash
npm run electron:dev
```

Tests:

```bash
npm test
```

## Web Build

```bash
npm run build
npm run preview
```

The Vite renderer is written to `dist/`.

## Electron Build

```bash
npm run electron:build
```

This compiles the renderer, bundles the Electron main/preload scripts into `dist-electron/`, and packages a directory build under `release/`.

## Project Structure

```text
electron/                 Electron main process and preload bridge
src/
  components/             Shared UI, layout, dialogs, SVG visualization
  features/               Tool pages (steel, flexural, slab, spectrum, surcharge, converter)
  lib/                    Calculation engines, validation, project files
  stores/                 UI and domain state
  services/               File open/save helpers
  hooks/                  Keyboard shortcuts
public/                   Favicon and static assets
```

## Usage

1. Open the overview page and choose a tool, or press `Ctrl/⌘ K`.
2. Enter inputs. Results and diagrams update immediately.
3. Save a project with `Ctrl/⌘ S`. Files are JSON documents with a `version` field.
4. Export steel tables or spectra as CSV from the tool page.

Material defaults live in Settings and seed the concrete and slab forms.

## Import / Export

| Format | Direction | Notes |
| ------ | --------- | ----- |
| `.swproj` / `.json` | Open and save | Full workspace project |
| CSV | Export | Steel catalogs and response-spectrum points |
| Drag and drop | Open | Drop a project file onto the window |

Desktop builds use a preload IPC bridge. The renderer never receives unrestricted filesystem access.

## Keyboard Shortcuts

| Shortcut | Action |
| -------- | ------ |
| Ctrl/⌘ K | Command palette |
| Ctrl/⌘ O | Open project |
| Ctrl/⌘ S | Save project |
| Ctrl/⌘ Shift S | Save project as |
| Ctrl/⌘ E | Export current project JSON |
| Ctrl/⌘ Shift T | Toggle theme |
| Ctrl/⌘ / | Shortcut list |
| 1–8 | Jump to a tool |
| Esc | Close dialogs |
| Space + drag / mouse wheel | Pan and zoom diagrams |

## Development Notes

- Hash routing is used so the UI works from `file://` in Electron.
- Electron runs with `contextIsolation`, `sandbox`, and `nodeIntegration: false`.
- Calculation modules are pure TypeScript and are covered by unit tests.
- This product is a calculation aid. Verify results against the governing code before use in design.

## Feature matrix

| Original feature | Reimplemented | Improved | Notes |
| ---------------- | ------------: | -------: | ----- |
| Steel H-beam table | Yes | Yes | Live SVG section, sort, filter, CSV |
| Steel angle table | Yes | Yes | Same as H-beam |
| Concrete flexural analysis | Yes | Yes | Strain diagram and classification |
| Two-way slab (Marcus) | Yes | Yes | Support-case plan diagram, self-weight toggle |
| Response spectrum | Yes | Yes | Interactive SVG chart, site coefficients displayed |
| Point surcharge | Yes | Yes | SVG heatmap and wall schematic |
| Strip surcharge | Yes | Yes | SVG heatmap and wall schematic |
| Unit converter | Yes | Yes | Added area and moment; SI-correct factors |
| Material options | Yes | Yes | Local persistence plus project files |
| About / license | Yes | Yes | Help page and notices file |

## License

BSD 3-Clause. See `LICENSE` and `THIRD_PARTY_NOTICES.md`.
