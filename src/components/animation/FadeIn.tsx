"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export default function FadeIn({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
