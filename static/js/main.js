const copyButtons = document.querySelectorAll("[data-copy-target]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1400);
    } catch {
      button.textContent = "Select";
    }
  });
});

const navbar = document.getElementById("navbar");
const progress = document.getElementById("scroll-progress");

function updateChrome() {
  const y = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  navbar?.classList.toggle("scrolled", y > 24);
  if (progress) {
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
}

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
updateChrome();

const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0.1, 0.35, 0.65],
  }
);

sections.forEach((section) => observer.observe(section));

const galleryItems = [
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Blocks ranking",
    tag: "clean-to-randomized transfer",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/blocks_ranking_rgb/recipe_blocks_ranking_rgb_seed100004.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Click bell",
    tag: "contact-rich interaction",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/click_bell/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/click_bell/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/click_bell/recipe_click_bell_seed100001.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Move stapler pad",
    tag: "clean-to-randomized transfer",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/move_stapler_pad/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/move_stapler_pad/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/move_stapler_pad/recipe_move_stapler_pad_seed100003.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place can in basket",
    tag: "bimanual placement",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_can_basket/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_can_basket/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/place_can_basket/recipe_place_can_basket_seed100002.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place mouse on pad",
    tag: "object placement",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_mouse_pad/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_mouse_pad/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/place_mouse_pad/recipe_place_mouse_pad_seed100002.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place phone on stand",
    tag: "object placement",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_phone_stand/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_phone_stand/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/place_phone_stand/recipe_place_phone_stand_seed100000.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Press stapler",
    tag: "contact-rich manipulation",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/press_stapler/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/press_stapler/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/press_stapler/recipe_press_stapler_seed100003.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Stack two blocks",
    tag: "bimanual object interaction",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/stack_blocks_two/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/stack_blocks_two/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/stack_blocks_two/recipe_stack_blocks_two_seed100001.jsonl"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Turn switch",
    tag: "fixture actuation",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/turn_switch/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/turn_switch/harness_vla.mp4",
    recipePath: "./videos/robotwin_c2r/turn_switch/recipe_turn_switch_seed100005.jsonl"
  }
];

const galleryGrid = document.getElementById("task-gallery-grid");
const galleryTabs = Array.from(document.querySelectorAll("[data-gallery-filter]"));

function createVideoPane(label, sourcePath, tone) {
  const pane = document.createElement("div");
  pane.className = `video-pane video-pane-${tone}`;

  const labelEl = document.createElement("span");
  labelEl.className = "video-label";
  labelEl.textContent = label;
  pane.append(labelEl);

  function appendFallback() {
    const fallback = document.createElement("div");
    fallback.className = "video-fallback";
    fallback.textContent = "Video unavailable";
    pane.append(fallback);
  }

  if (!sourcePath) {
    appendFallback();
    return pane;
  }

  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", `${label} rollout video`);

  const source = document.createElement("source");
  source.src = sourcePath;
  source.type = "video/mp4";
  video.append(source);

  video.addEventListener("error", () => {
    video.remove();
    appendFallback();
  });

  pane.append(video);
  return pane;
}

function pauseCardVideos(card) {
  card.querySelectorAll("video").forEach((video) => video.pause());
}

function playCardVideos(card) {
  card.querySelectorAll("video").forEach((video) => {
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  });
}

function createGalleryCard(item) {
  const card = document.createElement("article");
  card.className = "video-task-card";
  card.dataset.benchmark = item.benchmark;
  card.dataset.recipePath = item.recipePath;

  const comparison = document.createElement("div");
  comparison.className = "comparison-pair";
  comparison.append(
    createVideoPane(item.baselineLabel, item.baselineVideo, "baseline"),
    createVideoPane(item.harnessLabel, item.harnessVideo, "harness")
  );

  const meta = document.createElement("div");
  meta.className = "gallery-card-meta";

  const title = document.createElement("h3");
  title.textContent = item.taskTitle;

  const detail = document.createElement("p");
  detail.textContent = item.benchmark;

  meta.append(title, detail);
  card.append(comparison, meta);

  card.addEventListener("mouseenter", () => playCardVideos(card));
  card.addEventListener("mouseleave", () => pauseCardVideos(card));

  return card;
}

function renderGallery(filter) {
  if (!galleryGrid) return;

  const items =
    filter === "ALL" ? galleryItems : galleryItems.filter((item) => item.benchmark === filter);

  galleryGrid.innerHTML = "";

  if (items.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "gallery-empty";
    emptyState.textContent = "Examples coming soon.";
    galleryGrid.append(emptyState);
    return;
  }

  items.forEach((item) => galleryGrid.append(createGalleryCard(item)));
}

galleryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.galleryFilter;

    galleryTabs.forEach((button) => {
      const isActive = button === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderGallery(filter);
  });
});

renderGallery("ALL");
