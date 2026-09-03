import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import MyHandles from '@/pages/MyHandles';
import Docs from '@/pages/Docs';
import Legal from '@/pages/Legal';
import Privacy from '@/pages/Privacy';
import Faq from '@/pages/Faq';
import Contact from '@/pages/Contact';
import Footer from '@/components/solhandle/Footer';
import Admin from '@/pages/Admin';
import HandlePage from '@/pages/HandlePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedBrands from '@/pages/ProtectedBrands';
import Explore from '@/pages/Explore';
import Developers from '@/pages/Developers';
import Integrations from '@/pages/Integrations';
import IntegrationGuide from '@/pages/IntegrationGuide';
import MintSuccess from '@/pages/MintSuccess';
import Financials from '@/pages/Financials';
import Roadmap from '@/pages/Roadmap';
import ProtocolPaper from '@/pages/ProtocolPaper';
import Earn from '@/pages/Earn';
import ReferralTerms from '@/pages/ReferralTerms';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-handles" element={<MyHandles />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/protocol-paper" element={<ProtocolPaper />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/referral-terms" element={<ReferralTerms />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/integrations/:slug" element={<IntegrationGuide />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/protected-brands" element={<ProtectedBrands />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/financials" element={<Financials />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mint-success" element={<MintSuccess />} />
        <Route path="/:handle" element={<HandlePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App