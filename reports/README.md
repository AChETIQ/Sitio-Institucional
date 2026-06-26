# reports/

Sibling output directory for the **later** optimization passes (`01`–`04`, `06`).
Each pass writes its "after" measurements here so they can be diffed against the
committed pre-optimization baseline in
[`../prompts/optimization/baseline/`](../prompts/optimization/baseline/).

This directory is intentionally empty at baseline time — `05-baseline-audit.md`
only **measures**; it does not produce "after" numbers.
