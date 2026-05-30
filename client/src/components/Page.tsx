import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const Page = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);