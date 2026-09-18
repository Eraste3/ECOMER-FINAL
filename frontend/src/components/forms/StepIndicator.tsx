import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '../../utils/format';

export function StepIndicator({
  steps,
  current



}: {steps: string[];current: number;}) {
  return (
    <div>
      <ol className="flex items-center gap-1.5" aria-label="Progression du signalement">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s} className="flex flex-1 items-center gap-1.5">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                  done ?
                  'bg-eco-green text-white' :
                  active ?
                  'bg-eco-orange text-white' :
                  'bg-slate-200 text-slate-500'
                )}
                aria-current={active ? 'step' : undefined}>
                
                {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              {i < steps.length - 1 &&
              <span
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  done ? 'bg-eco-green' : 'bg-slate-200'
                )} />

              }
            </li>);

        })}
      </ol>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Étape {current + 1} / {steps.length} — {steps[current]}
      </p>
    </div>);

}