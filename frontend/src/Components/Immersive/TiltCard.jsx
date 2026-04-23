import { useRef } from "react";
import gsap from "gsap";

function TiltCard({ className = "", children, ...props }) {
  const ref = useRef(null);

  const handlePointerMove = (event) => {
    const card = ref.current;

    if (!card) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: y * -8,
      y: -8,
      duration: 0.45,
      ease: "power3.out",
      transformPerspective: 900,
      transformOrigin: "center",
    });
  };

  const handlePointerLeave = () => {
    if (!ref.current) {
      return;
    }

    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.65,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={ref}
      className={`immersive-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </article>
  );
}

export default TiltCard;
