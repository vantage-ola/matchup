import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotFoundScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center p-4">
      <div className="absolute right-3 top-3">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-xs space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            404 · Off the pitch
          </p>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            Out of play
          </h1>
          <p className="text-sm leading-snug text-muted-foreground">
            That URL isn't on the pitch. The ref's whistled it dead.
          </p>
        </div>

        <Link
          to="/"
          className={cn(
            buttonVariants(),
            'h-[52px] w-full text-sm font-bold uppercase tracking-wide',
          )}
        >
          <Home size={18} className="mr-2" />
          Back to menu
        </Link>

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
          Built for football heads
        </p>
      </div>
    </div>
  );
}
