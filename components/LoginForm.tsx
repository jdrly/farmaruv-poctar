'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  error?: string | null;
  flow?: "signIn" | "signUp";
  onFlowChange?: () => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  className,
  error,
  flow = "signIn",
  onFlowChange,
  onSubmit,
  ...props
}: LoginFormProps) {
  const { t } = useLanguage();
  
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit} {...props}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {flow === "signIn" ? t.signIn.title : t.signUp.title}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {flow === "signIn" ? t.signIn.description : t.signUp.description}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">{t.signIn.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vas@email.cz"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t.signIn.password}</Label>
                  {flow === "signIn" && (
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      {t.signIn.forgotPassword}
                    </a>
                  )}
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {flow === "signIn" ? t.signIn.submitButton : t.signUp.submitButton}
              </Button>
              <div className="text-center text-sm">
                {flow === "signIn" ? t.signIn.noAccount : t.signUp.hasAccount}
                <span
                  onClick={onFlowChange}
                  className="underline underline-offset-4 cursor-pointer ml-1"
                >
                  {flow === "signIn" ? t.signIn.registerLink : t.signUp.loginLink}
                </span>
              </div>
              {error && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
                  <p className="text-foreground font-mono text-xs">
                    {t.signIn.error} {error}
                  </p>
                </div>
              )}
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/farmaruvpoctar_loginbg.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t.common.termsAgreement} <a href="#">{t.common.termsOfService}</a>{" "}
        {t.common.and} <a href="#">{t.common.privacyPolicy}</a>.
      </div>
    </div>
  );
}
