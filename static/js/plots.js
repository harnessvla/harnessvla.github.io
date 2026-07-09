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
      ["LIBERO", "LIBERO-Pro"],
      ["RoboCasa", "RoboCasa365"],
      ["RoboTwin", "RoboTwin C2R"],
    ];

    panels.forEach(([environment, label], panelIndex) => {
      const rows = allRows
        .filter((row) => row.environment === environment)
        .map((row) => ({
          k: number(row.k_max_vla_invokes),
          success: number(row.cumulative_success_pct),
          episodes: number(row.episodes_with_exactly_k),
          frozen: number(row.vla_fullshot_ref_pct),
          full: number(row.hybrid_overall_ref_pct),
          total: number(row.n_episodes),
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
      addLine(svg, margin.left, frozenY, width - margin.right, frozenY, "invoke-ref-line invoke-ref-frozen");
      addLine(svg, margin.left, fullY, width - margin.right, fullY, "invoke-ref-line invoke-ref-full");
      addText(svg, `Frozen VLA ${compact(rows[0].frozen)}%`, width - margin.right - 3, frozenY - 6, "invoke-ref-label", { "text-anchor": "end" });
      addText(svg, `Full Harness ${compact(rows[0].full)}%`, margin.left + 3, fullY - 6, "invoke-ref-label invoke-ref-label-full", { "text-anchor": "start" });

      const points = rows.map((row) => [scales.x(row.k), scales.y(row.success), row]);
      const lineD = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
      addPath(svg, lineD, "invoke-line");

      points.forEach(([x, y, row], index) => {
        const hit = addCircle(svg, x, y, 8, "plot-point-hit");
        addCircle(svg, x, y, 4.5, "invoke-point");
        if (index === 0 || index === points.length - 1 || row.success >= row.frozen && rows[index - 1]?.success < row.frozen) {
          addText(svg, `${compact(row.success)}%`, x, y - 12, "invoke-point-label", { "text-anchor": "middle" });
        }
        attachTooltip(
          hit,
          `<strong>${escapeHTML(label)}: <= ${row.k} VLA_ACT calls</strong><br>${compact(row.success)}% cumulative success<br>${row.episodes} episodes with exactly ${row.k} calls<br>${row.total} total episodes`
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
      label: row.environment === "RoboTwin" ? "RoboTwin" : `${row.environment} · ${row.category}`,
      analytic: number(row.analytic_pct),
      vla: number(row.vla_pct),
      analyticCount: number(row.analytic_finish_count),
      vlaCount: number(row.vla_finish_count),
      solved: number(row.n_solved),
    }));

    const width = 820;
    const height = 430;
    const margin = { top: 44, right: 36, bottom: 48, left: 190 };
    const svg = createSVG(width, height);
    const barH = 22;
    const gap = 17;
    const scaleX = (value) => margin.left + (value / 100) * (width - margin.left - margin.right);

    [0, 25, 50, 75, 100].forEach((tick) => {
      const x = scaleX(tick);
      addLine(svg, x, margin.top - 16, x, height - margin.bottom, "plot-grid-line");
      addText(svg, `${tick}%`, x, height - 18, "plot-axis-label", { "text-anchor": "middle" });
    });

    rows.forEach((row, index) => {
      const y = margin.top + index * (barH + gap);
      addText(svg, row.label, margin.left - 14, y + 16, "plot-row-label", { "text-anchor": "end" });
      const analyticW = scaleX(row.analytic) - margin.left;
      const vlaW = scaleX(row.analytic + row.vla) - scaleX(row.analytic);
      const a = addRect(svg, margin.left, y, analyticW, barH, "plot-bar plot-bar-analytic", { rx: 6 });
      const v = addRect(svg, margin.left + analyticW, y, vlaW, barH, "plot-bar plot-bar-vla", { rx: 6 });
      addText(svg, `${Math.round(row.analytic)}%`, margin.left + analyticW / 2, y + 15, "plot-bar-label", { "text-anchor": "middle" });
      addText(svg, `${Math.round(row.vla)}%`, margin.left + analyticW + vlaW / 2, y + 15, "plot-bar-label", { "text-anchor": "middle" });
      attachTooltip(a, `<strong>${escapeHTML(row.label)}</strong><br>Analytic finish: ${row.analyticCount}/${row.solved} (${compact(row.analytic)}%)`);
      attachTooltip(v, `<strong>${escapeHTML(row.label)}</strong><br>VLA finish: ${row.vlaCount}/${row.solved} (${compact(row.vla)}%)`);
    });

    addRect(svg, margin.left, 14, 14, 14, "plot-bar-analytic", { rx: 3 });
    addText(svg, "Analytic primitive finish", margin.left + 20, 26, "plot-legend-label");
    addRect(svg, margin.left + 210, 14, 14, 14, "plot-bar-vla", { rx: 3 });
    addText(svg, "VLA primitive finish", margin.left + 230, 26, "plot-legend-label");

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
        addText(svg, row.method, x + barW / 2, baseY + 35, methodClass, {
          "text-anchor": "end",
          transform: `rotate(-35 ${x + barW / 2} ${baseY + 35})`,
        });
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
        loadCSV("vla_invoke_success.csv"),
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
