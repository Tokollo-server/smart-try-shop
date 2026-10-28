import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-closet.jpg";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img src={heroImage} alt="Smart Closet store" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/80">Members get more</p>
            <p className="font-display text-4xl leading-tight text-white">Save your favourites, track orders and unlock AI styling tools.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <p className="eyebrow mb-3">My account</p>
            <h1 className="font-display text-4xl md:text-5xl">Welcome</h1>
            <p className="mt-3 mb-10 text-muted-foreground">
              Sign in or create an account to continue shopping
            </p>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="mb-8 grid h-12 w-full grid-cols-2 rounded-full bg-secondary p-1">
                <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
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
                      className="h-12 bg-card"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="eyebrow">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      className="h-12 bg-card"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full text-xs uppercase tracking-[0.15em]"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
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
                    className="w-full h-12 rounded-full text-xs uppercase tracking-[0.15em]"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
