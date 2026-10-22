# SOLHANDLE NETWORK — MASTER DEVELOPMENT SPECIFICATION

Source: product owner's specification, received 22 October 2026. This is the controlling product specification. Earlier fragmented development instructions, phase plans and product baselines are historical or supporting references; where they conflict, this specification takes precedence. This document states requirements, not a claim of completed implementation or production release.

## Status of this specification

This document replaces fragmented previous development instructions for SolHandle Network.

The objective is to BUILD the complete SolHandle Network product described below.

Privacy, moderation, security, scam protection and regulatory safeguards must be built into the architecture, but they must NOT be used as reasons to stop development of the social product.

Unresolved production authentication may temporarily prevent public users from writing data, but it must NOT prevent development and testing of profiles, posts, follows, feeds, notifications, $HANDLE entitlements or other Network functionality behind feature flags or test access.

## 1. PRODUCT DEFINITION

SolHandle Network is a social identity layer for Solana.

It is NOT primarily a wallet dashboard.
It is NOT simply the existing `/profile` page with posts added.
It is NOT an X clone with a wallet attached afterwards.

The fundamental product concept is:
**Your owned SolHandle becomes your public social identity on Solana.**

Architecture:
Wallet → proves control → SolHandle Network account → current owned SolHandle → public @ identity → social profile → posts / follows / community → payments → projects / integrations → additional $HANDLE utility

Core message:
**Your @. Your identity. Your network.**

## 2. EXISTING `/profile` MUST REMAIN SEPARATE

The existing `/profile` page is a wallet/handle identity page.
It may continue to show connected wallet, Primary Handle, ownership information and existing SolHandle functionality.
It is NOT the Network profile. Do not reuse its data model as the social account model.
SolHandle Network receives its own routes, database entities and permissions.

Suggested routes: `/network`, `/network/@handle`, `/network/discover`, `/network/notifications`, `/network/settings`, `/network/bookmarks`.
The exact routing implementation may vary, but the separation may not.

## 3. DO NOT REBUILD WALLET CONNECTION

SolHandle already connects wallets. Reuse the existing connected Solana wallet infrastructure.
Supported wallets should continue to include Wallet Standard-compatible wallets such as Phantom, Solflare and Backpack.
Do NOT introduce a mandatory second wallet.
Do NOT automatically create an embedded wallet.
Do NOT require users to transfer assets to another wallet.
Do NOT use fake email addresses to make wallet users fit an email-auth system.
The existing wallet remains the user's wallet.

## 4. NETWORK LOGIN FLOW

Required user experience:
Connect existing wallet → Sign one login message → Verify signature server-side → Create or retrieve immutable Network account → Read owned SolHandles → Read Primary Handle → Use Primary Handle as default public social identity → Enter SolHandle Network.

Use the Solana standard sign-in/message signing architecture.
Preferred: `solana:signIn` / Sign In With Solana.
Fallback: `solana:signOffchainMessage`.
Fallback where required: `solana:signMessage`.
Do NOT use a blockchain transaction merely to log in unless absolutely required for an unsupported hardware-wallet fallback.

The login challenge must contain at least domain, statement, wallet address, nonce, issued-at timestamp, expiration timestamp and SolHandle Network purpose.

Example human-readable statement:
`Sign in to SolHandle Network. This does not create a transaction or spend funds.`

Nonce must be server generated, random, single use, short lived and invalidated immediately after successful verification.

## 5. PRIMARY HANDLE INTEGRATION

Once wallet control is verified:
1. Query current SolHandle ownership.
2. Query current Primary Handle.
3. If a valid Primary Handle exists and is owned by that wallet, use it as the default Network public identity.
4. If multiple handles are owned, allow selection of another owned handle where product rules permit.
5. Never allow a wallet to activate a handle it does not currently own.
6. Revalidate handle ownership for sensitive identity operations.

Example wallet: `7xA9...Kp82`. Primary Handle: `@yourname`. Network shows **@yourname**.
The 44-character wallet should become secondary information, not the public identity.

## 6. ACCOUNT ≠ WALLET ≠ HANDLE

Mandatory: **ACCOUNT ≠ WALLET ≠ HANDLE ≠ PERMISSIONS**.

