"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoldButton from "@/components/GoldButton";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Crown, Users, Mail, User as UserIcon, ArrowLeft, Shield, Sparkles, Lock } from "lucide-react";
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
      <main className="min-h-screen flex items-center justify-center bg-[#0a192f] overflow-hidden relative p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent" />
        </div>

        {/* Back Button */}
        <Link href="/" className="absolute top-8 right-8 z-20 text-[#F4E4BC]/60 hover:text-[#DAA520] transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للبوابة</span>
        </Link>
        
        <div className="relative z-10 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-4 drop-shadow-[0_0_15px_rgba(218,165,32,0.6)]">
              غرفة العهد
            </h1>
            <p className="text-[#F4E4BC]/60 text-lg font-[family-name:var(--font-scheherazade)]">
              {isLogin ? "سجل دخولك لإكمال مسيرتك" : "اختر مسارك في المملكة وابدأ كتابة أسطورتك"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Left Column: Role Selection (Only for Sign Up) */}
             <div className={cn("lg:col-span-8 transition-all duration-500", isLogin ? "opacity-50 pointer-events-none grayscale" : "opacity-100")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role, idx) => (
                        <motion.div 
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => !isLogin && setSelectedRole(role.id)}
                            className={cn(
                                "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden",
                                selectedRole === role.id 
                                    ? "bg-[#DAA520]/20 border-[#FFD700] shadow-[0_0_20px_rgba(218,165,32,0.2)]" 
                                    : "bg-[#2A1B0E]/60 border-[#5D4037]/50 hover:border-[#DAA520]/50 hover:bg-[#2A1B0E]/80"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                    selectedRole === role.id ? "bg-[#FFD700] text-[#2A1B0E]" : "bg-[#5D4037]/50 text-[#F4E4BC]/50 group-hover:text-[#DAA520] group-hover:bg-[#DAA520]/10"
                                )}>
                                    {role.icon}
                                </div>
                                {selectedRole === role.id && (
                                    <motion.div 
                                        initial={{ scale: 0 }} 
                                        animate={{ scale: 1 }}
                                        className="bg-[#4ECDC4] rounded-full p-1"
                                    >
                                        <Sparkles className="w-4 h-4 text-[#0a192f]" />
                                    </motion.div>
                                )}
                            </div>
                            <h3 className={cn(
                                "text-xl font-bold mb-1 font-[family-name:var(--font-amiri)] transition-colors",
                                selectedRole === role.id ? "text-[#FFD700]" : "text-[#F4E4BC]"
                            )}>
                                {role.label}
                            </h3>
                            <p className="text-[#F4E4BC]/50 text-sm">{role.desc}</p>
                            
                            {/* Hover Effect Background */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#DAA520]/5 rounded-full blur-2xl group-hover:bg-[#DAA520]/10 transition-colors pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
             </div>

             {/* Right Column: Registration Form */}
             <div className="lg:col-span-4">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#2A1B0E]/80 border border-[#DAA520]/30 rounded-2xl p-8 h-full flex flex-col justify-center backdrop-blur-sm relative overflow-hidden"
                >
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-50" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-[#DAA520]/10 rounded-full flex items-center justify-center mb-4 border border-[#DAA520]/30">
                            <Shield className="w-8 h-8 text-[#FFD700]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">
                            {isLogin ? "تسجيل الدخول" : "وثيقة العهد"}
                        </h2>
                    </div>

                    <div className="space-y-6 flex-1">
                        {!isLogin && (
                             <div className="relative group">
                                <label className="block text-[#F4E4BC]/70 text-sm mb-2 font-[family-name:var(--font-cairo)]">الاسم الكامل</label>
                                <div className="relative">
                                    <UserIcon className="absolute right-3 top-3.5 w-5 h-5 text-[#F4E4BC]/30 group-focus-within:text-[#DAA520] transition-colors" />
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-[#000]/40 border border-[#5D4037] rounded-xl pr-10 pl-4 py-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-all focus:bg-[#000]/60 placeholder:text-[#F4E4BC]/20"
                                        placeholder="اكتب اسمك هنا..."
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative group">
                            <label className="block text-[#F4E4BC]/70 text-sm mb-2 font-[family-name:var(--font-cairo)]">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3.5 w-5 h-5 text-[#F4E4BC]/30 group-focus-within:text-[#DAA520] transition-colors" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-[#000]/40 border border-[#5D4037] rounded-xl pr-10 pl-4 py-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-all focus:bg-[#000]/60 placeholder:text-[#F4E4BC]/20"
                                    placeholder="example@ather.com"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-[#F4E4BC]/70 text-sm mb-2 font-[family-name:var(--font-cairo)]">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-[#F4E4BC]/30 group-focus-within:text-[#DAA520] transition-colors" />
                                <input 
                                    type="password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-[#000]/40 border border-[#5D4037] rounded-xl pr-10 pl-4 py-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-all focus:bg-[#000]/60 placeholder:text-[#F4E4BC]/20"
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
                                    <div className="bg-[#DAA520]/10 border border-[#DAA520]/20 rounded-lg p-3 flex items-start gap-3">
                                        <div className="mt-1 min-w-[5px] h-2 w-2 rounded-full bg-[#DAA520]" />
                                        <p className="text-xs text-[#F4E4BC]/80 leading-relaxed">
                                            بصفتي <span className="text-[#FFD700] font-bold">{roles.find(r => r.id === selectedRole)?.label}</span>، أتعهد بالالتزام بقوانين المملكة والسعي نحو المعرفة والتميز.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 space-y-3">
                        <GoldButton 
                            className={cn("w-full py-4 text-lg shadow-lg", isLoading && "opacity-70 cursor-wait")}
                            onClick={handleConfirm}
                            disabled={isLoading || (!isLogin && !selectedRole)}
                        >
                            {isLoading ? "جاري المعالجة..." : (isLogin ? "دخول" : "توقيع ودخول")}
                        </GoldButton>
                        
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full text-[#F4E4BC]/50 hover:text-[#FFD700] text-sm transition-colors py-2"
                        >
                            {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب بالفعل؟ سجل الدخول"}
                        </button>

                        {!selectedRole && !isLogin && (
                            <p className="text-center text-[#F4E4BC]/30 text-xs">
                                * يجب اختيار دور لإكمال التسجيل
                            </p>
                        )}
                    </div>
                </motion.div>
             </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
