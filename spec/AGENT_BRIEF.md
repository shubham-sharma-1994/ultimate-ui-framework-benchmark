# Brief for every Jules agent

You build ONE framework's version of the "Pulse" benchmark app. Read, in order: `spec/DESIGN.md`, `spec/COMPAT.md`,
`spec/CI.md`, `spec/data.json`, `apps/_TEMPLATE_NOTES.md`.

Goal: pixel-, position-, motion-identical to the spec, using the framework idiomatically. Moderate effort: build what works
out of the box, skip & document what doesn't. No deep hacks, no native plugins written just for this demo.

Deliverables (only these paths): `apps/<fw>/**` (source, assets copied from `spec/assets`, `README.md` with run/build
commands, `NOTES.md` from the template) and `.github/workflows/<fw>.yml`.

Process: 1) propose a short plan (framework version, project layout, target support, which capabilities you expect to skip) and
WAIT for approval; 2) implement; 3) open one PR to the integration branch titled `[<fw>] Pulse app`; 4) PR description lists
✅/⚠️/⏭️ summary and CI status. Do not ask questions unless blocked.
