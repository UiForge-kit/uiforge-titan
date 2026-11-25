"use client";

import { Menu01Icon, Moon02Icon, Search01Icon, SidebarLeft01Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/theme-store";
import { useUIStore } from "@/store/ui-store";

export function Topbar() {
  const { setMobileNav, toggleSidebar, setCommandOpen } = useUIStore();
  const { resolved, toggleScheme } = useThemeStore();

  return (
    <div className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
      <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir la navigation">
        <Icon icon={Menu01Icon} size={18} />
      </Button>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon-sm" className="hidden md:inline-flex" onClick={toggleSidebar} />} aria-label="Replier la barre latérale">
          <Icon icon={SidebarLeft01Icon} size={17} />
        </TooltipTrigger>
        <TooltipContent className="gap-2">Replier la barre latérale <Kbd keys={["mod", "B"]} className="opacity-80" /></TooltipContent>
      </Tooltip>

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="border-border bg-surface text-muted-foreground hover:border-border-strong flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 text-sm transition-colors md:max-w-md"
      >
        <Icon icon={Search01Icon} size={15} />
        <span className="flex-1 truncate text-left">Rechercher un client, un utilisateur, une page…</span>
        <Kbd keys={["mod", "K"]} className="hidden sm:inline-flex" />
      </button>

      <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={toggleScheme} aria-label="Basculer clair / sombre">
        <Icon icon={resolved === "dark" ? Sun03Icon : Moon02Icon} size={17} />
      </Button>
    </div>
  );
}
