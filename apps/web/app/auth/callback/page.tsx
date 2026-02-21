"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleAuthCallback() {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Processing authentication...</p>
    </div>
  )
}
