export default function SecurityContactPolicy() {
  return <section id="security" className="mt-8 scroll-mt-8 rounded-2xl border border-border bg-card p-5 text-card-foreground">
    <h2 className="text-xl font-semibold">Report a security vulnerability</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Use the contact form above to report a suspected vulnerability privately. Start your message with “Security report” and include the affected feature or program, steps to reproduce, and the potential impact.</p>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Do not access other users’ data, move funds, disrupt services, or exploit a vulnerability on mainnet. Use local tests or devnet where possible. Please coordinate public disclosure with us so we can investigate and address the issue.</p>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Submitting a report does not guarantee a reward or authorize exploitation. Never include private keys or seed phrases.</p>
  </section>;
}