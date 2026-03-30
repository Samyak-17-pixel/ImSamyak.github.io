import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { home } from "@/content/home";

export function Home() {
  return (
    <div className="hero hero--dashboard">
      <motion.div
        className="hero-grid hero-grid--single"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-col hero-col--left">
          <span className="hero-badge">
            <span className="nav-brand-mark" style={{ width: 8, height: 8 }} />
            {home.badge}
          </span>
          <h1>{home.title}</h1>
          <div className="hero-subline">{home.subtitle}</div>
          <div className="hero-identity">{home.identityLine}</div>
          <p className="hero-lead">{home.lead}</p>

          <div className="panel panel--hud" style={{ marginTop: 18 }}>
            <h2 className="section-title">Mission highlights</h2>
            <ul className="prose">
              {home.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="panel panel--soft" style={{ marginTop: 14 }}>
            <h2 className="section-title">Professional summary</h2>
            <div className="prose">
              <p>{home.summary}</p>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/models">
              Open AUV models
            </Link>
            <Link className="btn btn-ghost" to="/research">
              Research
            </Link>
            <Link className="btn btn-ghost" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
