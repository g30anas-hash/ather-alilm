"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, UserCircle } from "lucide-react";
import GoldButton from "./GoldButton";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { name, role, updateName } = useUser();
  const { showToast } = useToast();
  const [newName, setNewName] = useState(name);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateName(newName);
      showToast("تم تحديث الملف الشخصي بنجاح", "success");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(218,165,32,0.3)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[#F4E4BC] hover:text-[#FF6B6B] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto bg-[#DAA520]/20 rounded-full flex items-center justify-center border-2 border-[#DAA520] mb-4 relative group cursor-pointer">
                <UserCircle className="w-16 h-16 text-[#FFD700]" />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs text-white">تغيير الصورة</span>
                </div>
              </div>
              <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">الملف الشخصي</h2>
              <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-scheherazade)]">
                {role === 'student' && "طالب مغامر"}
                {role === 'teacher' && "معلم حكيم"}
                {role === 'leader' && "قائد ملهم"}
                {role === 'parent' && "ولي أمر داعم"}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)] text-sm">الاسم الظاهر</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAA520]" />
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg py-3 pr-10 pl-4 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors"
                    placeholder="اكتب اسمك هنا"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-3 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors font-[family-name:var(--font-cairo)]"
                >
                  إلغاء
                </button>
                <GoldButton type="submit" className="flex-1">
                  <Save className="w-4 h-4 ml-2 inline" />
                  حفظ
                </GoldButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
