"use client";

import PageTransition from "@/components/PageTransition";
import GoldButton from "@/components/GoldButton";
import Link from "next/link";
import { ArrowLeft, Gavel, Scale, BookOpen, UserCheck, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a192f] text-[#F4E4BC] p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <header className="flex justify-between items-center mb-12 border-b border-[#DAA520]/30 pb-6">
             <div>
                <h1 className="text-4xl md:text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">الميثاق الملكي</h1>
                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-scheherazade)] text-xl">الشروط والأحكام لاستخدام منصة أثير العلم</p>
             </div>
             <Link href="/">
                <GoldButton variant="secondary" className="gap-2">
                   <ArrowLeft className="w-4 h-4" />
                   العودة للبوابة
                </GoldButton>
             </Link>
          </header>

          <div className="space-y-8 font-[family-name:var(--font-cairo)]">
            
            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#DAA520]/10 rounded-full flex items-center justify-center text-[#FFD700]">
                     <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">1. قبول الميثاق</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  بمجرد دخولك إلى بوابة "أثير العلم"، فإنك تقسم يمين الولاء للتعلم وتوافق على الالتزام بجميع بنود هذا الميثاق. إذا لم توافق على أي من هذه الشروط، يرجى عدم دخول البوابة.
               </p>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center text-[#4ECDC4]">
                     <UserCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">2. ميثاق الشرف (سلوك المغامر)</h2>
               </div>
               <ul className="list-disc list-inside space-y-2 text-[#F4E4BC]/80 leading-relaxed marker:text-[#DAA520]">
                  <li>الاحترام المتبادل بين جميع سكان المملكة (طلاب، معلمين، قادة).</li>
                  <li>الأمانة العلمية: الغش في المهام أو الاختبارات يعتبر خيانة عظمى تستوجب العقاب.</li>
                  <li>استخدام لغة راقية تليق بطلاب العلم في جميع ساحات النقاش.</li>
               </ul>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FFD700]/10 rounded-full flex items-center justify-center text-[#FFD700]">
                     <Scale className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">3. الملكية الفكرية</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  جميع المخطوطات، الدروس، والتعاويذ التعليمية الموجودة في المنصة هي ملك لمملكة أثير العلم. يمنع نسخها أو توزيعها خارج أسوار المملكة دون إذن خطي من المجلس الأعلى.
               </p>
            </section>

            <section className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center text-[#FF6B6B]">
                     <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4E4BC]">4. إنهاء العضوية</h2>
               </div>
               <p className="leading-relaxed text-[#F4E4BC]/80">
                  تحتفظ قيادة المملكة بالحق في سحب لقب "المغامر" وتجميد الحساب في حال انتهاك أي من بنود هذا الميثاق، أو عند ارتكاب مخالفات سلوكية جسيمة.
               </p>
            </section>

          </div>
          
          <footer className="mt-12 text-center text-[#F4E4BC]/40 text-sm">
             حرر في تاريخ 1445 هـ - بموجب المرسوم الملكي رقم 1
          </footer>
        </div>
      </main>
    </PageTransition>
  );
}
