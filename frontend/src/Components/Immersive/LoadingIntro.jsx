import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "../BrandLogo";

const INTRO_DURATION_MS = 3450;
const EXIT_DURATION_MS = 550;

const STREAKS = [
  { top: "20%", width: "20rem", delay: 0.18, duration: 1.05, rotate: -12 },
  { top: "36%", width: "15rem", delay: 0.44, duration: 0.92, rotate: -8 },
  { top: "68%", width: "24rem", delay: 0.72, duration: 1.18, rotate: -6 },
];

const BEAM_NODES = [
  { left: "18%", delay: 1.62 },
  { left: "43%", delay: 1.74 },
  { left: "71%", delay: 1.86 },
];

function LoadingIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !sessionStorage.getItem("plus_academy_intro_seen");
  });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const introDuration = prefersReducedMotion ? 1200 : INTRO_DURATION_MS;
    const exitDuration = prefersReducedMotion ? 220 : EXIT_DURATION_MS;

    const finishIntro = () => {
      sessionStorage.setItem("plus_academy_intro_seen", "true");
      setVisible(false);
    };

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, introDuration);

    const finishTimer = window.setTimeout(() => {
      finishIntro();
    }, introDuration + exitDuration);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [prefersReducedMotion, visible]);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      className="loading-intro"
      role="status"
      aria-label="Loading Plus Academy"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting ? 0.52 : 0.32,
        ease: isExiting ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="loading-intro__backdrop"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.24 : 0.68, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="loading-intro__field"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: 0.08 }}
      />

      <div className="loading-intro__hud" aria-hidden="true">
        {STREAKS.map((streak) => (
          <motion.span
            key={streak.top}
            className="loading-intro__streak"
            style={{ top: streak.top, width: streak.width, rotate: `${streak.rotate}deg` }}
            initial={{ x: "-34vw", opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0 }
                : { x: "118vw", opacity: [0, 0.85, 0] }
            }
            transition={{
              duration: streak.duration,
              delay: streak.delay,
              ease: [0.16, 1, 0.3, 1],
              repeat: prefersReducedMotion ? 0 : Infinity,
              repeatDelay: 1.2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="loading-intro__scan"
        aria-hidden="true"
        initial={{ x: "-40%", opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 0 }
            : { x: "130%", opacity: [0, 0.4, 0] }
        }
        transition={{
          duration: 1.35,
          delay: 0.22,
          ease: [0.16, 1, 0.3, 1],
          repeat: prefersReducedMotion ? 0 : Infinity,
          repeatDelay: 1.05,
        }}
      />

      <div className="loading-intro__stage">
        <motion.div
          className="loading-intro__logo-assembly"
          initial={{
            x: prefersReducedMotion ? 0 : "-48vw",
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.84,
            rotate: prefersReducedMotion ? 0 : -5,
          }}
          animate={{
            x: isExiting ? 14 : 0,
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.98 : 1,
            rotate: 0,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
              : {
                  x: { type: "spring", stiffness: 112, damping: 18, mass: 0.92, delay: 0.34 },
                  opacity: { duration: 0.32, delay: 0.28 },
                  scale: { type: "spring", stiffness: 126, damping: 18, mass: 0.88, delay: 0.34 },
                  rotate: { duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.34 },
                }
          }
        >
          <motion.span
            className="loading-intro__logo-aura"
            aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0.86 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.48, scaleX: 1 }
                : { opacity: [0, 0.72, 0.46], scaleX: [0.86, 1.08, 1] }
            }
            transition={{ duration: 0.95, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.span
            className="loading-intro__pulse-ring loading-intro__pulse-ring--outer"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: [0, 0.52, 0], scale: [0.92, 1.08, 1.32] }
            }
            transition={{ duration: 0.95, delay: 1.62, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.span
            className="loading-intro__pulse-ring loading-intro__pulse-ring--inner"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: [0, 0.38, 0], scale: [0.96, 1.03, 1.18] }
            }
            transition={{ duration: 0.84, delay: 1.76, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="loading-intro__logo-frame"
            initial={{ filter: "brightness(0.9)" }}
            animate={{ filter: isExiting ? "brightness(1)" : "brightness(1.08)" }}
            transition={{ duration: 0.42, delay: 0.78 }}
          >
            <BrandLogo className="loading-intro__brand" />
            <span className="loading-intro__logo-accent" aria-hidden="true" />
          </motion.div>
        </motion.div>

        <div className="loading-intro__beam-track" aria-hidden="true">
          <motion.span
            className="loading-intro__beam loading-intro__beam--glow"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: isExiting ? 0 : 1,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.62,
              delay: prefersReducedMotion ? 0.14 : 1.18,
              ease: [0.12, 1, 0.24, 1],
            }}
          />

          <motion.span
            className="loading-intro__beam loading-intro__beam--core"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: isExiting ? 0 : 1,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.16 : 0.54,
              delay: prefersReducedMotion ? 0.12 : 1.12,
              ease: [0.12, 1, 0.24, 1],
            }}
          />

          <motion.span
            className="loading-intro__beam-sweep"
            initial={{ x: "-140%", opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0 }
                : { x: "380%", opacity: [0, 1, 0] }
            }
            transition={{
              duration: 0.68,
              delay: 1.14,
              ease: [0.12, 1, 0.24, 1],
            }}
          />

          {BEAM_NODES.map((node) => (
            <motion.span
              key={node.left}
              className="loading-intro__beam-node"
              style={{ left: node.left }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.5, scale: 1 }
                  : { opacity: [0, 0.95, 0.42], scale: [0.4, 1.12, 1] }
              }
              transition={{ duration: 0.56, delay: node.delay, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          <motion.span
            className="loading-intro__beam-target"
            initial={{ opacity: 0, scale: 0.42 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.58, scale: 1 }
                : { opacity: [0, 1, 0.48], scale: [0.42, 1.16, 1] }
            }
            transition={{ duration: 0.72, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingIntro;
