import { Button } from '@/components/ui/button';
import { RulebookContent } from './RulebookContent';

interface RulebookScreenProps {
  onBack: () => void;
}

export function RulebookScreen({ onBack }: RulebookScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-auto gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-widest"
        >
          ←
        </Button>
        <div className="h-3.5 w-px bg-border" />
        <h1 className="text-xs font-bold uppercase tracking-widest">
          How to Play
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-4 py-6">
          <RulebookContent />
        </div>
      </div>
    </div>
  );
}