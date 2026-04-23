import { Link } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";

function MagneticButton({
  children,
  to,
  href,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const ref = useRef(null);
  const Component = to ? Link : href ? "a" : "button";
  const navigationProps = to ? { to } : href ? { href } : { type };

  const handlePointerMove = (event) => {
    if (disabled || !ref.current) {
      return;
    }

    const bounds = ref.current.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    gsap.to(ref.current, {
      x: x * 0.16,
      y: y * 0.2,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handlePointerLeave = () => {
    if (!ref.current) {
      return;
    }

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.35)",
    });
  };

  return (
    <Component
      ref={ref}
      className={`immersive-button immersive-button--${variant} ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      disabled={disabled}
      {...navigationProps}
      {...props}
    >
      <span className="immersive-button__shine" aria-hidden="true" />
      <span className="immersive-button__content">{children}</span>
    </Component>
  );
}

export default MagneticButton;
