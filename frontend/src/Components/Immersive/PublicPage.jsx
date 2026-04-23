import { useRef } from "react";
import { useCinematicReveal } from "./useCinematicReveal";

function PublicPage({ children, className = "" }) {
  const scopeRef = useRef(null);
  useCinematicReveal(scopeRef);

  return (
    <main ref={scopeRef} className={`public-experience ${className}`.trim()}>
      {children}
    </main>
  );
}

export default PublicPage;
