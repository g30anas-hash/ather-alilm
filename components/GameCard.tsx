"use client";

import { cn } from "@/lib/utils";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  action?: React.ReactNode;
  headerIcon?: React.ReactNode;
}

export default function GameCard({ title, children, className, action, headerIcon, onClick }: GameCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
      "relative p-6 rounded-xl transition-all duration-300 group",
      // Base styles: Dark wood/glass fantasy theme instead of light paper
      "bg-[#1E120A]/80 backdrop-blur-sm border-2 border-[#DAA520]", 
      "shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
      "hover:shadow-[0_8px_30px_rgba(218,165,32,0.1)] hover:border-[#DAA520]",
      className
    )}>
      {/* Corner Ornaments - Minimal & Clean */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#DAA520]/50 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#DAA520]/50 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#DAA520]/50 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#DAA520]/50 rounded-br-lg pointer-events-none" />

      {/* Header */}

      {title && (
        <div className="bg-[#5D4037] text-[#FFD700] py-2 px-6 text-center border-b-4 border-[#8B4513] relative z-20">
          <h2 className="text-xl font-bold font-[family-name:var(--font-amiri)]">{title}</h2>
        </div>
      )}
      
      <div className="p-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
