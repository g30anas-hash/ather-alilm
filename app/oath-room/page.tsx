"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoldButton from "@/components/GoldButton";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Crown, Users, Mail, User as UserIcon, ArrowLeft, Shield, Sparkles, Lock, Scroll } from "lucide-react";
import { useUser, UserRole, UserData } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function OathRoomPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addUser } = useUser();
  const { showToast } = useToast();

  const roles = [
    { 
      id: 'student', 
      label: 'طالب مغامر', 
      icon: <GraduationCap className="w-8 h-8" />,
      desc: "ابدأ رحلتك التعليمية واجمع الأوسمة" 
    },
    { 
      id: 'teacher', 
      label: 'معلم حكيم', 
      icon: <User className="w-8 h-8" />,
      desc: "أنشئ المهام وقد طلابك نحو التميز" 
    },
    { 
      id: 'leader', 
      label: 'قائد ملهم', 
      icon: <Crown className="w-8 h-8" />,
      desc: "أدر المملكة وراقب تقدم الجميع" 
    },
    { 
      id: 'parent', 
      label: 'ولي أمر داعم', 
      icon: <Users className="w-8 h-8" />,
      desc: "تابع إنجازات أبطالك الصغار" 
    },
  ];

  const handleConfirm = async () => {
    if (!selectedRole && !isLogin) {
        showToast("الرجاء اختيار دور للمتابعة", "error");
        return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
        showToast("الرجاء إدخال البريد الإلكتروني وكلمة المرور", "error");
        return;
    }
    if (!isLogin && !formData.name.trim()) {
        showToast("الرجاء إدخال الاسم", "error");
        return;
    }

    setIsLoading(true);

    try {
        if (isLogin) {
            // Login
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            showToast("تم تسجيل الدخول بنجاح!", "success");
            
            // Fetch user role to redirect correctly
            const { data: userData } = await supabase.from('users').select('role').eq('email', formData.email).single();
            const role = userData?.role || 'student';
            
            setTimeout(() => {
                switch(role) {
                   case 'student': router.push("/student-city"); break;
                   case 'teacher': router.push("/teacher-hall"); break;
                   case 'leader': router.push("/leadership-palace"); break;
                   case 'parent': router.push("/parent-observatory"); break;
                   default: router.push("/student-city");
                }
            }, 1000);

        } else {
            // Sign Up (Now restricted to "Activation" only)
            
            // 1. Check if email exists in 'users' table (Pre-registered by Admin)
            const { data: existingProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('email', formData.email)
                .single();

            if (!existingProfile) {
                showToast("عذراً، هذا البريد غير مسجل في سجلات المملكة. يرجى مراجعة الإدارة لإنشاء ملف لك أولاً.", "error");
                setIsLoading(false);
                return;
            }

            // 2. If profile exists, proceed to create Auth account
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: selectedRole
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // 3. Update the existing profile with any missing details if needed
                // But mainly we just wanted to link Auth to this email.
                // We might want to ensure the role matches what Admin set vs what they selected?
                // Ideally we force the role from the DB.
                
                if (existingProfile.role !== selectedRole) {
                     showToast(`تنبيه: تم تسجيلك بصلاحية "${existingProfile.role}" حسب سجلات الإدارة.`, "info");
                }

                showToast("تم تفعيل حسابك بنجاح! جاري الدخول...", "success");

                 setTimeout(() => {
                    const finalRole = existingProfile.role; // Use the role from DB, not selection
                    switch(finalRole) {
                       case 'student': router.push("/student-city"); break;
                       case 'teacher': router.push("/teacher-hall"); break;
                       case 'leader': router.push("/leadership-palace"); break;
                       case 'parent': router.push("/parent-observatory"); break;
                       default: router.push("/student-city");
                    }
                }, 1000);
            }
        }
    } catch (error: any) {
        showToast(error.message || "حدث خطأ أثناء العملية", "error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center bg-[#050B14] overflow-hidden relative p-4 font-[family-name:var(--font-amiri)]">
        {/* Magical Background Layers */}
        <div className="absolute inset-0 z-0">
             {/* Base Image */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-[#1a1008]/40" />
             {/* Floating Particles (CSS only for now) */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse" />
        </div>

        {/* Back Button */}
        <Link href="/" className="absolute top-8 right-8 z-20 text-[#D4AF37] hover:text-[#FFD700] transition-all hover:scale-105 flex items-center gap-2 group">
            <div className="p-2 border border-[#D4AF37]/30 rounded-full bg-[#000]/40 group-hover:bg-[#D4AF37]/20 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold drop-shadow-md">العودة للبوابة</span>
        </Link>
        
        <div className="relative z-10 w-full max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16 relative"
          >
            {/* Decorative Header Ornament */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
            
            <h1 className="text-6xl md:text-7xl text-[#FFD700] font-bold mb-4 drop-shadow-[0_4px_15px_rgba(218,165,32,0.4)] tracking-wide">
              غرفة العهد
            </h1>
            <p className="text-[#E6C288] text-xl md:text-2xl font-[family-name:var(--font-scheherazade)] drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              {isLogin ? "سجل دخولك لإكمال مسيرتك الأسطورية" : "اختر مسارك في المملكة وابدأ كتابة فصلك الأول في كتاب التاريخ"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             {/* Left Column: Role Selection */}
             <div className={cn("lg:col-span-7 transition-all duration-700", isLogin ? "opacity-40 pointer-events-none blur-sm scale-95" : "opacity-100 scale-100")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roles.map((role, idx) => (
                        <motion.div 
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.15 }}
                            onClick={() => !isLogin && setSelectedRole(role.id)}
                            className={cn(
                                "relative p-6 rounded-2xl border transition-all duration-500 group overflow-hidden cursor-pointer",
                                selectedRole === role.id 
                                    ? "bg-gradient-to-br from-[#2A1B0E] to-[#3E2723] border-[#FFD700] shadow-[0_0_30px_rgba(218,165,32,0.3)] transform -translate-y-2" 
                                    : "bg-[#1A1209]/80 border-[#5D4037] hover:border-[#D4AF37]/60 hover:bg-[#2A1B0E]/80 hover:shadow-[0_0_20px_rgba(218,165,32,0.1)]"
                            )}
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 border-2",
                                    selectedRole === role.id 
                                        ? "bg-[#FFD700] text-[#2A1B0E] border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)]" 
                                        : "bg-[#2A1B0E] text-[#9CA3AF] border-[#5D4037] group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]"
                                )}>
                                    {role.icon}
                                </div>
                                
                                <h3 className={cn(
                                    "text-2xl font-bold mb-2 transition-colors duration-300",
                                    selectedRole === role.id ? "text-[#FFD700]" : "text-[#E6C288] group-hover:text-[#FFD700]"
                                )}>
                                    {role.label}
                                </h3>
                                <p className="text-[#9CA3AF] text-sm leading-relaxed group-hover:text-[#E6C288]/80 transition-colors">
                                    {role.desc}
                                </p>
                            </div>

                            {/* Corner Ornaments */}
                            {selectedRole === role.id && (
                                <>
                                    <Sparkles className="absolute top-3 right-3 w-4 h-4 text-[#FFD700] animate-pulse" />
                                    <Sparkles className="absolute bottom-3 left-3 w-4 h-4 text-[#FFD700] animate-pulse delay-75" />
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
             </div>

             {/* Right Column: Registration/Login Scroll */}
             <div className="lg:col-span-5 relative">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                    className="relative"
                >
                    {/* Scroll Background */}
                    <div className="absolute inset-0 bg-[#E6C288] rounded-lg transform rotate-1 scale-[1.02] shadow-2xl opacity-10" />
                    
                    <div className="bg-[#1A1209]/95 border-2 border-[#D4AF37] rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-md">
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-xl opacity-50" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-xl opacity-50" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#D4AF37] rounded-br-xl opacity-50" />

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-b from-[#2A1B0E] to-[#000] rounded-full flex items-center justify-center mb-4 border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(218,165,32,0.3)]">
                                <Shield className="w-10 h-10 text-[#FFD700]" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#FFD700] mb-1">
                                {isLogin ? "بوابة العبور" : "وثيقة الانضمام"}
                            </h2>
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            {!isLogin && (
                                 <div className="group">
                                    <label className="block text-[#D4AF37] text-sm mb-2 font-bold">الاسم في السجلات</label>
                                    <div className="relative">
                                        <UserIcon className="absolute right-4 top-4 w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#FFD700] transition-colors" />
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-[#000]/60 border-b-2 border-[#5D4037] rounded-t-lg px-12 py-3.5 text-[#E6C288] focus:border-[#FFD700] focus:bg-[#2A1B0E] outline-none transition-all placeholder:text-[#9CA3AF]/30"
                                            placeholder="اكتب اسمك الأسطوري..."
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="group">
                                <label className="block text-[#D4AF37] text-sm mb-2 font-bold">عنوان البريد السحري</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-4 w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#FFD700] transition-colors" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-[#000]/60 border-b-2 border-[#5D4037] rounded-t-lg px-12 py-3.5 text-[#E6C288] focus:border-[#FFD700] focus:bg-[#2A1B0E] outline-none transition-all placeholder:text-[#9CA3AF]/30"
                                        placeholder="your-scroll@ather.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[#D4AF37] text-sm mb-2 font-bold">تعويذة الدخول (كلمة السر)</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-4 w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#FFD700] transition-colors" />
                                    <input 
                                        type="password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-[#000]/60 border-b-2 border-[#5D4037] rounded-t-lg px-12 py-3.5 text-[#E6C288] focus:border-[#FFD700] focus:bg-[#2A1B0E] outline-none transition-all placeholder:text-[#9CA3AF]/30"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {selectedRole && !isLogin && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4 flex items-start gap-3 mt-2">
                                            <Scroll className="w-5 h-5 text-[#FFD700] mt-1 shrink-0" />
                                            <p className="text-sm text-[#E6C288]/90 leading-relaxed font-[family-name:var(--font-scheherazade)] text-lg">
                                                أنا الموقع أدناه، بصفتي <span className="text-[#FFD700] font-bold">{roles.find(r => r.id === selectedRole)?.label}</span>، أقسم أن أحفظ عهد المملكة وأن أسعى لنشر العلم والمعرفة.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 space-y-4 relative z-10">
                            <GoldButton 
                                className={cn("w-full py-4 text-xl font-bold shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(218,165,32,0.4)] border border-[#FFD700]/30", isLoading && "opacity-70 cursor-wait")}
                                onClick={handleConfirm}
                                disabled={isLoading || (!isLogin && !selectedRole)}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isLoading ? "جاري فتح البوابة..." : (isLogin ? "عبور البوابة" : "توقيع الميثاق")}
                                    {!isLoading && <ArrowLeft className="w-5 h-5" />}
                                </span>
                            </GoldButton>
                            
                            <div className="text-center pt-2">
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[#9CA3AF] hover:text-[#FFD700] text-sm transition-all duration-300 hover:tracking-wider"
                                >
                                    {isLogin ? "ليس لديك ختم ملكي؟ اطلب الانضمام" : "لديك ختم بالفعل؟ اعبر الآن"}
                                </button>
                            </div>

                            {!selectedRole && !isLogin && (
                                <p className="text-center text-[#FF6B6B]/80 text-xs mt-2 animate-pulse">
                                    * يجب اختيار مسار لإكمال المراسم
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
             </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
