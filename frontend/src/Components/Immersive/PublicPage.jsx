import { useRef } from "react";
import { useCinematicReveal } from "./useCinematicReveal";

function PublicPage({ children, className = "", enableReveal = true }) {
  const scopeRef = useRef(null);
  useCinematicReveal(scopeRef, enableReveal);

  return (
    <main ref={scopeRef} className={`public-experience ${className}`.trim()}>
      {children}
    </main>
  );
}

export default PublicPage;