Account: permanent internal Network identity. Owns posts, followers, following, bookmarks, notifications, moderation history, preferences, privacy settings, project permissions and Network history.

Wallet: authentication/control proof. One account may eventually support more than one verified wallet.

Handle: public social identity currently used by the account. Transferable.

Permissions: account/project capabilities. Never transferred merely because an NFT handle transfers.

## 7. IMMUTABLE NETWORK USER ID

Every Network user receives an internal UUID, e.g. `network_user_id = 58df...`.
Never use wallet address, email, handle name or NFT asset ID as the primary user ID. Those can all change. The internal UUID cannot.

## 8. HANDLE TRANSFER BEHAVIOR

This must be correct before public launch.

Example: Alice owns `@alpha`, builds 500 posts, 2,000 followers, bookmarks, notifications, project permissions and private settings, then sells/transfers `@alpha`.

Alice's Network account remains Alice's. Alice keeps account, posts, follower relationships, bookmarks, moderation history, private information and project permissions.
Alice loses **the right to publicly act as @alpha**.

The new NFT owner receives **the right to claim @alpha as their public handle**.
The new owner DOES NOT receive Alice's account, posts, DMs, followers as account property, permissions, private data, payment history or moderation history.

Old posts must preserve historical attribution safely.
Suggested representation: `@alpha — owner at time of posting`, or maintain an internal historical handle snapshot.

## 9. FOLLOW GRAPH

Followers follow the NETWORK ACCOUNT. Not the NFT. Not the wallet. Not the handle asset.
Database relationship: `follower_user_id` → `followed_user_id`.
If a user changes handle, followers remain connected to that person/account.
This prevents popular handles from being sold together with social followers.

## 10. NETWORK PROFILE

The Network profile is social-first.

Required header hierarchy: Banner; Avatar; `@yourname`; optional display name; Bio; Current Owner Verified; Primary Handle Active; Payments Enabled; Join Date; optional verified external links.

Primary actions: **Follow**, **Pay @yourname**, **Share**.
Additional actions: View Handle, More.

Social statistics: Posts, Followers, Following.
Do NOT make wallet balance a primary profile statistic.
Do NOT publicly expose exact $HANDLE balance by default.

Tabs: Posts, Replies, Media, About.
Optional secondary SolHandle-specific areas: Projects, Integrations, Payments.

## 11. VERIFICATION TERMINOLOGY

Badges must have precise meanings.

**Current Owner Verified** means the Network has verified that the currently bound wallet owns this SolHandle.
It does NOT mean trustworthy person, safe project, approved investment, KYC verified or officially endorsed.

**Primary Handle Active** means the handle is currently the wallet's valid Primary SolHandle.

**Project Verified**: only introduce later with a documented verification procedure.

**Integration Verified** means a live SolHandle integration was confirmed.
Do not sell verification for $HANDLE.

## 12. PROFILE EDITING

Authenticated Network users may edit avatar, banner, display name, bio, website, social links and profile settings.
SolHandle @ name itself is NOT freely editable text. It comes from verified current SolHandle ownership.

## 13. SOCIAL FEATURES — REQUIRED

Build all of the following.

Posts: text, image support, links, mentions, timestamps, edit where policy permits, delete, share link.

Replies: nested enough for conversation; do not build infinitely deep UI.

Likes: one active like per user/post.

Reposts: native repost; optional quote-post later or in the same phase if straightforward.

Bookmarks: private; never publicly expose bookmark lists.

Follow: follow/unfollow.

Block: blocked account cannot meaningfully interact with blocker.

Mute: removes account/content from personal feed without notifying muted user.

## 14. FEEDS

Build three main feeds.

Following: posts from followed Network accounts, initially chronological.
Latest: recent public Network posts, chronological.
Discover: simple discovery/trending system, not a complex opaque recommendation algorithm in v1.

Suggested inputs: unique likes, unique replies, unique reposts, recent velocity, account abuse confidence and duplicate-content penalty.

Do NOT use $HANDLE holdings, wallet balance, token portfolio, political views or sensitive profiling to rank posts.
$HANDLE must never buy feed visibility.

