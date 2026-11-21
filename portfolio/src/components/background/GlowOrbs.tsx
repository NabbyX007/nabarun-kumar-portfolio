import { motion, useScroll, useTransform } from 'framer-motion';

/** Two slow-drifting colour fields behind the hero, with light scroll parallax. */
export function GlowOrbs() {
  const { scrollY } = useScroll();
  const yBlue = useTransform(scrollY, [0, 800], [0, 160]);
  const yViolet = useTransform(scrollY, [0, 800], [0, 90]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ y: yBlue }} className="absolute -top-40 -left-32 h-[34rem] w-[34rem]">
        <div className="animate-drift h-full w-full rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.28),transparent)] blur-2xl" />
      </motion.div>
      <motion.div style={{ y: yViolet }} className="absolute top-10 right-[-10rem] h-[38rem] w-[38rem]">
        <div className="animate-drift-slow h-full w-full rounded-full bg-[radial-gradient(closest-side,rgb(154_123_255/0.24),transparent)] blur-2xl" />
      </motion.div>
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(99_227_242/0.08),transparent)] blur-2xl" />
    </div>
  );
}
