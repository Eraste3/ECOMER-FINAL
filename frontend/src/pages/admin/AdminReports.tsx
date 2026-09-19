import { useMemo, useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { Modal } from '../../components/modals/Modal';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { useSignalements } from '../../hooks/useSignalements';
import { formatDateTime } from '../../utils/format';
import { reportStatusMeta, severityMeta, severityOrder, wasteMeta } from '../../utils/labels';
import { ZONE_NAMES } from '../../data/mock-geo';
import type { ReportStatus, Severity, WasteType, ZoneName } from '../../types';

const wasteKeys: WasteType[] = ['plastiques', 'menagers', 'hydrocarbures', 'filets', 'divers', 'inconnue'];
const statusKeys: ReportStatus[] = ['en_attente', 'autorise', 'en_cours', 'resolu'];

export function AdminReportsPage() {
  const { getAllSignalements } = useSignalements();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [waste, setWaste] = useState<WasteType | 'tous'>('tous');
  const [severity, setSeverity] = useState<Severity | 'tous'>('tous');
  const [status, setStatus] = useState<ReportStatus | 'tous'>('tous');
  const [zone, setZone] = useState<ZoneName | 'tous'>('tous');
  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllSignalements();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [getAllSignalements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  const rows = useMemo(
    () =>
    reports.filter((r) => {
      if (waste !== 'tous' && r.typeDechet !== waste) return false;
      if (severity !== 'tous' && r.gravite !== severity) return false;
      if (status !== 'tous' && r.statut !== status) return false;
      if (zone !== 'tous' && r.zone !== zone) return false;
      if (query.trim() && !`${r.id} ${r.authorName || ''}`.toLowerCase().includes(query.toLowerCase()))
      return false;
      return true;
    }),
    [reports, waste, severity, status, zone, query]
  );

  const selectCls =
  'h-9 rounded-lg border-0 bg-white/5 px-2.5 text-[12px] text-white ring-1 ring-inset ring-white/10 focus:ring-cyan-ecomer/40';

  const columns: Array<Column<any>> = [
  {
    key: 'id',
    header: 'ID',
    render: (r) =>
    <div>
          <p className="font-semibold text-white">#{r.id}</p>
        </div>

  },
  {
    key: 'author',
    header: 'Auteur',
    render: (r) =>
    <div>
          <p className="text-slate-200">{r.authorName || 'Anonyme'}</p>
          <p className="text-[11px] text-slate-500">Citoyen</p>
        </div>

  },
  { key: 'type', header: 'Type', render: (r) => wasteMeta[r.typeDechet as keyof typeof wasteMeta]?.short || r.typeDechet, hideOn: 'sm' },
  { key: 'zone', header: 'Zone', render: (r) => r.zone || 'Inconnue', hideOn: 'md' },
  { key: 'sev', header: 'Gravité', render: (r) => <SeverityBadge severity={r.gravite || 'modere'} dark /> },
  { key: 'date', header: 'Date', render: (r) => formatDateTime(r.createdAt), hideOn: 'lg' },
  {
    key: 'status',
    header: 'Statut',
    render: (r) =>
    <StatusBadge label={reportStatusMeta[r.statut as keyof typeof reportStatusMeta]?.label || r.statut} tone={reportStatusMeta[r.statut as keyof typeof reportStatusMeta]?.tone || 'neutral'} dark />

  }];


  return (
    <div className="space-y-4">
      <Card tone="dark" className="overflow-hidden">
        <CardHeader
          tone="dark"
          title="Cartographie des signalements"
          subtitle={`${rows.length} signalement(s) affiché(s)`} />
        
        <div className="relative aspect-[16/9]">
          <MapView
            perimeters={[]}
            reports={rows}
            tone="dark"
            showHeatmap={false}
            ariaLabel="Carte des signalements filtrés" />
          
          <MapLegend tone="dark" className="absolute bottom-3 left-3" />
        </div>
      </Card>

      <Card tone="dark">
        <CardHeader
          tone="dark"
          title="Signalements centralisés"
          subtitle="Filtres avancés sur l’ensemble de la plateforme"
          action={
          <label className="relative">
              <span className="sr-only">Rechercher</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ID ou auteur…"
              className="h-9 w-48 rounded-lg bg-white/5 pl-9 pr-3 text-xs text-white ring-1 ring-inset ring-white/10 outline-none placeholder:text-slate-500 focus:ring-cyan-ecomer/40" />
            
            </label>
          } />
        
        <div className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3">
          <select value={waste} onChange={(e) => setWaste(e.target.value as WasteType | 'tous')} className={selectCls}>
            <option value="tous">Tous les types</option>
            {wasteKeys.map((w) =>
            <option key={w} value={w}>
                {wasteMeta[w].short}
              </option>
            )}
          </select>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity | 'tous')} className={selectCls}>
            <option value="tous">Toutes gravités</option>
            {severityOrder.map((s) =>
            <option key={s} value={s}>
                {severityMeta[s].label}
              </option>
            )}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | 'tous')} className={selectCls}>
            <option value="tous">Tous statuts</option>
            {statusKeys.map((s) =>
            <option key={s} value={s}>
                {reportStatusMeta[s].label}
              </option>
            )}
          </select>
          <select value={zone} onChange={(e) => setZone(e.target.value as ZoneName | 'tous')} className={selectCls}>
            <option value="tous">Toutes zones</option>
            {ZONE_NAMES.map((z) =>
            <option key={z} value={z}>
                {z}
              </option>
            )}
          </select>
        </div>
        <DataTable columns={columns} rows={rows} tone="dark" onRowClick={setDetail} />
      </Card>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        tone="dark"
        size="lg"
        title={detail ? `Signalement ${detail.id}` : ''}
        subtitle={detail ? `${detail.zone || 'Inconnue'} · ${wasteMeta[detail.typeDechet as keyof typeof wasteMeta]?.label || detail.typeDechet}` : undefined}
        footer={
        <Button variant="outline-dark" onClick={() => setDetail(null)}>
            Fermer
          </Button>
        }>
        
        {detail &&
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              {detail.photoUrl ?
            <img
              src={detail.photoUrl}
              alt="Photo du signalement"
              className="h-48 w-full rounded-xl object-cover" /> :


            <div className="flex h-48 items-center justify-center rounded-xl bg-white/5 text-[12px] text-slate-500">
                  Aucune photo transmise
                </div>
            }
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Analyse IA
                </p>
                <dl className="mt-2 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Type détecté</dt>
                    <dd className="font-semibold text-white">{wasteMeta[detail.typeDechet as keyof typeof wasteMeta]?.short || detail.typeDechet}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Gravité estimée</dt>
                    <dd className="font-semibold" style={{ color: severityMeta[detail.gravite as keyof typeof severityMeta]?.color || '#f59e0b' }}>
                      {severityMeta[detail.gravite as keyof typeof severityMeta]?.label || detail.gravite}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <dl className="grid gap-2">
              {[
            ['Auteur', `${detail.authorName || 'Anonyme'} (Citoyen)`],
            ['Zone', detail.zone || 'Inconnue'],
            ['Statut', reportStatusMeta[detail.statut as keyof typeof reportStatusMeta]?.label || detail.statut],
            ['Latitude', detail.latitude || 'N/A'],
            ['Longitude', detail.longitude || 'N/A'],
            ['Reçu le', formatDateTime(detail.createdAt)],
            ['Description', detail.description || 'Aucune']].
            map(([k, v]) =>
            <div key={k} className="rounded-lg bg-white/5 px-3 py-2.5">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-white">{v}</dd>
                </div>
            )}
            </dl>
          </div>
        }
      </Modal>
    </div>);

}