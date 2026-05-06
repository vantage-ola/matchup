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
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to play</DialogTitle>
        </DialogHeader>
        <RulebookContent />
      </DialogContent>
    </Dialog>
  );
}
