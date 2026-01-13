"use client";

import { cn } from "@/lib/utils";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export default function GameCard({ children, className, title, onClick }: GameCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative bg-[#F4E4BC] border-4 border-[#8B4513] rounded-xl shadow-2xl overflow-hidden",
        "before:absolute before:inset-0 before:border-2 before:border-[#DAA520] before:rounded-lg before:pointer-events-none",
        className
      )}
    >
      {/* Corner Ornaments */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#DAA520] rounded-tl-lg z-10" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#DAA520] rounded-tr-lg z-10" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#DAA520] rounded-bl-lg z-10" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#DAA520] rounded-br-lg z-10" />

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
