// Follow Deno Edge Function conventions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Include property words directly in the edge function
const propertyWords = [
  "AGENT", "ALARM", "APART", "ATTIC", "BANKS", "BLOCK", "BRICK", "BUILD", 
  "CHAIN", "CHEAP", "CLEAN", "CLOSE", "COURT", "DEEDS", "DELTA", "DOORS", 
  "DRIVE", "EAVES", "ELITE", "ENTRY", "FIXED", "FLOOR", "FRAME", "FRONT", 
  "GATES", "GRAND", "GRANT", "GREEN", "GROSS", "GUIDE", "HALLS", "HANDY", 
  "HOUSE", "INDEX", "LEASE", "LEVEL", "LIGHT", "LINKS", "LOANS", "MAJOR", 
  "METRO", "MEWS", "NORTH", "OFFER", "OPEN", "ORDER", "OWNER", "PLACE", 
  "PLAZA", "PRICE", "PRIME", "QUOTE", "RATES", "RENTS", "RIVER", "ROYAL", 
  "SPACE", "STATE", "STOCK", "STORE", "STYLE", "SUITE", "TOWER", "VALUE", 
  "URBAN", "ADDED", "SMART", "PITCH", "TRACK", "SCALE", "WORTH", "SITE"
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get a random word from the property words list
    const randomIndex = Math.floor(Math.random() * propertyWords.length);
    const newWord = propertyWords[randomIndex].toUpperCase();

    // Insert the new word for today
    const { error } = await supabase
      .from('daily_words')
      .insert([{ word: newWord }]);

    if (error) throw error;

    console.log('Daily word updated successfully:', newWord);
    
    return new Response(
      JSON.stringify({ message: 'Daily word updated successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error updating daily word:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});