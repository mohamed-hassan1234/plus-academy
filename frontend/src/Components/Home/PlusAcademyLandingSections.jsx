import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import labImage from "../../assets/plus-academy-innovation-lab.svg";
import MagneticButton from "../Immersive/MagneticButton";
import TiltCard from "../Immersive/TiltCard";

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

const strengths = [
  "Mentor reviews",
  "Project sprints",
  "Hackathon culture",
  "Portfolio building",
  "Career support",
  "Practical curriculum",
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

function SectionIntro({ eyebrow, title, children, centered = false }) {
  return (
    <div className={`pa-section-intro ${centered ? "pa-section-intro--center" : ""}`}>
      <p className="pa-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

function MetricCard({ value, suffix, label }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    let frameId = 0;
    let hasAnimated = false;

    const animate = () => {
      const start = performance.now();
      const duration = 900;

      const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      frameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) {
          return;
        }

        hasAnimated = true;
        observer.disconnect();
        animate();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <article ref={ref} className="pa-trust-card">
      <strong>
        {displayValue}
        {suffix}
      </strong>
      <p>{label}</p>
    </article>
  );
}

function PlusAcademyLandingSections() {
  return (
    <>
      <section id="academy-trust" className="pa-section pa-trust-section">
        <div className="pa-container">
          <SectionIntro
            eyebrow="Trusted Learning Momentum"
            title="A serious academy for learners who want visible progress."
            centered
          >
            Every part of PlusAcademy is shaped around practical skill, confidence, mentorship,
            and work students can proudly present.
          </SectionIntro>

          <div className="pa-trust-grid">
            {trustMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="pa-trust-list" aria-label="Academy strengths">
            {strengths.map((item) => (
              <span key={item} className="pa-trust-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pa-section pa-program-showcase">
        <div className="pa-container">
          <SectionIntro eyebrow="Programs" title="Choose the track that fits your next move.">
            Each pathway is built for useful skills, clear milestones, and a premium learning
            rhythm that keeps students moving.
          </SectionIntro>

          <div className="pa-stack-grid">
            {programs.map((program, index) => (
              <TiltCard className="pa-program-card pa-program-card--premium" key={program.title}>
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
      </section>

      <section className="pa-section pa-why-section">
        <div className="pa-container pa-why-grid">
          <div className="pa-why-sticky">
            <p className="pa-eyebrow">Why PlusAcademy</p>
            <h2>Learning that feels structured, alive, and built for the real world.</h2>
            <p>
              The journey is designed to help students understand, practice, build, present, and
              grow with support at every major step.
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
          <div className="pa-lab-visual">
            <img src={labImage} alt="PlusAcademy digital learning ecosystem visual" loading="lazy" />
            <div>
              <span>Innovation lab</span>
              <strong>Projects, demos, and product thinking in motion.</strong>
            </div>
          </div>

          <div>
            <SectionIntro eyebrow="Hackathons and Community" title="A learning culture that does not sit still.">
              Students learn faster when the room has energy, deadlines, teammates, demos, and
              people who care about the next iteration.
            </SectionIntro>

            <div className="pa-event-list">
              {events.map((event) => (
                <article className="pa-event-card" key={event.title}>
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
          <div className="pa-final-cta__inner pa-final-cta__inner--premium">
            <p className="pa-eyebrow">Your Next Move</p>
            <h2>Start building the proof your future deserves.</h2>
            <p>
              Join PlusAcademy and turn curiosity into technical confidence, portfolio strength,
              career readiness, and momentum you can feel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton to="/getstarted">Apply to PlusAcademy</MagneticButton>
              <MagneticButton to="/contact" variant="secondary">
                Talk to an Advisor
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlusAcademyLandingSections;
