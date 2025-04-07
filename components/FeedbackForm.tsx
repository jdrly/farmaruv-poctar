import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const user = useQuery(api.users.getCurrentUser);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    feedback: ""
  });
  
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Prefill email when user data is loaded
  useEffect(() => {
    if (user?.email && typeof user.email === 'string') {
      // @ts-expect-error - TypeScript has issues with the email type but it works correctly
      setFormData(currentFormData => ({
        ...currentFormData,
        email: user.email
      }));
    }
  }, [user?.email]); // Remove the eslint-disable comment
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendFeedbackEmail = async () => {
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Nepodařilo se odeslat zpětnou vazbu.');
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error sending feedback email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Nepodařilo se odeslat zpětnou vazbu. Zkuste to prosím později." 
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consentChecked) {
      setSubmitError("Pro odeslání formuláře je nutné souhlasit se zpracováním osobních údajů.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const result = await sendFeedbackEmail();
      
      if (result.success) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: user?.email || "",
            feedback: ""
          });
          onOpenChange(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(result.error || "Nepodařilo se odeslat zpětnou vazbu.");
      }
    } catch (_) { // Change 'error' to '_' to avoid the unused variable error
      setSubmitError("Došlo k neočekávané chybě. Zkuste to prosím později.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Zpětná vazba</DialogTitle>
          <DialogDescription>
            Vaše názory a připomínky jsou pro nás důležité. Pomozte nám zlepšit aplikaci Farmářův počtář.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Jméno</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Příjmení</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Vaše zpětná vazba</Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consent" 
              checked={consentChecked} 
              onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
              required
            />
            <Label htmlFor="consent" className="text-sm gap-1">
              Souhlasím se zpracováním <Link href="/osobni-udaje" className="text-primary underline">osobních údajů</Link>
            </Label>
          </div>
          
          {submitError && (
            <div className="text-red-500 text-sm">{submitError}</div>
          )}
          
          {submitSuccess && (
            <div className="text-green-500 text-sm">Vaše zpětná vazba byla úspěšně odeslána. Děkujeme!</div>
          )}
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !consentChecked} 
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                "Odesílání..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Odeslat zpětnou vazbu
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}