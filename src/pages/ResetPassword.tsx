import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setStatus("ready");
    });

    const urlError = new URLSearchParams(window.location.hash.slice(1)).get("error_description");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus("ready");
      else if (urlError) setStatus("invalid");
    });
    const timeout = window.setTimeout(() => setStatus(current => (current === "checking" ? "invalid" : current)), 3000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      toast.success("Your password has been updated");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3">My account</p>
          <h1 className="font-bold tracking-tight text-4xl">Set a new password</h1>

          {status === "checking" && <p className="mt-6 text-muted-foreground">Checking your reset link...</p>}

          {status === "invalid" && (
            <div className="mt-8 rounded-lg bg-secondary p-5">
              <p className="font-semibold">This reset link is invalid or has expired</p>
              <p className="mt-1 text-sm text-muted-foreground">Reset links can only be used once. Request a new one to continue.</p>
              <Link to="/auth?mode=forgot" className="mt-4 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/80">
                Request a new link
              </Link>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="eyebrow">New password</Label>
                <Input id="new-password" name="password" type="password" required minLength={6} autoComplete="new-password" className="h-12 bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="eyebrow">Confirm new password</Label>
                <Input id="confirm-password" name="confirm" type="password" required minLength={6} autoComplete="new-password" className="h-12 bg-card" />
              </div>
              {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-lg text-sm font-semibold" disabled={loading}>
                {loading ? "Saving..." : "Save new password"}
              </Button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
