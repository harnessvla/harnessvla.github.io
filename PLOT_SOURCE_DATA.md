# Plot Source Data — `Agentic-VLA-paper/plot/`

Source data for every figure produced by the scripts in this folder, so the plots can be
reproduced directly from the numbers. Each machine-readable table is also in
`plot/source_data/*.csv` (opens in Excel). Shared publication style: DejaVu Sans,
`pdf.fonttype 42`, no top/right spines.

*生成 2026-07-08.*

## Index

| Script | Output figure(s) | Data table |
|---|---|---|
| `plot_finisher_attribution.py` | `finisher_attribution.*` (LIBERO) | §1 · `finisher_attribution.csv` |
| `plot_robocasa_finisher.py` | `robocasa_finisher.*` | §1 |
| `plot_robotwin_finisher.py` | `robotwin_finisher.*` | §1 |
| `plot_all_finisher.py` | `all_finisher.*` (3 panels combined) | §1 (same data) |
| `plot_vla_invoke_success.py` | `vla_invoke_success.*` (LIBERO) | §2 · `vla_invoke_success.csv` |
| `plot_robocasa_vla_invoke.py` | `robocasa_vla_invoke.*` | §2 |
| `plot_robotwin_vla_invoke.py` | `robotwin_vla_invoke.*` | §2 |
| `plot_robocasa_hybrid_vs_fullshot.py` | `robocasa_hybrid_vs_fullshot.*` | §3 · `robocasa_hybrid_vs_fullshot.csv` |
| `plot_method_comparison.py` | `libero/robocasa/robotwin_method_comparison.*` | §4 · `method_comparison.csv` |

---

## 1. Finisher attribution (VLA vs analytic)

**Chart:** grouped bars. **x** = benchmark category · **y** = "Proportion of task completions (%)"
(0–100). **Series:** "Analytic primitive finish" (`#4C72B0`), "VLA primitive finish" (`#DD8452`).
**Definition:** for each SOLVED cell, classify the LAST non-aux action of its recipe as VLA
(`pi0_pick`/`pi0_doubled` · `lingbot_act` · `rldx_skill`/`rldx_arm`) or analytic (everything else).
Bars show each side as a % of the solved cells `n = analytic + VLA`.

| Environment | Category | analytic | VLA | n | analytic % | VLA % |
|---|---|--:|--:|--:|--:|--:|
| LIBERO | Spatial | 165 | 63 | 228 | 72 | 28 |
| LIBERO | Object | 127 | 31 | 158 | 80 | 20 |
| LIBERO | Goal | 124 | 32 | 156 | 79 | 21 |
| LIBERO | LIBERO-10 | 97 | 18 | 115 | 84 | 16 |
| RoboCasa | Composite seen | 12 | 18 | 30 | 40 | 60 |
| RoboCasa | Composite unseen | 4 | 6 | 10 | 40 | 60 |
| RoboCasa | Atomic | 17 | 108 | 125 | 14 | 86 |
| RoboTwin | RoboTwin (50 tasks) | 38 | 67 | 105 | 36 | 64 |

---

## 2. Cumulative task success vs VLA-invocation budget

**Chart:** line "-o" (`#DD8452`), + two dashed reference lines: "VLA full-shot" (`#4C72B0`) and
"Hybrid, all invocations" (`#999999`). **x** = "VLA primitive invocations ( ≤ k )"
(0..K_MAX) · **y** = "Cumulative task success (%)" (0–100). No background grid (only the two dashed refs). Point value = fraction of ALL episodes
solved with ≤k VLA calls.

**Reference lines / scope:** LIBERO — full-shot 50%, hybrid overall 82%, n=803, K_MAX=6 ·
RoboCasa — full-shot 21%, hybrid overall 48%, n=80, K_MAX=10 · RoboTwin — full-shot 50.4%,
hybrid overall 55%, n=191, K_MAX=8.

