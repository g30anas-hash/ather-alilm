"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { 
    Activity, 
    Zap, 
    Users, 
    Trophy, 
    HeartPulse, 
    Sun, 
    CloudSun, 
    Cloud, 
    Star, 
    TrendingUp,
    School,
    BookOpen,
    Swords
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SchoolPulse() {
    const { role, lessons, behaviorRecords, quests, allUsers, classes } = useUser();
    
    // Calculate Pulse Metrics
    const today = new Date().toDateString();
    
    // 1. Daily Pulse (Lesson Documentation)
    // Assume 6 lessons per class per day is the target
    const totalClasses = classes.length;
    const expectedLessons = totalClasses * 6; 
    const todaysLessons = lessons.filter(l => new Date(l.createdAt).toDateString() === today);
    const documentedCount = todaysLessons.length;
    const pulsePercentage = Math.min(100, Math.round((documentedCount / (expectedLessons || 1)) * 100));

    // 2. Subject Heatmap
    const subjects = Array.from(new Set(todaysLessons.map(l => l.subject)));
    const subjectActivity = subjects.map(sub => {
        const count = todaysLessons.filter(l => l.subject === sub).length;
        // Mocking interaction score for now based on questions count in lessons
        const interactions = todaysLessons
            .filter(l => l.subject === sub)
            .reduce((acc, l) => acc + (l.questions?.length || 0), 0);
        
        let status: 'hot' | 'warm' | 'cool' = 'cool';
        if (count >= 3 && interactions > 5) status = 'hot';
        else if (count >= 1) status = 'warm';

        return { subject: sub, count, interactions, status };
    });

    // 3. Class of the Day
    // Class with most lessons documented + most positive behaviors
    const classScores = classes.map(cls => {
        const lessonCount = todaysLessons.filter(l => l.classId === cls.id).length;
        const behaviorCount = behaviorRecords.filter(b => 
            new Date(b.date).toDateString() === today && 
            b.type === 'positive' &&
            // We need to map behavior to class, assume checking student's class
            allUsers.find(u => u.name === b.studentName)?.classId === cls.id
        ).length;
        
        return { 
            ...cls, 
            score: (lessonCount * 10) + (behaviorCount * 5) 
        };
    }).sort((a, b) => b.score - a.score);
    
    const topClass = classScores[0]?.score > 0 ? classScores[0] : null;

    // 4. Mentor Spotlight (Teacher)
    // Teacher with most documented lessons today
    const teacherScores = allUsers.filter(u => u.role === 'teacher').map(t => {
        const count = todaysLessons.filter(l => l.teacherId === t.id).length;
        return { ...t, score: count };
    }).sort((a, b) => b.score - a.score);

    const mentorOfTheDay = teacherScores[0]?.score > 0 ? teacherScores[0] : null;

    // 5. Challenge Pulse
    // Active quests today
    const activeQuestsToday = quests.filter(q => q.status === 'approved').length; // Simplified
    // Gold earned today (from behaviors)
    const goldEarnedToday = behaviorRecords
        .filter(b => new Date(b.date).toDateString() === today)
        .reduce((acc, b) => acc + (b.goldAmount || 0), 0);

    // 6. Mood Indicator
    // Ratio of positive behaviors vs total behaviors today
    const todaysBehaviors = behaviorRecords.filter(b => new Date(b.date).toDateString() === today);
    const positiveBehaviors = todaysBehaviors.filter(b => b.type === 'positive').length;
    const moodRatio = todaysBehaviors.length > 0 ? positiveBehaviors / todaysBehaviors.length : 1; // Default to sunny
    
    let mood: 'sunny' | 'stable' | 'cloudy' = 'sunny';
    if (moodRatio < 0.5) mood = 'cloudy';
    else if (moodRatio < 0.8) mood = 'stable';

    // Role-based Content
    const getPulseMessage = () => {
        if (role === 'leader') return `اليوم يسير بنسبة ${pulsePercentage}% من التفاعل المتوقع`;
        if (role === 'teacher') return `تم توثيق ${documentedCount} حصة في المدرسة اليوم`;
        if (role === 'student') return `مدرستك تنبض بالنشاط اليوم! 💪`;
        if (role === 'parent') return `اليوم الدراسي يسير بوتيرة ${pulsePercentage > 80 ? 'ممتازة' : 'جيدة'}`;
        return "حالة المدرسة اليوم";
    };

    return (
        <div className="w-full bg-[#1E120A]/60 border border-[#DAA520]/30 rounded-2xl p-6 backdrop-blur-md mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-[#DAA520]/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#FF4757]/10 rounded-full border border-[#FF4757]/20 animate-pulse">
                        <Activity className="w-6 h-6 text-[#FF4757]" />
                    </div>
                    <div>
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">نبض المدرسة</h2>
                        <p className="text-[#F4E4BC]/60 text-xs">حالة المدرسة.. في لحظة واحدة</p>
                    </div>
                </div>
                
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border",
                    mood === 'sunny' ? "bg-[#2ECC71]/10 border-[#2ECC71] text-[#2ECC71]" :
                    mood === 'stable' ? "bg-[#F1C40F]/10 border-[#F1C40F] text-[#F1C40F]" :
                    "bg-[#95A5A6]/10 border-[#95A5A6] text-[#95A5A6]"
                )}>
                    {mood === 'sunny' ? <Sun className="w-5 h-5" /> : 
                     mood === 'stable' ? <CloudSun className="w-5 h-5" /> : 
                     <Cloud className="w-5 h-5" />}
                    <span className="font-bold text-sm">
                        {mood === 'sunny' ? "يوم مشرق" : mood === 'stable' ? "يوم مستقر" : "يحتاج دعم"}
                    </span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Daily Pulse */}
                <div className="bg-[#000]/20 p-4 rounded-xl border border-[#DAA520]/10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-[#F4E4BC] font-bold text-sm">نبض اليوم</h3>
                            <HeartPulse className="w-4 h-4 text-[#FF4757]" />
                        </div>
                        <p className="text-[#F4E4BC]/50 text-xs mb-3">{getPulseMessage()}</p>
                    </div>
                    <div className="relative h-2 bg-[#000]/40 rounded-full overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF4757] to-[#FF6B6B] transition-all duration-1000"
                            style={{ width: `${pulsePercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#F4E4BC]/40 mt-1">
                        <span>0%</span>
                        <span>{documentedCount} حصة</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* 2. Subject Heatmap */}
                <div className="bg-[#000]/20 p-4 rounded-xl border border-[#DAA520]/10 lg:col-span-2">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-[#F4E4BC] font-bold text-sm">حرارة المواد</h3>
                        <Zap className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subjectActivity.length > 0 ? subjectActivity.map((sub, idx) => (
                            <div 
                                key={idx}
                                className={cn(
                                    "px-3 py-1 rounded text-xs border flex items-center gap-1 transition-all",
                                    sub.status === 'hot' ? "bg-[#FF4757]/10 border-[#FF4757] text-[#FF4757]" :
                                    sub.status === 'warm' ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]" :
                                    "bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]"
                                )}
                            >
                                {sub.status === 'hot' && <TrendingUp className="w-3 h-3" />}
                                {sub.subject}
                            </div>
                        )) : (
                            <p className="text-[#F4E4BC]/30 text-xs">لا توجد بيانات كافية اليوم</p>
                        )}
                    </div>
                </div>

                {/* 3. Class/Mentor Spotlight (Rotating based on role/availability) */}
                <div className="bg-[#000]/20 p-4 rounded-xl border border-[#DAA520]/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#DAA520]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {topClass ? (
                        <>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className="text-[#F4E4BC] font-bold text-sm">صف اليوم ⭐</h3>
                                <Trophy className="w-4 h-4 text-[#FFD700]" />
                            </div>
                            <div className="text-center py-2 relative z-10">
                                <h4 className="text-2xl font-bold text-[#FFD700] mb-1">{topClass.name}</h4>
                                <p className="text-[#F4E4BC]/60 text-xs">أداء استثنائي وتعاون رائع!</p>
                            </div>
                        </>
                    ) : mentorOfTheDay && role !== 'student' ? (
                        <>
                             <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className="text-[#F4E4BC] font-bold text-sm">معلم اليوم 🏅</h3>
                                <Star className="w-4 h-4 text-[#4ECDC4]" />
                            </div>
                            <div className="text-center py-2 relative z-10">
                                <h4 className="text-xl font-bold text-[#4ECDC4] mb-1">{mentorOfTheDay.name}</h4>
                                <p className="text-[#F4E4BC]/60 text-xs">جهد مميز في توثيق الحصص</p>
                            </div>
                        </>
                    ) : (
                         <>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className="text-[#F4E4BC] font-bold text-sm">نبض التحديات</h3>
                                <Swords className="w-4 h-4 text-[#DAA520]" />
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[#F4E4BC]/60">تحديات نشطة</span>
                                    <span className="text-[#FFD700]">{activeQuestsToday}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#F4E4BC]/60">ذهب مكتسب</span>
                                    <span className="text-[#FFD700]">{goldEarnedToday}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* AI Insight Footer */}
            <div className="mt-4 pt-4 border-t border-[#DAA520]/10 flex items-start gap-3">
                <div className="p-1.5 bg-[#4ECDC4]/10 rounded-lg">
                    <Zap className="w-4 h-4 text-[#4ECDC4]" />
                </div>
                <p className="text-[#F4E4BC]/70 text-xs leading-relaxed">
                    <span className="text-[#4ECDC4] font-bold ml-1">تحليل أثير:</span>
                    {subjectActivity.find(s => s.status === 'cool') 
                        ? `لاحظنا هدوءاً في مادة ${subjectActivity.find(s => s.status === 'cool')?.subject}، قد يفيد تفعيل تحدٍ خفيف غداً 🎯`
                        : "التفاعل ممتاز في جميع المواد اليوم! استمروا على هذا المنوال."}
                </p>
            </div>
        </div>
    );
}