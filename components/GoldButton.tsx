"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoldButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function GoldButton({ 
  children, 
  className, 
  variant = "primary",
  fullWidth = false,
  ...props 
}: GoldButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(218, 165, 32, 0.6)" }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300",
        "border-2 border-[#DAA520] shadow-lg cursor-pointer",
        "font-[family-name:var(--font-amiri)]",
        variant === "primary" 
          ? "bg-gradient-to-b from-[#FFD700] to-[#B8860B] text-[#2A1B0E]" 
          : "bg-[#2A1B0E] text-[#FFD700] border-[#B8860B]",
        fullWidth ? "w-full" : "w-auto",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Shine effect overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.button>
  );
}
