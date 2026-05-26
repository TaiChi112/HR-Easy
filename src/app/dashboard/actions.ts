"use server";

import { signOut } from "@/auth";

export async function signOutToLandingAction() {
  await signOut({ redirectTo: "/" });
}