import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/models", label: "Models" },
  { to: "/research", label: "Research" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/skills", label: "Skills" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="nav-shell">
      <motion.div
        className="nav-inner"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <NavLink to="/" className="nav-brand">
          <span className="nav-brand-mark" />
          Samyak Kumar
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
