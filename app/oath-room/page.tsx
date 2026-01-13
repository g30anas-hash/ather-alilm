"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoldButton from "@/components/GoldButton";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Crown, Users, Mail, User as UserIcon, ArrowLeft, Shield, Sparkles } from "lucide-react";
import { useUser, UserRole, UserData } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function OathRoomPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const router = useRouter();
  const { setRole, updateName, addUser, allUsers } = useUser();
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
    if (!selectedRole) {
        showToast("الرجاء اختيار دور للمتابعة", "error");
        return;
    }
    if (!formData.name.trim()) {
        showToast("الرجاء إدخال الاسم", "error");
        return;
    }

    const email = formData.email || `${formData.name.replace(/\s/g, '').toLowerCase()}@ather.com`;

    // Check if user exists (Mock Login)
    const existingUser = allUsers.find(u => 
        u.email === email || (u.name === formData.name && u.role === selectedRole)
    );

    if (existingUser) {
        // Login Logic
        setRole(existingUser.role);
        updateName(existingUser.name);
        
        // Save session
        if (typeof window !== 'undefined') {
            localStorage.setItem("userId", existingUser.id.toString());
        }

        showToast(`أهلاً بعودتك يا ${existingUser.name}!`, 'success');
    } else {
        // Registration Logic
        const newUser: UserData = {
            id: Date.now(),
            name: formData.name,
            email: email,
            role: selectedRole as UserRole,
            // Default assignments based on role
            ...(selectedRole === 'student' ? { classId: "1-A", parentId: null } : {}),
            ...(selectedRole === 'teacher' ? { subject: "عام", assignedClasses: [] } : {}),
            ...(selectedRole === 'parent' ? { childrenIds: [] } : {})
        };
        await addUser(newUser);

        // Set current session
        setRole(selectedRole as UserRole);
        updateName(formData.name);
        
        if (typeof window !== 'undefined') {
            localStorage.setItem("userId", newUser.id.toString());
        }

        const roleName = roles.find(r => r.id === selectedRole)?.label;
        showToast(`تم تسجيل ${roleName}: ${formData.name} بنجاح!`, 'success');
    }
    
    // Smooth transition delay
    setTimeout(() => {
        switch(selectedRole) {
           case 'student': router.push("/student-city"); break;
           case 'teacher': router.push("/teacher-hall"); break;
           case 'leader': router.push("/leadership-palace"); break;
           case 'parent': router.push("/parent-observatory"); break;
           default: router.push("/student-city");
        }
    }, 500);
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
              اختر مسارك في المملكة وابدأ كتابة أسطورتك
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Left Column: Role Selection */}
             <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role, idx) => (
                        <motion.div 
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedRole(role.id)}
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
                            وثيقة العهد
                        </h2>
                    </div>

                    <div className="space-y-6 flex-1">
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

                        <div className="relative group">
                            <label className="block text-[#F4E4BC]/70 text-sm mb-2 font-[family-name:var(--font-cairo)]">البريد الإلكتروني (اختياري)</label>
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

                        <AnimatePresence>
                            {selectedRole && (
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

                    <div className="mt-8">
                        <GoldButton 
                            className={cn("w-full py-4 text-lg shadow-lg", (!selectedRole || !formData.name) && "opacity-50 grayscale cursor-not-allowed")}
                            onClick={handleConfirm}
                            disabled={!selectedRole || !formData.name}
                        >
                            توقيع ودخول
                        </GoldButton>
                        {!selectedRole && (
                            <p className="text-center text-[#F4E4BC]/30 text-xs mt-3">
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
