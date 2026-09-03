# norman-omc: mattpocock/skills C-class skills

## Release Notes

Completes the mattpocock/skills integration with the four C-class skills deferred from the initial merge.

### New skills

- **triage**: issue/PR triage state machine (needs-triage / needs-info / ready-for-agent / ready-for-human / wontfix), redundancy check, `.omc/out-of-scope/` rejection knowledge base, and agent briefs.
- **prototype**: throwaway prototype to answer a design question (logic branch via a single shareable HTML file, or UI branch via switchable variants).
- **improve-codebase-architecture**: deep-module scan with a Tailwind/Mermaid HTML report and a grilling loop, built on the codebase-design vocabulary.
- **writing-for-agents**: reference for writing agent-consumed docs (context pointers, information hierarchy, completion criteria), consulted by `writer`.

### Registration

- `plugin.json` skills array 43 -> 47; `skills/AGENTS.md` updated; `agents/writer.md` gains a writing-for-agents reference.

---

# norman-omc: mattpocock/skills integration

## Release Notes

Integrates the incremental value of mattpocock/skills into OMC's agents and skills, following the demote-and-unify principles from the merge plan (`docs/migrate_mattpocock_skills_to_omc.xlsx`): mattpocock skills are demoted to agent-internal prompts and reference skills rather than top-level slash commands, and all state lands in the `.omc/` namespace as the single source of truth.

### New reference skills (consult, not run)

- **codebase-design:** deep-module vocabulary (module, interface, seam, adapter, depth, leverage, locality), the deletion test, and design-it-twice. Consulted by `architect`, `executor`, `code-reviewer`, and `code-simplifier`.
- **domain-modeling:** glossary (`.omc/context.md`) and ADR (`.omc/adr/`) discipline with the three-condition ADR test. Consulted by `architect`, `planner`, and `analyst`.

### Agent enhancements

- **debugger:** adds a Phase 0 feedback-loop discipline (build a tight, red-capable loop before hypothesising), secret redaction, and 3-5 ranked falsifiable hypotheses.
- **test-engineer:** adds seam discipline (test only at pre-agreed seams), three anti-patterns (implementation-coupled, tautological, horizontal slicing), and vertical-slice tracer bullets.
- **code-reviewer:** adds fixed-point review (`git diff <ref>...HEAD`) and the Fowler 12-smell baseline with repo-override and judgment-call rules.
- **git-master:** adds a five-step merge/rebase conflict-resolution protocol.

### New user-invoked tools

- **wizard** (with `template.sh`), **to-questionnaire**, **wait-what**, **teach** (with four FORMAT files), **git-guardrails** (with `block-dangerous-git.sh`), **setup-pre-commit**.

### Registration

- `plugin.json` skills array 35 -> 43; `skills/AGENTS.md` adds Reference Skills and User-invoked Tools sections.

---

# oh-my-claudecode v5.1.0: Governed Delivery and Reliable Model Routing

## Release Notes

v5.1.0 is the minor release from the published v5.0.2 baseline through the current `dev` release candidate. It adds opt-in governed-delivery workflows, strengthens configured model preservation during team scale-up, and closes delegation-notice shell parsing false positives.

### Highlights

- Adds the opt-in `minimal-code-discipline` skill for existence-first, reuse-first implementation discipline. (#3899)
- Adds the opt-in `drydock` repository harness and `launch` governed delivery pipeline, plus a source-exact Shipyard methodology map. (#3907, #3908)
- Adds document-language selection and bilingual seed support to `drydock`. (#3909)
- Preserves Cursor and configured provider model defaults across direct launches and team scale-up. (#3900, #3904, #3905)
- Eliminates delegation-notice false positives for scratchpad writes, log redirects, shell control flow, directory-copy destinations, and named coprocess commands. (#3911 and exact-dev follow-up commits)

### New Features

- **Minimal code discipline:** ships `minimal-code-discipline` as an explicit, opt-in built-in skill. (#3899)
- **Governed delivery:** ships the `drydock` four-pillar harness scaffold and the `launch` staged delivery pipeline. (#3907)
- **Localized scaffolding:** lets `drydock` choose the document language and seed bilingual project guidance. (#3909)

### Reliability Fixes

- **Model routing:** gives Cursor a default-model hook and preserves effective configured defaults when team capacity scales up. (#3900, #3904, #3905)
- **Delegation enforcement:** accepts safe scratchpad writes and shell log redirects without false delegation notices. (#3911)
- **Shell parser follow-ups:** recognizes control-flow reserved words, copy destinations, coprocess source mutations, and named coprocess commands on the exact release-candidate lineage. (`da23d1a21`, `a02c57610`, `5bacbf808`)

### Documentation

- Documents the Shipyard vision, boundary, pillars, surfaces, and feedback loop with source-exact references. (#3908)

### Release Range

- Published baseline: `v5.0.2` (`adf4bf3280c8a8d7b932d5c11aef84ba22d6a11d`)
- Development merge base: `9d4d6c834fdd78febdb177eba70dc264efafad93`
- Release-candidate source: `5bacbf808698ab299a7136fad342b3a9eb95a096`
- Included work: 8 merged pull requests plus 3 exact-dev shell-parser follow-up commits.

### Validation

The release candidate must pass exact-head version consistency, metadata/projection/inventory verification, focused changed-feature tests, lint, typecheck, the full test suite, build, plugin shipping verification, package pack/install/CLI version smoke, upgrade validation, and protected GitHub checks. A failing or unavailable gate is not represented as passing evidence.
