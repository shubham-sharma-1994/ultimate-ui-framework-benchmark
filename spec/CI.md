# CI & artifact rules (per framework)

One workflow per framework: `.github/workflows/<fw>.yml`, triggered on `push`/`pull_request` with
`paths: ['apps/<fw>/**', '.github/workflows/<fw>.yml']` plus `workflow_dispatch`. Jobs run independently per target
(`web`, `android`, `windows`); a target the framework can't build is simply omitted (and noted in NOTES.md).

| Target | Runner | Artifact name | Contents |
|---|---|---|---|
| Web | ubuntu-latest | `<fw>-web` | static site folder, release/production build, servable with any static server from `/` |
| Android | ubuntu-latest | `<fw>-android` | release-mode APK (debug-signed is fine), `app-<fw>.apk` |
| Windows | windows-latest | `<fw>-windows` | zipped self-contained folder or portable exe, `app-<fw>-windows.zip` |

Rules: release/optimised builds only (benchmarks depend on it); pin tool versions; cache dependencies; no secrets;
`actions/upload-artifact@v4`, retention 30 days. Build must pass from a clean checkout. If a job can't be made green after a
reasonable try, mark it `continue-on-error: true`, say so in NOTES.md, and move on.
