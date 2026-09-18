import React, { useState } from 'react';
import { CameraIcon, CheckCircle2Icon, ImageOffIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export function BeforeAfterProof({
  before,
  after,
  onAddAfter




}: {before?: string;after?: string;onAddAfter?: () => void;}) {
  const [split, setSplit] = useState(50);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-xl ring-1 ring-hairline">
          <figcaption className="flex items-center justify-between bg-slate-100 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Photo avant
            </span>
            <CameraIcon className="h-3.5 w-3.5 text-slate-400" />
          </figcaption>
          {before ?
          <img src={before} alt="État du site avant intervention" className="h-52 w-full object-cover" /> :

          <div className="flex h-52 flex-col items-center justify-center gap-2 bg-surface text-slate-400">
              <ImageOffIcon className="h-6 w-6" />
              <span className="text-[11px]">Aucune preuve</span>
            </div>
          }
        </figure>

        <figure className="overflow-hidden rounded-xl ring-1 ring-hairline">
          <figcaption className="flex items-center justify-between bg-emerald-50 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Photo après
            </span>
            {after ?
            <CheckCircle2Icon className="h-3.5 w-3.5 text-eco-green" /> :

            <CameraIcon className="h-3.5 w-3.5 text-emerald-400" />
            }
          </figcaption>
          {after ?
          <img src={after} alt="État du site après nettoyage" className="h-52 w-full object-cover" /> :

          <div className="flex h-52 flex-col items-center justify-center gap-3 border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700">
              <CameraIcon className="h-7 w-7" />
              <span className="max-w-[16rem] text-center text-[11px]">
                La preuve « après » débloque le passage du périmètre au statut « Résolu ».
              </span>
              {onAddAfter &&
            <Button variant="success" size="sm" onClick={onAddAfter}>
                  Ajouter la preuve après nettoyage
                </Button>
            }
            </div>
          }
        </figure>
      </div>

      {before && after &&
      <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Comparaison avant / après
          </p>
          <div className="relative select-none overflow-hidden rounded-xl ring-1 ring-hairline">
            <img src={after} alt="Après nettoyage" className="h-64 w-full object-cover sm:h-80" />
            <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${split}%` }}
            aria-hidden="true">
            
              <img
              src={before}
              alt=""
              className="h-64 w-full object-cover sm:h-80"
              style={{ width: `${100 / split * 100}%`, maxWidth: 'none' }} />
            
            </div>
            <div
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow"
            style={{ left: `${split}%` }} />
          
            <span className="pointer-events-none absolute left-3 top-3 rounded bg-abyss/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Avant
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded bg-eco-green/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Après
            </span>
            <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Curseur de comparaison avant/après"
            className="absolute inset-x-0 bottom-4 mx-auto block w-[80%] accent-white" />
          
          </div>
        </div>
      }
    </div>);

}