## 15. POST COMPOSER

Composer visibly shows active identity: **Posting as @yourname**.
Capabilities: Text, Image, Link, optional project attachment, optional payment/request attachment later.
Primary button: **Post**.
If handle ownership became invalid, disable posting and request identity refresh.

## 16. DISCOVER

Create a real discovery layer.
Sections may include People, Creators, Projects, Businesses, Trending @ Handles, Recent Activity, New Network Profiles and Suggested Integrations.
Do not fabricate popularity. Only use actual Network data.

## 17. SEARCH

Global Network search supports `@handle`, display name, bio keywords, projects and posts.
Exact @ matches receive priority.
When a valid SolHandle exists but has no Network profile, show:
**@name exists on Solana — not yet active on SolHandle Network**.
Do not create a fake social profile.

## 18. NOTIFICATIONS

Required notification types: New Follower, Like, Reply, Repost, Mention, Project/Integration Notification, Important Security/Account Notification, Handle Ownership Change. Example: `@alice replied to your post`. Never expose sensitive wallet activity through social notifications without explicit design approval.

## 19. SOLHANDLE PAY INTEGRATION

A major differentiator: every Network profile can show **Pay @yourname**. Reuse the existing SolHandle Pay flow, supporting existing SOL, USDC, USDT and $HANDLE assets. Link to or embed the existing safe flow; do not rebuild payments. Resolve the current valid handle owner, never permanently trust a stale cached wallet.

## 20. CONTACTS INTEGRATION

Profile action **Save to Contacts**, or **In Contacts** if already saved. Reuse existing SolHandle Contacts; do not create another social address book.

## 21. CREATOR / PROJECT PROFILES

One shared profile architecture supports PERSON, CREATOR, PROJECT and BUSINESS with optional modules: description, official website, creator identity, official wallets, integration status, project cards, posts and payment link. These are not four separate systems.

## 22. PARALLAX / EXTERNAL INTEGRATIONS

Reusable **Connected Integrations** area. Examples: Parallax, Wallet Watch, Project Passport, Project Atlas; other verified integrations later. Only display actually confirmed integrations. Never fabricate partner cards.

## 23. $HANDLE UTILITY ARCHITECTURE

Build an entitlement layer now, not arbitrary access checks scattered through UI. Example levels: BASE, PRO, CREATOR, BUSINESS. Possible requirements: HANDLE_OWNER, HANDLE_TOKEN_BALANCE, HANDLE_TOKEN_PAYMENT, ADMIN_GRANT, PARTNER_GRANT. Do not finalize token thresholds without explicit instruction.

## 24. BASE NETWORK ACCESS

A valid owned SolHandle supplies basic profile, post, reply, like, repost, follow, bookmark, notifications, Pay, Contacts, search and discover. Normal use after obtaining a handle must not require buying $HANDLE.

## 25. FUTURE $HANDLE UTILITY

Support future advanced profile customization, extended modules, creator/business tools, analytics, scheduled posts, advanced media limits, custom project cards, advanced payment presentation, business payments, additional integrations and other premium Network features. Do not publicly promise exact features before activation.

## 26. $HANDLE MUST NOT CONTROL

Tokens never grant verification, safety, moderation priority, appeal priority, feed ranking, scam immunity, trust score or user rights. Wealth is not trustworthiness.

## 27. SAFETY — BUILD ALONGSIDE PRODUCT

Safety is required but is not the product. Keep the domain Safety Center as one module while building social functionality. User controls: Report, Block, Mute, Delete Own Post; mention controls later if needed.

## 28. REPORTING

Every public post/profile requires Report. Categories: scam/phishing, impersonation, spam, harassment, illegal content, malware, privacy violation, sexual content, threat/violence, copyright, other. Create a structured moderation case, not merely an email.

## 29. MODERATION DATA MODEL

Case fields: report_id, reporter_user_id, target_type, target_id, category, description, created_at, status, assigned_moderator, resolution, resolved_at. Actions: NO_ACTION, WARNING, LABEL, LINK_BLOCK, POST_REMOVE, TEMPORARY_RESTRICTION, TEMPORARY_SUSPENSION, PERMANENT_SUSPENSION. Record reason, manual/automated origin and appeal availability. Allegedly illegal content needs a workable notice/action process; restrictions/removals must be explainable rather than silent.

