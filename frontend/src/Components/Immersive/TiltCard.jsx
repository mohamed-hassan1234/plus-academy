function TiltCard({ className = "", children, ...props }) {
  return (
    <article
      className={`immersive-card ${className}`.trim()}
      {...props}
    >
      {children}
    </article>
  );
}

export default TiltCard;
