// Scene placement: the measuring and fitting math.
// Reads where an anchor div is on screen and turns it into a 3D position and scale for a model.
// Which model goes to which anchor (and when) lives in useSceneScroll.js.
import { MathUtils } from "three";

// How much of the anchor box a model may fill (0.85 = 85%, leaving padding on every side)
const FIT_PADDING = 0.85;

// Full size of each model in scene units at scale 1, including its effects and shadow.
// centerY = how far the visual center sits above the model's origin.
// AC: body plus snowflakes, air waves and shadow below it. Fridge: body, open door, mist and shadow.
const MODEL_SIZES = {
  ac: { width: 3.5, height: 2.5, centerY: 0.12 },
  fridge: { width: 1.9, height: 3, centerY: 0 },
};

// Measures an anchor on screen, in pixels. Returns null if the anchor is not on the page.
// "offscreen-left" / "offscreen-right" are not divs: they are spots just outside the screen.
function measureAnchor(anchorName, screenSize) {
  if (anchorName === "offscreen-left" || anchorName === "offscreen-right") {
    const centerX = anchorName === "offscreen-left" ? -screenSize.width * 0.35 : screenSize.width * 1.35;
    return { centerX, centerY: screenSize.height / 2, width: screenSize.width * 0.4, height: screenSize.height * 0.4 };
  }

  const anchor = document.querySelector(`[data-scene-anchor="${anchorName}"]`);
  if (!anchor) return null;

  const rect = anchor.getBoundingClientRect();
  return { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2, width: rect.width, height: rect.height };
}

// Converts a screen box (pixels) into a 3D position and a scale that fits the whole model inside it, centered.
// The camera looks straight ahead, so pixels map to scene units with simple proportions.
// viewport = visible scene area in scene units, screenSize = canvas size in pixels (both from R3F).
function rectToPlacement(rect, modelSize, viewport, screenSize) {
  const unitsPerPixel = viewport.width / screenSize.width;
  const fitScale =
    Math.min((rect.width * unitsPerPixel) / modelSize.width, (rect.height * unitsPerPixel) / modelSize.height) *
    FIT_PADDING;

  return {
    x: (rect.centerX / screenSize.width - 0.5) * viewport.width,
    // Move down by the model's own center offset, so its visual center lands on the box center
    y: (0.5 - rect.centerY / screenSize.height) * viewport.height - modelSize.centerY * fitScale,
    scale: fitScale,
  };
}

// Used by the models every frame: place a model's outer group at its current spot on its path.
// Position and scale follow the anchors exactly (so the model scrolls with the page); the turn eases in.
// presence (0 → 1) shrinks the model away; at 0 it is hidden.
export function applyModelPlacement(group, modelName, sceneState, threeState, rotationEase) {
  const presence = sceneState.presence[modelName];
  group.visible = presence > 0.001;
  if (!group.visible) return;

  const path = sceneState.paths[modelName];
  const stage = sceneState.stages[modelName];
  const fromIndex = Math.floor(stage);
  const toIndex = Math.min(fromIndex + 1, path.length - 1);
  const blend = stage - fromIndex;

  const fromRect = measureAnchor(path[fromIndex], threeState.size);
  const toRect = measureAnchor(path[toIndex], threeState.size);
  if (!fromRect || !toRect) return;

  const from = rectToPlacement(fromRect, MODEL_SIZES[modelName], threeState.viewport, threeState.size);
  const to = rectToPlacement(toRect, MODEL_SIZES[modelName], threeState.viewport, threeState.size);
  const rotations = sceneState.rotations[modelName];

  group.position.set(MathUtils.lerp(from.x, to.x, blend), MathUtils.lerp(from.y, to.y, blend), 0);
  group.scale.setScalar(MathUtils.lerp(from.scale, to.scale, blend) * presence);
  const targetRotation = MathUtils.lerp(rotations[fromIndex], rotations[toIndex], blend);
  group.rotation.y = MathUtils.lerp(group.rotation.y, targetRotation, rotationEase);
}