## 30. APPEALS

Build the model from day one. Users can appeal decisions. Fields: appeal_id, moderation_action_id, user_id, reason, submitted_at, reviewer, decision, decision_at. Preserve moderation history rather than requiring a later redesign.

## 31. DOMAIN / SCAM PROTECTION

Keep domain-policy Safety Center, extending with TRUSTED, NORMAL, UNKNOWN, SUSPICIOUS, BLOCKED. Unknown means unknown, not safe. Warn for suspicious external links: `You are leaving SolHandle. Never share your seed phrase or private key.` Confirmed blocked phishing domains must not be directly opened.

## 32. CONTRACT ADDRESS SAFETY

Recognize Solana addresses in content, optionally label **Solana address**. Official-project verification only with actual verified evidence. Never call unknown tokens safe, automatically replace addresses or alter copied contract addresses.

## 33. BOT / SPAM PROTECTION

Progressive internal risk controls can use account/handle age, post/reply/follow frequency, duplicate text, repeated links/mentions, CAPTCHA failures, reports and coordinated activity. No public bot score. Internal states: NORMAL, WATCH, CHALLENGE, RESTRICT, REVIEW.

## 34. BOT RESPONSE

Escalation: rate limit → CAPTCHA/challenge → temporary external-link restriction → temporary action restriction → manual review → justified suspension. Do not automatically ban on a single heuristic.

## 35. AUTOMATED ACCOUNTS

Prepare legitimate bots for later, labelled **Automated**. Unlabelled API bots must not imitate humans at scale. API architecture follows core launch.

## 36. PRIVACY MODEL

Social data stays OFF-CHAIN: posts, replies, likes, followers, bio, avatar, notifications, moderation, private settings, analytics and email if ever introduced. Never write this to Solana. Only genuine protocol ownership/proofs belong on-chain. Apply data minimisation and keep additional personal data off-chain.

## 37. WALLET PRIVACY

Do not prominently expose full wallets. Shortened wallet where needed, e.g. `7xA9...Kp82`; full address only through an explicit useful action. No public exact token balances or $HANDLE holdings by default.

## 38. USER PRIVACY SETTINGS

Eventually include public profile, discovery visibility, who may mention me, notification preferences, payment-button visibility, external links, connected wallets, active sessions, blocked/muted accounts, data export and delete Network account.

## 39. DATA EXPORT

Prepare `GET /network/settings/export`, or the platform-supported equivalent, returning usable structured user-created Network data: profile, posts, replies, following/followers, bookmarks, settings and appropriate account metadata.

## 40. ACCOUNT DELETION

Network deletion must not burn/delete a handle NFT. Flow: request → reauthentication/signature → deletion process → hidden profile → revoked sessions → off-chain/private removal or anonymisation according to retention policy. Solana history stays unchanged; explain this clearly.

## 41. COOKIES / ANALYTICS

Essential authentication/security storage may be used where legally strictly necessary. Non-essential/marketing analytics require applicable consent first, including ordinary audience-measurement cookies under Belgian guidance. Continue developing product analytics with consent-aware implementation.

## 42. AUTHENTICATION VS BASE44

Network identity must not depend on an email identity model. The immutable Network account is the source of truth. The requested fallback, when native wallet-session issuance is unavailable, is a secure supported custom gateway or minimal external Network auth/session service. Do not distort the product to fit email authentication. This requirement is not a claim that such a gateway already exists or is deployable in the current implementation environment.

## 43. CUSTOM NETWORK SESSION

Requested session after signature verification: short-lived, preferably secure HttpOnly cookie, server validated, rotatable, revocable and bound to immutable Network ID. No private keys or seed phrases. Supported platform authentication constraints still govern what can actually be implemented; developer wallet proofs are not production login sessions.

## 44. BASE44 WRITE SECURITY

Browser wallet-connected state never grants writes. Authorize create post/follow/like/edit server-side against the valid Network session. Privileged database access, when needed, occurs only after session authorization. No client service credentials.

## 45. FEATURE FLAGS

