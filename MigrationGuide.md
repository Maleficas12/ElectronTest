# SOMA Aware Dashboard Migration Guide

## Goal

Migrate the SOMA Aware Dashboard from the older Dash/Plotly Python desktop implementation to a Tauri + React + Plotly.js desktop app.

The migration should preserve the familiar SOMA Aware workflow and visual identity while improving maintainability, testability, and frontend flexibility. React should own the UI, routing, state orchestration, and Plotly.js rendering. Existing Python data engineering and processing code should be reused through a sidecar boundary instead of being rewritten up front.

## Reference Sources

- Current Tauri app: `W:\Game Development\ElectronTest`
- Legacy Dash app: `D:\Documents\Unity\AWARE\_Tools\SOMA Aware Dashboard`
- Legacy app source: `D:\Documents\Unity\AWARE\_Tools\SOMA Aware Dashboard\src`
- Visual reference guide: `C:\Users\Michel\Downloads\2026-02-10_Quickstart-Guide_v1.5.1.docx`

The quickstart guide screenshots are the visual reference for the new UI. The goal is visual familiarity, not a literal copy of Dash or Bootstrap internals.

## Target Architecture

The target app should be split into clear frontend, native, and Python-sidecar boundaries.

- React renderer:
  - app shell, routing, page layout, local UI state, and user workflows
  - Plotly.js chart rendering and interaction
  - testable views with stable Playwright selectors
- Tauri/Rust backend:
  - typed command bridge between React and native capabilities
  - filesystem/native dialog access
  - Python sidecar process lifecycle and command execution
  - packaging integration for sidecar binaries and external tools
- Python sidecar:
  - session discovery and metadata extraction
  - biomarker definitions and data loading
  - downsampling and preprocessing helpers
  - processing/export orchestration where Python already owns the reliable implementation

Suggested frontend module structure:

```text
src/renderer/
  app/
    shell/
    routes/
    providers/
  features/
    visualization/
    recordings/
    exports/
    settings/
    processing/
  shared/
    api/
    components/
    contracts/
    formatting/
    styles/
```

Use `react-router-dom` for page routes and a query/cache layer such as `@tanstack/react-query` for sidecar calls, polling, loading states, and cache invalidation. Keep global state small and explicit: selected session, selected biomarker, sidebar state, visualization settings, and active job summaries.

Keep domain state separate from rendering state:

- domain data: sessions, metadata, biomarkers, visualization payloads, jobs, exports
- UI state: open modals, selected tabs, sidebar collapsed state, transient control values
- derived view models: table rows, disabled action states, status labels, chart traces

Complex transformations should live in pure, unit-tested functions rather than React components. This includes Plotly trace building, histogram shaping, biomarker availability, session status labels, export labels, and disabled-state rules. Components should mostly compose data and render UI.

## Visual Design Direction

The new UI should look and feel close to the guide screenshots:

- dark desktop dashboard shell
- left sidebar with SOMAREALITY branding
- sidebar navigation for `Recordings`, `Visualization`, and `Exports`
- bottom sidebar actions for `Need help?`, `Settings`, and app version
- compact page headings with primary actions grouped at the top right
- dense recording table with:
  - checkbox selection
  - session name
  - duration
  - location
  - status pill
  - processed biomarker pills
  - icon action buttons
- blue primary/icon buttons
- green/teal processed and available states
- grey disabled or unavailable states
- red destructive actions such as cancel queue
- centered dark modals for settings, license, data folder, diagnostics, and export selection
- visualization page with:
  - selected recording summary row
  - processed video panel on the left
  - time-series plot under the video
  - histogram and intervals panel in the middle
  - biomarker interpretation panel on the right

Use modern React components and icons, but preserve the old app's information density and workflow rhythm. Avoid turning the app into a marketing-style interface; this is an operational analysis tool.

## Migration Phases

1. Visualization-first using processed session data.
   - Build the app shell and visualization route.
   - Load already-processed session results through the Python sidecar.
   - Render processed video, time-series chart, histogram, biomarker tabs, plot settings, moving average, peak settings, and downsampling/detail controls.

2. Recordings and metadata discovery.
   - Add folder selection.
   - Discover compatible sessions under a parent folder.
   - Show cached metadata and processed/raw status in the recording table.
   - Allow selecting a session and navigating to visualization.

3. Export queue.
   - Add export selection modal.
   - Add export queue page.
   - Surface queued, running, completed, warning, and failed export states.

4. Processing queue.
   - Add biomarker processing queue.
   - Show active job, queued sessions, progress, logs, and cancellation states.
   - Keep long-running processing behind the Python sidecar.

5. Package Python sidecar and external binaries.
   - Bundle the sidecar executable with Tauri.
   - Resolve external tools such as processing binaries, ffmpeg/ffprobe, and export helpers from packaged paths.
   - Keep signing/updater workflows separate from ordinary feature development.

## Python Sidecar Strategy

Use a Python sidecar as the default strategy for reusing the old application's proven data engineering code.

The sidecar should expose stable JSON commands. Tauri should own process spawning and translate sidecar responses into typed frontend contracts. React components should never call generic process APIs directly.

The sidecar should also expose a lightweight machine-readable command manifest. The manifest should list supported commands, basic input/output schema names, and version information. This gives humans, tests, and AI agents a reliable way to discover sidecar capabilities without reading implementation details.

Manifest command candidate:

- `worker.manifest`

Initial sidecar command candidates:

