import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Input } from "@/components/ui/input";

export function SearchInput({ value, onChange, placeholder = "Rechercher…" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="relative min-w-52 flex-1 md:max-w-xs">
      <Icon icon={Search01Icon} size={15} className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-9 pl-8" />
    </div>
  );
}
