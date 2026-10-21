# SolHandle retirement affected-surface inventory

21 October 2026. Initial repository inventory, paired with PHASE_0_AUDIT.md. References below designate change targets or dependency boundaries, not approval for bulk deletion. Pattern hits require semantic review; generic marketplace identity integration is NOT native trading.

## Route map: src/App.jsx is authoritative

| Existing route | Current surface | Ordered target |
| --- | --- | --- |
| /market | Market, native trading | Redirect to /names?tab=for-sale; preserve handle query in discovery search |
| /upcoming/marketplace | Same Market page | Same redirect; no second native-trading entry point |
| /marketplace-recovery (new) | Does not exist | Wallet-based recovery, not platform-email registration; signed cancellation only |
| /earn | Earn | Discontinuation notice with historical claims/support access until resolved |
| /earn-litepaper | EarnLitepaper | Archive notice; preserve historical published terms/document |
| /leaderboard | Referral leaderboard | Discontinuation, not the distinct hidden Growth Hub leaderboard |
| /referral-terms | ReferralTerms | Historical archive, never silently rewrite accrued rights |
| /admin/referrals | AdminReferrals | Historical obligation review until formally retired |
| /developers/resolve | SolHandleResolve | Currently EMBED/gallery despite route name; retire this product surface, not resolve API |
| /widgets/:type | SolHandleWidgetPage | Embed discontinuation/migration notice |
| /developers/partner-mint | Admin-only PartnerMintPlan | Discontinued-product notice and archived plan |
| /developers/partner-mint/devnet-sdk | Admin-only PartnerMintSdkDevnet | Stop new pilot mint UI after preserved saved-intent/status recovery |
| /mint | Admin-only PartnerMint, NOT ordinary public mint | Retire pilot creation, preserve historical Devnet recovery; /?ref= must still load normal Home mint funnel |
| /, /search, /my-handles, /:handle | Shared mint/identity | Keep; remove native trading/Earn callouts and auto-attribution only |
| /names, /explore | Discover; /explore redirects | Keep every tab; external-only For Sale |
| /pay, /receive, /contacts | Payments and contacts | Keep unchanged |
| /developers, /docs | General developer identity APIs | Keep resolver API/SDK; remove embed and revenue-share promises only |
| /integrations, /integrate, /live-integrations, /integrations/:slug | Integration Center / intake / guides | Keep; remove discontinued widget/partner-mint options after receipt/history preservation |
| /growth, /flywheel, /growth/burn, /growth/handle-mint-payments, /upcoming/token-launch | Token/burn/accounting | Preserve retained utility; remove Earn-tier/revenue-sharing claims selectively |
| /quests/* | Hidden Growth Hub | Do not enable; remove future referral reward dependencies only if necessary |

## Native marketplace execution and recovery dependency graph

MarketplaceAction / PortfolioMarketplaceAction / HandleMarketplacePanel / MarketplaceCard / MarketplaceInbox / MarketOwnedHandles -> src/lib/marketplace.js -> prepareMarketplaceTx + submitMarketplaceTx -> shared solanaRpc + solhandleProtocol -> existing Mainnet program / Core assets.

`programs/solhandle/src/lib.rs` contains list_handle, buy_handle, delist_handle, place_bid, accept_bid, cancel_bid plus core identity/minting. DO NOT delete instructions or alter this program in this application migration.

Execution surfaces: src/pages/Market.jsx; src/components/solhandle/{MarketplaceAction,MarketplaceCard,MarketOwnedHandles,PurchaseConfirmation,MarketplaceInbox,PortfolioMarketplaceAction,HandleMarketplacePanel,HandleSearch,MyHandlesCard,HandleList}.jsx. Shared pages MyHandles, HandlePage and Search must keep their non-trading functions. Search imports must be traced before removing anything shared.

Index/cache/read targets: base44/functions/{getExploreHandles,getHandleAvailability,discoverNames,syncSolHandleIndex}/entry.ts; base44/shared/namesChain.ts; src/components/solhandle/useMarketplacePage.js; src/hooks/useMarketplaceNotifications.js; MarketplaceNotificationBell / MarketplaceNotificationItems / AdminTradeBell / AdminTradeOverview. Header imports bells; remove both desktop/mobile hooks to prevent background queries after visual removal. Preserve ownership indexing in syncSolHandleIndex.

Recovery-specific issue: delist currently appends database bid accounts in src/lib/marketplace.js; submitMarketplaceTx bulk marks bids cancelled. Replace with live-account recovery and exact confirmation reconciliation before exposing a dedicated recovery route.

Discovery surfaces: src/components/solhandle/names/{useNamesExplorer.js,NamesExplorer.jsx,NamesControls.jsx,NamesResults.jsx,NameCard.jsx}; discoverNames currently uses NativeListing for for-sale; namesChain also enriches native prices. Preserve search, wallet watch proof, ownership, all other tabs, paging and filtering; no native price should become an external quote.

Homepage/native promotion targets: src/pages/Home.jsx and src/components/solhandle/{LatestMarketplaceListings,home/HomeMarketplacePreview,home/HomeHandleTiles,home/HomeActivity,home/HomeProof}.jsx. Inspect actual imports rather than removing similarly named unused files blindly.

## Earn graph and shared mint boundaries

Home / ReferralLandingGate -> src/lib/referralAttribution.js -> referralAttribution backend -> ReferralAttribution + ReferralClick.

Mint preparation/confirmation/indexing -> shared/referralEngine.ts -> MintIntent + shared/earnNetwork.ts -> OriginReferral, EarnRevenueEvent, ReferralConversion, ReferralLedger, ReferralProfile, notifications.

Other Earn writers: recordEarnRevenue, submitMarketplaceTx (secondary royalty), processCreatorFeeCycle (creator fee), syncSolHandleIndex (mint processing), maintainReferralSystem (held rewards). Cut off all writers, not just referralPortal enrollment. Keep actual creator-fee/treasury financial accounting where required; retire only reward allocation.

Base44 backend targets: referralAttribution, referralPortal, manageReferrals, manageReferralSettings, recordEarnRevenue, maintainReferralSystem. Core shared callers requiring precise decoupling: solanaMintTransaction, syncSolHandleIndex, processCreatorFeeCycle. Backend/shared targets: referralEngine.ts, earnNetwork.ts, partnerMintEarnGuard.ts, partnerMintEarnPolicy.mjs, defaultPrimary.ts/defaultPrimary callers where relevant; preserve standard primary-handle behavior.

Frontend targets: src/pages/{Earn,EarnLitepaper,Leaderboard,ReferralTerms,AdminReferrals,MintSuccess}.jsx; src/components/solhandle/{ReferralLandingGate,ReferralDashboard,ReferralActivation,ReferralGettingStarted,ReferralShareActions,ReferralWidgetEmbed,ReferralStats,ReferralHistory,ReferralNotifications,ReferralPayoutHistory,ReferralLeaderboard,ReferralActivity,ReferralExplainer,ReferralRewardExamples,EarnRewardsOverview,EarnWays,EarnRevenueStreams,EarnNetworkStatus,AmbassadorBadge,AmbassadorBanner,AdminReferrals,AdminReferralSettings,AdminEarnNetworkSettings,AdminPayoutList}.jsx; src/lib/{referralAttribution.js,earnLitepaperContent.js,downloadEarnLitepaper.js,mintSolHandle.js}; src/components/solhandle/litepaper/*.jsx.

IMPORTANT: createReferralMintIntent currently writes MintIntent even without a referrer when referral_enabled=true. Keep core mint confirmation/idempotency/recovery independent before removing any referral helper. No referenced financial history or MintIntent table is a deletion target.

maintainReferralSystem also expires CREATED/PAYMENT_PENDING/TRANSACTION_SUBMITTED MintIntent and recovers stuck PROCESSING. Split needed core maintenance from rewards before pausing the whole workflow. Existing auth/side effects must be reviewed when extracting.

## Entities

Retain historical records (private exports already made): NativeListing, NativeBid, ReferralSettings, ReferralProfile, ReferralAttribution, OriginReferral, ReferralConversion, ReferralLedger, ReferralPayout, EarnRevenueEvent, ReferralClick, ReferralNotification, ShareEvent, FraudFlag, Partner, PartnerDistribution, CreatorFeeCycle, PartnerMintProfile, PartnerMintIntent, PartnerMintReceipt, PartnerMintAdminIntent, PartnerMintEvent.

Keep runtime core data: HandleIndex, PrimaryHandleCache, MintIntent, MintAttempt, FinancialTransaction, TokenMintPayment, TokenLaunchSettings, BurnActivity, GrowthCycle, GrowthHolder, Payment, PayLink, WalletContact, ContactsChallenge, ContactsSession, ReservedName/ProtectedName/PriceOverride and official claims data. Preserve other identity records not named in retirement scope.

External cache MarketplaceListing currently has 2 rows; do not reuse these as proof of current active external listing. A new verified listing model needs provider-specific status, integer lamports, source and verification/expiry times, stable identifiers and approved URL provenance; authorize public reads only if every field is public, admin-only writes. Load RLS guide before schema changes.

## Workflows (files found, not proof of live schedule status)

- Magic Eden Listing Sync: */5 * * * * -> syncMagicEdenListings. Replace adapter/cache validation before relying on it; don't delete external discovery synchronization merely because native trading retires.
- Referral System Maintenance: 15 * * * * -> maintainReferralSystem. Mixed core MintIntent maintenance + rewards. Split before retirement.
- SolHandle Index Sync: */5 * * * * -> syncSolHandleIndex. KEEP ownership/identity indexing; remove only referral/trading enrichment dependencies.
- SolHandle Growth Snapshot: 0 * * * * -> growthCurve. KEEP retained token/burn functionality.
- Discord Handle Registrations -> publishDiscord. KEEP new-handle registration notifications, remove trading/Earn messages only.
- Integration Request Confirmation -> IntegrationReceived email. KEEP intake receipt; review copy/options for retired products.

