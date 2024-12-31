import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function checkMXRecord(domain: string): Promise<boolean> {
  try {
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const dnsData = await dnsResponse.json();
    return dnsData.Answer && dnsData.Answer.length > 0;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    // Basic syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid email format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Domain validation
    const domain = email.split('@')[1]
    const hasMXRecord = await checkMXRecord(domain)
    
    if (!hasMXRecord) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid email domain' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})