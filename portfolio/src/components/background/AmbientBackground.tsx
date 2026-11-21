/**
 * Site-wide layered backdrop, fixed behind all content:
 *   1. ambient colour fields that give the page a sense of light sources
 *   2. a fine grid, faded out towards the edges
 *   3. film grain to soften gradient banding
 * Everything here is static. Nothing animates, so it adds no ongoing paint cost.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Ambient light */}
      <div className="absolute -top-[30vh] left-1/2 h-[70vh] w-[110vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.12),transparent)]" />
      <div className="absolute top-[35vh] -left-[20vw] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgb(154_123_255/0.07),transparent)]" />
      <div className="absolute -right-[15vw] -bottom-[20vh] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgb(99_227_242/0.05),transparent)]" />

      {/* Grid, masked so it reads as texture rather than graph paper */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_30%,transparent_85%)] opacity-70" />

      {/* Grain */}
      <div className="bg-noise absolute inset-0 opacity-[0.035]" />

      {/* Vignette keeps the edges calm */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(6_9_20/0.55))]" />
    </div>
  );
}