Load workflows guide/live state before changing status or definitions. No workflow status changed in Phase 0.

## Embed and Partner Mint boundaries

Hosted Embed pages: SolHandleResolve.jsx, SolHandleWidgetPage.jsx; src/components/solhandle/widgets/{WidgetGallery,SolHandleWidget,SearchWidget,WidgetResult,SearchWidgetResult,WidgetAffiliateSetup,WidgetExtrasOptions,WidgetActivitySection}.jsx and {createWidgetEmbed.js,useWidgetAutoHeight.js,useWidgetLookup.js,widgetOptions.js}; ReferralWidgetEmbed and EarnEmbedExplainer.

Partner Mint distribution: pages PartnerMintPlan, PartnerMint, PartnerMintSdkDevnet; src/components/solhandle/partner-mint/ (React mint component, hosted examples, preview/widget demos, phases, plan, registry, report and Devnet recovery). Local source SDK contains both resolution and new partner mint exports: do not delete src/lib/solhandle-sdk wholesale or break resolution exports when deprecating partner mint exports.

Backend pilot: partnerMintRead, partnerMintTransaction, partnerMintRegistry; base44/shared/partnerMint*.ts and partnerMintEarnPolicy.mjs. Keep saved-intent submit/status/reconciliation until assessed; new prepare/quote/registry-enrollment can be deprecated after notices. Retain DEVNET quote signer/RPC secrets until all saved attempts and recovery dependencies are resolved; never reuse or expose them in a browser.

