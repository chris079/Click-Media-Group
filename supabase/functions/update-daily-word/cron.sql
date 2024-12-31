-- Schedule the function to run at midnight UK time (1 AM UTC during BST, midnight UTC during GMT)
select
  cron.schedule(
    'update-daily-word-midnight-uk',
    '0 0 * * *', -- At midnight UTC
    $$
    select
      net.http_post(
        url:='https://vxibtrvuwqvqutkxxhrb.supabase.co/functions/v1/update-daily-word',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWJ0cnZ1d3F2cXV0a3h4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzYwOTQsImV4cCI6MjA1MDExMjA5NH0.N4mexEBvckGS_6PILiP1WD9VtHOidApCLThwnI3BIqk"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );