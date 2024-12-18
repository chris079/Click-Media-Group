import { createClient } from '@supabase/supabase-js';
import { propertyWords } from '../../../src/data/propertyWords';

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