/** Global pointer in normalised coords (-1..1, y up), shared by canvases and the cursor. */
export const pointer = { x: 0, y: 0, clientX: -100, clientY: -100, active: false };

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.active = true;
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}
