import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const metric = (row, index) => Number(row?.metricValues?.[index]?.value || 0);
const dimension = (row, index) => row?.dimensionValues?.[index]?.value || "Unknown";
const topCounts = (items, key, limit = 8) => Object.entries(items.reduce((acc, item) => { const value = item[key] || "Unknown"; acc[value] = (acc[value] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, count]) => ({ name, count }));

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const recent = (items) => items.filter((item) => Date.parse(item.timestamp || item.created_date) >= Date.parse(since));
    const pages = recent(await base44.asServiceRole.entities.PageView.list("-timestamp", 500));
    const searches = recent(await base44.asServiceRole.entities.SearchAnalytics.list("-timestamp", 500));
    const funnel = recent(await base44.asServiceRole.entities.FunnelEvent.list("-timestamp", 500));
    const profiles = await base44.asServiceRole.entities.ReferralProfile.list("-created_date", 500);
    const conversions = await base44.asServiceRole.entities.ReferralConversion.list("-created_date", 500);
    const steps = ["SEARCH", "CLAIM_CLICK", "WALLET_CONNECTED", "MINT_STARTED", "MINT_CONFIRMED"];
    const funnelCounts = steps.map((step) => ({ step, count: new Set(funnel.filter((event) => event.step === step).map((event) => event.session_id)).size }));
    const profileCodes = Object.fromEntries(profiles.map((profile) => [profile.id, profile.referral_code]));
    const referralVisits = topCounts(pages.filter((page) => page.referral_code), "referral_code", 10);
    const referralMints = conversions.reduce((acc, item) => { const code = profileCodes[item.referral_profile_id] || "Unknown"; acc[code] = (acc[code] || 0) + 1; return acc; }, {});
    const referrals = referralVisits.map((item) => ({ code: item.name, visits: item.count, mints: referralMints[item.name] || 0 }));
    let ga = { connected: false };
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection("google_analytics");
      const accountsResponse = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", { headers: { Authorization: `Bearer ${accessToken}` } });
      const accounts = await accountsResponse.json();
      const property = accounts.accountSummaries?.flatMap((account) => account.propertySummaries || [])[0];
      if (property?.property) {
        const reportResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/${property.property}:runReport`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ dateRanges: [{ startDate: "30daysAgo", endDate: "today" }], dimensions: [{ name: "sessionDefaultChannelGroup" }, { name: "country" }, { name: "deviceCategory" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }], limit: 100 }) });
        const report = await reportResponse.json();
        const rows = report.rows || [];
        ga = { connected: reportResponse.ok, property: property.displayName, activeUsers: Math.max(...rows.map((row) => metric(row, 0)), 0), sessions: rows.reduce((sum, row) => sum + metric(row, 1), 0), pageViews: rows.reduce((sum, row) => sum + metric(row, 2), 0), channels: rows.slice(0, 8).map((row) => ({ name: dimension(row, 0), country: dimension(row, 1), device: dimension(row, 2), users: metric(row, 0) })) };
      } else ga = { connected: false, message: "No GA4 property is accessible to the connected Google account." };
    } catch (error) { ga = { connected: false, message: error.message }; }
    return Response.json({ ga, protocol: { pageViews: pages.length, sessions: new Set(pages.map((page) => page.session_id)).size, walletSessions: new Set(pages.filter((page) => page.wallet_connected).map((page) => page.session_id)).size, popularPages: topCounts(pages, "route"), popularSearches: topCounts(searches, "handle"), searches: searches.slice(0, 20), funnel: funnelCounts, referrals } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}