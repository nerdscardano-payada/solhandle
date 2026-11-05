export default function PassportTableRow({ row, index, picked, onPick, onOpen }) {
  return <tr className="dt1-row" data-dt1-row data-status={row.status} data-order={row.created_at} data-customer={row.token_name} data-total={row.proof_level} data-dt1-sel={picked?'1':'0'} style={{'--dt1-i':index}}>
    <td className="dt1-cell dt1-cell--pick"><span className="dt1-rowline" aria-hidden="true"/><input type="checkbox" checked={picked} onChange={onPick} aria-label={`Select @${row.handle} association`}/></td>
    <td className="dt1-cell dt1-cell--order"><span className="dt1-order">{new Date(row.created_at).toLocaleDateString()}</span></td>
    <td className="dt1-cell dt1-cell--cust"><span className="dt1-avatar" aria-hidden="true">{(row.token_symbol||row.token_name||'T').slice(0,2)}</span><button className="dt1-name dt1-open" onClick={onOpen}>{row.token_name||'Unnamed token'}</button>{row.source==='MEMBER'&&<span className="dt1-email">User registration</span>}</td>
    <td className="dt1-cell dt1-cell--email"><span className="dt1-email">@{row.handle}</span></td>
    <td className="dt1-cell dt1-cell--total"><span className="dt1-total" title={row.wallet}>{row.wallet.slice(0,4)}…{row.wallet.slice(-4)}</span></td>
    <td className="dt1-cell dt1-cell--status"><span className={`dt1-badge dt1-badge--${row.status}`}>{row.status}</span></td>
  </tr>;
}