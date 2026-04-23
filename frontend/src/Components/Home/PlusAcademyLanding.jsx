import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import plusLogo from "../../assets/plusacademy logo.jpeg";
import labImage from "../../assets/plus-academy-innovation-lab.svg";
import MagneticButton from "../Immersive/MagneticButton";
import TiltCard from "../Immersive/TiltCard";

gsap.registerPlugin(ScrollTrigger);

const floatingCards = [
  { title: "Full Stack Development", angle: 0, radius: 182, fromX: -180, fromY: -120 },
  { title: "Mobile App Development", angle: 45, radius: 182, fromX: 180, fromY: -120 },
  { title: "IoT", angle: 90, radius: 182, fromX: 0, fromY: -170 },
  { title: "Cybersecurity", angle: 135, radius: 182, fromX: -200, fromY: 0 },
  { title: "UI/UX", angle: 180, radius: 182, fromX: -170, fromY: 120 },
  { title: "Real Projects", angle: 225, radius: 182, fromX: 0, fromY: 170 },
  { title: "Career Growth", angle: 270, radius: 182, fromX: 170, fromY: 120 },
  { title: "Mentorship", angle: 315, radius: 182, fromX: 200, fromY: 0 },
];

const programs = [
  {
    title: "Full Stack Development",
    label: "Code",
    detail:
      "Build complete web products with React, Node, APIs, databases, deployment, and portfolio-ready releases.",
    meta: "16 weeks",
  },
  {
    title: "Mobile App Development",
    label: "App",
    detail:
      "Design and ship polished mobile apps with practical UI systems, state, data flows, and launch foundations.",
    meta: "Studio cohorts",
  },
  {
    title: "IoT Development",
    label: "IoT",
    detail:
      "Connect sensors, microcontrollers, cloud tools, and dashboards through hands-on smart device projects.",
    meta: "Project led",
  },
  {
    title: "Basic Computing",
    label: "Core",
    detail:
      "Gain confident digital literacy, office productivity, internet safety, and practical computer fluency.",
    meta: "Beginner friendly",
  },
  {
    title: "UI/UX Foundations",
    label: "Design",
    detail:
      "Learn interface structure, research habits, prototyping, and presentation skills for digital product teams.",
    meta: "Portfolio path",
  },
  {
    title: "Data and AI Foundations",
    label: "AI",
    detail:
      "Understand data thinking, AI tools, automation workflows, and responsible use through guided mini-projects.",
    meta: "Future skills",
  },
];

const trustMetrics = [
  { value: 92, suffix: "%", label: "students complete core milestones" },
  { value: 4, suffix: "+", label: "career-focused learning paths" },
  { value: 100, suffix: "+", label: "alumni and active learners" },
  { value: 24, suffix: "/7", label: "community momentum and support" },
];

const whyCards = [
  {
    title: "Mentorship that moves with you",
    text:
      "Students get direct guidance, review loops, and calm accountability so blockers turn into progress.",
  },
  {
    title: "Project-based learning from week one",
    text:
      "Every program turns concepts into working demos, documented builds, and portfolio proof.",
  },
  {
    title: "Future-ready curriculum",
    text:
      "Modern web, mobile, IoT, product thinking, data, and AI foundations connect into practical career pathways.",
  },
  {
    title: "Career confidence beyond class",
    text:
      "CV polish, interview practice, presentation habits, and community events help students step forward prepared.",
  },
];

const events = [
  {
    title: "Innovation Hack Nights",
    date: "Monthly",
    text: "Fast team challenges where learners turn ideas into testable prototypes.",
  },
  {
    title: "Portfolio Demo Days",
    date: "Cohort close",
    text: "Students present their work, sharpen stories, and practice professional feedback.",
  },
  {
    title: "Mentor Clinics",
    date: "Weekly",
    text: "Focused support sessions for code reviews, product decisions, and career questions.",
  },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.16,
    },
  },
};

const MotionDiv = motion.div;
const MotionSvg = motion.svg;
const MotionPath = motion.path;
const MotionCircle = motion.circle;

