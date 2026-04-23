import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCinematicReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray("[data-cinematic]").forEach((element) => {
        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 42,
            filter: "blur(14px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-stagger]").forEach((group) => {
        const children = group.querySelectorAll("[data-stagger-item]");

        if (!children.length) {
          return;
        }

        gsap.fromTo(
          children,
          {
            autoAlpha: 0,
            y: 28,
            rotateX: -8,
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-soft-parallax]").forEach((element) => {
        gsap.to(element, {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.35,
          },
        });
      });
    }, scope);

    return () => context.revert();
  }, [scopeRef]);
}
