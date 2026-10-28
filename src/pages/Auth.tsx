import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, MailCheck } from "lucide-react";
import heroImage from "@/assets/hero-closet.jpg";

const friendlyAuthError = (message: string) =>
  /invalid login credentials/i.test(message) ? "Incorrect email or password." : message;

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"account" | "forgot">(searchParams.get("mode") === "forgot" ? "forgot" : "account");
  const [email, setEmail] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [resetSentTo, setResetSentTo] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please check your email to verify.");
      navigate("/");
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSignInError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSignInError(friendlyAuthError(error.message));
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }

    setLoading(false);
  };

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setResetSentTo(email);
    }

    setLoading(false);
  };

  const openForgot = () => {
    setSignInError(null);
    setResetSentTo(null);
    setMode("forgot");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img src={heroImage} alt="Smart Closet store" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <p className="mb-3 text-sm font-semibold text-white/80">Members get more</p>
            <p className="font-bold tracking-tight text-4xl leading-tight text-white">Save your favourites, track orders and check out faster.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            {mode === "forgot" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode("account")}
                  className="mb-6 flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to sign in
                </button>
                <h1 className="font-bold tracking-tight text-4xl">Forgot your password?</h1>
                {resetSentTo ? (
                  <div className="mt-8 flex gap-4 rounded-lg bg-secondary p-5">
                    <MailCheck className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Check your email</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        If an account exists for <span className="font-semibold text-foreground">{resetSentTo}</span>, we've sent a link to reset your password.
                      </p>
                      <button type="button" onClick={() => setResetSentTo(null)} className="mt-3 text-sm font-semibold underline">
                        Send again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-3 mb-8 text-muted-foreground">
                      Enter the email you signed up with and we'll send you a link to reset it.
                    </p>
                    <form onSubmit={handleResetRequest} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="eyebrow">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="h-12 bg-card"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-lg text-sm font-semibold" disabled={loading}>
                        {loading ? "Sending..." : "Send reset link"}
                      </Button>
                    </form>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="eyebrow mb-3">My account</p>
                <h1 className="font-bold tracking-tight text-4xl md:text-5xl">Welcome</h1>
                <p className="mt-3 mb-10 text-muted-foreground">
                  Sign in or create an account to continue shopping
                </p>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="mb-8 grid h-12 w-full grid-cols-2 rounded-full bg-secondary p-1">
                    <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign in</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="eyebrow">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="h-12 bg-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="signin-password" className="eyebrow">Password</Label>
                          <button type="button" onClick={openForgot} className="text-sm font-semibold hover:underline">
                            Forgot password?
                          </button>
                        </div>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          required
                          aria-invalid={!!signInError}
                          aria-describedby={signInError ? "signin-error" : undefined}
                          className="h-12 bg-card"
                        />
                      </div>
                      {signInError && (
                        <div id="signin-error" role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                          <p className="font-semibold text-destructive">{signInError}</p>
                          <p className="mt-1 text-muted-foreground">
                            Check your details and try again, or{" "}
                            <button type="button" onClick={openForgot} className="font-semibold text-foreground underline">
                              reset your password
                            </button>
                            .
                          </p>
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-lg text-sm font-semibold"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="eyebrow">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          className="h-12 bg-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="eyebrow">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          minLength={6}
                          className="h-12 bg-card"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-lg text-sm font-semibold"
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