Flags keep development moving: public read on, public registration/posting off, social testers on, token entitlements off, creator profiles on as appropriate. Keep developing all Network functionality while public writes remain gated.

## 46. PUBLIC READ MODE

Read-only `/network` is allowed during development: posts/profiles/search/explore remain public as intended. It is not the final architecture. Continue development behind test/feature flags.

## 47. CORE DATABASE ENTITIES

Minimum logical models (existing physical names may map to these without duplicating identities):

- NetworkUser: immutable ID, status, created/updated timestamps.
- ConnectedWallet: ID, user_id, address, verified_at, revoked_at, is_primary.
- HandleBinding: ID, user_id, asset_id, handle, wallet_address, is_primary, started_at, ended_at, status.
- NetworkProfile: user_id, display_name, bio, avatar, banner, website, profile_type, visibility.
- Post: ID, author_user_id, handle_binding_id, handle_snapshot, content, created_at, edited_at, deleted_at, visibility.
- Media: ID, post_id, storage_path, type, metadata.
- Follow: follower_user_id, followed_user_id, created_at; unique pair.
- Reaction: user_id, post_id, type, created_at.
- Repost and Bookmark: user_id, post_id, created_at; bookmarks private.
- Notification: ID, user_id, actor_user_id, type, object_id, read_at, created_at.
- Report, ModerationAction and Appeal: structured cases, actions/audit records and appeals.
- Block: blocker_user_id, blocked_user_id; Mute: muter_user_id, muted_user_id.
- Entitlement: user_id, feature, source, valid_from, valid_until.
- SecurityEvent: authentication/abuse events; AuditLog: admin actions.

## 48. DATABASE CONSTRAINTS

A wallet cannot belong to two active accounts absent explicit migration/recovery. One active binding per handle. Unique follows, reactions per user/post/type and bookmarks per user/post. Prevent races server-side; frontend validation is insufficient.

## 49. OWNERSHIP REFRESH

Refresh on login, active-handle changes, high-impact identity actions, detected transfer and periodically for active sessions. Do not resolve chain ownership on every feed render. Cache with explicit freshness rules.

## 50. OWNERSHIP TRANSFER WATCHER

Detect transfers, invalidate active binding, prevent future posts under old ownership, notify prior account and allow new owner to claim. Never delete old social history due to transfer.

## 51. NETWORK HOME

Desktop: left navigation Home/Discover/Notifications/Bookmarks/Pay/Contacts/Profile; center composer and Following/Latest/Discover posts; right own identity, real trending handles, suggested profiles/projects and relevant modules. Mobile uses bottom navigation.

## 52. PROFILE DESIGN

Existing SolHandle visual language: dark background, cyan/blue/purple gradients, existing typography/navigation, restrained neon. Part of solhandle.io, not a separate third-party application.

## 53. MOBILE APP

Same architecture and accounts on mobile/web. Suggested bottom navigation Home/Discover/Pay/Notifications/Profile; Contacts under suitable Pay/profile/navigation placement. No separate user system.

## 54. ADMIN NETWORK DASHBOARD

Modules: users, posts, reports/moderation, appeals, suspensions, blocked domains, risk events, bot/spam cases, verified integrations, flags, entitlements and audit. Search by @handle, wallet, user ID or post ID.

## 55. CONTENT STATES

Logical states: ACTIVE, USER_DELETED, MOD_REMOVED, HIDDEN_PENDING_REVIEW. Do not immediately erase moderation evidence. Public projection respects deletion/privacy; retain only justified internal records.

## 56. MEDIA SECURITY

Validate MIME, size, re-encode when practical, remove unnecessary EXIF, malware scan where supported. No executable uploads or raw HTML posts. Sanitize links/content.

## 57. RATE LIMITING

Separate limits for login, posts, replies, likes, follows, reports, search, profile edits and media uploads, not one global throttle.

## 58. AUDIT LOGGING

Record admin actor, action, target, reason, timestamp and relevant before/after. No silently editable administrative actions.

## 59. TESTING REQUIREMENTS — AUTH

Phantom, Solflare, Backpack; desktop and Android mobile; rejected wallet prompt; expired/reused nonce; wrong signature; wallet switch; disconnect/reconnect; multiple supported wallet accounts; expired/revoked session.

