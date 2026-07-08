# Harness VLA Website Data Provenance

This website is rebuilt from the Overleaf source at `HarnessVLA/`.
All benchmark numbers shown on `index.html` are transcribed from `HarnessVLA/example.tex`.

## Paper Metadata

- Title: `HarnessVLA/example.tex`, `\title{...}`, lines 13-14.
- Submission status: anonymous CoRL 2026 submission, inferred from `\usepackage{corl_2026}` and the compiled PDF metadata.
- Authors: kept anonymous because the source uses the initial submission mode.

## Headline Results

- LIBERO-Pro: RLinf `50%` to Harness VLA (CC) `82%`.
  Source: abstract and Table `tab:libero_pro_perturbation`, `HarnessVLA/example.tex` around lines 66-69 and 230-258.
- RoboCasa365: RLDX-1 weighted overall `30%` to Harness VLA (Codex) `55%`.
  Source: paragraph and Table `tab:robocasa_main`, around lines 260-283.
- RoboTwin C2R: Harness VLA (Codex) `58%`, Harness VLA (CC) `58%`.
  Source: Table `tab:robotwin_c2r`, around lines 311-327.

## Tables and Derived Displays on the Website

- Primitive vocabulary chips:
  Source: Table `tab:primitive_vocabulary`, around lines 137-155.
- Standard LIBERO success rates:
  Source: Table `tab:libero_main`, around lines 210-227.
- LIBERO-Pro aggregate success rates:
  Source: Table `tab:libero_pro_perturbation`, around lines 230-258.
- RoboCasa365 success rates:
  Source: Table `tab:robocasa_main`, around lines 263-283.
- Zero-shot LIBERO-Pro Goal:
  Source: Table `tab:zeroshot_vs_capx_transposed`, around lines 287-306.
- RoboTwin C2R:
  Source: Table `tab:robotwin_c2r`, around lines 311-327.

## Figures and Images

The website references original image files directly from `HarnessVLA/`.
No PDF screenshots, extracted PDF page images, generated mosaics, or derived web image files are used by `index.html`.

- Main framework figure:
  `HarnessVLA/scheme.png`.
- Teaser / perturbation figure:
  `HarnessVLA/figures/Abstract_figure.png`.
- Benchmark overview:
  `HarnessVLA/figures/libero.png`, `liberopro.png`, `robocasa.png`, `robotwin.png`.
- Generalization terminal states:
  `HarnessVLA/figures/object_t4_*.png`, `goal_t2_*.png`.
- Adaptive VLA invocation charts:
  `HarnessVLA/figures/exp_analysis/vla_invoke_success.png`,
  `robocasa_vla_invoke.png`, `robotwin_vla_invoke.png`.
- Adaptive rollout frames:
  `HarnessVLA/figures/exp_analysis/frame_0118.png` through `frame_1089.png`,
  and `HarnessVLA/figures/exp_analysis/PreSoakPan_s1_frames/*.png`.
- Completion attribution:
  `HarnessVLA/figures/exp_analysis/all_finisher.png`.
- Analytic decomposition rollout frames:
  `HarnessVLA/figures/exp_analysis/10_swap_t7/*.png`,
  and `HarnessVLA/figures/exp_analysis/SteamInMicrowave_s2_frames/*.png`.

## Limitations

The limitations section is transcribed from `HarnessVLA/example.tex` around lines 466-475:

- Open feedback loop between the high-level planner and low-level VLA.
- No joint fine-tuning via environmental rewards and human preferences.
- Absence of fine-grained image captioning in highly cluttered, long-horizon tasks.

## Verification Notes

- The website intentionally keeps `noindex,nofollow` and `robots.txt` disallowing crawlers because the paper is currently an anonymous submission.
- Before public release, update authors, BibTeX, code/model links, and remove the crawler restrictions if appropriate.
