export interface Step {
  n: string;
  title: string;
  text: string;
  icon: 'flag' | 'pin' | 'layers' | 'truck' | 'check';
  color: string;
}

export const howItWorks: Step[] = [
{
  n: '01',
  title: 'Signaler',
  text: 'Un citoyen photographie une pollution aquatique depuis son téléphone en moins de 30 secondes.',
  icon: 'flag',
  color: '#22d3ee'
},
{
  n: '02',
  title: 'Localiser',
  text: 'La position GPS est captée automatiquement et rattachée au quartier concerné.',
  icon: 'pin',
  color: '#1273b8'
},
{
  n: '03',
  title: 'Regrouper',
  text: 'Le moteur de clustering spatial fusionne les signalements proches en un périmètre de pollution.',
  icon: 'layers',
  color: '#0e4f7d'
},
{
  n: '04',
  title: 'Intervenir',
  text: 'La Direction de l’Environnement autorise une ONG ou mandate une équipe municipale.',
  icon: 'truck',
  color: '#f97316'
},
{
  n: '05',
  title: 'Résoudre',
  text: 'La preuve avant/après valide le nettoyage : le périmètre passe au statut « Résolu ».',
  icon: 'check',
  color: '#10b981'
}];


export interface Actor {
  title: string;
  role: string;
  bullets: string[];
  href: string;
  cta: string;
  accent: string;
  icon: 'users' | 'building' | 'shield' | 'landmark';
}

export const actors: Actor[] = [
{
  title: 'Citoyens',
  role: 'Signaler & suivre',
  bullets: [
  'Signalement photo géolocalisé',
  'Suivi du statut en temps réel',
  'EcoPoints, badges et classement'],

  href: '/citoyens',
  cta: 'Ouvrir l’espace citoyen',
  accent: '#22d3ee',
  icon: 'users'
},
{
  title: 'ONG & Associations',
  role: 'Intervenir sur le terrain',
  bullets: [
  'Carte des périmètres de sa zone',
  'Demande d’autorisation et de matériel',
  'Preuve avant / après nettoyage'],

  href: '/ONG',
  cta: 'Ouvrir l’espace ONG',
  accent: '#14b8a6',
  icon: 'building'
},
{
  title: 'Direction de l’Environnement',
  role: 'Valider & superviser',
  bullets: [
  'Guichet unique de validation',
  'Carte stratégique et heatmap',
  'Attribution du matériel municipal'],

  href: '/dirEnv',
  cta: 'Ouvrir la supervision',
  accent: '#f97316',
  icon: 'shield'
},
{
  title: 'Municipalité',
  role: 'Décider & piloter',
  bullets: [
  'Mandat des équipes municipales',
  'Indicateurs de salubrité urbaine',
  'Console d’administration ECOMER'],

  href: '/adminEcomer',
  cta: 'Ouvrir la console',
  accent: '#0e4f7d',
  icon: 'landmark'
}];


export const pipeline = [
{ label: 'Signalement', detail: 'Citoyen ou ONG', color: '#22d3ee' },
{ label: 'Analyse IA', detail: 'Type + gravité', color: '#38bdf8' },
{ label: 'Géolocalisation', detail: 'GPS + quartier', color: '#1273b8' },
{ label: 'Clustering spatial', detail: 'Rayon 100 m', color: '#0e4f7d' },
{ label: 'Périmètre de pollution', detail: 'Polygone généré', color: '#7c3aed' },
{ label: 'ONG / Municipalité', detail: 'Autorisation 30 j', color: '#f59e0b' },
{ label: 'Intervention', detail: 'Équipe + matériel', color: '#f97316' },
{ label: 'Preuve avant / après', detail: 'Contrôle visuel', color: '#22c55e' },
{ label: 'Résolution', detail: 'Zone assainie', color: '#10b981' }];


export const gamificationBadges = [
{ label: 'Éclaireur', points: '0 pt', desc: 'Premier signalement' },
{ label: 'Sentinelle', points: '100 pts', desc: '10 signalements validés' },
{ label: 'Éco-villageois', points: '300 pts', desc: 'Contributeur régulier' },
{ label: 'Gardien des eaux', points: '600 pts', desc: '5 périmètres résolus' },
{ label: 'Ambassadeur', points: '1 000 pts', desc: 'Référence citoyenne' }];