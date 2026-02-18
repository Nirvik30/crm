export async function register() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase: Missing env variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)")
    return
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: supabaseAnonKey },
    })

    if (res.ok || res.status === 200) {
      console.log(`✅ Supabase connected — ${supabaseUrl}`)
    } else {
      console.error(`❌ Supabase connection failed — HTTP ${res.status} ${res.statusText}`)
    }
  } catch (e) {
    console.error("❌ Supabase connection failed —", e instanceof Error ? e.message : e)
  }
}
