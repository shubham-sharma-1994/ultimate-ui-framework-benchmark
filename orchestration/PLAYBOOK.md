# Orchestration playbook (for the Claude session driving Jules)
Sessions: `sessions.json` (framework → Jules session id). `python3 check.py` prints state/plan/PR per framework.
Cadence: sleep 25 min → check plans (+15 min loops until all approved) → then 45 min loops until all PRs are in and CI is green.
Approve: POST /v1alpha/sessions/{id}:approvePlan · Message: POST /v1alpha/sessions/{id}:sendMessage {"prompt": "..."}.
Rules: don't force anyone - if a framework can't do something, it is skipped with a note in apps/<fw>/NOTES.md.
