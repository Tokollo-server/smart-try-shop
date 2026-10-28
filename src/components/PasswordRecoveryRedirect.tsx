import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Captured before Supabase strips the recovery tokens from the URL.
const openedFromRecoveryLink = /type=recovery/.test(window.location.hash);

export const PasswordRecoveryRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (openedFromRecoveryLink && window.location.pathname !== "/reset-password") {
      // Keep the hash so Supabase can still read the recovery tokens on the reset page.
      navigate({ pathname: "/reset-password", hash: window.location.hash }, { replace: true });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY" && window.location.pathname !== "/reset-password") {
        navigate("/reset-password", { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};
