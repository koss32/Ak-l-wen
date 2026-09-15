# Historical branch map

Only two branches are active project references:

- `release-2` — approved AK LÖWEN landing baseline.
- `release-3` — current AK LÖWEN application WIP: landing + Telegram integration.

All other branch names are historical technical refs and must not be used as user-facing versions.

## Fully contained in an active release

These branches are ancestors of an active release; their commits are already reachable from Release 2 or Release 3:

- `backup/site-v1-d640c22-release-a` → contained in `release-2`.
- `codex/release-a` → contained in `release-2`.
- `feature/telegram-bot-mvp` → contained in `release-2`.
- `feature/telegram-native-care-2026-09-14` → contained in `release-3`.
- `hoplite/tanagra-066bef9e` → contained in `release-3`.

These refs are redundant as working branches, but remain visible until branch deletion is performed with repository administration access.

## Historical branches with unique commits

These branches diverge from the current release chain and contain one or more commits not reachable from the active release being compared. They must not be deleted blindly:

- `Ak-loewen` — old documentation/default branch with unique historical commits.
- `backup/pre-v3-2026-09-12` — historical pre-v3 snapshot with unique history.
- `codex/site-v1` — early implementation branch with unique history.
- `feature/v3-functional-fixes` — historical v3 functional work with unique commits.
- `fix-navigation-trainer-handoff-20260913` — historical navigation/trainer work with unique commits.
- `hoplite/beroia-1c1134e6` — historical branch with a unique commit relative to current Release 3.
- `release-a-review-20260913` — historical review branch with unique history.

If repository branch cleanup is performed later, preserve those unique commits first under clearly named archive tags/refs or verify that their useful content has already been captured elsewhere.

## Pull requests

- PR #1 — archived/closed; early site work.
- PR #2 — archived/closed; pre-Release-3 Telegram work.
- PR #3 — current Draft PR: `release-3` → `release-2`.

The active project navigation should therefore be understood as:

```text
AK LÖWEN
├─ Release 2 — approved
└─ Release 3 — WIP / Preview
   └─ Telegram integration
```
