// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vxibtrvuwqvqutkxxhrb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWJ0cnZ1d3F2cXV0a3h4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzYwOTQsImV4cCI6MjA1MDExMjA5NH0.N4mexEBvckGS_6PILiP1WD9VtHOidApCLThwnI3BIqk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);