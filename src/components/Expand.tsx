import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export function Expand({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidde p-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
