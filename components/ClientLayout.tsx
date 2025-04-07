"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/prihlaseni";

  return (
    <div className="h-screen flex flex-col">
      {/* Only render the Header if not on the login page */}
      {!isLoginPage && <Header />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}