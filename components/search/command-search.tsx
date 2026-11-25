"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { ALL_NAV_ITEMS } from "@/config/navigation";
import { PRO_COPY } from "@/config/pro-copy";
import { cn } from "@/lib/utils";
import { useCustomers, useUsers } from "@/store/data";
import { useUIStore } from "@/store/ui-store";

interface Result {
  id: string;
  group: "Pages" | "Clients" | "Utilisateurs";
  label: string;
  hint?: string;
  href: string;
  icon?: (typeof ALL_NAV_ITEMS)[number]["icon"];
}

export function CommandSearch() {
  const { commandOpen, setCommandOpen } = useUIStore();
  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent showCloseButton={false} className="top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Recherche globale</DialogTitle>
        <Panel onDone={() => setCommandOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function Panel({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const customers = useCustomers((s) => s.items);
  const users = useUsers((s) => s.items);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo<Result[]>(() => {
    const needle = query.trim().toLowerCase();
    const pages = ALL_NAV_ITEMS.filter((i) => !needle || i.label.toLowerCase().includes(needle)).map<Result>((i) => ({ id: i.id, group: "Pages", label: i.label, href: i.href, icon: i.icon, hint: i.locked ? PRO_COPY.badge : undefined }));
    if (!needle) return pages.slice(0, 6);
    const matchedCustomers = customers.filter((c) => c.name.toLowerCase().includes(needle) || c.domain.includes(needle)).slice(0, 5).map<Result>((c) => ({ id: c.id, group: "Clients", label: c.name, hint: c.domain, href: `/customers/${c.id}` }));
    const matchedUsers = users.filter((u) => u.name.toLowerCase().includes(needle) || u.email.includes(needle)).slice(0, 5).map<Result>((u) => ({ id: u.id, group: "Utilisateurs", label: u.name, hint: u.email, href: `/users?q=${encodeURIComponent(u.email)}` }));
    return [...pages.slice(0, 4), ...matchedCustomers, ...matchedUsers];
  }, [query, customers, users]);

  const open = (result: Result) => {
    onDone();
    router.push(result.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      open(results[active]);
    }
  };

  return (
    <div onKeyDown={onKeyDown}>
      <div className="border-border flex items-center gap-2.5 border-b px-4">
        <Icon icon={Search01Icon} size={17} className="text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          placeholder="Page, client, e-mail…"
          aria-label="Rechercher"
          className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
        />
        <Kbd keys={["Échap"]} />
      </div>
      <ul role="listbox" aria-label="Résultats" className="scrollbar-slim max-h-80 overflow-y-auto p-1.5">
        {results.length === 0 && <li className="text-muted-foreground px-3 py-8 text-center text-sm">Aucun résultat pour « {query} ».</li>}
        {results.map((result, i) => (
          <li key={`${result.group}-${result.id}`} role="option" aria-selected={i === active}>
            {(i === 0 || results[i - 1].group !== result.group) && <p className="label-caps px-2.5 pt-2 pb-1">{result.group}</p>}
            <button type="button" onClick={() => open(result)} onMouseEnter={() => setActive(i)} className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left", i === active && "bg-muted")}>
              {result.icon ? <Icon icon={result.icon} size={17} className="text-muted-foreground" /> : <PersonAvatar name={result.label} className="size-6" />}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{result.label}</span>
              {result.hint && <span className="text-muted-foreground truncate text-xs">{result.hint}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
