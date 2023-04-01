import { writable } from "svelte/store";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Create a writable store with an initial value of an empty array
export const accountStore = writable([]);

export default supabase