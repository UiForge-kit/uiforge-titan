import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Réglages", description: "Thème, police et raccourcis clavier." };

export default function Page() {
  // useSearchParams needs a Suspense boundary for static rendering
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  );
}
