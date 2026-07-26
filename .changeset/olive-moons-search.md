---
'eslint-plugin-zod': patch
---

fix: `no-conflicting-checks` now recognises every deprecated chained string format

`.ipv4()`, `.guid()`, `.ksuid()`, `.uuidv4()`, `.xid()` and others were missing
from the rule's table, so conflicts involving them went unreported.
