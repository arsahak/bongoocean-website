"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

const COLORS = ["#E2136E", "#F5821F", "#16A34A", "#1A56DB", "#FACC15", "#A855F7", "#38BDF8"];

// Classic "success confetti": an opening burst from the middle, side
// cannons for a few seconds, then a closing burst. Sits above the modal.
export function SuccessConfetti() {
  useEffect(() => {
    const base = {
      colors: COLORS,
      zIndex: 110,
      disableForReducedMotion: true,
    } satisfies confetti.Options;

    const burst = (ratio: number, opts: confetti.Options) =>
      confetti({
        ...base,
        origin: { y: 0.6 },
        particleCount: Math.floor(220 * ratio),
        ...opts,
      });

    // Layered opening burst — mixes speed/spread so it reads as one big pop.
    burst(0.25, { spread: 26, startVelocity: 55 });
    burst(0.2, { spread: 60 });
    burst(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
    burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    burst(0.1, { spread: 120, startVelocity: 45 });

    const end = Date.now() + 3000;
    let raf = 0;
    const cannons = () => {
      confetti({ ...base, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
      confetti({ ...base, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) raf = requestAnimationFrame(cannons);
    };
    raf = requestAnimationFrame(cannons);

    const finale = setTimeout(() => {
      confetti({ ...base, particleCount: 160, spread: 160, startVelocity: 35, origin: { y: 0.35 } });
    }, 3200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finale);
      confetti.reset();
    };
  }, []);

  return null;
}