Actual private inventory has one Devnet pilot profile and seven receipts. No Mainnet Partner Mint profile is evidenced. The public widget product can still have external consumers without a partner profile; repository data does not establish absence of deployed iframes.

PRESERVE resolveSolHandle, reverseResolveSolHandle, resolver safety checks, standard SDK, Integration Center, intake records and direct wallet/identity integration guides (including marketplace identity labels in integrationCatalog.js). Their use of the word marketplace does not make them native trading.

## Public communication/navigation targets

Shared navigation: navigationLinks.js, Header.jsx, HomeDesktopNavigation.jsx, HomeNavigation.jsx, MobileAppNavigation.jsx, MobileAppMore.jsx, MobileNavigation.jsx, MoreMenu.jsx, DevelopersMenu.jsx, DiscoverMenu.jsx, TokenGrowthMenu.jsx, UpcomingMenu.jsx, Footer.jsx, FooterNavigation.jsx, CommunityLinks.jsx.

Pages/copy: Home, Roadmap, Faq, Docs, ProtocolPaper, About, Legal, EarnLitepaper, ReferralTerms, TokenLaunchPreview, Growth, HandleMintPayments, PartnerMintPlan, Developers, Demos/DemoDetail and integration guides. Source content: roadmapMilestones.js, protocolPaperContent.js, earnLitepaperContent.js, integrationWizardContent.js, integrationCatalog.js; demos/demoCatalog.js and demo scenarios referring to trading/referrals; inspect scenario semantics before removal.

Localized copy must be updated across components/i18n, home locale modules, integration-locales, bundled locales, recent-locales, onboarding-locales and public locale resources. Avoid old promises reappearing in another language. Agent atto.jsonc and email IntegrationReceived.html also need scoped review; load respective guides before editing agent permissions/config.

Review index.html metadata/structured data, canonical links and any generated sitemap. No sitemap file was found by the scoped find command, so dashboard-generated/published SEO routes still need separate inspection; do not claim checked.

## Secrets and authority

Keep SOLANA_RPC_URL, HANDLE_QUOTE_SIGNER_KEYPAIR, IRYS_UPLOADER_PRIVATE_KEY, TURNSTILE keys, JUPITER_API_KEY, Discord secrets and ACTOR_TOKEN_SECRET unless separately proven unused. Their names are not evidence of retirement scope. No Embed-only API secret is identified in the supplied inventory. Partner Devnet signer/RPC require lifecycle review; no secret removed. Tensor API key is missing.

Authority transfer is a separate owner-authorized Mainnet operation. Do not infer hot-wallet custody from an address, generate new private keys in app code, request a recovery phrase, burn upgradeability, modify NFT collection, migrate NFTs, change balances or alter token supply in this retirement.