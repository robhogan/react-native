# RNTester visual tests

Maestro flows that capture cropped screenshots of RNTester examples for visual regression testing. Baselines live in object storage, not in Git.

- `flows/`: one flow per visual contract. Each flow deep-links to its example, asserts it is ready, and captures with `takeScreenshot` to `${VISUAL_OUTPUT_DIR}/<component>/<scenario>/<checkpoint>`.
- `helpers/`: flow fragments. They live outside `flows/` so the runners don't execute them as flows.
- `config.json`: the comparison policy. Every test is strict by default: any changed pixel is a difference. Loosen a single test under `tests` only with evidence.

`Visual Capture RNTester` captures on CI, and `Visual Compare RNTester` compares with the baseline for the pull request's base commit and reports on the PR. To accept an intentional change, a maintainer applies the `visual-change-approved` label after reviewing the report.
