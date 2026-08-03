import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ReceiptsPage from './pages/ReceiptsPage';
import NewReceiptPage from './pages/NewReceiptPage';
import ReceiptDetailPage from './pages/ReceiptDetailPage';
import VerifyPage from './pages/VerifyPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProofPage from './pages/ProofPage';
import ProfilePage from './pages/ProfilePage';
import WorkerPublicPage from './pages/WorkerPublicPage';
import OrganisationPage from './pages/OrganisationPage';
import AdminPage from './pages/AdminPage';
import PrivacyPage, {
  TermsPage,
  EvidencePolicyPage,
  DisputePolicyPage,
  SupportPage,
} from './pages/LegalPages';
import NotFoundPage from './pages/NotFoundPage';

/** Amplify/S3 may 301 SPA paths to a trailing slash; normalize for React Router. */
function StripTrailingSlash() {
  const { pathname, search, hash } = useLocation();
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return <Navigate to={`${pathname.slice(0, -1)}${search}${hash}`} replace />;
  }
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <StripTrailingSlash />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/proof/:verificationCode" element={<ProofPage />} />
          <Route path="/workers/:profileSlug" element={<WorkerPublicPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/evidence-policy" element={<EvidencePolicyPage />} />
          <Route path="/dispute-policy" element={<DisputePolicyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['WORKER']} />}>
            <Route path="/receipts" element={<ReceiptsPage />} />
            <Route path="/receipts/new" element={<NewReceiptPage />} />
            <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['ORGANISATION']} />}>
            <Route path="/organisation" element={<OrganisationPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
