"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import GoldButton from "@/components/GoldButton";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send, HelpCircle, Mail, Phone, Smartphone } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", type: "general", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { addSupportMessage } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
        addSupportMessage({
            senderName: form.name,
            mobile: form.mobile,
            email: form.email,
            type: form.type,
            message: form.message
        });
        
        setIsSubmitting(false);
        showToast("تم إرسال رسالتك إلى الحمام الزاجل بنجاح! سيصلك الرد قريباً.", "success");
        setForm({ name: "", mobile: "", email: "", type: "general", message: "" });
    }, 1500);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a192f] text-[#F4E4BC] p-8 relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
        
        <div className="max-w-4xl w-full relative z-10">
          <header className="flex justify-between items-center mb-12 border-b border-[#DAA520]/30 pb-6">
             <div>
                <h1 className="text-4xl md:text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">ديوان المظالم</h1>
                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-scheherazade)] text-xl">مركز الدعم والمساعدة الفنية</p>
             </div>
             <Link href="/">
                <GoldButton variant="secondary" className="gap-2">
                   <ArrowLeft className="w-4 h-4" />
                   العودة للبوابة
                </GoldButton>
             </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Contact Info */}
             <div className="space-y-6">
                <div className="bg-[#2A1B0E]/60 border border-[#5D4037] p-6 rounded-2xl backdrop-blur-sm">
                   <h3 className="text-xl font-bold text-[#FFD700] mb-4 font-[family-name:var(--font-amiri)] flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      كيف يمكننا مساعدتك؟
                   </h3>
                   <p className="text-[#F4E4BC]/70 leading-relaxed mb-4">
                      واجهت مشكلة في دخول البوابة؟ تعطلت إحدى التعاويذ الرقمية؟ أو لديك اقتراح لتطوير المملكة؟ مستشارو الديوان في خدمتك دائماً.
                   </p>
                </div>

                <div className="bg-[#2A1B0E]/60 border border-[#5D4037] p-6 rounded-2xl backdrop-blur-sm space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#DAA520]/10 rounded-full flex items-center justify-center text-[#DAA520]">
                         <Mail className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[#F4E4BC]/50 text-xs">البريد السحري</p>
                         <p className="text-[#F4E4BC] font-bold">support@ather-alilm.com</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center text-[#4ECDC4]">
                         <Phone className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[#F4E4BC]/50 text-xs">الخط الساخن</p>
                         <p className="text-[#F4E4BC] font-bold" dir="ltr">+966 54 670 6776</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Form */}
             <div className="bg-[#2A1B0E]/80 border border-[#DAA520] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-50" />
                
                <h3 className="text-2xl font-bold text-[#F4E4BC] mb-6 font-[family-name:var(--font-amiri)] flex items-center gap-2">
                   <MessageSquare className="w-6 h-6 text-[#DAA520]" />
                   أرسل برقية
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 font-[family-name:var(--font-cairo)]">
                   <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">اسم المرسل</label>
                      <input 
                         type="text" 
                         required
                         value={form.name}
                         onChange={e => setForm({...form, name: e.target.value})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[#F4E4BC]/70 text-sm mb-2">رقم الجوال</label>
                         <div className="relative">
                             <input 
                                type="tel" 
                                required
                                value={form.mobile}
                                onChange={e => setForm({...form, mobile: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 pl-10 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors"
                                dir="ltr"
                                placeholder="+966..."
                             />
                             <Smartphone className="w-4 h-4 text-[#F4E4BC]/30 absolute left-3 top-3.5" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-[#F4E4BC]/70 text-sm mb-2">البريد الإلكتروني</label>
                         <div className="relative">
                             <input 
                                type="email" 
                                required
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 pl-10 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors"
                                dir="ltr"
                             />
                             <Mail className="w-4 h-4 text-[#F4E4BC]/30 absolute left-3 top-3.5" />
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">نوع الرسالة</label>
                      <select 
                         value={form.type}
                         onChange={e => setForm({...form, type: e.target.value})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors"
                      >
                         <option value="general">استفسار عام</option>
                         <option value="tech">مشكلة تقنية</option>
                         <option value="suggestion">اقتراح تطوير</option>
                         <option value="complaint">شكوى</option>
                      </select>
                   </div>

                   <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">نص الرسالة</label>
                      <textarea 
                         required
                         rows={4}
                         value={form.message}
                         onChange={e => setForm({...form, message: e.target.value})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none transition-colors resize-none"
                         placeholder="اكتب تفاصيل طلبك هنا..."
                      ></textarea>
                   </div>

                   <GoldButton 
                      type="submit" 
                      className={cn("w-full mt-4", isSubmitting && "opacity-70 cursor-wait")}
                      disabled={isSubmitting}
                   >
                      {isSubmitting ? "جاري الإرسال..." : (
                         <>
                            إرسال البرقية <Send className="w-4 h-4 mr-2" />
                         </>
                      )}
                   </GoldButton>
                </form>
             </div>

          </div>
        </div>
      </main>
    </PageTransition>
  );
}
