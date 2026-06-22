# The Grid Architecture

The Grid is the top-level local-first operations shell for Davis's projects. It is not a replacement for Hermes. Hermes remains the agent/runtime system; The Grid is the structured human command surface for current project state, evidence, reports, prompts, and local audio/report intake.

## Shell And Modules

The Grid owns shared shell concerns:

- top-level module switching
- active module selection
- global audio inbox metadata
- saved reports
- prompt library surfaces
- local data export/import
- settings and namespace visibility

Each project gets a module inside The Grid. A module should keep its data, language, prompts, export format, and maintenance workflow isolated enough that it can later be spun off into a standalone tool.

The first two top-level modules are:

- `Grid Home` for Grid-owned overview and shell utilities
- `Meridian Port` for Meridian-specific operations

## Meridian Port

Meridian Port is the first project module. It owns Meridian-specific readiness work:

- fresh-clone audit prompt flow
- PR #7 scoped hybrid auto-close smoke checklist
- smoke evidence fields
- final ready / hold / rollback decision
- Meridian smoke export format
- Meridian prompt cards

The smoke checklist remains focused on live Salesforce/widget smoke testing. Source-code review and readiness audit work belongs in prompts, not in checklist rows.

## Source Layout

- `src/app` owns app state orchestration and module/view selection.
- `src/grid/moduleRegistry` owns top-level module registration.
- `src/shell` owns the Grid shell, module tabs, and command-center status bar.
- `src/ports/meridian` owns Meridian Port rendering, namespaced Meridian styles, data, prompts, storage, and export format.
- `src/shared` is reserved for cross-port components, storage helpers, export helpers, and audio utilities.

Meridian rendering is split by operational concern:

- `MeridianOverview.js`
- `MeridianAudit.js`
- `MeridianSmokeChecklist.js`
- `MeridianReports.js`
- `meridianStyles.css`

## Local-First Storage

The current Grid shell has no backend dependency and no Supabase writes. Data is stored locally using namespaced browser storage:

- `grid:activePort`
- `grid:activeModule`
- `grid:activeView`
- `grid:inbox`
- `grid:reports`
- `grid:meridian-port:audit`
- `grid:meridian-port:smoke-checklist`
- `grid:meridian-port:metadata`
- `grid:meridian-port:exports`

Audio blobs are stored in IndexedDB. Metadata stays in localStorage so it can be exported with the rest of The Grid data.

`grid:activePort` is retained as a legacy migration key. New module selection is stored in `grid:activeModule`.

## Audio Inbox

The Audio Inbox exists because Telegram media playback can chain or loop through old messages, and technical reports can get buried in chat. The current Grid shell supports manual/local intake: paste a report, upload an audio file, or provide an audio URL.

A static PWA cannot receive live Tron messages automatically by itself. Future versions may add one of these ingress paths:

- webhook/API endpoint such as `POST /api/inbox`
- local folder watcher for a local desktop mode, such as `~/tron-outbox/`
- hosted file/audio URL ingestion

Those are intentionally out of scope for the current static shell.
