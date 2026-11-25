"use client";

import { Download04Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { getModule } from "@/config/modules";
import { PRO_COPY } from "@/config/pro-copy";
import { toast } from "@/store/toast-store";

// exports the filtered rows, not the whole collection
export function ExportButton({ filename, headers, rows }: { filename: string; headers: string[]; rows: Array<Array<string | number | null>> }) {
  const exportCsv = getModule("exports")?.exportCsv;
  return (
    <Button
      variant="outline"
      className="h-9"
      disabled={!exportCsv || rows.length === 0}
      title={exportCsv ? undefined : PRO_COPY.noLink}
      onClick={() => {
        exportCsv?.(filename, headers, rows);
        toast(`${rows.length} ligne${rows.length > 1 ? "s" : ""} exportée${rows.length > 1 ? "s" : ""}.`, "info");
      }}
    >
      <Icon icon={Download04Icon} size={15} /> Exporter
      {!exportCsv && <span className="text-muted-foreground ml-1 text-[0.625rem] font-semibold uppercase">{PRO_COPY.badge}</span>}
    </Button>
  );
}
