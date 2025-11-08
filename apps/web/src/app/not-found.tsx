// apps/web/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground max-w-prose">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="inline-block rounded-lg border px-4 py-2">
        Go back home
      </Link>
    </main>
  );
}
