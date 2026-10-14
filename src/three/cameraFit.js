/*
 * Aspect-aware camera framing.
 *
 * Problem: zone views were composed for landscape desktop. On a portrait
 * phone the horizontal FOV collapses (vertical FOV stays the same), so wide
 * subjects like the central counter get cropped off the sides.
 *
 * Fix: widen the vertical FOV on narrow viewports AND pull the camera back
 * along its view direction just enough that the zone's subject
 * (zone.frameHalfWidth, in world units) fits inside the *horizontal* FOV.
 * On desktop the required distance is always below the authored distance,
 * so the desktop framing is untouched.
 */

export function zoneFraming(zone, aspect, shortLandscape) {
  let fov = 55;
  if (aspect < 1) {
    // portrait: 55 at square, ~78 at 360x740, capped at 85
    fov = Math.min(85, 55 + (1 - aspect) * 45);
  } else if (shortLandscape) {
    fov = 62;
  }
  const vfovRad = (fov * Math.PI) / 180;
  const hHalf = Math.atan(Math.tan(vfovRad / 2) * aspect); // half horizontal FOV
  const halfW = zone.frameHalfWidth || 2.5;
  const needDist = (halfW * 1.18) / Math.tan(hHalf);
  return { fov, needDist };
}

/* FOV for the pick-up viewer: small scene, just needs margin on portrait. */
export function pickupFov(aspect) {
  return aspect < 1 ? 54 : 42;
}
