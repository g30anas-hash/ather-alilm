"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Star, Shield, Scroll, Map, CheckCircle2, Users, Landmark, Sword, Gem, Mail, ScrollText, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const items: NavItem[] = [
  { icon: <Landmark className="w-6 h-6" />, label: "بوابة المدينة", href: "/student-city" },
  { icon: <ScrollText className="w-6 h-6" />, label: "خرائط المعرفة", href: "/knowledge-maps" },
  { icon: <Sword className="w-6 h-6" />, label: "تحديات الرحلة", href: "/teacher-hall" },
  { icon: <Gem className="w-6 h-6" />, label: "الكنوز", href: "/treasures" },
  { icon: <Shield className="w-6 h-6" />, label: "برج الحكمة", href: "/wisdom-tower" },
  { icon: <Mail className="w-6 h-6" />, label: "رسائل الحكام", href: "#" },
  { icon: <Map className="w-6 h-6" />, label: "عقل أثير", href: "/ather-mind" },
  { icon: <Home className="w-6 h-6" />, label: "بوابة القصر", href: "/leadership-palace" },
  { icon: <Users className="w-6 h-6" />, label: "المرصد", href: "/parent-observatory" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/gate');
  };

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-[#2A1B0E]/90 border-2 border-[#DAA520] p-2 rounded-lg text-[#FFD700] shadow-lg backdrop-blur-sm"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-[#2A1B0E] border-l-4 border-[#DAA520] z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-[#5D4037] pb-4">
                <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                  أثير العلم
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#F4E4BC] hover:text-[#FF6B6B] transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto">
                {items.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-[#DAA520]/20 text-[#FFD700] border-r-4 border-[#FFD700]"
                          : "text-[#F4E4BC] hover:bg-[#5D4037]/30"
                      )}
                    >
                      <span className={isActive ? "text-[#FFD700]" : "text-[#F4E4BC]/80"}>
                        {item.icon}
                      </span>
                      <span className="text-xl font-[family-name:var(--font-cairo)]">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-300 mt-4 border border-[#FF6B6B]/20"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="text-xl font-[family-name:var(--font-cairo)]">تسجيل الخروج</span>
                </button>
              </nav>

              <div className="mt-auto pt-6 border-t border-[#5D4037]">
                <p className="text-center text-[#8B4513] font-[family-name:var(--font-scheherazade)]">
                  رحلة العلم لا تنتهي
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
