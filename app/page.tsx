"use client";

import { useConvexAuth } from "convex/react";
import { BreederCalculator } from "@/components/BreederCalculator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WelcomePopup } from "@/components/WelcomePopup";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/prihlaseni");
    } else if (!isLoading && isAuthenticated) {
      // Check if this is a fresh login
      const isNewLogin = sessionStorage.getItem("justLoggedIn");
      
      if (isNewLogin === "true") {
        // Show welcome popup only on fresh login
        setShowWelcome(true);
        // Clear the flag so it doesn't show on refresh
        sessionStorage.removeItem("justLoggedIn");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking authentication or redirecting
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Kalkulačka pro malochovatele</h1>
        <BreederCalculator />
        {showWelcome && <WelcomePopup />}
      </div>
    </div>
  );
}
