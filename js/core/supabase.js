/**
 * DiplomaStudy - Supabase Client
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://webdhsdicivbjctsigxi.supabase.co";
const SUPABASE_KEY = "sb_publishable_Oa0V3D_yE6yjuYEDM9dUGw_usausAhQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  realtime: {
    params: {
      eventsPerSecond: 5
    }
  }
});

console.log('[Supabase] ✅ Client initialized:', SUPABASE_URL);