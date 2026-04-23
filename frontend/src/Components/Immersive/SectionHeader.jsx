function SectionHeader({ eyebrow, title, children, align = "center", className = "" }) {
  return (
    <div
      data-cinematic
      className={`section-header section-header--${align} ${className}`.trim()}
    >
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {children ? <p className="section-copy">{children}</p> : null}
    </div>
  );
}

export default SectionHeader;
