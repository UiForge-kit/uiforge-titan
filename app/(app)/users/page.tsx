import type { Metadata } from "next";
import { Suspense } from "react";
import { UsersView } from "@/components/users/users-view";

export const metadata: Metadata = { title: "Utilisateurs", description: "Gérez les comptes utilisateurs : invitation, rôle, suspension et suppression." };

export default function Page() {
  // useSearchParams needs a Suspense boundary for static rendering
  return (
    <Suspense>
      <UsersView />
    </Suspense>
  );
}
