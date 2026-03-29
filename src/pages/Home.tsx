import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { home } from "@/content/home";

export function Home() {
  return (
    <div className="hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-badge">
          <span className="nav-brand-mark" style={{ width: 8, height: 8 }} />
          {home.badge}
        </span>
        <h1>{home.title}</h1>
        <p className="hero-lead">{home.lead}</p>
        <div className="panel" style={{ marginTop: 22 }}>
          <h2 className="section-title">Professional summary</h2>
          <div className="prose">
            <p>{home.summary}</p>
          </div>
        </div>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/about">
            About me
          </Link>
          <Link className="btn btn-ghost" to="/research">
            Research
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Get in touch
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
