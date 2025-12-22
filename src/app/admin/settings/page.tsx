import { requireAdminOnly } from "@/lib/auth/session"
import { SettingsForm } from "./SettingsForm"

export default async function AdminSettingsPage() {
  await requireAdminOnly()
  return <SettingsForm />
}
