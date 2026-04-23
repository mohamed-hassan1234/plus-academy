import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import BrandLogo from "./BrandLogo";
import MagneticButton from "./Immersive/MagneticButton";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Curriculum", to: "/curriculum" },
  { label: "Alumni", to: "/alumni" },
  { label: "Contact", to: "/contact" },
];

const services = [
  "Full-Stack Development",
  "Mobile App Development",
  "Internet of Things (IoT)",
  "Basic Computer Skills",
  "Digital Marketing",
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-cinematic
      className="immersive-footer"
    >
      <div className="immersive-footer__particles" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-4">
          <div className="space-y-5 md:col-span-2">
            <Link to="/" className="immersive-footer__brand" aria-label="PlusAcademy home">
              <BrandLogo className="immersive-footer__logo" />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
              PlusAcademy empowers the next generation of developers through
              hands-on, project-based bootcamps designed for real-world success.
            </p>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#4FFFEA]">
                  4+
                </span>
                <span className="text-xs font-medium uppercase text-white/50">
                  Courses
                </span>
              </div>
              <div className="h-6 w-px bg-white/15" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#4FFFEA]">
                  100+
                </span>
                <span className="text-xs font-medium uppercase text-white/50">
                  Alumni
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase text-[#4FFFEA]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-white/65 transition-colors hover:text-[#4FFFEA]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#4FFFEA] opacity-0 transition-opacity group-hover:opacity-100" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase text-[#4FFFEA]">
                Our Services
              </h3>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service}>
                    <Link
                      to="/curriculum"
                      className="group -mx-3 flex items-center gap-2.5 rounded-lg border-l-2 border-transparent px-3 py-1.5 text-sm text-white/65 transition-all duration-200 hover:border-[#4FFFEA] hover:bg-white/10 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A99D] transition-colors group-hover:bg-[#4FFFEA]" />
                      <span>{service}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase text-[#4FFFEA]">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="immersive-social"
                >
                  <FaInstagram className="text-lg" />
                </a>
                <a
                  href="#"
                  className="immersive-social"
                >
                  <FaFacebookF className="text-lg" />
                </a>
                <a
                  href="252614068829"
                  className="immersive-social"
                >
                  <FaWhatsapp className="text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-sm text-white/50">
              © {year} PlusAcademy. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-sm text-white/50 transition-colors hover:text-[#4FFFEA]">
                Privacy & Data Protection
              </a>
              <a href="#" className="text-sm text-white/50 transition-colors hover:text-[#4FFFEA]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <MagneticButton to="/getstarted" variant="ghost">
            Start learning with us
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
