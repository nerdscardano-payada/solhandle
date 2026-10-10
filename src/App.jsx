import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import HomeEntrance from '@/components/solhandle/intro/HomeEntrance';
import Search from '@/pages/Search';
import MyHandles from '@/pages/MyHandles';
import Docs from '@/pages/Docs';
import Legal from '@/pages/Legal';
import Privacy from '@/pages/Privacy';
import Faq from '@/pages/Faq';
import Contact from '@/pages/Contact';
import Footer from '@/components/solhandle/Footer';
import Admin from '@/pages/Admin';
import AdminMainnetTests from '@/pages/AdminMainnetTests';
import ProtectedRoute from '@/components/ProtectedRoute';
import HandlePage from '@/pages/HandlePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedBrands from '@/pages/ProtectedBrands';
import Explore from '@/pages/Explore';
import Fun from '@/pages/Fun';
import Developers from '@/pages/Developers';
import PartnerMintPlan from '@/pages/PartnerMintPlan';
import SolHandleResolve from '@/pages/SolHandleResolve';
import SolHandleWidgetPage from '@/pages/SolHandleWidgetPage';
import TokenHandlesPlan from '@/pages/TokenHandlesPlan';
import PartnerMint from '@/pages/PartnerMint';
import Integrations from '@/pages/Integrations';
import LiveIntegrations from '@/pages/LiveIntegrations';
import IntegrationGuide from '@/pages/IntegrationGuide';
import MintSuccess from '@/pages/MintSuccess';
import Financials from '@/pages/Financials';
import AdminReferrals from '@/pages/AdminReferrals';
import Roadmap from '@/pages/Roadmap';
import ProtocolPaper from '@/pages/ProtocolPaper';
import Earn from '@/pages/Earn';
import EarnLitepaper from '@/pages/EarnLitepaper';
import Leaderboard from '@/pages/Leaderboard';
import ReferralTerms from '@/pages/ReferralTerms';
import AdminAnalytics from '@/pages/AdminAnalytics';
import About from '@/pages/About';
import PremiumDirectory from '@/pages/PremiumDirectory';
import DiscordVerify from '@/pages/DiscordVerify';
import UpcomingProjects from '@/pages/UpcomingProjects';
import TokenLaunchPreview from '@/pages/TokenLaunchPreview';
import Market from '@/pages/Market';
import Promo from '@/pages/Promo';
import Pay from '@/pages/Pay';
import Growth from '@/pages/Growth';
import Flywheel from '@/pages/Flywheel';
import AdminBurn from '@/pages/AdminBurn';
import HandleMintPayments from '@/pages/HandleMintPayments';
import BurnDashboard from '@/pages/BurnDashboard';
import { growthHubVisible } from '@/components/solhandle/navigationLinks';
import GrowthHubLayout from '@/components/solhandle/quests/GrowthHubLayout';
import GrowthHub from '@/pages/GrowthHub';
import GrowthHubDashboard from '@/pages/GrowthHubDashboard';
import GrowthHubExplore from '@/pages/GrowthHubExplore';
import GrowthHubQuest from '@/pages/GrowthHubQuest';
import GrowthHubSeasons from '@/pages/GrowthHubSeasons';
import GrowthHubLeaderboard from '@/pages/GrowthHubLeaderboard';
import GrowthHubRules from '@/pages/GrowthHubRules';
import AdminGrowthHub from '@/pages/AdminGrowthHub';

import ProtocolPageTracker from '@/components/solhandle/ProtocolPageTracker';
import AttoChat from '@/components/solhandle/AttoChat';
import PlatformSurface from '@/components/solhandle/PlatformSurface';
import LanguageProvider from '@/components/i18n/LanguageProvider';
import StaticTextLocalization from '@/components/i18n/StaticTextLocalization';
import NativeDialogLocalization from '@/components/i18n/NativeDialogLocalization';

const AuthenticatedApp = () => {
  const { pathname } = useLocation();
  const isWidget = pathname.startsWith('/widgets/');
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
    <PlatformSurface>
      <Routes>
        <Route path="/" element={<HomeEntrance><Home /></HomeEntrance>} />
        <Route path="/search" element={<Search />} />
        <Route path="/mint-weekend" element={<Navigate to="/" replace />} />
        <Route path="/my-handles" element={<MyHandles />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/developers/partner-mint" element={<PartnerMintPlan />} />
        <Route path="/developers/resolve" element={<SolHandleResolve />} />
        <Route path="/widgets/:type" element={<SolHandleWidgetPage />} />
        <Route path="/developers/token-handles" element={<TokenHandlesPlan />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to={`/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />} />}>
          <Route path="/mint" element={<PartnerMint />} />
        </Route>
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/upcoming" element={<UpcomingProjects />} />
        <Route path="/upcoming/marketplace" element={<Market />} />
        <Route path="/upcoming/token-launch" element={<TokenLaunchPreview />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/protocol-paper" element={<ProtocolPaper />} />
        {growthHubVisible ? <Route element={<GrowthHubLayout />}>
          <Route path="/quests" element={<GrowthHub />} />
          <Route path="/quests/dashboard" element={<GrowthHubDashboard />} />
          <Route path="/quests/explore" element={<GrowthHubExplore />} />
          <Route path="/quests/quest/:slug" element={<GrowthHubQuest />} />
          <Route path="/quests/seasons" element={<GrowthHubSeasons />} />
          <Route path="/quests/leaderboard" element={<GrowthHubLeaderboard />} />
          <Route path="/quests/rules" element={<GrowthHubRules />} />
        </Route> : <Route path="/quests/*" element={<Navigate to="/" replace />} />}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Fadmin%2Fgrowth" replace />} />}>
          <Route path="/admin/growth" element={growthHubVisible ? <AdminGrowthHub /> : <Navigate to="/" replace />} />
        </Route>
        <Route path="/earn" element={<Earn />} />
        <Route path="/earn-litepaper" element={<EarnLitepaper />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/referral-terms" element={<ReferralTerms />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/live-integrations" element={<LiveIntegrations />} />
        <Route path="/integrations/:slug" element={<IntegrationGuide />} />
        <Route path="/names" element={<Explore />} />
        <Route path="/fun" element={<Fun />} />
        <Route path="/explore" element={<Navigate to="/names" replace />} />
        <Route path="/directory" element={<PremiumDirectory />} />
        <Route path="/market" element={<Market />} />
        <Route path="/protected-brands" element={<ProtectedBrands />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Fadmin%2Fmainnet-tests" replace />} />}>
          <Route path="/admin/mainnet-tests" element={<AdminMainnetTests />} />
        </Route>
        <Route path="/admin/financials" element={<Financials />} />
        <Route path="/admin/burn" element={<AdminBurn />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mint-success" element={<MintSuccess />} />
        <Route path="/discord-verify" element={<DiscordVerify />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/growth/handle-mint-payments" element={<HandleMintPayments />} />
        <Route path="/growth/burn" element={<BurnDashboard />} />
        <Route path="/flywheel" element={<Flywheel />} />
        <Route path="/:handle" element={<HandlePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!isWidget && <Footer />}
      {!isWidget && <AttoChat />}
    </PlatformSurface>
  );
};


function App() {

  return (
    <LanguageProvider><AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <StaticTextLocalization />
          <NativeDialogLocalization />
          <ScrollToTop />
          <ProtocolPageTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider></LanguageProvider>
  )
}

export default App