| Environment | k (≤) | cumulative success % | episodes with exactly k |
|---|--:|--:|--:|
| LIBERO | 0 | 3 | 42 |
| LIBERO | 1 | 52 | 445 |
| LIBERO | 2 | 68 | 151 |
| LIBERO | 3 | 73 | 55 |
| LIBERO | 4 | 77 | 37 |
| LIBERO | 5 | 79 | 20 |
| LIBERO | 6 | 80 | 15 |
| RoboCasa | 0 | 0 | 0 |
| RoboCasa | 1 | 2 | 2 |
| RoboCasa | 2 | 11 | 8 |
| RoboCasa | 3 | 21 | 9 |
| RoboCasa | 4 | 26 | 8 |
| RoboCasa | 5 | 29 | 3 |
| RoboCasa | 6 | 31 | 4 |
| RoboCasa | 7 | 32 | 2 |
| RoboCasa | 8 | 35 | 7 |
| RoboCasa | 9 | 36 | 2 |
| RoboCasa | 10 | 39 | 6 |
| RoboTwin | 0 | 0 | 3 |
| RoboTwin | 1 | 14 | 27 |
| RoboTwin | 2 | 46 | 72 |
| RoboTwin | 3 | 52 | 29 |
| RoboTwin | 4 | 52 | 27 |
| RoboTwin | 5 | 53 | 10 |
| RoboTwin | 6 | 54 | 7 |
| RoboTwin | 7 | 55 | 10 |
| RoboTwin | 8 | 55 | 1 |

---

## 3. RoboCasa — Hybrid vs VLA full-shot (bars)

**Chart:** grouped bars. **x** = category · **y** = "Task success rate (%)" (0–100). **Series:**
"VLA full-shot" (`#4C72B0`), "Hybrid (LLM + VLA)" (`#DD8452`). Values are hardcoded in the script.

| Category | Hybrid | Hybrid % | VLA full-shot | full-shot % |
|---|---|--:|---|--:|
| Composite seen | 38/80 | 48 | 17/80 | 21 |
| Composite unseen | 6/36 | 17 | 1/36 | 3 |
| Atomic | 143/180 | 79 | 537/900 | 60 |

> Note: `unseen` uses the older 9-task subset (6/36, 1/36) — edit the script's `DATA` for the 16-task version.

---

## 4. Method comparison (bars)

**Chart:** one bar per method, "Harness VLA" highlighted. **x** = method · **y** = "Task success
rate (%)" (0–100). **Colors:** ours `#7FB3D5` (light blue), baselines `#B0B0B0` (grey). Ours bar
label + its % are bold; ours % is larger. Values are hardcoded (paper/literature numbers).

| Benchmark | Method | Success rate % | Role |
|---|---|--:|---|
| LIBERO-PRO | $\pi_{0.5}$ | 11 | baseline |
| LIBERO-PRO | Cap-X | 18.2 | baseline |
| LIBERO-PRO | RATS | 43.8 | baseline |
| LIBERO-PRO | RLinf | 50.0 | baseline |
| LIBERO-PRO | Harness VLA | 82.4 | ours |
| RoboCasa | $\pi_{0.5}$ | 17 | baseline |
| RoboCasa | RLDX-1 | 30 | baseline |
| RoboCasa | Harness VLA | 55.4 | ours |
| RoboTwin | StarVLA | 10.6 | baseline |
| RoboTwin | $\pi_{0.5}$ | 47.9 | baseline |
| RoboTwin | Harness VLA | 58.4 | ours |

---

### Reproduce

```
cd Agentic-VLA-paper/plot
/opt/venv/openpi/bin/python plot_finisher_attribution.py     # + robocasa/robotwin/all_finisher
/opt/venv/openpi/bin/python plot_vla_invoke_success.py        # + robocasa/robotwin_vla_invoke
/opt/venv/openpi/bin/python plot_robocasa_hybrid_vs_fullshot.py
/opt/venv/openpi/bin/python plot_method_comparison.py
```

Compute-based scripts (§1, §2) recompute their numbers on run; the bar scripts (§3, §4) read their
hardcoded `DATA`/lists.
