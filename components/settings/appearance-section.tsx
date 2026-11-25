"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { SectionCard } from "@/components/shared/section-card";
import { Swatch } from "@/components/theme/swatch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { FONT_OPTIONS } from "@/config/fonts";
import { THEMES } from "@/config/themes";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import { useThemeStore } from "@/store/theme-store";

export function AppearanceSection() {
  const { themeId, scheme, setTheme, setScheme } = useThemeStore();
  const { fontFamily, compactTables, set } = usePreferencesStore();

  return (
    <div className="grid gap-4">
      <SectionCard title="Thème">
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((theme) => (
            <button key={theme.id} type="button" aria-pressed={theme.id === themeId} onClick={() => setTheme(theme.id)} className={cn("surface-card flex flex-col gap-2 p-4 text-left transition-colors", theme.id === themeId ? "border-brand ring-brand ring-1" : "hover:border-border-strong")}>
              <span className="flex items-center justify-between"><Swatch colors={theme.swatch} />{theme.id === themeId && <Icon icon={Tick02Icon} size={15} className="text-brand" />}</span>
              <span className="text-sm font-medium">{theme.name}</span>
              <span className="text-muted-foreground text-xs">{theme.description}</span>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Mode et densité">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SegmentedControl className="w-fit" value={scheme} onChange={setScheme} options={[{ value: "light", label: "Clair" }, { value: "dark", label: "Sombre" }, { value: "system", label: "Système" }]} />
          <label className="flex items-center gap-2.5 text-sm"><Switch checked={compactTables} onCheckedChange={(v) => set("compactTables", v)} /> Tableaux compacts</label>
        </div>
      </SectionCard>
      <SectionCard title="Police">
        <div className="grid gap-2 sm:grid-cols-2">
          {FONT_OPTIONS.map((font) => (
            <button key={font.id} type="button" aria-pressed={font.id === fontFamily} onClick={() => set("fontFamily", font.id)} className={cn("surface-card p-3 text-left", font.id === fontFamily ? "border-brand ring-brand ring-1" : "hover:border-border-strong")}>
              <span className="block text-sm font-medium" style={{ fontFamily: font.variable }}>{font.label}</span>
              <span className="text-muted-foreground text-xs">{font.hint}</span>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
