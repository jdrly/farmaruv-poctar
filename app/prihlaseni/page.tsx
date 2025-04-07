"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm 
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            
            const formData = new FormData(event.currentTarget);
            formData.set("flow", flow);
            
            signIn("password", formData)
              .catch((error) => {
                console.error("Authentication error:", error);
                setError(error.message);
              })
              .then(() => {
                // After successful login:
                sessionStorage.setItem("justLoggedIn", "true");
                // Then redirect to home page
                router.push("/");
              });
          }}
          error={error}
          flow={flow}
          onFlowChange={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        />
      </div>
    </div>
  );
}
