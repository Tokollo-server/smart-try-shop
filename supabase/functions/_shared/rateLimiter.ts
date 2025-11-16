import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function checkRateLimit(
  authHeader: string | null,
  endpoint: string,
  maxRequests: number = 20,
  windowMinutes: number = 10
): Promise<{ allowed: boolean; userId?: string; error?: string }> {
  if (!authHeader) {
    return { allowed: false, error: 'Authentication required' };
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Verify user
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError || !user) {
    return { allowed: false, error: 'Invalid authentication' };
  }

  // Check rate limit
  const { data, error } = await supabase.rpc('check_rate_limit', {
    _user_id: user.id,
    _endpoint: endpoint,
    _max_requests: maxRequests,
    _window_minutes: windowMinutes
  });

  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, userId: user.id }; // Fail open to prevent blocking on errors
  }

  return { allowed: data as boolean, userId: user.id };
}