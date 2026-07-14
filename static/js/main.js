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
    baselinePoster: "./videos/posters/libero_pro/object_task_t4_s3/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/object_task_t4_s3/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/object_task_t4_s3/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the red mug on the plate and put the chocolate pudding to the right of the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t6_s0/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_task_t6_s0/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_task_t6_s0/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_task_t6_s0/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the alphabet soup and the cream cheese box in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t7_s9/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_swap_t7_s9/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_swap_t7_s9/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_swap_t7_s9/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the tomato sauce and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t2_s4/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/object_task_t2_s4/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/object_task_t2_s4/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/object_task_t2_s4/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the wine bottle in the bowl",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t2_s3/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/goal_task_t2_s3/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/goal_task_t2_s3/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/goal_task_t2_s3/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the yellow and white mug on the left plate and put the white mug on the right plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t4_s0/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_task_t4_s0/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_task_t4_s0/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_task_t4_s0/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the cream cheese box and the butter in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t1_s8/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_swap_t1_s8/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_swap_t1_s8/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_swap_t1_s8/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the bbq sauce and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t5_s8/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/object_task_t5_s8/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/object_task_t5_s8/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/object_task_t5_s8/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Turn on the stove and put the moka pot on it",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t2_s8/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_swap_t2_s8/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_swap_t2_s8/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_swap_t2_s8/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Open the top layer of the drawer and put the cream cheese inside",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t3_s9/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/goal_task_t3_s9/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/goal_task_t3_s9/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/goal_task_t3_s9/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the white mug on the plate and put the chocolate pudding to the right of the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t6_s8/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_swap_t6_s8/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_swap_t6_s8/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_swap_t6_s8/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the bottle in the bottom drawer of the cabinet and close it",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t3_s1/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_task_t3_s1/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_task_t3_s1/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_task_t3_s1/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put both the cream cheese and the tomato sauce in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_task_t0_s6/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_task_t0_s6/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_task_t0_s6/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_task_t0_s6/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the akita black bowl next to the ramekin and place it on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/spatial_task_t8_s1/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/spatial_task_t8_s1/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/spatial_task_t8_s1/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/spatial_task_t8_s1/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the akita black bowl next to the plate and place it on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/spatial_task_t2_s7/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/spatial_task_t2_s7/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/spatial_task_t2_s7/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/spatial_task_t2_s7/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the wine bottle on the plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_task_t8_s6/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/goal_task_t8_s6/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/goal_task_t8_s6/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/goal_task_t8_s6/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the bowl on the top of the drawer",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/goal_swap_t4_s7/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/goal_swap_t4_s7/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/goal_swap_t4_s7/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/goal_swap_t4_s7/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Put the white mug on the left plate and put the yellow and white mug on the right plate",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/10_swap_t4_s7/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/10_swap_t4_s7/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/10_swap_t4_s7/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/10_swap_t4_s7/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the chocolate pudding and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_swap_t8_s7/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/object_swap_t8_s7/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/object_swap_t8_s7/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/object_swap_t8_s7/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "LIBERO-Pro",
    taskTitle: "Pick the salad dressing and place it in the basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/libero_pro/object_task_t8_s8/frozen_vla.mp4",
    baselinePoster: "./videos/posters/libero_pro/object_task_t8_s8/frozen_vla.jpg",
    harnessVideo: "./videos/libero_pro/object_task_t8_s8/harness_vla.mp4",
    harnessPoster: "./videos/posters/libero_pro/object_task_t8_s8/harness_vla.jpg",
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
    baselinePoster: "./videos/posters/robocasa365/16_bread_selection_s2/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/16_bread_selection_s2/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/16_bread_selection_s2/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Pick the kettle from the counter and place it on the tray. Then pick the mug from the cabinet and place it on the tray. Then close the cabinet doors.",
    detail: "RoboCasa365 · ArrangeTea",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/18_arrange_tea_s3/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/18_arrange_tea_s3/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/18_arrange_tea_s3/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/18_arrange_tea_s3/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Put the shaker and condiment bottle from the counter next to their counterparts in the cabinet.",
    detail: "RoboCasa365 · CategorizeCondiments",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/22_categorize_condiments_s2/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/22_categorize_condiments_s2/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/22_categorize_condiments_s2/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/22_categorize_condiments_s2/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Grab a lemon wedge from the fridge and one ice cube from the ice bowl, and put them in the glass of lemonade.",
    detail: "RoboCasa365 · MakeIceLemonade",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/13_make_ice_lemonade_s0/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/13_make_ice_lemonade_s0/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/13_make_ice_lemonade_s0/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/13_make_ice_lemonade_s0/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Place one bun and one sausage from the bowl on each plate.",
    detail: "RoboCasa365 · PortionHotDogs",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/12_portion_hot_dogs_s2/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/12_portion_hot_dogs_s2/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/12_portion_hot_dogs_s2/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/12_portion_hot_dogs_s2/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Move the plastic bottles in the middle to the plastics group, and the glass bottles in the middle to the glass group.",
    detail: "RoboCasa365 · RecycleBottlesByType",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/10_recycle_bottles_by_type_s1/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/10_recycle_bottles_by_type_s1/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/10_recycle_bottles_by_type_s1/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/10_recycle_bottles_by_type_s1/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",

    taskTitle: "Pick up the knife from the drawer and place it on the cutting board. Then place the meat from the plate to the cutting board.",
    detail: "RoboCasa365 · SetUpCuttingStation",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/08_set_up_cutting_station_s0/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/08_set_up_cutting_station_s0/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/08_set_up_cutting_station_s0/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/08_set_up_cutting_station_s0/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  {
    benchmark: "RoboCasa365",
    taskTitle: "Open the microwave, place the bowl with waffle inside the microwave, then close the microwave door and turn it on.",
    detail: "RoboCasa365 · WaffleReheat",
    baselineLabel: "VLA fullshot",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robocasa365/06_waffle_reheat_s1/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robocasa365/06_waffle_reheat_s1/frozen_vla.jpg",
    harnessVideo: "./videos/robocasa365/06_waffle_reheat_s1/harness_vla.mp4",
    harnessPoster: "./videos/posters/robocasa365/06_waffle_reheat_s1/harness_vla.jpg",
    frameRatio: "1 / 1"
  },
  // End RoboCasa365 gallery examples.
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Blocks ranking",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/blocks_ranking_rgb/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/blocks_ranking_rgb/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/blocks_ranking_rgb/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Click bell",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/click_bell/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/click_bell/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/click_bell/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/click_bell/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Handover block",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/handover_block/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/handover_block/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/handover_block/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/handover_block/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Move playing card away",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/move_playingcard_away/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/move_playingcard_away/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/move_playingcard_away/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/move_playingcard_away/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place can in basket",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_can_basket/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/place_can_basket/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/place_can_basket/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/place_can_basket/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Place mouse on pad",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/place_mouse_pad/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/place_mouse_pad/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/place_mouse_pad/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/place_mouse_pad/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Press stapler",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/press_stapler/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/press_stapler/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/press_stapler/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/press_stapler/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Stack two blocks",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/stack_blocks_two/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/stack_blocks_two/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/stack_blocks_two/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/stack_blocks_two/harness_vla.jpg",
    frameRatio: "4 / 3"
  },
  {
    benchmark: "RoboTwin C2R",
    taskTitle: "Turn switch",
    baselineLabel: "Frozen VLA",
    harnessLabel: "Harness VLA",
    baselineVideo: "./videos/robotwin_c2r/turn_switch/frozen_vla.mp4",
    baselinePoster: "./videos/posters/robotwin_c2r/turn_switch/frozen_vla.jpg",
    harnessVideo: "./videos/robotwin_c2r/turn_switch/harness_vla.mp4",
    harnessPoster: "./videos/posters/robotwin_c2r/turn_switch/harness_vla.jpg",
    frameRatio: "4 / 3"
  }
];

