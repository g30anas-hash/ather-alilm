import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FantasyModalProps {
  isOpen?: boolean; // For compatibility if passed
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export default function FantasyModal({ onClose, title, children, icon, className = "", maxWidth = "max-w-lg" }: FantasyModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-black/90 backdrop-blur-md"
         onClick={onClose}
      />
      
      <motion.div
         initial={{ scale: 0.95, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         exit={{ scale: 0.95, opacity: 0, y: 20 }}
         className={`relative z-50 w-full ${maxWidth} ${className} max-h-[90vh] flex flex-col`}
      >
         {/* Fantasy Frame Structure */}
         <div className="relative bg-[#1E120A] border-[3px] border-[#DAA520] rounded-lg shadow-[0_0_60px_rgba(218,165,32,0.2)] flex flex-col overflow-hidden max-h-full">
            {/* Inner Decorative Border */}
            <div className="absolute inset-1 border border-[#DAA520]/30 rounded-md pointer-events-none" />
            
            {/* Corner Ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#DAA520] rounded-tl-none z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#DAA520] rounded-tr-none z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#DAA520] rounded-bl-none z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#DAA520] rounded-br-none z-20 pointer-events-none" />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#DAA520]/5 via-transparent to-[#DAA520]/5 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
                {/* Header */}
                {(title || icon) && (
                    <div className="flex justify-between items-center mb-6 border-b border-[#DAA520]/30 pb-4 shrink-0">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="p-2 bg-[#DAA520]/10 rounded-full border border-[#DAA520] text-[#DAA520]">
                                    {icon}
                                </div>
                            )}
                            {title && (
                                <div className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold">
                                    {title}
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className="text-[#F4E4BC]/50 hover:text-[#FF6B6B] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
         </div>
      </motion.div>
    </div>
  );
}
