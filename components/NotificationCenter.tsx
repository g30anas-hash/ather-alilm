"use client";

import { useState } from "react";
import { Bell, Check, Info, Trash2, X, Crown, Scroll } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, Notification } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function NotificationCenter() {
  const { notifications, markNotificationAsRead } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markNotificationAsRead(id);
  };

  const handleNotificationClick = (notification: Notification) => {
      setSelectedNotification(notification);
      if (!notification.read) {
          markNotificationAsRead(notification.id);
      }
      setIsOpen(false); // Close the dropdown when opening details
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="relative p-2 bg-[#000]/30 rounded-full border border-[#DAA520] text-[#FFD700] hover:bg-[#DAA520]/20 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-4 w-80 md:w-96 bg-[#2A1B0E] border-2 border-[#DAA520] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-[#5D4037] flex justify-between items-center bg-[#1a1109]">
                <h3 className="text-[#FFD700] font-[family-name:var(--font-amiri)] text-xl">الإشعارات</h3>
                <span className="text-[#F4E4BC]/60 text-xs font-[family-name:var(--font-cairo)]">
                  {unreadCount} غير مقروء
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#F4E4BC]/40 font-[family-name:var(--font-cairo)]">
                    لا توجد إشعارات حالياً
                  </div>
                ) : (
                  <div className="divide-y divide-[#5D4037]/50">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-[#DAA520]/10 transition-colors relative group cursor-pointer",
                          !notification.read ? "bg-[#DAA520]/5" : ""
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "mt-1 w-2 h-2 rounded-full shrink-0",
                            !notification.read ? "bg-[#FF6B6B]" : "bg-transparent",
                            notification.type === 'success' && !notification.read ? "bg-[#4ECDC4]" : ""
                          )} />
                          <div className="flex-1">
                            <h4 className={cn(
                              "text-sm font-bold mb-1 font-[family-name:var(--font-cairo)]",
                              notification.read ? "text-[#F4E4BC]/70" : "text-[#F4E4BC]"
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-xs text-[#F4E4BC]/60 leading-relaxed">
                              {notification.message}
                            </p>
                            <span className="text-[10px] text-[#DAA520]/60 mt-2 block">
                              {notification.date}
                            </span>
                          </div>
                          
                          {!notification.read && (
                            <button 
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="self-start text-[#DAA520] opacity-0 group-hover:opacity-100 transition-opacity"
                              title="تحديد كمقروء"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedNotification(null)}
             />
             
             <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-50 bg-[#F4E4BC] text-[#2A1B0E] p-8 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden"
             >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none" />
                
                <div className="relative z-10">
                   <div className="text-center mb-6 border-b-2 border-[#2A1B0E]/20 pb-4">
                       {selectedNotification.title.includes('مرسوم') ? (
                           <Crown className="w-12 h-12 mx-auto text-[#DAA520] mb-2" />
                       ) : (
                           <Bell className="w-12 h-12 mx-auto text-[#DAA520] mb-2" />
                       )}
                       <h2 className="text-2xl font-[family-name:var(--font-amiri)] font-bold text-[#2A1B0E]">
                           {selectedNotification.title}
                       </h2>
                       <p className="text-[#2A1B0E]/60 text-sm mt-1">{selectedNotification.date}</p>
                   </div>

                   <div className="min-h-[100px] mb-6">
                       <p className="text-[#2A1B0E] text-lg leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-cairo)]">
                           {selectedNotification.message}
                       </p>
                   </div>

                   <div className="flex justify-center pt-4 border-t border-[#2A1B0E]/10">
                       <button 
                           onClick={() => setSelectedNotification(null)}
                           className="bg-[#2A1B0E] text-[#F4E4BC] px-8 py-2 rounded-full font-bold hover:bg-[#2A1B0E]/90 transition-transform hover:scale-105 shadow-lg"
                       >
                           إغلاق الرسالة
                       </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
