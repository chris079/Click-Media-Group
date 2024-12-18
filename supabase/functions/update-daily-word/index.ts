// Import from specific URLs for Deno compatibility
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Since we can't import directly from the src folder in Edge Functions,
// we'll need to include the words directly here
const propertyWords = [
  "ALIGN", "BLOCK", "COLOR", "FLOAT", "FOCUS", 
  "HOVER", "INDEX", "INSET", "MEDIA", "ORDER",
  "SCALE", "STACK", "STYLE", "TABLE", "WIDTH"
];

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.cron("Update Daily Word", "0 0 * * *", async () => {
  try {
    const randomIndex = Math.floor(Math.random() * propertyWords.length);
    const newWord = propertyWords[randomIndex];
    
    // Store the new word in the database
    const { error } = await supabase
      .from('daily_word')
      .upsert({ 
        id: 1, 
        word: newWord,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating daily word:', error);
      return;
    }

    console.log('Daily word updated successfully');
  } catch (error) {
    console.error('Error in update-daily-word function:', error);
  }
});