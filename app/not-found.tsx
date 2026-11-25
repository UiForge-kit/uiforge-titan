import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-canvas flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-4xl font-semibold" data-numeric>
        404
      </p>
      <p className="text-muted-foreground max-w-sm text-sm">
        Cette page n&apos;existe pas. Elle a peut-être été renommée ou supprimée.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground mt-2 h-9 rounded-lg px-4 text-sm leading-9 font-medium"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