- `worker.health`
- `biomarkers.list`
- `visualization.loadProcessedSession`
- `visualization.loadTimeSeries`
- `visualization.loadHistogram`
- `visualization.loadVideoInfo`

Later command candidates:

- `recordings.discover`
- `sessions.getMetadata`
- `exports.enqueue`
- `exports.getStatus`
- `processing.enqueue`
- `processing.getStatus`
- `processing.cancelQueued`

Prefer returning data payloads instead of Python-generated Plotly figure JSON where practical. This lets React own the presentation and makes Playwright assertions easier. Python should still own heavy data loading, normalization, downsampling, provider detection, and processing orchestration.

## Shared Data Contracts

Define shared TypeScript contracts before building feature UI. Mirror these contracts in the sidecar's JSON responses.

Core contracts:

- `BiomarkerDefinition`
  - `name`
  - `displayName`
  - `csvFilename`
  - `categories`
  - `colors`
  - `plotModes`
  - `downsamplingStrategy`
- `SessionSummary`
  - `path`
  - `name`
  - `duration`
  - `locationLabel`
  - `status`
  - `biomarkers`
  - `resultsFolder`
- `SessionMetadata`
  - `path`
  - `videoFile`
  - `videoUrl`
  - `resultsFolder`
  - `isProcessed`
  - `biomarkers`
  - `gazeVideo`
- `VisualizationPayload`
  - `session`
  - `selectedBiomarker`
  - `availability`
  - `video`
  - `timeSeries`
  - `histogram`
  - `intervals`
  - `warnings`
- `TimeSeriesPayload`
  - `time`
  - `value`
  - `confidence`
  - `peaks`
  - `downsampled`
  - `cacheKey`
- `JobSnapshot`
  - `id`
  - `type`
  - `status`
  - `stage`
  - `progress`
  - `message`
  - `logs`
  - `startedAt`
  - `completedAt`
- `ApiError`
  - `code`
  - `message`
  - `details`

These contracts should be stable enough for Playwright fixtures, sidecar contract tests, and future release validation.

Treat these contracts as the app's main integration boundary. When a feature needs new data, add or extend a contract first, then implement the Python response, Tauri command, React query, and UI. This makes feature work easier for both human developers and AI agents because each layer has an explicit shape to satisfy.

## Testing Strategy

Most functionality should be testable via Playwright. The UI should expose stable `data-testid` attributes on major surfaces and actions:

- shell navigation
- page headings
- recording table
- recording rows
- row action buttons
- settings modal
- export modal
- biomarker tabs
- video panel
- histogram panel
- time-series plot panel
- intervals panel
- export queue rows
- processing queue overlay

Tests should avoid native dialogs where possible. For local and CI tests, provide fixture-backed or test-mode command responses for native folder selection and sidecar calls.

The first migrated features should be built as testable vertical slices:

```text
test session data -> Python sidecar contract -> Tauri command -> React query -> UI -> Playwright assertion
```

Each major page should have Playwright page-object helpers so tests and AI agents can use the same vocabulary for common actions such as selecting a recording, opening settings, switching biomarkers, queueing exports, or checking job status.

In dev/test mode only, expose enough diagnostics for browser-driven debugging:

- active test mode
- configured test data parent
- selected session
- selected biomarker
- sidecar health
- last sidecar/API error
- active processing/export jobs

This can be hidden from production builds, but it makes Playwright MCP and other browser automation tools much easier to use.

Playwright suites should be split into short and long groups:

- Short tests:
  - suitable for PR validation
  - use small/simple real sessions or fixtures
  - verify navigation, rendering, metadata loading, visualization surfaces, modal behavior, and simulated export/processing states
- Long tests:
  - suitable for local verification or final release readiness
  - use larger real sessions
  - may cover slower end-to-end processing/export flows

Both suites should be runnable locally by providing a parent data folder. The exact storage/upload layout for short and long test datasets can be decided later. The important design constraint is that the app and tests should be able to point at real test session folders without hardcoded local machine paths.

Suggested environment variables:

```text
SOMA_TEST_DATA_PARENT
SOMA_TEST_SUITE=short|long
SOMA_TEST_MODE=fixture|sidecar|real
```

Playwright MCP can be used for interactive debugging when available. Standard Playwright CLI tests should remain the repeatable source of truth for CI and local validation.

## Validation Commands

For ordinary feature work:

```bash
npm run typecheck
npm run test:smoke
```

For documentation-only changes, app builds and typechecks are not required unless code or release metadata also changes.

For version or release metadata changes:

```bash
npm run version:check
```

Do not run installer builds for ordinary feature work. Installer builds are only needed when packaging, signing, updater behavior, release workflows, or sidecar bundling changes.

## Assumptions and Non-Goals

Assumptions:

- The quickstart guide screenshots represent the desired visual direction.
- Python sidecar reuse is preferred over an immediate TypeScript/Rust rewrite of data engineering logic.
- Visualization is the first migration slice, followed by recordings/metadata, export queue, and processing queue.
- Real short and long test sessions will become available for Playwright and release validation.
- The new app should be easier to test than the old Dash callback graph.

Non-goals for the first migration pass:

- Pixel-perfect recreation of Dash/Bootstrap markup.
- Rewriting all Python processing code into TypeScript or Rust.
- Full installer/signing workflow changes.
- Finalizing the complete test data storage strategy.
- Building every old feature before establishing the sidecar contracts and visual shell.
