import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import MagneticButton from "./Immersive/MagneticButton";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Hackathons", to: "/hackathons" },
  { label: "Curriculum", to: "/curriculum" },
  { label: "Alumni", to: "/alumni" },
  { label: "Contact", to: "/contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`immersive-nav ${isScrolled ? "immersive-nav--scrolled" : ""}`}>
      <div className="h-[-500px]  immersive-nav__shell">
        <div className="immersive-nav__inner">
          <Link to="/" className="immersive-nav__brand-link" aria-label="PlusAcademy home">
            <BrandLogo className="immersive-nav__logo" />
          </Link>

          <nav className="hidden md:block">
            <ul className="immersive-nav__list">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`immersive-nav__link ${
                      location.pathname === to ? "immersive-nav__link--active" : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <MagneticButton to="/getstarted" className="immersive-nav__cta">
                  Get Started
                </MagneticButton>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="immersive-menu-button md:hidden"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close mobile menu overlay"
        onClick={() => setIsMenuOpen(false)}
        className={`immersive-mobile-backdrop md:hidden ${
          isMenuOpen ? "immersive-mobile-backdrop--open" : ""
        }`}
      />

      <nav
        id="mobile-navigation"
        className={`immersive-mobile-nav md:hidden ${
          isMenuOpen ? "immersive-mobile-nav--open" : ""
        }`}
      >
        <div className="immersive-mobile-nav__header">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
            className="immersive-mobile-nav__close"
          >
            <span aria-hidden="true">×</span>
          </button>
          <Link
            to="/"
            onClick={handleNavClick}
            className="immersive-mobile-nav__brand"
            aria-label="PlusAcademy home"
          >
            <BrandLogo className="immersive-mobile-nav__logo" />
          </Link>
          <span className="immersive-mobile-nav__header-spacer" aria-hidden="true" />
        </div>

        <ul className="flex flex-col px-5 py-4 text-sm font-medium">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-md px-4 py-3 transition-colors"
              >
                <span>{label}</span>
                <span aria-hidden="true">/</span>
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <Link
              to="/getstarted"
              onClick={handleNavClick}
              className="immersive-mobile-nav__cta"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
