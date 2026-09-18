
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { EcomerProvider } from './contexts/EcomerContext';
import { LandingPage } from './pages/Landing';
import { EcoShopPage } from './pages/EcoShopPage';
import { CitizenLayout } from './components/layout/CitizenLayout';
import { CitizenHome } from './pages/citizen/CitizenHome';
import { ReportFlowPage } from './pages/citizen/ReportFlow';
import { MyReportsPage } from './pages/citizen/MyReports';
import { EcoPointsPage } from './pages/citizen/EcoPoints';
import { RecycleurLayout } from './components/layout/RecycleurLayout';
import { RecycleurDashboard } from './pages/recycleur/RecycleurDashboard';
import { RecycleurMarketplace } from './pages/recycleur/RecycleurMarketplace';
import { RecycleurLotDetails } from './pages/recycleur/RecycleurLotDetails';
import { RecycleurTransactionsPage } from './pages/recycleur/RecycleurTransactions';
import { OngMapPage } from './pages/ong/OngMapPage';
import { OngInterventionsPage } from './pages/ong/OngInterventions';
import { OngInterventionDetailPage } from './pages/ong/OngInterventionDetail';
import { DirEnvLayout } from './components/layout/DirEnvLayout';
import { DirEnvDashboard } from './pages/dirEnv/DirEnvDashboard';
import { ValidationDeskPage } from './pages/dirEnv/ValidationDesk';
import { StrategicMapPage } from './pages/dirEnv/StrategicMap';
import { MunicipalInterventionsPage } from './pages/dirEnv/MunicipalInterventions';
import { DirEnvKpiPage } from './pages/dirEnv/DirEnvKpi';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsers';
import { AdminOngsPage } from './pages/admin/AdminOngs';
import { AdminReportsPage } from './pages/admin/AdminReports';
import { AdminPerimetersPage } from './pages/admin/AdminPerimeters';
import { AdminZonesPage } from './pages/admin/AdminZones';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalytics';
import { AdminAiPage } from './pages/admin/AdminAi';
import { AdminConfigPage } from './pages/admin/AdminConfig';
import { AdminMonitoringPage } from './pages/admin/AdminMonitoring';
import { AdminDocsPage } from './pages/admin/AdminDocs';
import { AdminEcoshop } from './pages/admin/AdminEcoshop';

export function App() {
  return (
    <EcomerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ecoshop" element={<EcoShopPage />} />

          <Route path="/citoyens" element={<CitizenLayout />}>
            <Route index element={<CitizenHome />} />
            <Route path="signaler" element={<ReportFlowPage />} />
            <Route path="mes-signalements" element={<MyReportsPage />} />
            <Route path="ecopoints" element={<EcoPointsPage />} />
          </Route>

          {/* Espace Recycleur (remplace l'espace ONG côté client B2B) */}
          <Route path="/recycleur" element={<RecycleurLayout />}>
            <Route index element={<RecycleurDashboard />} />
            <Route path="carte" element={<OngMapPage />} />
            <Route path="interventions" element={<OngInterventionsPage />} />
            <Route path="interventions/:id" element={<OngInterventionDetailPage />} />
            <Route path="marketplace" element={<RecycleurMarketplace />} />
            <Route path="marketplace/lot/:id" element={<RecycleurLotDetails />} />
            <Route path="commandes" element={<RecycleurTransactionsPage />} />
          </Route>

          <Route path="/dirEnv" element={<DirEnvLayout />}>
            <Route index element={<DirEnvDashboard />} />
            <Route path="demandes" element={<ValidationDeskPage />} />
            <Route path="carte" element={<StrategicMapPage />} />
            <Route path="interventions" element={<MunicipalInterventionsPage />} />
            <Route path="kpi" element={<DirEnvKpiPage />} />
          </Route>

          <Route path="/adminEcomer" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<AdminUsersPage />} />
            <Route path="signalements" element={<AdminReportsPage />} />
            <Route path="perimetres" element={<AdminPerimetersPage />} />
            <Route path="ong" element={<AdminOngsPage />} />
            <Route path="zones" element={<AdminZonesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="ia" element={<AdminAiPage />} />
            <Route path="configuration" element={<AdminConfigPage />} />
            <Route path="monitoring" element={<AdminMonitoringPage />} />
            <Route path="documentation" element={<AdminDocsPage />} />
            <Route path="ecoshop" element={<AdminEcoshop />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </EcomerProvider>
  );
}