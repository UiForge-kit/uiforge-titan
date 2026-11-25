export function Field({ label, error, hint, children }: { label: string; error?: string | null; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint && !error && <span className="text-muted-foreground text-xs">{hint}</span>}
      {error && <span role="alert" className="text-destructive text-xs">{error}</span>}
    </label>
  );
}
