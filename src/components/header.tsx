import { AuthButton } from "@/components/auth-button";
import { Icons } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-tighter">
            Musician's Toolkit
          </h1>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}