function splitOrbitLabel(title) {
  const words = title.split(" ");

  if (words.length <= 2) {
    return [title];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function LogoGeometryBackground({ enabled, tier }) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="pa-hero-logo-geometry" aria-hidden="true">
      <MotionSvg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="pa-hero-logo-geometry__svg"
      >
        <defs>
          <linearGradient id="pa-geo-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(17, 212, 192, 0)" />
            <stop offset="35%" stopColor="rgba(17, 212, 192, 0.55)" />
            <stop offset="55%" stopColor="rgba(98, 170, 255, 0.42)" />
            <stop offset="70%" stopColor="rgba(17, 212, 192, 0.5)" />
            <stop offset="100%" stopColor="rgba(17, 212, 192, 0)" />
          </linearGradient>
          <linearGradient id="pa-geo-stroke-soft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(11, 61, 115, 0)" />
            <stop offset="40%" stopColor="rgba(17, 212, 192, 0.22)" />
            <stop offset="60%" stopColor="rgba(98, 170, 255, 0.18)" />
            <stop offset="100%" stopColor="rgba(11, 61, 115, 0)" />
          </linearGradient>
          <radialGradient id="pa-geo-core" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(17, 212, 192, 0.12)" />
            <stop offset="45%" stopColor="rgba(98, 170, 255, 0.06)" />
            <stop offset="75%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Animated dash arcs are expensive; keep them only in full tier */}
        {tier === "full" ? (
          <>
            <MotionPath
              d="M-140,640 C220,430 520,330 860,350 C1210,372 1410,318 1750,170"
              className="pa-geo-arc pa-geo-arc--a"
              stroke="url(#pa-geo-stroke-soft)"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 1, opacity: 0.24 }}
              animate={{ strokeDashoffset: [0, -380] }}
              transition={{ duration: 34, ease: "linear", repeat: Infinity }}
            />
            <MotionPath
              d="M-160,240 C250,110 520,120 860,170 C1200,220 1420,190 1760,70"
              className="pa-geo-arc pa-geo-arc--b"
              stroke="url(#pa-geo-stroke)"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0.16 }}
              animate={{ strokeDashoffset: [0, 520] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            />
            <MotionPath
              d="M-120,520 C120,470 240,560 420,540 C610,520 740,460 910,492 C1080,524 1240,610 1420,580 C1540,560 1640,520 1760,480"
              className="pa-geo-wave"
              stroke="url(#pa-geo-stroke)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0.18 }}
              animate={{ strokeDashoffset: [0, 680] }}
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            />
          </>
        ) : (
          <>
            <path
              d="M-140,640 C220,430 520,330 860,350 C1210,372 1410,318 1750,170"
              className="pa-geo-arc pa-geo-arc--a"
              stroke="url(#pa-geo-stroke-soft)"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              opacity="0.2"
            />
            <path
              d="M-160,240 C250,110 520,120 860,170 C1200,220 1420,190 1760,70"
              className="pa-geo-arc pa-geo-arc--b"
              stroke="url(#pa-geo-stroke)"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
              opacity="0.14"
            />
          </>
        )}

        {/* Layer C: emblem rings (rotating) */}
        <g>
          <MotionCircle
            cx="800"
            cy="470"
            r="280"
            className="pa-geo-ring pa-geo-ring--outer"
            fill="none"
            stroke="rgba(17, 212, 192, 0.18)"
            strokeWidth="2"
            strokeDasharray="9 10"
            initial={{ opacity: 0.24, rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 82, ease: "linear", repeat: Infinity }}
            style={{ transformOrigin: "800px 470px" }}
          />
          <MotionCircle
            cx="800"
            cy="470"
            r="210"
            className="pa-geo-ring pa-geo-ring--inner"
            fill="none"
            stroke="rgba(98, 170, 255, 0.16)"
            strokeWidth="2"
            strokeDasharray="4 16"
            initial={{ opacity: 0.22, rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 68, ease: "linear", repeat: Infinity }}
            style={{ transformOrigin: "800px 470px" }}
          />
        </g>

        {/* Core aura to reinforce logo power */}
        {/* Keep the base white: reduce core wash */}
        <circle cx="800" cy="470" r="380" fill="url(#pa-geo-core)" opacity="0.32" />
      </MotionSvg>
    </div>
  );
}
const cinematicTrails = [
  { id: "trail-1", width: "62%", top: "22%", rotate: -14, duration: 12.5, delay: 0.35 },
  { id: "trail-2", width: "68%", top: "62%", rotate: -10, duration: 14.5, delay: 1.9 },
];

