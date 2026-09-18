import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  Building2Icon,
  CheckIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  UsersIcon } from
'lucide-react';
import { actors } from '../../data/landing-content';

const icons = {
  users: UsersIcon,
  building: Building2Icon,
  shield: ShieldCheckIcon,
  landmark: LandmarkIcon
};

export function ActorsSection() {
  return (
    <section id="acteurs" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ocean-bright">Les acteurs</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Quatre espaces, une même chaîne de responsabilité
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actors.map((a, i) => {
            const Icon = icons[a.icon];
            return (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card transition-transform hover:-translate-y-1">
                
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${a.accent}1f`, color: a.accent }}>
                  
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy">{a.title}</h3>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: a.accent }}>
                  {a.role}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {a.bullets.map((b) =>
                  <li key={b} className="flex gap-2 text-[13px] leading-snug text-slate-600">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-eco-green" />
                      {b}
                    </li>
                  )}
                </ul>
                <Link
                  to={a.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ocean hover:text-ocean-bright">
                  
                  {a.cta}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </motion.article>);

          })}
        </div>
      </div>
    </section>);

}