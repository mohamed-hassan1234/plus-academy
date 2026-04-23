import { lazy, Suspense } from "react";
import MagneticButton from "../Immersive/MagneticButton";

const AcademyScene = lazy(() => import("../Immersive/AcademyScene"));

const heroStats = [
  ["500+", "Tech professionals trained"],
  ["9", "Specialized tech programs"],
  ["15", "Tech events"],
];

function HeroSection() {
  return (
    <section className="plus-hero" aria-labelledby="plus-home-title">
      <div className="plus-hero__scene" aria-hidden="true">
        <Suspense fallback={<div className="plus-hero__scene-fallback" />}>
          <AcademyScene className="academy-scene--hero-background" variant="hero" />
        </Suspense>
      </div>

      <div className="plus-hero__motion-grid" aria-hidden="true" />

      <div className="plus-hero__grid">
        <div className="plus-hero__copy">
          <div className="plus-hero__kicker" data-cinematic>
            <span aria-hidden="true" />
            Become a job-ready developer
          </div>

          <h1 id="plus-home-title" className="plus-hero__title" data-cinematic>
            Empowering Future Leaders Through{" "}
            <strong data-text="Innovation">Innovation</strong>
          </h1>

          <p className="plus-hero__text" data-cinematic>
            A Future-Ready Learning Experience at PlusAcademy
          </p>

          <div className="plus-hero__actions" data-cinematic>
            <MagneticButton to="/curriculum">Explore Programs</MagneticButton>
            <MagneticButton to="/getstarted" variant="secondary">
              Apply Now
            </MagneticButton>
          </div>

          <div className="plus-hero__stats" data-stagger>
            {heroStats.map(([value, label]) => (
              <div key={label} className="plus-hero__stat" data-stagger-item>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
