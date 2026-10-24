export default function NetworkHomeLayout({ mobileActions, context, children }) {
  return <>
    <div className="sd-network-mobile-actions">{mobileActions}</div>
    <div className="sd-network-home-layout">
      <section className="sd-network-social-stream" aria-label="Social timeline">{children}</section>
      <aside className="sd-network-context-stack" aria-label="Identity and Pay">{context}</aside>
    </div>
  </>;
}