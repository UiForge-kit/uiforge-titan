"use client";

import Link from "next/link";
import { ArrowDown01Icon, Moon02Icon, PaintBoardIcon, RepeatIcon, Settings01Icon, Sun03Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Swatch } from "@/components/theme/swatch";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { getStaffRole } from "@/config/staff-roles";
import { MODULES } from "@/config/modules";
import { THEMES, getTheme } from "@/config/themes";
import { useCurrentStaff } from "@/hooks/use-staff";
import { cn } from "@/lib/utils";
import { resetAll } from "@/store/data";
import { useThemeStore } from "@/store/theme-store";
import type { ColorScheme } from "@/types/theme";

const SCHEMES: Array<{ value: ColorScheme; label: string }> = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Auto" },
];

export function StaffMenu() {
  const { member } = useCurrentStaff();
  const { themeId, scheme, setTheme, setScheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" className="border-border bg-surface hover:border-border-strong flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-colors" />}>
        <PersonAvatar name={member.name} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] leading-tight font-medium">{member.name}</span>
          <span className="text-muted-foreground block truncate text-[0.6875rem] leading-tight">{getStaffRole(member.role).label}</span>
        </span>
        <Icon icon={ArrowDown01Icon} size={15} className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-64">
        {MODULES.map((module) => module.accountMenu && <module.accountMenu key={module.id} />)}

        <DropdownMenuGroup>
          <DropdownMenuLabel>Apparence</DropdownMenuLabel>
          <div className="flex gap-1 px-1 pb-1">
            {SCHEMES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setScheme(option.value);
                }}
                className={cn("flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors", scheme === option.value ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}
              >
                {option.value === "light" && <Icon icon={Sun03Icon} size={14} />}
                {option.value === "dark" && <Icon icon={Moon02Icon} size={14} />}
                {option.label}
              </button>
            ))}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon={PaintBoardIcon} size={15} />
            <span className="flex-1">Thème</span>
            <span className="text-muted-foreground text-xs">{getTheme(themeId).name}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72">
            {THEMES.map((theme) => (
              <DropdownMenuItem key={theme.id} onClick={() => setTheme(theme.id)} className="items-start gap-2.5 py-2">
                <Swatch colors={theme.swatch} className="mt-0.5" />
                <span className="flex-1">
                  <span className="block font-medium">{theme.name}</span>
                  <span className="text-muted-foreground block text-xs leading-snug">{theme.description}</span>
                </span>
                {theme.id === themeId && <Icon icon={Tick02Icon} size={15} className="text-brand mt-0.5" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Icon icon={Settings01Icon} size={15} />
          <span className="flex-1">Réglages</span>
          <Kbd keys={["mod", ","]} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void resetAll()}>
          <Icon icon={RepeatIcon} size={15} />
          Réinitialiser la démo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
