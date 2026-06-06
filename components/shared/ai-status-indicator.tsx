"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProcessingStore } from "@/store/project-store";

export function AiStatusIndicator() {
  const isProcessing = useProcessingStore((s) => s.isProcessing);
  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed top-0 inset-x-0 z-[60] h-[3px] overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--brand-blue)] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
