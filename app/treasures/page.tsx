"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import SidebarWorld from "@/components/SidebarWorld";
import MobileNav from "@/components/MobileNav";
import GoldButton from "@/components/GoldButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins, Gem, ShoppingBag, Package, Gift, Sparkles, Shield, Lock, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'frame' | 'badge' | 'consumable';
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const marketItems: MarketItem[] = [
  {
    id: "frame_gold",
    name: "إطار الملك",
    description: "إطار ذهبي فاخر يزين صورتك الرمزية",
    price: 500,
    type: "frame",
    image: "https://images.unsplash.com/photo-1614850523060-8da1d56e37ad?q=80&w=2670&auto=format&fit=crop",
    rarity: "legendary"
  },
  {
    id: "badge_explorer",
    name: "وسام المستكشف",
    description: "وسام شرف للمغامرين الشجعان",
    price: 300,
    type: "badge",
    image: "https://images.unsplash.com/photo-1615750035658-4f81c969966f?q=80&w=2670&auto=format&fit=crop",
    rarity: "rare"
  },
  {
    id: "mystery_box",
    name: "صندوق الغموض",
    description: "افتح الصندوق واحصل على جائزة عشوائية!",
    price: 150,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2640&auto=format&fit=crop",
    rarity: "epic"
  },
  {
    id: "frame_silver",
    name: "الإطار الفضي",
    description: "أناقة وبساطة للمحترفين",
    price: 200,
    type: "frame",
    image: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2576&auto=format&fit=crop",
    rarity: "common"
  },
  {
    id: "canteen_voucher",
    name: "قسيمة المقصف",
    description: "وجبة مجانية من مقصف المدرسة",
    price: 1000,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2580&auto=format&fit=crop",
    rarity: "epic"
  },
  {
    id: "homework_pass",
    name: "إعفاء واجب",
    description: "بطاقة ذهبية للإعفاء من واجب واحد",
    price: 2000,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2670&auto=format&fit=crop",
    rarity: "legendary"
  }
];

