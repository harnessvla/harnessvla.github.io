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
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the milk and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t4_s3/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/object_task_t4_s3/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the red mug on the plate and put the chocolate pudding to the right of the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t6_s0/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_task_t6_s0/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the alphabet soup and the cream cheese box in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t7_s9/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_swap_t7_s9/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the tomato sauce and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t2_s4/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/object_task_t2_s4/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the wine bottle in the bowl",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t2_s3/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/goal_task_t2_s3/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the yellow and white mug on the left plate and put the white mug on the right plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t4_s0/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_task_t4_s0/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the cream cheese box and the butter in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t1_s8/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_swap_t1_s8/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the bbq sauce and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t5_s8/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/object_task_t5_s8/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Turn on the stove and put the moka pot on it",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t2_s8/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_swap_t2_s8/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Open the top layer of the drawer and put the cream cheese inside",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t3_s9/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/goal_task_t3_s9/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the white mug on the plate and put the chocolate pudding to the right of the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t6_s8/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_swap_t6_s8/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the bottle in the bottom drawer of the cabinet and close it",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t3_s1/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_task_t3_s1/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the cream cheese and the tomato sauce in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t0_s6/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_task_t0_s6/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the akita black bowl next to the ramekin and place it on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/spatial_task_t8_s1/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/spatial_task_t8_s1/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the akita black bowl next to the plate and place it on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/spatial_task_t2_s7/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/spatial_task_t2_s7/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the wine bottle on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t8_s6/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/goal_task_t8_s6/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the bowl on the top of the drawer",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_swap_t4_s7/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/goal_swap_t4_s7/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the white mug on the left plate and put the yellow and white mug on the right plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t4_s7/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/10_swap_t4_s7/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the chocolate pudding and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_swap_t8_s7/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/object_swap_t8_s7/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the salad dressing and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t8_s8/frozen_vla.mp4",
    harnessVideo: "./videos/libero_pro/object_task_t8_s8/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Begin by placing red block on the left, then add green block to the right, and finish with blue block.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Press down the bell with metallic top and plastic base's top center gently.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/click_bell/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/click_bell/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Set the paper stapler with silver tray on the yellow mat with the right arm.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/move_stapler_pad/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/move_stapler_pad/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Grab the white patterned brown metal can, place it in the basket with perforated sides, and raise the basket using the other arm.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_can_basket/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_can_basket/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Lift the plastic mouse with the right arm and stick it onto the blue mat.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_mouse_pad/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_mouse_pad/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Take the phone with polished silver border to the light brown phone stand.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_phone_stand/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_phone_stand/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Use one arm to press the plastic and metal stapler.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/press_stapler/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/press_stapler/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Relocate red block and green block to the center, then layer green block over red block.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/stack_blocks_two/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/stack_blocks_two/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Locate and press the plastic switch with metal prongs.",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/turn_switch/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/turn_switch/harness_vla.mp4",
    frameRatio: "4 / 3"
  }
];

const galleryGrid = document.getElementById("task-gallery-grid");
const galleryTabs = Array.from(document.querySelectorAll("[data-gallery-filter]"));
const TASK_GALLERY_VIDEO_VERSION = "primitive-overlay-20260711";

function versionedVideoSrc(src) {
  if (!src) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${TASK_GALLERY_VIDEO_VERSION}`;
}

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

  const frame = document.createElement("div");
  frame.className = "gallery-video-frame";

  const video = document.createElement("video");
  video.className = "gallery-video";
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", `${label} rollout video`);

  video.src = versionedVideoSrc(sourcePath);

  video.addEventListener("error", () => {
    frame.remove();
    appendFallback();
  });

  frame.append(video);
  pane.append(frame);
  return pane;
}

function createGalleryCard(item) {
  const card = document.createElement("article");
  card.className = "video-task-card";
  card.dataset.benchmark = item.benchmark;
  card.style.setProperty("--video-frame-ratio", item.frameRatio || "4 / 3");

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
