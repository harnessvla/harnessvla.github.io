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
  // RoboCasa365 gallery examples: generated from clean_task_all.
  {
    benchmark: "RoboCasa365",
    taskTitle: "From the different types of pastries on the counter, select a croissant and place it on the cutting board. Then retrieve a jar of jam from the cabinet and place it alongside the croissant on the cutting board.",
    detail: "RoboCasa365 · BreadSelection",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/16_bread_selection_s2/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/16_bread_selection_s2/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Pick the kettle from the counter and place it on the tray. Then pick the mug from the cabinet and place it on the tray. Then close the cabinet doors.",
    detail: "RoboCasa365 · ArrangeTea",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/18_arrange_tea_s3/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/18_arrange_tea_s3/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Put the shaker and condiment bottle from the counter next to their counterparts in the cabinet.",
    detail: "RoboCasa365 · CategorizeCondiments",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/22_categorize_condiments_s2/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/22_categorize_condiments_s2/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Grab a lemon wedge from the fridge and one ice cube from the ice bowl, and put them in the glass of lemonade.",
    detail: "RoboCasa365 · MakeIceLemonade",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/13_make_ice_lemonade_s0/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/13_make_ice_lemonade_s0/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Place one bun and one sausage from the bowl on each plate.",
    detail: "RoboCasa365 · PortionHotDogs",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/12_portion_hot_dogs_s2/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/12_portion_hot_dogs_s2/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Move the plastic bottles in the middle to the plastics group, and the glass bottles in the middle to the glass group.",
    detail: "RoboCasa365 · RecycleBottlesByType",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/10_recycle_bottles_by_type_s1/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/10_recycle_bottles_by_type_s1/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Pick up the sponge from the counter and clean the cutting board by briefly scrubbing or pressing down on the cutting board. Once finished, release the sponge.",
    detail: "RoboCasa365 · ScrubCuttingBoard",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/20_scrub_cutting_board_s1/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/20_scrub_cutting_board_s1/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Pick up the knife from the drawer and place it on the cutting board. Then place the meat from the plate to the cutting board.",
    detail: "RoboCasa365 · SetUpCuttingStation",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/08_set_up_cutting_station_s0/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/08_set_up_cutting_station_s0/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Open the microwave, place the bowl with waffle inside the microwave, then close the microwave door and turn it on.",
    detail: "RoboCasa365 · WaffleReheat",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/06_waffle_reheat_s1/frozen_vla.mp4",
    harnessVideo: "./videos/robocasa365/06_waffle_reheat_s1/harness_vla.mp4",
    frameRatio: "1 / 1"
  },
  // End RoboCasa365 gallery examples.
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Blocks ranking",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Click bell",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/click_bell/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/click_bell/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Handover block",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/handover_block/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/handover_block/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Move playing card away",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/move_playingcard_away/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/move_playingcard_away/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place can in basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_can_basket/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_can_basket/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place mouse on pad",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_mouse_pad/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/place_mouse_pad/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Press stapler",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/press_stapler/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/press_stapler/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Stack two blocks",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/stack_blocks_two/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/stack_blocks_two/harness_vla.mp4",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Turn switch",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/turn_switch/frozen_vla.mp4",
    harnessVideo: "./videos/robotwin_c2r/turn_switch/harness_vla.mp4",
    frameRatio: "4 / 3"
  }
];

const galleryGrid = document.getElementById("task-gallery-grid");
const galleryTabs = Array.from(document.querySelectorAll("[data-gallery-filter]"));
const TASK_GALLERY_VIDEO_VERSION = "robotwin-c2r-update-20260712";

function versionedVideoSrc(src) {
  if (!src) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${TASK_GALLERY_VIDEO_VERSION}`;
}

function loadGalleryVideo(video) {
  if (video.dataset.loaded === "true") return;

  const sourcePath = video.dataset.src;
  if (!sourcePath) return;

  video.src = sourcePath;
  video.load();
  video.dataset.loaded = "true";
}

function unloadGalleryVideo(video) {
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.dataset.loaded = "false";
}

const lazyVideoObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            loadGalleryVideo(entry.target);
            lazyVideoObserver.unobserve(entry.target);
          });
        },
        {
          rootMargin: "300px 0px",
          threshold: 0.01,
        }
      )
    : null;

const playbackVideoObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              entry.target.pause();
            }
          });
        },
        {
          threshold: 0.01,
        }
      )
    : null;

function pauseOtherGalleryVideos(currentVideo) {
  const currentCard = currentVideo.closest(".video-task-card");
  document.querySelectorAll(".gallery-video").forEach((video) => {
    if (video === currentVideo) return;
    if (video.closest(".video-task-card") === currentCard) return;
    video.pause();
  });
}

function observeGalleryVideos(root) {
  root.querySelectorAll(".gallery-video[data-src]").forEach((video) => {
    if (lazyVideoObserver) {
      lazyVideoObserver.observe(video);
    } else {
      loadGalleryVideo(video);
    }

    playbackVideoObserver?.observe(video);
  });
}

function cleanupGalleryVideos(root) {
  root.querySelectorAll(".gallery-video").forEach((video) => {
    lazyVideoObserver?.unobserve(video);
    playbackVideoObserver?.unobserve(video);
    unloadGalleryVideo(video);
  });
}

function createVideoPane(label, sourcePath, tone) {
  const pane = document.createElement("div");
  pane.className = `video-pane video-pane-${tone}`;

  const labelEl = document.createElement("span");
  labelEl.className = "video-label";
  labelEl.textContent = label;
  pane.append(labelEl);

  function appendFallback() {
    if (pane.querySelector(".video-fallback")) return;
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
  video.preload = "none";
  video.setAttribute("aria-label", `${label} rollout video`);
  video.dataset.src = versionedVideoSrc(sourcePath);
  video.dataset.loaded = "false";

  video.addEventListener("error", () => {
    lazyVideoObserver?.unobserve(video);
    playbackVideoObserver?.unobserve(video);
    frame.remove();
    appendFallback();
  });

  video.addEventListener("play", () => {
    pauseOtherGalleryVideos(video);
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
  detail.textContent = item.detail || item.benchmark;

  meta.append(title, detail);
  card.append(comparison, meta);

  return card;
}

function renderGallery(filter) {
  if (!galleryGrid) return;

  const items =
    filter === "ALL" ? galleryItems : galleryItems.filter((item) => item.benchmark === filter);

  cleanupGalleryVideos(galleryGrid);
  galleryGrid.innerHTML = "";

  if (items.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "gallery-empty";
    emptyState.textContent = "Examples coming soon.";
    galleryGrid.append(emptyState);
    return;
  }

  items.forEach((item) => galleryGrid.append(createGalleryCard(item)));
  observeGalleryVideos(galleryGrid);
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
