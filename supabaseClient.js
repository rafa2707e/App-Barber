import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://reieucbrjzdfqkdudvnp.supabase.co';
const SUPABASE_ANON = 'sb_publishable_2cuoZTe82mNNm08z_hnctQ_1FRsuZd4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);