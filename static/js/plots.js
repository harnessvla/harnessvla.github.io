(function () {
  const DATA_PATH = "static/data/plots/";
  const NS = "http://www.w3.org/2000/svg";
  const colors = {
    analytic: "#6ea8fe",
    vla: "#ffb86b",
    ours: "#7dd3fc",
    base: "#8f9bad",
    hybrid: "#ffb86b",
    fullshot: "#6ea8fe",
    axis: "rgba(226, 236, 255, 0.78)",
    grid: "rgba(226, 236, 255, 0.12)",
  };

  const state = {
    datasets: null,
  };

  const tooltip = document.createElement("div");
  tooltip.className = "plot-tooltip";
  document.body.appendChild(tooltip);

  function splitCSVLine(line) {
    const cells = [];
    let current = "";
    let quoted = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      const next = line[i + 1];

      if (ch === '"' && quoted && next === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = !quoted;
      } else if (ch === "," && !quoted) {
        cells.push(current);
        current = "";
      } else {
        current += ch;
      }
    }

    cells.push(current);
    return cells;
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    const headers = splitCSVLine(lines[0]);

    return lines.slice(1).map((line) => {
      const cells = splitCSVLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    });
  }

  async function loadCSV(name) {
    const response = await fetch(`${DATA_PATH}${name}`);
    if (!response.ok) {
      throw new Error(`Unable to load ${name}`);
    }
    return parseCSV(await response.text());
  }

  function uniq(values) {
    return Array.from(new Set(values));
  }

  function number(value) {
    return Number.parseFloat(value);
  }

  function compact(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function createSVG(width, height) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("aria-hidden", "true");
    return svg;
  }

  function addText(svg, text, x, y, className, attrs = {}) {
    const node = document.createElementNS(NS, "text");
    node.textContent = text;
    node.setAttribute("x", x);
    node.setAttribute("y", y);
    if (className) node.setAttribute("class", className);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.appendChild(node);
    return node;
  }

  function addLine(svg, x1, y1, x2, y2, className, attrs = {}) {
    const node = document.createElementNS(NS, "line");
    node.setAttribute("x1", x1);
    node.setAttribute("y1", y1);
    node.setAttribute("x2", x2);
    node.setAttribute("y2", y2);
    if (className) node.setAttribute("class", className);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.appendChild(node);
    return node;
  }

  function addRect(svg, x, y, width, height, className, attrs = {}) {
    const node = document.createElementNS(NS, "rect");
    node.setAttribute("x", x);
    node.setAttribute("y", y);
    node.setAttribute("width", width);
    node.setAttribute("height", height);
    if (className) node.setAttribute("class", className);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.appendChild(node);
    return node;
  }

  function addPath(svg, d, className, attrs = {}) {
    const node = document.createElementNS(NS, "path");
    node.setAttribute("d", d);
    if (className) node.setAttribute("class", className);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.appendChild(node);
    return node;
  }

  function addCircle(svg, cx, cy, r, className, attrs = {}) {
    const node = document.createElementNS(NS, "circle");
    node.setAttribute("cx", cx);
    node.setAttribute("cy", cy);
    node.setAttribute("r", r);
    if (className) node.setAttribute("class", className);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.appendChild(node);
    return node;
  }

  function attachTooltip(node, html) {
    node.addEventListener("pointerenter", (event) => {
      tooltip.innerHTML = html;
      tooltip.classList.add("visible");
      moveTooltip(event);
    });
    node.addEventListener("pointermove", moveTooltip);
    node.addEventListener("pointerleave", () => {
      tooltip.classList.remove("visible");
    });
  }

  function moveTooltip(event) {
    const offset = 16;
    tooltip.style.left = `${event.clientX + offset}px`;
    tooltip.style.top = `${event.clientY + offset}px`;
  }

  function renderTabs(name, values, active, onClick) {
    const target = document.querySelector(`[data-plot-tabs="${name}"]`);
    if (!target) return;

    target.innerHTML = "";
    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = value;
      button.className = value === active ? "active" : "";
      button.addEventListener("click", () => onClick(value));
      target.appendChild(button);
    });
  }

  function axisScales({ width, height, margin, xDomain, yDomain }) {
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const xSpan = xDomain[1] - xDomain[0] || 1;
    const ySpan = yDomain[1] - yDomain[0] || 1;

    return {
      x: (value) => margin.left + ((value - xDomain[0]) / xSpan) * innerW,
      y: (value) => margin.top + innerH - ((value - yDomain[0]) / ySpan) * innerH,
      innerW,
      innerH,
    };
  }

  function drawGrid(svg, width, margin, yScale, ticks) {
    ticks.forEach((tick) => {
      const y = yScale(tick);
      addLine(svg, margin.left, y, width - margin.right, y, "plot-grid-line");
      addText(svg, `${tick}`, margin.left - 12, y + 4, "plot-axis-label", { "text-anchor": "end" });
    });
  }

  function renderInvokeChart() {
    const allRows = state.datasets.vlaInvoke;
    const target = document.getElementById("vla-invoke-chart");
    if (!target || allRows.length === 0) return;
    target.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "invoke-small-multiples";
    target.appendChild(grid);

    const panels = [
      ["LIBERO-Pro", "LIBERO-Pro"],
      ["RoboCasa365", "RoboCasa365"],
      ["RoboTwin C2R", "RoboTwin C2R"],
    ];

    const referenceLabels = {
      "LIBERO-Pro": {
        full: "HarnessVLA, all invocations",
        frozen: "VLA full-shot",
      },
      RoboCasa365: {
        full: "Hybrid, all invocations",
        frozen: "VLA full-shot",
      },
      "RoboTwin C2R": {
        full: "Hybrid, all invocations",
        frozen: "VLA full-shot",
      },
    };

    panels.forEach(([environment, label], panelIndex) => {
      const rows = allRows
        .filter((row) => row.environment === environment)
        .map((row) => ({
          k: number(row.k_max_vla_invokes),
          success: number(row.cumulative_success_pct),
          episodesRaw: row.episodes_with_exactly_k,
          frozen: number(row.vla_fullshot_ref_pct),
          full: number(row.hybrid_overall_ref_pct),
          totalRaw: row.n_episodes,
        }));
      if (rows.length === 0) return;

      const panel = document.createElement("div");
      panel.className = "invoke-mini-panel";
      grid.appendChild(panel);

      const width = 360;
      const height = 310;
      const margin = { top: 42, right: 18, bottom: 58, left: panelIndex === 0 ? 52 : 30 };
      const maxK = Math.max(...rows.map((row) => row.k));
      const scales = axisScales({
        width,
        height,
        margin,
        xDomain: [0, maxK],
        yDomain: [0, 100],
      });
      const svg = createSVG(width, height);
      const baseY = scales.y(0);

      addText(svg, label, width / 2, 22, "invoke-panel-title", { "text-anchor": "middle" });
      [0, 25, 50, 75, 100].forEach((tick) => {
        const y = scales.y(tick);
        addLine(svg, margin.left, y, width - margin.right, y, "invoke-grid-line");
        if (panelIndex === 0) {
          addText(svg, `${tick}`, margin.left - 10, y + 4, "invoke-axis-label", { "text-anchor": "end" });
        }
      });

      addLine(svg, margin.left, baseY, width - margin.right, baseY, "invoke-axis-line");
      if (panelIndex === 0) {
        addLine(svg, margin.left, margin.top, margin.left, baseY, "invoke-axis-line");
        addText(svg, "Success Rate (%)", 15, margin.top + scales.innerH / 2, "invoke-axis-title", {
          transform: `rotate(-90 15 ${margin.top + scales.innerH / 2})`,
          "text-anchor": "middle",
        });
      }

      const xTicks = Array.from(new Set([0, Math.ceil(maxK / 2), maxK]));
      xTicks.forEach((tick) => {
        const x = scales.x(tick);
        addLine(svg, x, baseY, x, baseY + 5, "invoke-axis-line");
        addText(svg, tick, x, baseY + 24, "invoke-axis-label", { "text-anchor": "middle" });
      });

      const frozenY = scales.y(rows[0].frozen);
      const fullY = scales.y(rows[0].full);
      const panelLabels = referenceLabels[environment];
      addLine(svg, margin.left, frozenY, width - margin.right, frozenY, "invoke-ref-line invoke-ref-frozen");
      addLine(svg, margin.left, fullY, width - margin.right, fullY, "invoke-ref-line invoke-ref-full");
      addText(svg, `${panelLabels.full} (${compact(rows[0].full)}%)`, margin.left + 4, fullY - 9, "invoke-ref-label invoke-ref-label-full", { "text-anchor": "start" });
      addText(svg, `${panelLabels.frozen} (${compact(rows[0].frozen)}%)`, width - margin.right - 4, frozenY + 16, "invoke-ref-label", { "text-anchor": "end" });

      const points = rows.map((row) => [scales.x(row.k), scales.y(row.success), row]);
      const lineD = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
      addPath(svg, lineD, "invoke-line");

      points.forEach(([x, y, row], index) => {
        const hit = addCircle(svg, x, y, 8, "plot-point-hit");
        addCircle(svg, x, y, 4.5, "invoke-point");
        const crossesFrozen = row.success >= row.frozen && rows[index - 1]?.success < row.frozen;
        const usefulEndpoint = index === points.length - 1 && Math.abs(row.success - row.full) > 3;
        if (index === 0 || usefulEndpoint || crossesFrozen) {
          addText(svg, `${compact(row.success)}%`, x, y - 12, "invoke-point-label", { "text-anchor": "middle" });
        }
        const tooltipLines = [
          `<strong>${escapeHTML(label)}: <= ${row.k} VLA_ACT calls</strong>`,
          `${compact(row.success)}% cumulative success`,
        ];
        if (Number.isFinite(number(row.episodesRaw))) {
          tooltipLines.push(`${row.episodesRaw} episodes with exactly ${row.k} calls`);
        }
        if (Number.isFinite(number(row.totalRaw))) {
          tooltipLines.push(`${row.totalRaw} total episodes`);
        }
        attachTooltip(
          hit,
          tooltipLines.join("<br>")
        );
      });

      addText(svg, "VLA_ACT invocation budget", width / 2, height - 12, "invoke-axis-title", { "text-anchor": "middle" });
      panel.appendChild(svg);
    });
  }

  function renderFinisherChart() {
    const target = document.getElementById("finisher-chart");
    if (!target) return;
    target.innerHTML = "";

    const rows = state.datasets.finisher.map((row) => ({
      label: row.environment === "RoboTwin" ? "RoboTwin C2R" : `${row.environment} · ${row.category}`,
      analyticCount: number(row.analytic_finish_count),
      vlaCount: number(row.vla_finish_count),
      solved: number(row.n_solved),
      analyticLabel: number(row.analytic_pct),
      vlaLabel: number(row.vla_pct),
    }));

    const width = 980;
    const height = 470;
    const margin = { top: 58, right: 34, bottom: 58, left: 255 };
    const svg = createSVG(width, height);
    const barH = 24;
    const gap = 18;
    const scaleX = (value) => margin.left + (value / 100) * (width - margin.left - margin.right);
    const percentFromCount = (count, solved) => (count / solved) * 100;
    const labelPercent = (value) => `${Math.round(value)}%`;

    [0, 25, 50, 75, 100].forEach((tick) => {
      const x = scaleX(tick);
      addLine(svg, x, margin.top - 16, x, height - margin.bottom, "finisher-grid-line");
      addText(svg, `${tick}%`, x, height - 21, "finisher-axis-label", { "text-anchor": "middle" });
    });
    addLine(svg, margin.left, height - margin.bottom, width - margin.right, height - margin.bottom, "finisher-axis-line");

    rows.forEach((row, index) => {
      const y = margin.top + index * (barH + gap);
      const analyticPct = percentFromCount(row.analyticCount, row.solved);
      const vlaPct = 100 - analyticPct;
      const analyticW = scaleX(analyticPct) - margin.left;
      const vlaW = scaleX(100) - scaleX(analyticPct);
      const vlaX = margin.left + analyticW;

      addText(svg, row.label, margin.left - 18, y + 16, "finisher-row-label", { "text-anchor": "end" });
      const a = addRect(svg, margin.left, y, analyticW, barH, "finisher-segment finisher-analytic", { rx: 8 });
      const v = addRect(svg, vlaX, y, vlaW, barH, "finisher-segment finisher-vla", { rx: 8 });

      const analyticText = labelPercent(row.analyticLabel);
      const vlaText = labelPercent(row.vlaLabel);
      addText(svg, analyticText, margin.left + analyticW / 2, y + 16, "finisher-segment-label", { "text-anchor": "middle" });
      addText(svg, vlaText, vlaW > 46 ? vlaX + vlaW / 2 : vlaX + vlaW + 8, y + 16, vlaW > 46 ? "finisher-segment-label" : "finisher-segment-label finisher-label-outside", { "text-anchor": vlaW > 46 ? "middle" : "start" });
      attachTooltip(a, `<strong>${escapeHTML(row.label)}</strong><br>Analytic primitive finish: ${row.analyticCount}/${row.solved} (${compact(row.analyticLabel)}%)`);
      attachTooltip(v, `<strong>${escapeHTML(row.label)}</strong><br>VLA_ACT primitive finish: ${row.vlaCount}/${row.solved} (${compact(row.vlaLabel)}%)`);
    });

    addRect(svg, margin.left, 18, 14, 14, "finisher-analytic", { rx: 3 });
    addText(svg, "Analytic primitive finish", margin.left + 21, 30, "finisher-legend-label");
    addRect(svg, margin.left + 232, 18, 14, 14, "finisher-vla", { rx: 3 });
    addText(svg, "VLA_ACT primitive finish", margin.left + 253, 30, "finisher-legend-label");
    addText(svg, "Proportion of solved tasks", margin.left + (width - margin.left - margin.right) / 2, height - 10, "finisher-axis-title", { "text-anchor": "middle" });

    target.appendChild(svg);
  }

  function methodLabel(value) {
    return value === "pi_0.5" ? "π0.5" : value;
  }

  function benchmarkLabel(value) {
    return {
      "LIBERO-PRO": "LIBERO-Pro",
      RoboCasa: "RoboCasa365",
      RoboTwin: "RoboTwin C2R",
    }[value] || value;
  }

  function methodPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function addMethodTickLabel(svg, row, x, y, className) {
    if (row.role !== "ours") {
      addText(svg, row.method, x, y, className, {
        "text-anchor": "end",
        transform: `rotate(-35 ${x} ${y})`,
      });
      return;
    }

    const label = addText(svg, "", x, y - 3, className, { "text-anchor": "middle" });
    const methodLine = document.createElementNS(NS, "tspan");
    methodLine.setAttribute("x", x);
    methodLine.setAttribute("dy", "0");
    methodLine.textContent = row.method;

    const oursLine = document.createElementNS(NS, "tspan");
    oursLine.setAttribute("x", x);
    oursLine.setAttribute("dy", "1.15em");
    oursLine.textContent = "(ours)";

    label.append(methodLine, oursLine);
  }

  function renderMethodChart() {
    const allRows = state.datasets.method;
    const target = document.getElementById("method-comparison-chart");
    if (!target || allRows.length === 0) return;
    target.innerHTML = "";

    const benchmarkOrder = ["LIBERO-PRO", "RoboCasa", "RoboTwin"];
    const groups = benchmarkOrder.map((benchmark) => ({
      benchmark,
      label: benchmarkLabel(benchmark),
      rows: allRows
        .filter((row) => row.benchmark === benchmark)
        .map((row) => ({
          method: methodLabel(row.method),
          value: number(row.success_rate_pct),
          role: row.role,
        })),
    })).filter((group) => group.rows.length > 0);

    const width = 1120;
    const height = 510;
    const margin = { top: 42, right: 38, bottom: 120, left: 82 };
    const svg = createSVG(width, height);
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const y = (value) => margin.top + (100 - value) / 100 * innerH;
    const baseY = y(0);
    const groupW = innerW / groups.length;
    const barW = 42;
    const barGap = 16;

    [0, 25, 50, 75, 100].forEach((tick) => {
      const tickY = y(tick);
      addLine(svg, margin.left, tickY, width - margin.right, tickY, "method-grid-line");
      addText(svg, `${tick}`, margin.left - 14, tickY + 4, "method-axis-label", { "text-anchor": "end" });
    });

    addLine(svg, margin.left, baseY, width - margin.right, baseY, "method-axis-line");
    addLine(svg, margin.left, margin.top, margin.left, baseY, "method-axis-line");
    addText(svg, "Success Rate (%)", 24, margin.top + innerH / 2, "method-axis-title", {
      transform: `rotate(-90 24 ${margin.top + innerH / 2})`,
      "text-anchor": "middle",
    });

    const legendX = width - margin.right - 330;
    const legendY = 16;
    addRect(svg, legendX, legendY, 12, 12, "method-legend-base", { rx: 3 });
    addText(svg, "Published baselines", legendX + 18, legendY + 10, "method-legend-label");
    addRect(svg, legendX + 170, legendY, 12, 12, "method-legend-ours", { rx: 3 });
    addText(svg, "Harness VLA (ours)", legendX + 188, legendY + 10, "method-legend-label");

    groups.forEach((group, groupIndex) => {
      const center = margin.left + groupW * groupIndex + groupW / 2;
      const rowsW = group.rows.length * barW + (group.rows.length - 1) * barGap;
      const startX = center - rowsW / 2;

      group.rows.forEach((row, rowIndex) => {
        const x = startX + rowIndex * (barW + barGap);
        const top = y(row.value);
        const barClass = row.role === "ours" ? "method-bar method-bar-ours" : `method-bar method-bar-base method-bar-base-${rowIndex % 3}`;
        const valueClass = row.role === "ours" ? "method-value-label method-value-ours" : "method-value-label";
        const methodClass = row.role === "ours" ? "method-label method-label-ours" : "method-label";
        const bar = addRect(svg, x, top, barW, baseY - top, barClass, { rx: 8 });
        addText(svg, methodPercent(row.value), x + barW / 2, top - 10, valueClass, { "text-anchor": "middle" });
        addMethodTickLabel(svg, row, x + barW / 2, baseY + 35, methodClass);
        attachTooltip(bar, `<strong>${escapeHTML(row.method)}</strong><br>${escapeHTML(group.label)} success: ${methodPercent(row.value)}`);
      });

      addText(svg, group.label, center, height - 24, "method-group-label", { "text-anchor": "middle" });
    });

    target.appendChild(svg);
  }

  async function boot() {
    const chartRoot = document.getElementById("vla-invoke-chart");
    if (!chartRoot) return;

    try {
      const [finisher, method, vlaInvoke] = await Promise.all([
        loadCSV("finisher_attribution.csv"),
        loadCSV("method_comparison.csv"),
        loadCSV("vla_invoke_success.csv?v=vla-invoke-paper-v1"),
      ]);
      state.datasets = { finisher, method, vlaInvoke };
      renderInvokeChart();
      renderFinisherChart();
      renderMethodChart();
    } catch (error) {
      document.querySelectorAll(".plot-stage").forEach((stage) => {
        stage.innerHTML = `<p class="plot-error">Plot source data could not be loaded.</p>`;
      });
      console.error(error);
    }
  }

  boot();
})();
