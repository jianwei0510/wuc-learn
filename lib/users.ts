import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export type StoredUser = {
  id: number;
  clerk_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function syncCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (
      clerk_id,
      email,
      first_name,
      last_name,
      username,
      image_url,
      created_at,
      updated_at
    )
    VALUES (
      @clerkId,
      @email,
      @firstName,
      @lastName,
      @username,
      @imageUrl,
      @now,
      @now
    )
    ON CONFLICT(clerk_id) DO UPDATE SET
      email = excluded.email,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      username = excluded.username,
      image_url = excluded.image_url,
      updated_at = excluded.updated_at
  `).run({
    clerkId: userId,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    username: user.username ?? null,
    imageUrl: user.imageUrl ?? null,
    now,
  });

  return db
    .prepare("SELECT * FROM users WHERE clerk_id = ?")
    .get(userId) as StoredUser;
}
