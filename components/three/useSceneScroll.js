// Scene scroll: the choreography. Which model goes to which anchor in each section, and when.
// GSAP only changes numbers in sceneStateRef; the measuring and fitting math lives in scene-placement.js.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { invalidate } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each model visits these anchors in order. A name like "ac-hero" matches <div data-scene-anchor="ac-hero"> in a section.
// "offscreen-left" / "offscreen-right" are spots just outside the screen (see scene-placement.js).
const MODEL_PATHS = {
  ac: ["ac-hero", "ac-section", "offscreen-left", "ac-cta"],
  fridge: ["offscreen-right", "fridge-section"],
};

// Turn (radians) at each anchor of the path, so the models face toward the content
const ROTATIONS = { ac: [-0.3, 0.35, 0.2, -0.3], fridge: [-0.3, -0.25] };

// Start values of the shared scene state.
// stages: where each model is on its path (1.5 = halfway between anchor 1 and anchor 2).
// presence: 1 = full size, 0 = shrunk away and hidden.
export function createSceneState() {
  return {
    paths: MODEL_PATHS,
    stages: { ac: 0, fridge: 0 },
    presence: { ac: 1, fridge: 1 },
    rotations: ROTATIONS,
    airStrength: 0, // 0 = gentle air waves, 1 = strong
    doorOpen: 0, // 0 = fridge door closed, 1 = fully open
  };
}

// One scrubbed step: animate `target` from `fromValues` to `toValues` while the trigger scrolls from start to end.
// fromTo + immediateRender: false means the step only takes over once it is reached, and always
// returns to the exact same start values when scrolling back up.
function addScrollStep(target, fromValues, toValues, trigger, start, end) {
  gsap.fromTo(target, { ...fromValues }, {
    ...toValues,
    ease: "none",
    immediateRender: false,
    scrollTrigger: { trigger, start, end, scrub: true },
  });
}

// Scroll choreography for the 3D models. The models read sceneStateRef every frame through applyModelPlacement.
export default function useSceneScroll(sceneStateRef) {
  useGSAP(() => {
    const mediaQueries = gsap.matchMedia();

    mediaQueries.add(
      { isDesktop: "(min-width: 1024px)", reduceMotion: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        // The 3D scene is desktop only (see HeroSceneLoader.jsx), so no model ever moves on smaller screens
        if (!isDesktop) return;

        const sceneState = sceneStateRef.current;
        sceneState.presence.ac = 1;
        sceneState.presence.fridge = 1;
        sceneState.airStrength = 0;
        sceneState.doorOpen = 0;

        // Reduced motion: AC in the hero, fridge in its section, door closed. No scroll movement between spots,
        // but the canvas only draws on demand, so redraw on scroll to keep the models in their spots as the page moves.
        if (reduceMotion) {
          sceneState.stages.ac = 0;
          sceneState.stages.fridge = 1;
          ScrollTrigger.create({ start: 0, end: "max", onUpdate: () => invalidate() });
          invalidate();
          return;
        }

        sceneState.stages.ac = 0;
        sceneState.stages.fridge = 0;

        // Step 1 — into the AC section: the AC travels from the hero spot to the AC section spot, cool air gets stronger
        addScrollStep(sceneState.stages, { ac: 0 }, { ac: 1 }, "#ac-services", "top bottom", "top center");
        addScrollStep(sceneState, { airStrength: 0 }, { airStrength: 1 }, "#ac-services", "top bottom", "top center");

        // Step 2 — into the fridge section: the AC leaves to the left, the fridge comes in from the right
        addScrollStep(sceneState.stages, { ac: 1, fridge: 0 }, { ac: 2, fridge: 1 }, "#fridge-services", "top bottom", "top center");

        // Step 3 — through the fridge section: the door opens and the inner glow fades in (scrolling up closes it)
        addScrollStep(sceneState, { doorOpen: 0 }, { doorOpen: 1 }, "#fridge-services", "top center", "bottom center");

        // Step 4 — how it works comes in: both models shrink away and the whole 3D layer fades out,
        // so nothing ever sits behind the steps, the chat demo or their text
        addScrollStep(sceneState.presence, { ac: 1, fridge: 1 }, { ac: 0, fridge: 0 }, "#how-it-works", "top bottom", "top 60%");
        addScrollStep("#scene-layer", { opacity: 1 }, { opacity: 0 }, "#how-it-works", "top bottom", "top 60%");

        // Step 5 — final call-to-action, in two parts so the AC never crosses the testimonials above it:
        // first, while still hidden, the AC moves to its spot next to the card;
        // then it grows and the 3D layer fades back in, right on that spot
        addScrollStep(sceneState.stages, { ac: 2 }, { ac: 3 }, "#contact", "top bottom", "top 60%");
        addScrollStep(sceneState.presence, { ac: 0 }, { ac: 1 }, "#contact", "top 60%", "top center");
        addScrollStep("#scene-layer", { opacity: 0 }, { opacity: 1 }, "#contact", "top 60%", "top center");
      }
    );
  });
}
