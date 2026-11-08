import { motion } from "framer-motion";

/** Route-change flourish: a single sonar ping ring sweeping out from the centre. */
export function SonarWipe() {
  return (
    <motion.div
      className="sonar-wipe"
      aria-hidden
      initial={{ scale: 0.05, opacity: 0.9 }}
      animate={{ scale: 3.2, opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
