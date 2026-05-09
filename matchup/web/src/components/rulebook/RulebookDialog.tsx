import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RulebookContent } from './RulebookContent';

interface RulebookDialogProps {
  trigger: React.ReactElement;
}

export function RulebookDialog({ trigger }: RulebookDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85dvh] gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="border-b border-border px-5 pt-5 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold uppercase tracking-widest">
              How to Play
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-5 py-5">
          <RulebookContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}