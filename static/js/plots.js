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
    invokeEnv: "LIBERO",
    methodBenchmark: "LIBERO-PRO",
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
    const envs = uniq(allRows.map((row) => row.environment));
    renderTabs("vla-invoke", envs, state.invokeEnv, (value) => {
      state.invokeEnv = value;
      renderInvokeChart();
    });

    const rows = allRows
      .filter((row) => row.environment === state.invokeEnv)
      .map((row) => ({
        k: number(row.k_max_vla_invokes),
        success: number(row.cumulative_success_pct),
        episodes: number(row.episodes_with_exactly_k),
        fullshot: number(row.vla_fullshot_ref_pct),
        hybrid: number(row.hybrid_overall_ref_pct),
        total: number(row.n_episodes),
      }));

    const target = document.getElementById("vla-invoke-chart");
    if (!target || rows.length === 0) return;
    target.innerHTML = "";

    const width = 820;
    const height = 380;
    const margin = { top: 28, right: 30, bottom: 58, left: 58 };
    const maxK = Math.max(...rows.map((row) => row.k));
    const scales = axisScales({
      width,
      height,
      margin,
      xDomain: [0, maxK],
      yDomain: [0, 100],
    });
    const svg = createSVG(width, height);

    drawGrid(svg, width, margin, scales.y, [0, 25, 50, 75, 100]);
    addLine(svg, margin.left, height - margin.bottom, width - margin.right, height - margin.bottom, "plot-axis-line");
    addLine(svg, margin.left, margin.top, margin.left, height - margin.bottom, "plot-axis-line");

    rows.forEach((row) => {
      const x = scales.x(row.k);
      addLine(svg, x, height - margin.bottom, x, height - margin.bottom + 5, "plot-axis-line");
      addText(svg, row.k, x, height - margin.bottom + 25, "plot-axis-label", { "text-anchor": "middle" });
    });

    const fullY = scales.y(rows[0].fullshot);
    const hybridY = scales.y(rows[0].hybrid);
    addLine(svg, margin.left, fullY, width - margin.right, fullY, "plot-ref-line plot-ref-blue");
    addLine(svg, margin.left, hybridY, width - margin.right, hybridY, "plot-ref-line plot-ref-gray");
    addText(svg, `full-shot ${compact(rows[0].fullshot)}%`, width - margin.right - 4, fullY - 8, "plot-ref-label", { "text-anchor": "end" });
    addText(svg, `all calls ${compact(rows[0].hybrid)}%`, margin.left + 4, hybridY - 8, "plot-ref-label", { "text-anchor": "start" });

    const points = rows.map((row) => [scales.x(row.k), scales.y(row.success), row]);
    const lineD = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
    const areaD = `${lineD} L ${points.at(-1)[0]} ${height - margin.bottom} L ${points[0][0]} ${height - margin.bottom} Z`;
    addPath(svg, areaD, "plot-area-fill");
    addPath(svg, lineD, "plot-line");

    points.forEach(([x, y, row]) => {
      const hit = addCircle(svg, x, y, 8, "plot-point-hit");
      addCircle(svg, x, y, 5, "plot-point");
      addText(svg, compact(row.success), x, y - 13, "plot-point-label", { "text-anchor": "middle" });
      attachTooltip(
        hit,
        `<strong>${escapeHTML(state.invokeEnv)}: <= ${row.k} calls</strong><br>${compact(row.success)}% cumulative success<br>${row.episodes} episodes with exactly ${row.k} calls<br>${row.total} total episodes`
      );
    });

    addText(svg, "VLA primitive invocations (<= k)", width / 2, height - 12, "plot-axis-title", { "text-anchor": "middle" });
    addText(svg, "success %", 16, margin.top + 10, "plot-axis-title", { transform: `rotate(-90 16 ${margin.top + 10})`, "text-anchor": "end" });

    target.appendChild(svg);

    const last = rows.at(-1);
    const insight = document.getElementById("vla-invoke-insight");
    if (insight) {
      insight.textContent = `${state.invokeEnv} reaches ${compact(last.success)}% success by ${last.k} VLA calls, with the full-shot reference at ${compact(last.fullshot)}% and the all-invocation hybrid reference at ${compact(last.hybrid)}%.`;
    }
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
    return value.replace("pi_0.5", "pi0.5");
  }

  function renderMethodChart() {
    const allRows = state.datasets.method;
    const benchmarks = uniq(allRows.map((row) => row.benchmark));
    renderTabs("method", benchmarks, state.methodBenchmark, (value) => {
      state.methodBenchmark = value;
      renderMethodChart();
    });

    const rows = allRows
      .filter((row) => row.benchmark === state.methodBenchmark)
      .map((row) => ({
        method: methodLabel(row.method),
        value: number(row.success_rate_pct),
        role: row.role,
      }));
    const target = document.getElementById("method-comparison-chart");
    if (!target || rows.length === 0) return;
    target.innerHTML = "";

    const width = 820;
    const height = 360;
    const margin = { top: 34, right: 30, bottom: 76, left: 58 };
    const svg = createSVG(width, height);
    const y = (value) => margin.top + (100 - value) / 100 * (height - margin.top - margin.bottom);
    const baseY = y(0);
    const slotW = (width - margin.left - margin.right) / rows.length;
    const barW = Math.min(92, slotW * 0.58);

    drawGrid(svg, width, margin, y, [0, 25, 50, 75, 100]);
    addLine(svg, margin.left, baseY, width - margin.right, baseY, "plot-axis-line");

    rows.forEach((row, index) => {
      const x = margin.left + slotW * index + (slotW - barW) / 2;
      const top = y(row.value);
      const className = row.role === "ours" ? "plot-bar plot-bar-ours" : "plot-bar plot-bar-base";
      const bar = addRect(svg, x, top, barW, baseY - top, className, { rx: 8 });
      addText(svg, `${compact(row.value)}%`, x + barW / 2, top - 9, row.role === "ours" ? "plot-value-label plot-value-ours" : "plot-value-label", { "text-anchor": "middle" });
      addText(svg, row.method, x + barW / 2, baseY + 29, row.role === "ours" ? "plot-axis-label plot-axis-ours" : "plot-axis-label", { "text-anchor": "middle" });
      attachTooltip(bar, `<strong>${escapeHTML(row.method)}</strong><br>${escapeHTML(state.methodBenchmark)} success: ${compact(row.value)}%`);
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
