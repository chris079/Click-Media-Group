import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const words = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json')
    const wordsJson = await words.json()
    const fiveLetterWords = Object.keys(wordsJson).filter(word => word.length === 5)
    const randomWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)].toUpperCase()
    
    // Store the word in Supabase or your preferred storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // You might want to store this in a separate table or configuration
    console.log(`New word set: ${randomWord}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})