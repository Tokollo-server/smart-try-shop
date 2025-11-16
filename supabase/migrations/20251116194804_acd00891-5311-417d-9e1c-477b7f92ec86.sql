-- Create table for rate limiting
CREATE TABLE public.api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, endpoint, window_start)
);

-- Enable RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limit data
CREATE POLICY "Users can view their own rate limits"
ON public.api_rate_limits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    _user_id UUID,
    _endpoint TEXT,
    _max_requests INTEGER,
    _window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate window start (round down to nearest window)
    window_start := date_trunc('minute', now()) - 
                    (EXTRACT(MINUTE FROM now())::INTEGER % _window_minutes) * INTERVAL '1 minute';
    
    -- Try to get existing record for this window
    SELECT request_count INTO current_count
    FROM public.api_rate_limits
    WHERE user_id = _user_id
      AND endpoint = _endpoint
      AND window_start = window_start;
    
    -- If no record exists, create one
    IF current_count IS NULL THEN
        INSERT INTO public.api_rate_limits (user_id, endpoint, request_count, window_start)
        VALUES (_user_id, _endpoint, 1, window_start);
        RETURN TRUE;
    END IF;
    
    -- Check if limit exceeded
    IF current_count >= _max_requests THEN
        RETURN FALSE;
    END IF;
    
    -- Increment counter
    UPDATE public.api_rate_limits
    SET request_count = request_count + 1
    WHERE user_id = _user_id
      AND endpoint = _endpoint
      AND window_start = window_start;
    
    RETURN TRUE;
END;
$$;

-- Cleanup old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    DELETE FROM public.api_rate_limits
    WHERE window_start < now() - INTERVAL '1 hour';
$$;