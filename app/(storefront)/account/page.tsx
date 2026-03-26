import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountDetails } from "@/components/auth/account-details"

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Salt & Stone AU account.",
}

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile
  let profile = null
  try {
    const { data } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = data
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
      <h1 className="font-serif text-3xl tracking-wide text-foreground">
        My Account
      </h1>
      <AccountDetails user={user} profile={profile} />
    </div>
  )
}
