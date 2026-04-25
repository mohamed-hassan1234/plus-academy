import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "../BrandLogo";

const INTRO_DISPLAY_MS = 1100;
const EXIT_DURATION_MS = 260;

function LoadingIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !window.sessionStorage.getItem("plus_academy_intro_seen");
  });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!visible || typeof window === "undefined") {
      return undefined;
    }

    const bodyStyle = document.body.style;
    const previousOverflow = bodyStyle.overflow;
    bodyStyle.overflow = "hidden";

    const introDuration = prefersReducedMotion ? 520 : INTRO_DISPLAY_MS;
    const exitDuration = prefersReducedMotion ? 160 : EXIT_DURATION_MS;

    const startExitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, introDuration);

    const finishTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("plus_academy_intro_seen", "true");
      setVisible(false);
    }, introDuration + exitDuration);

    return () => {
      bodyStyle.overflow = previousOverflow;
      window.clearTimeout(startExitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [prefersReducedMotion, visible]);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      className="loading-intro-lite"
      role="status"
      aria-label="Loading Plus Academy"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.18 : isExiting ? 0.22 : 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="loading-intro-lite__wash" aria-hidden="true" />

      <motion.div
        className="loading-intro-lite__panel"
        initial={{
          x: prefersReducedMotion ? 0 : 88,
          opacity: 0,
          scale: prefersReducedMotion ? 1 : 0.96,
        }}
        animate={{
          x: 0,
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 0.985 : 1,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            : {
                x: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              }
        }
      >
        <div className="loading-intro-lite__logo-shell">
          <BrandLogo className="loading-intro-lite__brand" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LoadingIntro;