const galleryGrid = document.getElementById("task-gallery-grid");
const galleryViewport = document.getElementById("task-gallery-viewport");
const galleryTabs = Array.from(document.querySelectorAll("[data-gallery-filter]"));
const galleryPrevButton = document.querySelector("[data-gallery-prev]");
const galleryNextButton = document.querySelector("[data-gallery-next]");
const galleryCount = document.getElementById("task-gallery-count");
const TASK_GALLERY_VIDEO_VERSION = "poster-click-faststart-20260712-fps30-noscrub";
const TASK_GALLERY_POSTER_VERSION = "posters-20260712";

function versionedAssetSrc(src, version) {
  if (!src) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${version}`;
}

function versionedVideoSrc(src) {
  return versionedAssetSrc(src, TASK_GALLERY_VIDEO_VERSION);
}

function versionedPosterSrc(src) {
  return versionedAssetSrc(src, TASK_GALLERY_POSTER_VERSION);
}

function pauseOtherGalleryVideos(currentVideo) {
  const currentCard = currentVideo.closest(".video-task-card");
  document.querySelectorAll(".gallery-video").forEach((video) => {
    if (video === currentVideo) return;
    if (video.closest(".video-task-card") === currentCard) return;
    video.pause();
  });
}

function cleanupGalleryVideos(root) {
  root.querySelectorAll(".gallery-video").forEach((video) => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  });
}

function createVideoPane(label, sourcePath, posterPath, tone) {
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

  if (!sourcePath || !posterPath) {
    appendFallback();
    return pane;
  }

  const frame = document.createElement("div");
  frame.className = "gallery-video-frame";

  function activateVideo() {
    const video = document.createElement("video");
    video.className = "gallery-video";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = "metadata";
    video.src = versionedVideoSrc(sourcePath);
    video.setAttribute("aria-label", `${label} rollout video`);

    video.addEventListener("error", () => {
      frame.remove();
      appendFallback();
    });

    video.addEventListener("play", () => {
      pauseOtherGalleryVideos(video);
    });

    frame.replaceChildren(video);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  const posterButton = document.createElement("button");
  posterButton.className = "gallery-video-poster";
  posterButton.type = "button";
  posterButton.dataset.videoSrc = sourcePath;
  posterButton.setAttribute("aria-label", `Play ${label} video`);

  const posterImage = document.createElement("img");
  posterImage.src = versionedPosterSrc(posterPath);
  posterImage.alt = `${label} video poster`;
  posterImage.loading = "lazy";
  posterImage.decoding = "async";

  const playButton = document.createElement("span");
  playButton.className = "gallery-play-button";
  playButton.setAttribute("aria-hidden", "true");

  posterButton.append(posterImage, playButton);
  posterButton.addEventListener("click", activateVideo, { once: true });

  frame.append(posterButton);
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
    createVideoPane(item.baselineLabel, item.baselineVideo, item.baselinePoster, "baseline"),
    createVideoPane(item.harnessLabel, item.harnessVideo, item.harnessPoster, "harness")
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

function getGalleryCards() {
  if (!galleryGrid) return [];
  return Array.from(galleryGrid.querySelectorAll(".video-task-card"));
}

function getGalleryVisibleRange() {
  const cards = getGalleryCards();
  if (!galleryViewport || cards.length === 0) {
    return { cards, first: 0, last: 0, visibleCount: 0 };
  }

  const start = galleryViewport.scrollLeft;
  const end = start + galleryViewport.clientWidth;
  const visibleCards = cards.filter((card) => {
    const cardStart = card.offsetLeft;
    const cardEnd = cardStart + card.offsetWidth;
    return cardEnd > start + 2 && cardStart < end - 2;
  });

  if (visibleCards.length === 0) {
    return { cards, first: 0, last: 0, visibleCount: 0 };
  }

  const first = cards.indexOf(visibleCards[0]);
  const last = cards.indexOf(visibleCards[visibleCards.length - 1]);
  return { cards, first, last, visibleCount: visibleCards.length };
}

function updateGalleryControls() {
  if (!galleryViewport) return;

  const { cards, first, last, visibleCount } = getGalleryVisibleRange();
  const maxScroll = Math.max(0, galleryViewport.scrollWidth - galleryViewport.clientWidth);
  const progress = maxScroll > 0 ? (galleryViewport.scrollLeft / maxScroll) * 100 : 100;
  const carousel = galleryViewport.closest(".gallery-carousel");

  carousel?.style.setProperty("--gallery-scroll-progress", `${progress}%`);

  if (galleryCount) {
    galleryCount.textContent =
      visibleCount > 0 ? `${first + 1}-${last + 1} / ${cards.length}` : "0 / 0";
  }

  if (galleryPrevButton) {
    galleryPrevButton.disabled = cards.length === 0 || galleryViewport.scrollLeft <= 2;
  }

  if (galleryNextButton) {
    galleryNextButton.disabled =
      cards.length === 0 || galleryViewport.scrollLeft >= maxScroll - 2;
  }
}

function scrollGallery(direction) {
  if (!galleryViewport) return;

  const { cards, first, last, visibleCount } = getGalleryVisibleRange();
  if (cards.length === 0) return;

  const step = Math.max(1, visibleCount || 1);
  const targetIndex =
    direction > 0 ? Math.min(cards.length - 1, last + 1) : Math.max(0, first - step);

  cards[targetIndex]?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
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
    if (galleryViewport) {
      galleryViewport.scrollLeft = 0;
    }
    window.requestAnimationFrame(updateGalleryControls);
    return;
  }

  items.forEach((item) => galleryGrid.append(createGalleryCard(item)));
  if (galleryViewport) {
    galleryViewport.scrollLeft = 0;
  }
  window.requestAnimationFrame(updateGalleryControls);
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

galleryPrevButton?.addEventListener("click", () => scrollGallery(-1));
galleryNextButton?.addEventListener("click", () => scrollGallery(1));
galleryViewport?.addEventListener("scroll", updateGalleryControls, { passive: true });
window.addEventListener("resize", updateGalleryControls);

galleryViewport?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    scrollGallery(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    scrollGallery(1);
  }
});

if (galleryViewport) {
  let isDraggingGallery = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;

  galleryViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button, video, a")) return;
    isDraggingGallery = true;
    dragStartX = event.clientX;
    dragStartScrollLeft = galleryViewport.scrollLeft;
    galleryViewport.classList.add("is-dragging");
    galleryViewport.setPointerCapture(event.pointerId);
  });

  galleryViewport.addEventListener("pointermove", (event) => {
    if (!isDraggingGallery) return;
    event.preventDefault();
    galleryViewport.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX);
  });

  function stopGalleryDrag(event) {
    if (!isDraggingGallery) return;
    isDraggingGallery = false;
    galleryViewport.classList.remove("is-dragging");
    if (galleryViewport.hasPointerCapture(event.pointerId)) {
      galleryViewport.releasePointerCapture(event.pointerId);
    }
  }

  galleryViewport.addEventListener("pointerup", stopGalleryDrag);
  galleryViewport.addEventListener("pointercancel", stopGalleryDrag);
}

renderGallery("ALL");
