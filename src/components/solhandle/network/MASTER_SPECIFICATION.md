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

Required notification types: New Follower, Like, Reply, Repost, Mention.

---

The supplied specification ends at the notification type list in section 18. No additional unprovided sections or release approvals are assumed. Implementation status is tracked separately in MASTER_PROGRESS.md; unfinished requirements remain explicitly open, not removed from scope.