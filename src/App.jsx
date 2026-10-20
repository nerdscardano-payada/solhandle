import { lazy, Suspense } from 'react';
import MobileTabCache from '@/components/solhandle/navigation/MobileTabCache';
import AndroidBackListener from '@/components/solhandle/navigation/AndroidBackListener';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
const PageNotFound = lazy(() => import('@/lib/PageNotFound'));
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import HomeEntrance from '@/components/solhandle/intro/HomeEntrance';
import Footer from '@/components/solhandle/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { growthHubVisible } from '@/components/solhandle/navigationLinks';
import GrowthHubLayout from '@/components/solhandle/quests/GrowthHubLayout';

const Home = lazy(() => import('@/pages/Home'));
const AndroidDownload = lazy(() => import('@/pages/AndroidDownload'));
const Demos = lazy(() => import('@/pages/Demos'));
const DemoDetail = lazy(() => import('@/pages/DemoDetail'));
const Search = lazy(() => import('@/pages/Search'));
const MyHandles = lazy(() => import('@/pages/MyHandles'));
const Docs = lazy(() => import('@/pages/Docs'));
const Legal = lazy(() => import('@/pages/Legal'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Faq = lazy(() => import('@/pages/Faq'));
const Contact = lazy(() => import('@/pages/Contact'));
const Admin = lazy(() => import('@/pages/Admin'));
const AdminMainnetTests = lazy(() => import('@/pages/AdminMainnetTests'));
const HandlePage = lazy(() => import('@/pages/HandlePage'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const ProtectedBrands = lazy(() => import('@/pages/ProtectedBrands'));
const Explore = lazy(() => import('@/pages/Explore'));
const Fun = lazy(() => import('@/pages/Fun'));
const Developers = lazy(() => import('@/pages/Developers'));
const PartnerMintPlan = lazy(() => import('@/pages/PartnerMintPlan'));
const SolHandleResolve = lazy(() => import('@/pages/SolHandleResolve'));
const SolHandleWidgetPage = lazy(() => import('@/pages/SolHandleWidgetPage'));
const TokenHandlesPlan = lazy(() => import('@/pages/TokenHandlesPlan'));
const PartnerMint = lazy(() => import('@/pages/PartnerMint'));
const PartnerMintSdkDevnet = lazy(() => import('@/pages/PartnerMintSdkDevnet'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const Integrate = lazy(() => import('@/pages/Integrate'));
const AdminIntegrations = lazy(() => import('@/pages/AdminIntegrations'));
const LiveIntegrations = lazy(() => import('@/pages/LiveIntegrations'));
const IntegrationGuide = lazy(() => import('@/pages/IntegrationGuide'));
const ParallaxIntegration = lazy(() => import('@/pages/ParallaxIntegration'));
const MintSuccess = lazy(() => import('@/pages/MintSuccess'));
const Financials = lazy(() => import('@/pages/Financials'));
const AdminReferrals = lazy(() => import('@/pages/AdminReferrals'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const ProtocolPaper = lazy(() => import('@/pages/ProtocolPaper'));
const Earn = lazy(() => import('@/pages/Earn'));
const EarnLitepaper = lazy(() => import('@/pages/EarnLitepaper'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const ReferralTerms = lazy(() => import('@/pages/ReferralTerms'));
const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
const About = lazy(() => import('@/pages/About'));
const PremiumDirectory = lazy(() => import('@/pages/PremiumDirectory'));
const DiscordVerify = lazy(() => import('@/pages/DiscordVerify'));
const UpcomingProjects = lazy(() => import('@/pages/UpcomingProjects'));
const TokenLaunchPreview = lazy(() => import('@/pages/TokenLaunchPreview'));
const Market = lazy(() => import('@/pages/Market'));
const Statistics = lazy(() => import('@/pages/Statistics'));
const LastMinted = lazy(() => import('@/pages/LastMinted'));
const Promo = lazy(() => import('@/pages/Promo'));
const Pay = lazy(() => import('@/pages/Pay'));
const MyContacts = lazy(() => import('@/pages/MyContacts'));
const Receive = lazy(() => import('@/pages/Receive'));
const Growth = lazy(() => import('@/pages/Growth'));
const Flywheel = lazy(() => import('@/pages/Flywheel'));
const AdminBurn = lazy(() => import('@/pages/AdminBurn'));
const HandleMintPayments = lazy(() => import('@/pages/HandleMintPayments'));
const BurnDashboard = lazy(() => import('@/pages/BurnDashboard'));
const GrowthHub = lazy(() => import('@/pages/GrowthHub'));
const GrowthHubDashboard = lazy(() => import('@/pages/GrowthHubDashboard'));
const GrowthHubExplore = lazy(() => import('@/pages/GrowthHubExplore'));
const GrowthHubQuest = lazy(() => import('@/pages/GrowthHubQuest'));
const GrowthHubSeasons = lazy(() => import('@/pages/GrowthHubSeasons'));
const GrowthHubLeaderboard = lazy(() => import('@/pages/GrowthHubLeaderboard'));
const GrowthHubRules = lazy(() => import('@/pages/GrowthHubRules'));
const AdminGrowthHub = lazy(() => import('@/pages/AdminGrowthHub'));

import ProtocolPageTracker from '@/components/solhandle/ProtocolPageTracker';
import AttoChat from '@/components/solhandle/AttoChat';
import PlatformSurface from '@/components/solhandle/PlatformSurface';
import MobileAppNavigation from '@/components/solhandle/MobileAppNavigation';
import MobileBackHeader from '@/components/solhandle/MobileBackHeader';
import MobileTabProvider from '@/components/solhandle/navigation/MobileTabProvider';
import LanguageProvider from '@/components/i18n/LanguageProvider';
import StaticTextLocalization from '@/components/i18n/StaticTextLocalization';
import NativeDialogLocalization from '@/components/i18n/NativeDialogLocalization';

const AuthenticatedApp = () => {
  const location = useLocation();
  const { pathname } = location;

  const isWidget = pathname.startsWith('/widgets/');
  const showMobileTabs = !isWidget && !pathname.startsWith('/admin') && !['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);
  const isChildPage = !isWidget && !['/', '/search', '/my-handles', '/pay', '/receive', '/quests', '/earn', '/explore', '/names'].includes(pathname);
  const { user, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
      {isChildPage && <MobileBackHeader />}
      <MobileTabCache className={isChildPage ? 'mobile-child-page min-w-0' : 'min-w-0'}>
          <Suspense fallback={<div role="status" aria-label="Loading page" className="flex min-h-[50dvh] items-center justify-center"><span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-names-accent"/></div>}>
      <Routes location={location}>
        <Route path="/" element={<HomeEntrance><Home /></HomeEntrance>} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/" replace />} />}>
          <Route path="/android" element={user?.role === 'admin' ? <AndroidDownload /> : <Navigate to="/" replace />} />
        </Route>
        <Route path="/demos" element={<Demos />} />
        <Route path="/demos/:slug" element={<DemoDetail />} />
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
          <Route path="/developers/partner-mint/devnet-sdk" element={<PartnerMintSdkDevnet />} />
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
        <Route path="/integrate" element={<Integrate />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Fadmin%2Fintegrations" replace />} />}>
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
        </Route>
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/live-integrations" element={<LiveIntegrations />} />
        <Route path="/integrations/parallax" element={<ParallaxIntegration />} />
        <Route path="/integrations/:slug" element={<IntegrationGuide />} />
        <Route path="/names" element={<Explore />} />
        <Route path="/fun" element={<Fun />} />
        <Route path="/explore" element={<Navigate to="/names" replace />} />
        <Route path="/directory" element={<PremiumDirectory />} />
        <Route path="/market" element={<Market />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/last-minted" element={<LastMinted />} />
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
        <Route path="/contacts" element={<MyContacts />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/growth/handle-mint-payments" element={<HandleMintPayments />} />
        <Route path="/growth/burn" element={<BurnDashboard />} />
        <Route path="/flywheel" element={<Flywheel />} />
        <Route path="/:handle" element={<HandlePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
          </Suspense>
      </MobileTabCache>
      {!isWidget && <div className="hidden md:block"><Footer /></div>}
      {!isWidget && <AttoChat />}
      {showMobileTabs && <MobileAppNavigation />}
    </PlatformSurface>
  );
};


function App() {
  return (
    <LanguageProvider><AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <MobileTabProvider>
          <AndroidBackListener />
          <StaticTextLocalization />
          <NativeDialogLocalization />
          <ScrollToTop />
          <ProtocolPageTracker />
          <AuthenticatedApp />
          </MobileTabProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider></LanguageProvider>
  )
}

export default App