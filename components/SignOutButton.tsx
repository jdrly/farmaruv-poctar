"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(className)}
      onClick={() =>
        void signOut().then(() => {
          router.push("/prihlaseni");
        })
      }
    >
      Odhlásit se
    </Button>
  );
}