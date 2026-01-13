"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  Map as MapIcon, 
  Scroll, 
  Shield, 
  Star, 
  Users, 
  Crown, 
  GraduationCap, 
  Sword, 
  Gem, 
  Mail, 
  Landmark, 
  ScrollText,
  Home,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserRole } from "@/context/UserContext";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles: UserRole[];
}

export default function SidebarWorld() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const allItems: SidebarItem[] = [
    // Student specific
    { icon: <Landmark className="w-5 h-5" />, label: "بوابة المدينة", href: "/student-city", roles: ['student'] },
    { icon: <ScrollText className="w-5 h-5" />, label: "خرائط المعرفة", href: "/knowledge-maps", roles: ['student'] },
    { icon: <MapIcon className="w-5 h-5" />, label: "خريطة الأسبوع", href: "/student-city?view=planning", roles: ['student'] },
    { icon: <Sword className="w-5 h-5" />, label: "تحديات الرحلة", href: "/teacher-hall", roles: ['student'] },
    { icon: <Gem className="w-5 h-5" />, label: "الكنوز والمكافآت", href: "/treasures", roles: ['student'] },
    { icon: <Shield className="w-5 h-5" />, label: "برج الحكمة", href: "/wisdom-tower", roles: ['student'] },
    { icon: <Mail className="w-5 h-5" />, label: "رسائل الحكام", href: "/student-city?view=messages", roles: ['student'] },
    
    // Teacher specific
    { icon: <GraduationCap className="w-5 h-5" />, label: "قصر المعلمين", href: "/teacher-hall", roles: ['teacher'] },
    // { icon: <Scroll className="w-5 h-5" />, label: "المهام", href: "/quests", roles: ['teacher'] },

    // Leader specific
    { icon: <Home className="w-5 h-5" />, label: "بوابة القصر", href: "/leadership-palace", roles: ['leader'] },
    { icon: <Users className="w-5 h-5" />, label: "سجل المواطنين", href: "/leadership-palace", roles: ['leader'] },
    // { icon: <Scroll className="w-5 h-5" />, label: "المهام", href: "/quests", roles: ['leader'] },

    // Parent specific
    { icon: <Users className="w-5 h-5" />, label: "المرصد", href: "/parent-observatory", roles: ['parent'] },

    // Shared
    { icon: <MapIcon className="w-5 h-5" />, label: "عقل أثير", href: "/ather-mind", roles: ['student', 'teacher', 'leader', 'parent'] },
  ];

  const visibleItems = allItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="w-64 bg-[#2A1B0E]/95 border-l-4 border-[#8B4513] h-full p-4 flex flex-col relative overflow-hidden">
      {/* Decorative Top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B4513] via-[#DAA520] to-[#8B4513]" />
      
      <div className="mb-8 text-center">
        <h3 className="text-[#FFD700] text-2xl font-[family-name:var(--font-amiri)] border-b-2 border-[#5D4037] pb-2">
          أثير العلم
        </h3>
        <p className="text-[#F4E4BC]/60 text-sm mt-2 font-[family-name:var(--font-scheherazade)]">
          {role === 'student' && "بوابة الطالب"}
          {role === 'teacher' && "بوابة المعلم"}
          {role === 'leader' && "بوابة القيادة"}
          {role === 'parent' && "بوابة ولي الأمر"}
        </p>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {visibleItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 mb-2",
                  "hover:bg-[#5D4037]/50 hover:border-r-4 hover:border-[#DAA520]",
                  isActive ? "bg-[#5D4037] border-r-4 border-[#FFD700]" : "border-r-4 border-transparent"
                )}
              >
                <span className={cn("text-[#F4E4BC]", isActive ? "text-[#FFD700]" : "")}>
                  {item.icon}
                </span>
                <span className={cn(
                  "font-[family-name:var(--font-cairo)] text-lg",
                  isActive ? "text-[#FFD700] font-bold" : "text-[#F4E4BC]"
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Decorative Bottom */}
      <div className="mt-auto pt-4 border-t border-[#5D4037] text-center">
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-300 mb-2"
        >
            <LogOut className="w-4 h-4" />
            <span className="font-[family-name:var(--font-cairo)]">تسجيل الخروج</span>
        </button>
        <p className="text-[#8B4513] text-sm font-[family-name:var(--font-scheherazade)]">
          أثير العلم v1.0
        </p>
      </div>
    </div>
  );
}
