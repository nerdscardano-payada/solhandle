import { base44 } from '@/api/base44Client';
import { projectFields, projectQuery } from '@/components/solhandle/network/projects/projectDirectory';

export const rankingFields = ['integration_valid_until', 'integration_reviewed_at', 'integration_evidence_url', 'integration_reviewed_website', 'handle_valid_until', 'handle_reviewed_at', 'handle_evidence_url', 'handle_owner_wallet', 'handle_verified_asset', 'handle_reviewed_handle', 'handle_reviewed_website', 'handle_checked_at', 'handle_check_due_at', 'handle_check_interval_hours', 'handle_check_status'];
export function rankingBenefits(listing, now = Date.now()) {
  return {
    integration: Date.parse(listing.integration_valid_until) > now && listing.integration_reviewed_website === listing.website,
    handle: Date.parse(listing.handle_valid_until) > now && ['ACTIVE', 'UNCERTAIN'].includes(listing.handle_check_status) && !!listing.handle_owner_wallet && listing.handle_reviewed_handle === listing.handle && listing.handle_reviewed_website === listing.website
  };
}
export async function rankedProjectPage(args, pageParam) {
  const fields = [...projectFields, ...rankingFields], limit = args.limit || 20;
  if (args.admin) return base44.entities.NetworkProject.filter(projectQuery(args), { sort: 'name', limit, fields, ...(pageParam ? { cursor: pageParam } : {}) });
  const asOf = pageParam?.asOf || new Date().toISOString();
  const integration = { integration_valid_until: { $gt: asOf } };
  const noIntegration = { $or: [{ integration_valid_until: { $exists: false } }, { integration_valid_until: null }, { integration_valid_until: { $lte: asOf } }] };
  const handle = { $and: [{ handle_valid_until: { $gt: asOf } }, { handle_check_status: { $in: ['ACTIVE', 'UNCERTAIN'] } }] };
  const noHandle = { $or: [{ handle_valid_until: { $exists: false } }, { handle_valid_until: null }, { handle_valid_until: { $lte: asOf } }, { handle_check_status: { $nin: ['ACTIVE', 'UNCERTAIN'] } }] };
  const tiers = [integration, { $and: [noIntegration, handle] }, { $and: [noIntegration, noHandle] }];
  let tier = pageParam?.tier || 0, cursor = pageParam?.cursor;
  const items = [];
  while (tier < tiers.length && items.length < limit) {
    const page = await base44.entities.NetworkProject.filter({ $and: [projectQuery(args), tiers[tier]] }, { sort: 'name', fields, limit: limit - items.length, ...(cursor ? { cursor } : {}) });
    items.push(...page.items);
    if (page.has_more) return { items, has_more: true, next_cursor: { tier, cursor: page.next_cursor, asOf } };
    tier += 1; cursor = undefined;
  }
  return { items, has_more: tier < tiers.length, next_cursor: tier < tiers.length ? { tier, asOf } : undefined };
}