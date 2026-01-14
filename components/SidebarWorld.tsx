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
  LogOut,
  BookOpen,
  Trophy,
  FileText,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser, UserRole } from "@/context/UserContext";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles: UserRole[];
  checkActive?: (pathname: string, searchParams: URLSearchParams) => boolean;
}

export default function SidebarWorld() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, logout, name, level } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const allItems: SidebarItem[] = [
    // Student specific
    { 
      icon: <Landmark className="w-5 h-5" />, 
      label: "بوابة المدينة", 
      href: "/student-city", 
      roles: ['student'],
      checkActive: (p, s) => p === "/student-city" && !s.get('view')
    },
    { 
      icon: <BookOpen className="w-5 h-5" />, 
      label: "سجل الحصص", 
      href: "/student-city?view=lessons", 
      roles: ['student'],
      checkActive: (p, s) => p === "/student-city" && s.get('view') === 'lessons'
    },
    { icon: <ScrollText className="w-5 h-5" />, label: "خرائط المعرفة", href: "/knowledge-maps", roles: ['student'] },
    { 
      icon: <MapIcon className="w-5 h-5" />, 
      label: "خريطة الأسبوع", 
      href: "/student-city?view=planning", 
      roles: ['student'],
      checkActive: (p, s) => p === "/student-city" && s.get('view') === 'planning'
    },
    { icon: <Sword className="w-5 h-5" />, label: "تحديات الرحلة", href: "/teacher-hall", roles: ['student'] },
    { icon: <Gem className="w-5 h-5" />, label: "الكنوز والمكافآت", href: "/treasures", roles: ['student'] },
    { icon: <Shield className="w-5 h-5" />, label: "برج الحكمة", href: "/wisdom-tower", roles: ['student'] },
    { 
      icon: <Mail className="w-5 h-5" />, 
      label: "رسائل الحكام", 
      href: "/student-city?view=messages", 
      roles: ['student'],
      checkActive: (p, s) => p === "/student-city" && s.get('view') === 'messages'
    },
    
    // Teacher specific
    { icon: <GraduationCap className="w-5 h-5" />, label: "قصر المعلمين", href: "/teacher-hall", roles: ['teacher'] },
    { icon: <BookOpen className="w-5 h-5" />, label: "سجل الحصة", href: "/teacher-hall?view=lessons", roles: ['teacher'], checkActive: (p, s) => p === "/teacher-hall" && s.get('view') === 'lessons' },
    { icon: <Trophy className="w-5 h-5" />, label: "لوحة الشرف", href: "/teacher-hall?view=leaderboard", roles: ['teacher', 'leader'], checkActive: (p, s) => p === "/teacher-hall" && s.get('view') === 'leaderboard' },
    { icon: <Mail className="w-5 h-5" />, label: "الحمام الزاجل", href: "/teacher-hall?view=messages", roles: ['teacher'] },

    // Leader specific
    { icon: <Home className="w-5 h-5" />, label: "بوابة القصر", href: "/leadership-palace", roles: ['leader'] },
    { icon: <Users className="w-5 h-5" />, label: "سجل المواطنين", href: "/leadership-palace", roles: ['leader'] },
    { icon: <FileText className="w-5 h-5" />, label: "المتابعة الذكية", href: "/leadership-palace?view=engagement", roles: ['leader'], checkActive: (p, s) => p === "/leadership-palace" && s.get('view') === 'engagement' },
    { icon: <Settings className="w-5 h-5" />, label: "إعدادات القصر", href: "/leadership-palace?view=settings", roles: ['leader'], checkActive: (p, s) => p === "/leadership-palace" && s.get('view') === 'settings' },

    // Parent specific
    { icon: <Users className="w-5 h-5" />, label: "المرصد", href: "/parent-observatory", roles: ['parent'] },
    { icon: <BookOpen className="w-5 h-5" />, label: "سجل الحصص", href: "/parent-observatory?view=lessons", roles: ['parent'], checkActive: (p, s) => p === "/parent-observatory" && s.get('view') === 'lessons' },

    // Shared
    { icon: <MapIcon className="w-5 h-5" />, label: "عقل أثير", href: "/ather-mind", roles: ['student', 'teacher', 'leader', 'parent'] },
  ];

  const visibleItems = allItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="w-80 h-full p-6 relative z-50">
      <div className="h-full flex flex-col relative">
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-[#1E120A]/90 backdrop-blur-xl rounded-[2rem] border border-[#DAA520]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#DAA520]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000] to-transparent" />
        </div>

        {/* Profile Section - Top */}
        <div className="relative z-10 pt-8 pb-6 px-4 text-center border-b border-[#DAA520]/10 mx-4 mb-2">
            <div className="relative inline-block mb-4 group cursor-pointer">
                <div className="absolute inset-0 bg-[#DAA520] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="w-20 h-20 rounded-full bg-[#2A1B0E] border-2 border-[#DAA520] p-1 relative z-10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-[#DAA520] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover bg-center" />
                    </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#DAA520] text-[#1E120A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2A1B0E] shadow-sm whitespace-nowrap">
                    Lv. {level || 5}
                </div>
            </div>
            <h2 className="text-xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold tracking-wide">{name || "زائر"}</h2>
            <p className="text-[#DAA520]/60 text-xs mt-1">
                {role === 'student' && "مغامر طموح"}
                {role === 'teacher' && "معلم حكيم"}
                {role === 'leader' && "قائد ملهم"}
                {role === 'parent' && "ولي أمر داعم"}
            </p>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-2 custom-scrollbar relative z-10">
            {visibleItems.map((item, idx) => {
              const isActive = item.checkActive 
                ? item.checkActive(pathname, searchParams)
                : pathname === item.href;
                
              return (
                <Link key={idx} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        isActive 
                            ? "text-[#1E120A]" 
                            : "text-[#F4E4BC]/70 hover:text-[#FFD700]"
                    )}
                  >
                    {/* Active Background */}
                    {isActive && (
                        <motion.div 
                            layoutId="activeTabBgSidebar"
                            className="absolute inset-0 bg-gradient-to-r from-[#DAA520] to-[#F4E4BC] rounded-xl z-0"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    
                    {/* Hover Effect */}
                    {!isActive && (
                        <div className="absolute inset-0 bg-[#DAA520]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-0" />
                    )}

                    <span className={cn(
                        "relative z-10 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-[#1E120A]" : "text-[#DAA520]"
                    )}>
                        {item.icon}
                    </span>
                    <span className={cn(
                        "relative z-10 font-bold text-sm transition-all duration-300 font-[family-name:var(--font-cairo)]",
                        isActive ? "translate-x-1" : "group-hover:translate-x-1"
                    )}>
                        {item.label}
                    </span>
                    
                    {/* Active Indicator Dot */}
                    {isActive && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="absolute left-4 w-2 h-2 bg-[#1E120A] rounded-full z-10"
                        />
                    )}
                  </motion.div>
                </Link>
              );
            })}
        </div>

        {/* Decorative Bottom */}
        <div className="mt-auto p-4 border-t border-[#DAA520]/10 text-center relative z-10">
          <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:shadow-[0_0_20px_rgba(255,107,107,0.1)] transition-all duration-300 border border-[#FF6B6B]/20 group bg-[#000]/20"
          >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm font-[family-name:var(--font-cairo)]">تسجيل الخروج</span>
          </button>
          <p className="text-[#DAA520]/30 text-[10px] mt-4 font-[family-name:var(--font-scheherazade)]">
            أثير العلم v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