export default function TreasuresPage() {
  const { coins, spendCoins, addItemToInventory, inventory, recordPurchase, name, allUsers, role } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'market' | 'inventory'>('market');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleBuy = (item: MarketItem) => {
    // Check if already owned (for non-consumables)
    if (item.type !== 'consumable' && inventory.some(i => i.id === item.id)) {
        showToast("أنت تمتلك هذا العنصر بالفعل!", "warning");
        return;
    }

    setPurchasingId(item.id);

    // Simulate Network Request
    setTimeout(() => {
        if (spendCoins(item.price)) {
            const currentUser = allUsers.find(u => u.name === name && u.role === role);
            recordPurchase({
                studentId: currentUser?.id || 0,
                studentName: name,
                itemId: item.id,
                itemName: item.name,
                price: item.price
            });

            addItemToInventory({
                id: item.id,
                name: item.name,
                type: item.type,
                image: item.image
            });
            showToast(`مبروك! تم شراء ${item.name} بنجاح`, "success");
        } else {
            showToast("عذراً، لا تملك ما يكفي من الذهب", "error");
        }
        setPurchasingId(null);
    }, 1000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'legendary': return 'text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10';
        case 'epic': return 'text-[#9B59B6] border-[#9B59B6] bg-[#9B59B6]/10';
        case 'rare': return 'text-[#4ECDC4] border-[#4ECDC4] bg-[#4ECDC4]/10';
        default: return 'text-[#F4E4BC] border-[#5D4037] bg-[#5D4037]/20';
    }
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[#0a192f] flex overflow-hidden">
          {/* Sidebar */}
          <div className="relative z-20 hidden md:block h-screen">
            <SidebarWorld />
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col">
             {/* Header */}
             <header className="p-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#DAA520]/20 bg-[#0a192f]/50 backdrop-blur-sm z-10">
                <div>
                   <h1 className="text-4xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-3">
                      <Gem className="w-8 h-8" />
                      الخزنة الملكية
                   </h1>
                   <p className="text-[#F4E4BC]/60 mt-1">أنفق ذهبك بحكمة واجمع النوادر</p>
                </div>

                <div className="bg-[#2A1B0E] px-6 py-3 rounded-xl border border-[#FFD700] flex items-center gap-4 shadow-[0_0_20px_rgba(218,165,32,0.2)]">
                   <div className="text-right">
                      <p className="text-[#F4E4BC]/60 text-xs font-[family-name:var(--font-cairo)]">رصيدك الحالي</p>
                      <p className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-cairo)]">{coins.toLocaleString()}</p>
                   </div>
                   <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center border border-[#FFD700]">
                      <Coins className="w-6 h-6 text-[#FFD700]" />
                   </div>
                </div>
             </header>

             {/* Tabs */}
             <div className="px-8 py-4 flex gap-4">
                <button 
                   onClick={() => setActiveTab('market')}
                   className={cn(
                      "px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2",
                      activeTab === 'market' 
                        ? "bg-[#DAA520] text-[#0a192f] shadow-[0_0_15px_rgba(218,165,32,0.4)]" 
                        : "bg-[#2A1B0E] text-[#F4E4BC]/60 hover:text-[#F4E4BC] border border-[#5D4037]"
                   )}
                >
                   <ShoppingBag className="w-4 h-4" /> السوق
                </button>
                <button 
                   onClick={() => setActiveTab('inventory')}
                   className={cn(
                      "px-6 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-2",
                      activeTab === 'inventory' 
                        ? "bg-[#DAA520] text-[#0a192f] shadow-[0_0_15px_rgba(218,165,32,0.4)]" 
                        : "bg-[#2A1B0E] text-[#F4E4BC]/60 hover:text-[#F4E4BC] border border-[#5D4037]"
                   )}
                >
                   <Package className="w-4 h-4" /> مقتنياتي
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                   {activeTab === 'market' ? (
                      <motion.div 
                        key="market"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                         {marketItems.map((item) => (
                            <div key={item.id} className="group bg-[#2A1B0E]/80 border border-[#5D4037] rounded-xl overflow-hidden hover:border-[#DAA520] transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.1)] flex flex-col">
                               <div className="relative h-48 overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B0E] to-transparent z-10" />
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className={cn("absolute top-3 right-3 z-20 px-2 py-1 rounded text-xs font-bold border backdrop-blur-md uppercase tracking-wider", getRarityColor(item.rarity))}>
                                     {item.rarity}
                                  </div>
                               </div>
                               
                               <div className="p-5 flex-1 flex flex-col">
                                  <h3 className="text-xl font-bold text-[#F4E4BC] mb-2 font-[family-name:var(--font-amiri)]">{item.name}</h3>
                                  <p className="text-[#F4E4BC]/60 text-sm mb-4 flex-1">{item.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#5D4037]/50">
                                     <div className="flex items-center gap-1 text-[#FFD700] font-bold text-lg">
                                        <Coins className="w-5 h-5" />
                                        {item.price}
                                     </div>
                                     <GoldButton 
                                        className={cn("px-6 py-2 text-sm", purchasingId === item.id && "opacity-70 cursor-wait")}
                                        onClick={() => handleBuy(item)}
                                        disabled={!!purchasingId}
                                     >
                                        {purchasingId === item.id ? (
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "شراء"
                                        )}
                                     </GoldButton>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </motion.div>
                   ) : (
                      <motion.div 
                        key="inventory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                         {inventory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-[#F4E4BC]/40">
                               <Package className="w-24 h-24 mb-4 opacity-50" />
                               <h3 className="text-2xl font-bold mb-2">خزنتك فارغة</h3>
                               <p>اذهب للسوق واشترِ بعض الكنوز!</p>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                               {inventory.map((item, idx) => (
                                  <div key={`${item.id}-${idx}`} className="bg-[#2A1B0E]/60 border border-[#5D4037] rounded-xl p-4 flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#DAA520]/30 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-[#F4E4BC]">{item.name}</h4>
                                        <p className="text-[#F4E4BC]/50 text-xs mt-1">{item.type}</p>
                                        <p className="text-[#DAA520] text-xs mt-2">{item.dateAcquired}</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

          </div>
        </main>
      </PageTransition>
    </>
  );
}
