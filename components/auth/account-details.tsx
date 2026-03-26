"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
interface UserData {
  email?: string
  user_metadata?: Record<string, any>
}

interface Profile {
  first_name?: string
  last_name?: string
  email?: string
  preferred_flavour?: string
  wellness_goals?: string[]
  wellness_goal?: string
  focus_areas?: string[]
}

export function AccountDetails({
  user,
  profile,
}: {
  user: UserData
  profile: Profile | null
}) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Personal Info */}
      <section className="border border-border p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          Personal Information
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="mt-1 text-sm text-foreground">
              {profile?.first_name || user.user_metadata?.first_name || "Not set"}{" "}
              {profile?.last_name || user.user_metadata?.last_name || ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="mt-1 text-sm text-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Wellness Profile */}
      {profile?.wellness_goal && (
        <section className="border border-border p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Wellness Profile
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Wellness Goal</p>
              <p className="mt-1 text-sm capitalize text-foreground">
                {profile.wellness_goal}
              </p>
            </div>
            {profile.focus_areas && profile.focus_areas.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Focus Areas</p>
                <p className="mt-1 text-sm capitalize text-foreground">
                  {profile.focus_areas.join(", ")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-border text-sm uppercase tracking-widest"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
