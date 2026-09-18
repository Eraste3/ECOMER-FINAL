import React from 'react';
import { motion } from 'framer-motion';
import { BotIcon, LoaderIcon } from 'lucide-react';
import { severityMeta, wasteMeta } from '../../utils/labels';
import type { Severity, WasteType } from '../../types';

export interface AiResult {
  detectedType: WasteType;
  confidence: number;
  severity: Severity;
}

export function AiAnalysisCard({
  loading,
  result



}: {loading: boolean;result: AiResult | null;}) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-navy p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-ecomer/15 text-cyan-ecomer">
          <LoaderIcon className="h-5 w-5 animate-spin" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Analyse IA en cours…</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Classification de l’image et estimation de la gravité
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: '95%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-cyan-ecomer" />
            
          </div>
        </div>
      </div>);

  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-navy p-4">
      
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-ecomer/15 text-cyan-ecomer">
          <BotIcon className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-white">Analyse IA terminée</p>
        <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Modèle v2.4
        </span>
      </div>

      <dl className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-white/5 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-slate-400">Type détecté</dt>
          <dd className="mt-1 text-[13px] font-bold text-white">
            {wasteMeta[result.detectedType].label}
          </dd>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-slate-400">Confiance</dt>
          <dd className="mt-1 text-[13px] font-bold text-cyan-ecomer">{result.confidence} %</dd>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-slate-400">Gravité estimée</dt>
          <dd className="mt-1 text-[13px] font-bold" style={{ color: severityMeta[result.severity].color }}>
            {severityMeta[result.severity].label}
          </dd>
        </div>
      </dl>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${result.confidence}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-cyan-ecomer" />
        
      </div>
    </motion.div>);

}