## 60. TESTING REQUIREMENTS — HANDLE

Primary present/absent; multiple handles; transfer or Primary change while logged in; burned/invalid handle; stale cache; simultaneous claims; new-owner claim; prior-owner history retention.

## 61. TESTING REQUIREMENTS — SOCIAL

Post/delete/reply; like/unlike; repost/unrepost; follow/unfollow; block/mute; bookmarks; notifications; search; pagination; duplicate/concurrent requests; deleted/suspended users and transferred handles.

## 62. TESTING REQUIREMENTS — ABUSE

100 rapid posts; repeated identical replies; mass follows/mentions; phishing/punycode links; seed-phrase scam text; malicious image filename; repeated/abusive reports; blocked-user interaction; suspended-user session.

## 63. PERFORMANCE

Paginated feeds; no whole-table browser reads. Cache public profiles, Primary resolution, safe ownership results with expiry and trending. Do not cache sensitive authorization too long.

## 64. ACCESSIBILITY

Keyboard buttons, meaningful labels, sufficient contrast, non-color-only trust indicators, loading/error states and responsive design.

## 65. ERROR COPY

No raw backend/security errors in UI. Example: `We couldn't verify your wallet. Please try signing in again.` Technical detail belongs in server logs, not an Ed25519 exception shown to a user.

## 66. DEVELOPMENT PHASES

1. FOUNDATION + SOCIAL CORE: NetworkUser, wallet-signature auth POC, handle binding/Primary mapping, profile/editing, posts/replies/likes/reposts/follow, Following/Latest, search, public read and test writes.
2. COMPLETE SOCIAL EXPERIENCE: Discover, notifications, bookmarks, media, block/mute, Pay, Contacts, creator/project profiles and connected integrations.
3. SAFETY + PUBLIC PARTICIPATION: production wallet login, reports/moderation/appeals, domain protection, spam/challenges, sessions, privacy/export/delete and public writes.
4. $HANDLE UTILITY: entitlement engine, Pro/Creator/Business tools, analytics and profile enhancements; activate exact thresholds only with approval.
5. EXPANSION: justified communities, developer/API, labelled automation, advanced discovery and integrations. DMs only after separate safety review.

## 67. DO NOT BUILD YET

No exchange, copy-trading execution, custody, internal launchpad, anonymous DMs, advertising marketplace, financial reputation score, pay-to-rank, token-based verification, second mandatory wallet or synthetic-email wallet accounts.

## 68. FIRST REAL NETWORK BETA — ACCEPTANCE

A user must be able to:
1. Open Network.
2. Connect existing Solana wallet.
3. Sign safe login message.
4. Have wallet verified.
5. Detect owned handles.
6. Detect valid Primary.
7. Enter as @theirhandle.
8. Create/edit social profile.
9. Post.
10. Reply.
11. Like.
12. Repost.
13. Follow.
14. View Following.
15. View Latest.
16. Search another @handle.
17. Open another profile.
18. Pay through existing SolHandle Pay.
19. Save/block/mute as applicable.
20. Report abuse/scams.
21. Log out.
22. Reconnect to SAME account.
23. Transfer handle without transferring account/history.
24. New owner claims transferred handle without old private/social data.

If this flow does not work, beta is not complete.

## 69. NON-BLOCKING DEVELOPMENT RULE

Production dependencies never stop other development. Continue via test accounts, flags, mock/development adapters and staging. Continue posts/profiles/feeds/follows/notifications/moderation/entitlements even when production wallet sessions are unresolved. Authentication is a launch blocker, not a development blocker.

## 70. FINAL PRODUCT PRINCIPLE

**I own @yourname → prove control of its wallet → use it as public Network identity → communicate, connect, build reputation through real activity, represent projects and receive payments → optional $HANDLE utility expands capabilities.**

Do not reduce Network to a wallet profile or read-only directory, redesign it around email, or replace product development with compliance. Build the full social identity network with security/compliance engineered in from the start.

Implementation and acceptance status remain separate in MASTER_PROGRESS.md. No unfinished requirement is silently treated as complete.