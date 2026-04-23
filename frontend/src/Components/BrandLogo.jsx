import plusAcademyLogo from "../assets/plusacademy logo.jpeg";

function BrandLogo({ className = "" }) {
  return (
    <span
      className={`brand-logo brand-logo--image ${className}`.trim()}
      aria-label="PlusAcademy"
    >
      <img src={plusAcademyLogo} alt="PlusAcademy" className="brand-logo__image" />
    </span>
  );
}

export default BrandLogo;
