import { Link } from "react-router-dom";

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
  const Component = to ? Link : href ? "a" : "button";
  const navigationProps = to ? { to } : href ? { href } : { type };

  return (
    <Component
      className={`immersive-button immersive-button--${variant} ${className}`.trim()}
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
