"use client";

import PageTransition from "@/components/PageTransition";
import GoldButton from "@/components/GoldButton";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Scroll, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a192f] text-[#F4E4BC] p-8 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-12 border-b border-[#DAA520]/30 pb-6">
             <div>
                <h1 className="text-4xl md:text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">دستور الخصوصية</h1>
                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-scheherazade)] text-xl">كيف نحمي أسرار مغامراتك في المملكة</p>
             </div>
             <Link href="/">
                <GoldButton variant="secondary" className="gap-2">
                   <ArrowLeft className="w-4 h-4" />
                   العودة للبوابة
                </GoldButton>
             </Link>
          </header>

          {/* Content */}
          <div className="space-y-8 font-[family-name:var(--font-cairo)]">
            
            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#DAA520]/10 rounded-full flex items-center justify-center text-[#FFD700]">
                     <Scroll className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">1. ما هي البيانات التي نجمعها؟</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  نحن نجمع فقط المعلومات الضرورية لتوثيق رحلتك البطولية: اسم المغامر، البريد الإلكتروني (الحمام الزاجل)، وسجلات التقدم في المهام والأوسمة التي حصلت عليها. لا نقوم بجمع أي بيانات سحرية خفية دون علمك.
               </p>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center text-[#4ECDC4]">
                     <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">2. حماية القلعة (أمن المعلومات)</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  بياناتك محفوظة في خزائن مشفرة بحماية تعويذات رقمية متقدمة (SSL/TLS). حراس القلعة (فريق الأمن السيبراني) يعملون على مدار الساعة لصد أي هجمات من قراصنة البيانات.
               </p>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center text-[#FF6B6B]">
                     <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">3. مشاركة الأسرار</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  نحن لا نبيع أسرارك لأي تاجر في السوق السوداء. تتم مشاركة بياناتك فقط مع قادة المملكة (المعلمين والإدارة) لمتابعة تقدمك الدراسي، أو مع أولياء الأمور عبر "مرصد الأهل".
               </p>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#DAA520]/10 rounded-full flex items-center justify-center text-[#FFD700]">
                     <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">4. حقوقك كبطل</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  لك الحق دائماً في طلب الاطلاع على سجلك، تصحيح أي خطأ في تدوين تاريخك، أو طلب حذف حسابك إذا قررت اعتزال المغامرة (مع مراعاة الأنظمة المدرسية).
               </p>
            </section>

          </div>
          
          <footer className="mt-12 text-center text-[#F4E4BC]/40 text-sm">
             حرر في تاريخ 1445 هـ - تم الختم بالختم الملكي
          </footer>
        </div>
      </main>
    </PageTransition>
  );
}
