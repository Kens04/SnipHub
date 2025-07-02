import { createClient } from '@supabase/supabase-js'

//管理者のみ作成、削除、変更可能にする
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);