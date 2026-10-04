export const demoTokens = [
  { id: 'DEMO-MINT-0001', name: 'Demo Project Token', symbol: 'DEMO', price: 3, program: 'SPL Token' },
  { id: 'DEMO-MINT-0002', name: 'Demo Short Token', symbol: 'DMO', price: 15, program: 'Token-2022' }
];
export const demoDeposit = 0.25;
export const demoInitialState = { step: 0, token: null, wallet: '', challenge: null, proof: false, depositPaid: false, balancePaid: false, evidence: null, reviews: {}, rejection: '', registration: 'none', events: [] };
const record = (state, patch, message) => ({ ...state, ...patch, events: [...state.events, { message, at: new Date().toISOString() }] });
export function tokenClaimDemoReducer(state, action) {
  if (action.type === 'reset') return demoInitialState;
  if (action.type === 'detect' && state.step === 0) {
    const token = demoTokens.find(item => item.id === action.id);
    return token ? record(state, { token, step: 1 }, `Sample metadata loaded: $${token.symbol} → ${token.id}.`) : state;
  }
  if (action.type === 'challenge' && state.step === 1) return record(state, { wallet: 'DEMO-CLAIMANT-WALLET', challenge: action.challenge }, 'Demo claimant selected; unsigned sample challenge created.');
  if (action.type === 'proof' && state.step === 1 && state.challenge && Date.now() < state.challenge.expires) return record(state, { proof: true, step: 2 }, 'Wallet-control proof simulated. No signature requested; project identity still requires review.');
  if (action.type === 'deposit' && state.step === 2 && state.proof && action.evidence?.project?.trim() && action.evidence?.channel?.trim() && action.evidence?.description?.trim()) return record(state, { depositPaid: true, evidence: action.evidence, step: 3 }, 'Application submitted; 0.25 SOL deposit simulated and credited toward the total.');
  if (action.type === 'review' && state.step === 3 && state.depositPaid && ['reviewer-a', 'reviewer-b'].includes(action.reviewer) && !state.reviews[action.reviewer] && action.reason?.trim()) {
    if (action.approved && !action.checks?.every(Boolean)) return state;
    const reviews = { ...state.reviews, [action.reviewer]: { approved: action.approved, reason: action.reason.trim() } };
    const allApproved = reviews['reviewer-a']?.approved && reviews['reviewer-b']?.approved;
    return record(state, { reviews, rejection: action.approved ? '' : action.reason.trim(), step: action.approved ? (allApproved ? 4 : 3) : 6 }, `${action.reviewer} ${action.approved ? 'approved' : 'rejected'} the sample application: ${action.reason.trim()}`);
  }
  if (action.type === 'expire' && state.step === 3) return record(state, { step: 6, rejection: 'Sample application expired before both reviewers approved.' }, 'Application expiry simulated. Deposit remains non-refundable; no balance charged.');
  if (action.type === 'prepare' && state.step === 4 && state.reviews['reviewer-a']?.approved && state.reviews['reviewer-b']?.approved && ['none', 'expired'].includes(state.registration)) return record(state, { registration: 'prepared' }, 'Fresh evidence and both unique registry bindings checked (simulation). Registration prepared.');
  if (action.type === 'submit' && state.step === 4 && state.registration === 'prepared') return record(state, { balancePaid: true, registration: 'pending' }, state.balancePaid ? 'Registration resubmitted without another simulated payment.' : `${state.token.price - demoDeposit} SOL remaining balance simulated. Registration submitted; not finalized.`);
  if (action.type === 'transaction-expired' && state.step === 4 && state.registration === 'pending') return record(state, { registration: 'expired' }, 'Registration expiry simulated. Recover the existing payment; do not debit the balance again.');
  if (action.type === 'finalize' && state.step === 4 && state.registration === 'pending' && state.balancePaid) return record(state, { registration: 'finalized', step: 5 }, 'Demo registration finalized: forward and reverse fixture bindings agree. No on-chain record created.');
  return state;
}