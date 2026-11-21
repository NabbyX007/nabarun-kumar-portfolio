/** Shared motion tokens so every animation feels like part of one system. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const durations = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
} as const;

export const springSoft = { type: 'spring', stiffness: 170, damping: 22, mass: 0.6 } as const;
export const springSnappy = { type: 'spring', stiffness: 420, damping: 32 } as const;
