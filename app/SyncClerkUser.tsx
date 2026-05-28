import { syncCurrentUser } from "@/lib/users";

export async function SyncClerkUser() {
  await syncCurrentUser();

  return null;
}
