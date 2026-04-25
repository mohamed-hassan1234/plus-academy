import { Suspense, lazy, useEffect, useState } from "react";
import plusLogo from "../../assets/plusacademy logo.jpeg";

const PlusAcademyLandingSections = lazy(() => import("./PlusAcademyLandingSections"));

const courseChips = [
  { title: "Full Stack Development" },
  { title: "Mobile App Development" },
  { title: "IoT" },
  { title: "Cybersecurity" },
  { title: "UI/UX" },
  { title: "Real Projects" },
  { title: "Career Growth" },
  { title: "Mentorship" },
];

function splitLabel(title) {
  const words = title.split(" ");

  if (words.length <= 2) {
    return [title];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function getOrbitPosition(index, total, radius) {
  const startAngle = -90;
  const angle = startAngle + (index * 360) / total;

  return {
    angle: `${angle}deg`,
    angleNeg: `${angle * -1}deg`,
    radius: `${radius}rem`,
  };
}

const heroOrbitItems = courseChips.map((chip, index) => ({
  ...chip,
  desktop: getOrbitPosition(index, courseChips.length, 12.2),
  tablet: getOrbitPosition(index, courseChips.length, 8.7),
  mobile: getOrbitPosition(index, courseChips.length, 6.7),
}));

function PlusAcademyLanding() {
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    let timeoutId;
    let idleId;

    const queueSections = () => setShowSections(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(queueSections, { timeout: 360 });
    } else {
      timeoutId = window.setTimeout(queueSections, 140);
    }

    return () => {
      if (typeof window !== "undefined" && idleId) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="pa-home-lite">
      <section className="pa-hero pa-hero--premium pa-hero-lite" aria-label="PlusAcademy visual hero scene">
        <div className="pa-container pa-hero-lite__layout">
          <div className="pa-hero-lite__frame">
            <div className="pa-hero-lite__background" aria-hidden="true">
              <span className="pa-hero-lite__wash" />
              <span className="pa-hero-lite__ring pa-hero-lite__ring--outer" />
              <span className="pa-hero-lite__ring pa-hero-lite__ring--middle" />
              <span className="pa-hero-lite__ring pa-hero-lite__ring--inner" />
            </div>

            <div className="pa-hero-lite__orbit" aria-label="PlusAcademy course pillars">
              <div className="pa-hero-lite__orbit-track">
                {heroOrbitItems.map((chip, index) => (
                  <div
                    key={chip.title}
                    className="pa-hero-lite__orbit-node"
                    style={{
                      "--desktop-angle": chip.desktop.angle,
                      "--desktop-angle-neg": chip.desktop.angleNeg,
                      "--desktop-radius": chip.desktop.radius,
                      "--tablet-angle": chip.tablet.angle,
                      "--tablet-angle-neg": chip.tablet.angleNeg,
                      "--tablet-radius": chip.tablet.radius,
                      "--mobile-angle": chip.mobile.angle,
                      "--mobile-angle-neg": chip.mobile.angleNeg,
                      "--mobile-radius": chip.mobile.radius,
                      "--chip-delay": `${0.12 + index * 0.06}s`,
                    }}
                  >
                    <div className="pa-hero-lite__chip-shell">
                      <article
                        className="pa-hero-lite__chip"
                        style={{
                          "--desktop-angle-neg": chip.desktop.angleNeg,
                          "--tablet-angle-neg": chip.tablet.angleNeg,
                          "--mobile-angle-neg": chip.mobile.angleNeg,
                        }}
                      >
                        <strong aria-label={chip.title}>
                          {splitLabel(chip.title).map((line) => (
                            <span key={`${chip.title}-${line}`}>{line}</span>
                          ))}
                        </strong>
                      </article>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pa-hero-lite__logo-wrap">
              <span className="pa-hero-lite__logo-halo" aria-hidden="true" />
              <div className="pa-hero-lite__logo-card" role="img" aria-label="PlusAcademy centered logo">
                <img src={plusLogo} alt="PlusAcademy" loading="eager" decoding="async" />
              </div>
            </div>
          </div>
        </div>

        <a className="pa-scroll-cue" href="#academy-trust" aria-label="Scroll to academy outcomes">
          <span />
          See the outcomes
        </a>
      </section>

      {showSections ? (
        <Suspense fallback={<div className="pa-home-sections-placeholder" aria-hidden="true" />}>
          <PlusAcademyLandingSections />
        </Suspense>
      ) : (
        <div className="pa-home-sections-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

export default PlusAcademyLanding;
