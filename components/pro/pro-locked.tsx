import { LockIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { PRO_COPY } from "@/config/pro-copy";
import { SITE } from "@/config/site";

interface ProLockedProps {
  feature: string;
  description?: string;
}

export function ProLocked({ feature, description }: ProLockedProps) {
  const url = SITE.upgrade.url;
  return (
    <div className="surface-card">
      <EmptyState
        icon={LockIcon}
        title={`${feature} · ${PRO_COPY.title}`}
        description={description ?? PRO_COPY.noLink}
        action={url ? <Button render={<a href={url} target="_blank" rel="noopener noreferrer" />}>{PRO_COPY.cta}</Button> : undefined}
      />
    </div>
  );
}