const cinematicParticles = Array.from({ length: 6 }, (_, index) => ({
  id: `particle-${index}`,
  top: `${14 + (index % 3) * 24}%`,
  left: `${10 + ((index * 17) % 80)}%`,
  duration: 10 + (index % 3) * 2.5,
  delay: index * 0.7,
}));

const cinematicRibbons = [{ id: "ribbon-1", top: "18%", rotate: -18, duration: 18, delay: 0.6, scale: 1.02 }];

const cinematicSweeps = [{ id: "sweep-1", rotate: 16, duration: 7.2, delay: 2.6, thickness: "clamp(9rem, 14vw, 16rem)" }];

function SectionIntro({ eyebrow, title, children, centered = false }) {
  return (
    <div className={`pa-section-intro ${centered ? "pa-section-intro--center" : ""}`} data-cinematic>
      <p className="pa-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

function FloatingCardsSystem({ onChipEnter }) {
  const prefersReducedMotion = useReducedMotion();
  const baseDelay = 3.05; // after logo landing
  const stagger = 0.13;
  const settleAfter = 0.55;
  const orbitStartDelay = baseDelay + (floatingCards.length - 1) * stagger + settleAfter;

  const nodes = useMemo(() => {
    // Balanced, evenly spaced placements around center.
    // Orbit rotation is handled by the container; chips counter-rotate to stay upright.
    const count = floatingCards.length;
    const startAngle = -90; // start from top
    const yCompression = 0.86; // slightly elliptical for premium composition
    const radius = 186; // safe on desktop; responsive scaling handled in CSS via --orbit-scale

    return floatingCards.map((card, index) => {
      const angle = startAngle + (index * 360) / count;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius * yCompression;
      // Shorter travel = lighter feel + less perceived stutter.
      const fromX = Math.sign(x || 1) * 110;
      const fromY = Math.sign(y || 1) * 84;

      return {
        ...card,
        index,
        angle,
        lines: splitOrbitLabel(card.title),
        x,
        y,
        fromX,
        fromY,
      };
    });
  }, []);

  return (
    <div
      className="pa-course-orbit"
      aria-label="PlusAcademy course pillars"
      style={{
        "--orbit-start-delay": `${orbitStartDelay}s`,
        "--orbit-duration": "52s",
      }}
      data-orbit={prefersReducedMotion ? "off" : "on"}
    >
      {nodes.map((card) => (
        <div
          className="pa-orbit-node"
          key={card.title}
          style={{
            "--node-x": `${card.x}px`,
            "--node-y": `${card.y}px`,
          }}
        >
          <MotionDiv
            className="pa-course-chip"
            initial={
              prefersReducedMotion
                ? { opacity: 1, x: 0, y: 0, scale: 1 }
                : { opacity: 0, x: card.fromX, y: card.fromY, scale: 0.965 }
            }
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: baseDelay + card.index * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationStart={() => {
              if (!prefersReducedMotion) onChipEnter?.();
            }}
          >
            <strong aria-label={card.title}>
              {card.lines.map((line) => (
                <span key={`${card.title}-${line}`}>{line}</span>
              ))}
            </strong>
          </MotionDiv>
        </div>
      ))}
    </div>
  );
}

function MobileCourseOrbit() {
  const wrapRef = useRef(null);
  const sampleChipRef = useRef(null);
  const [mobileRadius, setMobileRadius] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const resolve = () => {
      const heroVisual = wrap.closest(".pa-hero-center-visual");
      const ring = heroVisual?.querySelector?.(".pa-hero-center-rings span:nth-child(1)");
      const logo = heroVisual?.querySelector?.(".pa-hero-logo-core");

      const visualBounds = heroVisual?.getBoundingClientRect?.();
      const ringBounds = ring?.getBoundingClientRect?.();
      const logoBounds = logo?.getBoundingClientRect?.();
      const chipBounds = sampleChipRef.current?.getBoundingClientRect?.();

      if (!visualBounds?.width || !ringBounds?.width) return;

      const desiredRingRadius = ringBounds.width / 2;
      const chipHalf = chipBounds?.width ? chipBounds.width / 2 : 64;
      const edgePadding = 10;

      const maxRadius = Math.max(0, visualBounds.width / 2 - chipHalf - edgePadding);
      const minRadius = logoBounds?.width
        ? logoBounds.width / 2 + chipHalf + 14
        : 0;

      const computed = Math.min(desiredRingRadius, maxRadius);
      setMobileRadius(Math.max(computed, minRadius));
    };

    resolve();
    const ro = new ResizeObserver(() => resolve());
    ro.observe(wrap);
    window.addEventListener("orientationchange", resolve);
    window.addEventListener("resize", resolve);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", resolve);
      window.removeEventListener("resize", resolve);
    };
  }, []);

  const positions = useMemo(() => {
    // Mobile-specific orbit: place chips ON the visible ring path.
    // The ring radius is measured from the actual ring element.
    const count = floatingCards.length;
    const startAngle = -90; // 12 o'clock
    const radius = mobileRadius || 0;

    return floatingCards.map((card, index) => {
      const angle = startAngle + (index * 360) / count;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      return { ...card, index, lines: splitOrbitLabel(card.title), x, y };
    });
  }, [mobileRadius]);

  return (
    <div ref={wrapRef} className="pa-course-orbit-mobile-wrap md:hidden" aria-hidden="false">
      <div
        className="pa-course-orbit pa-course-orbit--mobile"
        aria-label="PlusAcademy course pillars"
        style={{
          "--orbit-start-delay": "3.2s",
          "--orbit-duration": "64s",
        }}
        data-orbit="on"
      >
        {positions.map((card) => (
          <div
            className="pa-orbit-node"
            key={`mobile-orbit-${card.title}`}
            style={{
              "--node-x": `${card.x}px`,
              "--node-y": `${card.y}px`,
            }}
          >
            <div
              ref={card.index === 0 ? sampleChipRef : null}
              className="pa-course-chip pa-course-chip--mobile"
              aria-label={card.title}
            >
              <strong>
                {card.lines.map((line) => (
                  <span key={`${card.title}-m-${line}`}>{line}</span>
                ))}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlusAcademyLanding() {
  const rootRef = useRef(null);
  const heroVisualRef = useRef(null);
  const whooshPlayedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [motionTier, setMotionTier] = useState("full"); // full | lite | minimal
  const [heroActive, setHeroActive] = useState(true);
  const audioRef = useRef({ ctx: null, unlocked: false, chipCount: 0 });

  const motionConfig = useMemo(() => {
    if (prefersReducedMotion || motionTier === "minimal") {
      return { tier: "minimal", showParticles: false, showSweeps: false, showTrails: false, showRibbon: false };
    }
    if (motionTier === "lite") {
      return { tier: "lite", showParticles: false, showSweeps: false, showTrails: true, showRibbon: true };
    }
    return { tier: "full", showParticles: true, showSweeps: true, showTrails: true, showRibbon: true };
  }, [motionTier, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || whooshPlayedRef.current) {
      return undefined;
    }

    const ensureAudio = () => {
      const state = audioRef.current;
      if (state.ctx) return state.ctx;
      // Only create audio context after a real user gesture unlock.
      if (!state.unlocked) return null;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        state.ctx = ctx;
        return ctx;
      } catch {
        return null;
      }
    };

    const playWhoosh = () => {
      if (whooshPlayedRef.current) {
        return;
      }
      try {
        const audioContext = ensureAudio();
        if (!audioContext) return;
        const duration = 0.42;
        const source = audioContext.createBufferSource();
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < channelData.length; i += 1) channelData[i] = (Math.random() * 2 - 1) * 0.2;
        source.buffer = buffer;

        const filter = audioContext.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(260, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(920, audioContext.currentTime + duration);
        filter.Q.value = 0.9;

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.038, audioContext.currentTime + 0.11);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
        source.stop(audioContext.currentTime + duration);
        whooshPlayedRef.current = true;
      } catch (_error) {
        // Optional effect; ignore unsupported or blocked audio.
      }
    };

    const playChipTick = () => {
      // Small, subtle tick; safe/no-op if blocked.
      try {
        const audioContext = ensureAudio();
        if (!audioContext) {
          audioRef.current.pendingTicks = (audioRef.current.pendingTicks || 0) + 1;
          return;
        }
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.028, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } catch {
        // ignore
      }
    };

    // Prefer to play after interaction; fall back to a subtle timed attempt.
    const timer = window.setTimeout(playWhoosh, 1850);
    const onFirstInteraction = () => {
      const state = audioRef.current;
      state.unlocked = true;
      // Create context immediately on gesture.
      ensureAudio();
      state.chipCount = 0;
      // Flush any queued chip ticks that occurred pre-unlock.
      const pending = Math.min(8, state.pendingTicks || 0);
      state.pendingTicks = 0;
      for (let i = 0; i < pending; i += 1) {
        window.setTimeout(() => state.playChipTick?.(), i * 85);
      }
      playWhoosh();
    };
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });

    // Expose tick player via ref for chip entrances (lightweight, no re-renders).
    audioRef.current.playChipTick = playChipTick;
    audioRef.current.pendingTicks = audioRef.current.pendingTicks || 0;

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Adaptive performance tiering (mobile/low-end devices).
    const isSmallScreen = window.matchMedia?.("(max-width: 719px)")?.matches;
    const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;
    const memory = typeof navigator !== "undefined" ? navigator.deviceMemory : undefined;
    const lowEnd = (typeof cores === "number" && cores <= 6) || (typeof memory === "number" && memory <= 6);
    const highEnd = (typeof cores === "number" && cores >= 8) || (typeof memory === "number" && memory >= 8);

    if (prefersReducedMotion) {
      setMotionTier("minimal");
      return;
    }

    if (isSmallScreen || lowEnd) {
      setMotionTier("lite");
    } else if (highEnd) {
      setMotionTier("full");
    } else {
      // Default to lite to keep it soft/smooth on typical laptops.
      setMotionTier("lite");
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Pause heavy layers when hero is offscreen.
    const target = heroVisualRef.current;
    if (!target || prefersReducedMotion) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroActive(entry.isIntersecting);
      },
      { root: null, threshold: 0.08 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray("[data-scroll-drift]").forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -42 : 34,
          rotate: index % 2 === 0 ? -1.4 : 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
          },
        });
      });

      gsap.utils.toArray(".pa-why-card").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.28, y: 60, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              end: "top 38%",
              scrub: 0.65,
            },
          }
        );

        gsap.to(card, {
          "--story-progress": 1,
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            end: "bottom 45%",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray("[data-counter]").forEach((element) => {
        const target = Number(element.getAttribute("data-counter"));
        const suffix = element.getAttribute("data-suffix") || "";
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      });

    }, rootRef);

    return () => context.revert();
  }, [prefersReducedMotion]);

  const handleHeroPointerMove = (event) => {
    const visual = heroVisualRef.current;

    if (!visual || prefersReducedMotion || window.innerWidth < 900) {
      return;
    }

    const bounds = visual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 28;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 24;
    visual.style.setProperty("--mx", x.toFixed(2));
    visual.style.setProperty("--my", y.toFixed(2));
    visual.style.setProperty("--mrx", (-y / 16).toFixed(2));
    visual.style.setProperty("--mry", (x / 16).toFixed(2));
  };

  return (
    <div ref={rootRef} className="pa-premium-home">
      <section
        className="pa-hero pa-hero--premium"
        aria-label="PlusAcademy visual hero scene"
        onPointerMove={handleHeroPointerMove}
      >
        <div className="pa-container pa-hero-center-layout">
          <div className="pa-hero-center-visual" ref={heroVisualRef} data-cinematic data-motion-tier={motionConfig.tier}>
            <MotionDiv
              className="pa-hero-center-atmosphere"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="pa-hero-cinematic-background" aria-hidden="true">
              <LogoGeometryBackground enabled={heroActive && !prefersReducedMotion} tier={motionConfig.tier} />
              <MotionDiv
                className="pa-hero-cinematic-aura pa-hero-cinematic-aura--left"
                initial={{ opacity: 0.16 }}
                animate={heroActive ? { x: ["-5%", "6%", "-4%"], y: ["-3%", "5%", "-2%"], opacity: [0.18, 0.36, 0.22] } : { opacity: 0.12 }}
                transition={{ duration: 26, ease: "easeInOut", repeat: Infinity }}
              />

              {motionConfig.showRibbon &&
                cinematicRibbons.map((ribbon) => (
                  <MotionDiv
                    key={ribbon.id}
                    className="pa-hero-glow-ribbon"
                    style={{ top: ribbon.top, rotate: `${ribbon.rotate}deg`, scale: ribbon.scale }}
                    initial={{ x: "-34%", opacity: 0.12 }}
                    animate={heroActive ? { x: ["-30%", "14%", "-26%"], opacity: [0.12, 0.26, 0.14] } : { opacity: 0 }}
                    transition={{
                      duration: ribbon.duration,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: ribbon.delay,
                    }}
                  />
                ))}

              {motionConfig.showSweeps &&
                cinematicSweeps.map((sweep) => (
                  <MotionDiv
                    key={sweep.id}
                    className="pa-hero-light-sweep"
                    style={{ rotate: `${sweep.rotate}deg`, "--sweep-thickness": sweep.thickness }}
                    initial={{ x: "-140%", opacity: 0 }}
                    animate={heroActive ? { x: ["-140%", "140%"], opacity: [0, 0.42, 0] } : { opacity: 0 }}
                    transition={{ duration: sweep.duration, ease: "easeInOut", repeat: Infinity, repeatType: "loop", delay: sweep.delay }}
                  />
                ))}

              {motionConfig.showTrails &&
                cinematicTrails.map((trail) => (
                  <MotionDiv
                    key={trail.id}
                    className="pa-hero-energy-trail"
                    style={{ width: trail.width, top: trail.top, rotate: `${trail.rotate}deg` }}
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={heroActive ? { x: ["-120%", "132%"], opacity: [0, 0.34, 0] } : { opacity: 0 }}
                    transition={{
                      duration: trail.duration,
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: trail.delay + 2.05,
                    }}
                  />
                ))}

              {motionConfig.showParticles &&
                cinematicParticles.map((particle) => (
                  <MotionDiv
                    key={particle.id}
                    className="pa-hero-energy-particle"
                    style={{ top: particle.top, left: particle.left }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={heroActive ? { opacity: [0.06, 0.22, 0.08], y: ["0%", "-14%", "0%"], x: ["0%", "7%", "0%"], scale: [0.92, 1.18, 0.98] } : { opacity: 0 }}
                    transition={{ duration: particle.duration, delay: particle.delay + 1.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
            </div>
            <div className="pa-hero-center-rings" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <MotionDiv
              className="pa-hero-logo-core"
              initial={{ opacity: 0, scale: 0.9, y: -760 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.35, delay: 1.28, ease: [0.16, 1, 0.3, 1] }}
              onAnimationStart={() => {
                // Ensure the whoosh is attempted on logo entry as well (safe no-op if blocked).
                // The initial effect hook also attempts playback; this reinforces timing.
                if (prefersReducedMotion) return;
                try {
                  // Reuse the same generator by emulating a first-interaction call.
                  // If blocked, it silently fails.
                  const state = audioRef.current;
                  if (typeof state.playChipTick === "function") {
                    // no-op; presence indicates audio system is initialized
                  }
                } catch {
                  // ignore
                }
              }}
            >
              <div className="pa-hero-logo-waves" aria-hidden="true">
                <MotionDiv
                  className="pa-hero-logo-wave pa-hero-logo-wave--a"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.1, 0.55, 0.1], scale: [0.9, 1.8, 0.9] }}
                  transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity }}
                />
                <MotionDiv
                  className="pa-hero-logo-wave pa-hero-logo-wave--b"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.08, 0.48, 0.08], scale: [0.85, 2.2, 0.85] }}
                  transition={{ duration: 4.6, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
                />
                <MotionDiv
                  className="pa-hero-logo-wave pa-hero-logo-wave--c"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.06, 0.38, 0.06], scale: [0.8, 2.55, 0.8] }}
                  transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, delay: 1.05 }}
                />
              </div>
              <span aria-hidden="true" />
              <div
                className="pa-hero-logo-card"
                role="img"
                aria-label="PlusAcademy centered logo"
                style={{ backgroundImage: `url(${plusLogo})` }}
              />
            </MotionDiv>
            <div className="hidden md:block">
              <FloatingCardsSystem
                onChipEnter={() => {
                  const state = audioRef.current;
                  if (!state || typeof state.playChipTick !== "function") return;
                  // Keep chip sound subtle + capped.
                  if (state.chipCount >= 10) return;
                  state.chipCount += 1;
                  state.playChipTick();
                }}
              />
            </div>
            <MobileCourseOrbit />
          </div>

        </div>

        <a className="pa-scroll-cue" href="#academy-trust" aria-label="Scroll to academy outcomes">
          <span />
          See the outcomes
        </a>
      </section>

      <section id="academy-trust" className="pa-section pa-trust-section">
        <div className="pa-container">
          <SectionIntro
            eyebrow="Trusted Learning Momentum"
            title="A serious academy for learners who want visible progress."
            centered
          >
            Every part of PlusAcademy is shaped around practical skill,
            confidence, mentorship, and work students can proudly present.
          </SectionIntro>

          <div className="pa-trust-grid" data-stagger>
            {trustMetrics.map((metric) => (
              <article className="pa-trust-card" key={metric.label} data-stagger-item>
                <strong data-counter={metric.value} data-suffix={metric.suffix}>
                  0{metric.suffix}
                </strong>
                <p>{metric.label}</p>
              </article>
            ))}
          </div>

          <div className="pa-trust-marquee" aria-label="Academy strengths">
            <div>
              {[
                "Mentor reviews",
                "Project sprints",
                "Hackathon culture",
                "Portfolio building",
                "Career support",
                "Practical curriculum",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div aria-hidden="true">
              {[
                "Mentor reviews",
                "Project sprints",
                "Hackathon culture",
                "Portfolio building",
                "Career support",
                "Practical curriculum",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pa-section pa-program-showcase">
        <div className="pa-container">
          <SectionIntro eyebrow="Programs" title="Choose the track that fits your next move.">
            Each pathway is built for useful skills, clear milestones, and a
            premium learning rhythm that keeps students moving.
          </SectionIntro>

          <div className="pa-program-marquee" aria-label="Program showcase marquee">
            <div className="pa-program-track-loop">
              {programs.map((program, index) => (
                <TiltCard className="pa-program-card pa-program-card--premium" key={`program-a-${program.title}`}>
                  <div className="pa-card-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="pa-card-icon">{program.label}</div>
                  <h3>{program.title}</h3>
                  <p>{program.detail}</p>
                  <div className="pa-card-meta">
                    <span>{program.meta}</span>
                    <Link to="/curriculum">View curriculum</Link>
                  </div>
                </TiltCard>
              ))}
            </div>
            <div className="pa-program-track-loop" aria-hidden="true">
              {programs.map((program, index) => (
                <TiltCard className="pa-program-card pa-program-card--premium" key={`program-b-${program.title}`}>
                  <div className="pa-card-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="pa-card-icon">{program.label}</div>
                  <h3>{program.title}</h3>
                  <p>{program.detail}</p>
                  <div className="pa-card-meta">
                    <span>{program.meta}</span>
                    <Link to="/curriculum">View curriculum</Link>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pa-section pa-why-section">
        <div className="pa-container pa-why-grid">
          <div className="pa-why-sticky" data-cinematic>
            <p className="pa-eyebrow">Why PlusAcademy</p>
            <h2>Learning that feels structured, alive, and built for the real world.</h2>
            <p>
              The journey is designed to help students understand, practice,
              build, present, and grow with support at every major step.
            </p>
            <div className="pa-why-signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="pa-why-story">
            {whyCards.map((card, index) => (
              <article className="pa-why-card" key={card.title} style={{ "--story-index": index }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pa-section pa-community-section">
        <div className="pa-container pa-community-grid">
          <div className="pa-lab-visual" data-cinematic>
            <img src={labImage} alt="PlusAcademy digital learning ecosystem visual" loading="lazy" />
            <div>
              <span>Innovation lab</span>
              <strong>Projects, demos, and product thinking in motion.</strong>
            </div>
          </div>

          <div>
            <SectionIntro eyebrow="Hackathons and Community" title="A learning culture that does not sit still.">
              Students learn faster when the room has energy, deadlines,
              teammates, demos, and people who care about the next iteration.
            </SectionIntro>

            <div className="pa-event-list" data-stagger>
              {events.map((event) => (
                <article className="pa-event-card" key={event.title} data-stagger-item>
                  <span>{event.date}</span>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pa-section pa-final-cta">
        <div className="pa-container">
          <div className="pa-final-cta__inner pa-final-cta__inner--premium" data-cinematic>
            <p className="pa-eyebrow">Your Next Move</p>
            <h2>Start building the proof your future deserves.</h2>
            <p>
              Join PlusAcademy and turn curiosity into technical confidence,
              portfolio strength, career readiness, and momentum you can feel.
            </p>
            <div>
              <MagneticButton to="/getstarted">Apply to PlusAcademy</MagneticButton>
              <MagneticButton to="/contact" variant="secondary">
                Talk to an Advisor
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlusAcademyLanding;
