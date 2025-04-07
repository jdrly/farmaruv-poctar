"use client";

import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Info, MessageSquare } from "lucide-react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <h2 className="text-lg font-semibold">Farmářův počtář</h2>
      
      <nav className="flex items-center gap-6">
        <Link 
          href="/" 
          className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}
        >
          <Calculator size={18} />
          <span>Kalkulačka</span>
        </Link>
        
        <Link 
          href="/hodnoty-od-chovatelu" 
          className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname === '/informace-od-chovatelu' ? 'text-primary font-medium' : ''}`}
        >
          <Info size={18} />
          <span>Hodnoty od chovatelů</span>
        </Link>
        
        <button 
          onClick={() => setShowFeedbackForm(true)}
          className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
        >
          <MessageSquare size={18} />
          <span>Zpětná vazba</span>
        </button>
      </nav>
      
      <SignOutButton className="cursor-pointer" />
      
      <FeedbackForm open={showFeedbackForm} onOpenChange={setShowFeedbackForm} />
    </header>
  );
}