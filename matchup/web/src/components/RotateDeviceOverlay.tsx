import { useEffect, useState } from 'react';

function isPortraitMobile() {
  if (typeof window === 'undefined') return false;
  const portrait = window.matchMedia('(orientation: portrait)').matches;
  const small = window.matchMedia('(max-width: 900px)').matches;
  return portrait && small;
}

export function RotateDeviceOverlay() {
  const [show, setShow] = useState(isPortraitMobile);

  useEffect(() => {
    const update = () => setShow(isPortraitMobile());
    const portrait = window.matchMedia('(orientation: portrait)');
    const small = window.matchMedia('(max-width: 900px)');
    portrait.addEventListener('change', update);
    small.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      portrait.removeEventListener('change', update);
      small.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#0b1f12] px-8 text-center text-white">
      <div className="animate-[spin_2.4s_ease-in-out_infinite] text-6xl" aria-hidden>
        ⟳
      </div>
      <div className="flex h-24 w-14 items-center justify-center rounded-[14px] border-2 border-white/80 transition-transform duration-700 [transform:rotate(90deg)]">
        <div className="h-1 w-6 rounded-full bg-white/60" />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-wide">ROTATE YOUR DEVICE</h2>
        <p className="mt-2 max-w-xs text-sm text-white/70">
          Matchup needs landscape mode. Turn your phone sideways to play.
        </p>
      </div>
    </div>
  );
}
