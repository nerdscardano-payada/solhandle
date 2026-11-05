import { Link } from 'react-router-dom';
const states={
  ACTIVE:['Koppeling actueel bevestigd','De ondertekenende wallet bezit deze officiële handle bij deze controle.'],
  NOT_REGISTERED:['Geen openbare koppeling','Dit tokenadres bestaat, maar heeft geen openbare SolHandle-koppeling. Dit betekent niet dat het token onveilig is.'],
  OWNERSHIP_CHANGED:['Koppeling niet meer actueel','Het actuele handle-eigendom komt niet meer overeen met de gepubliceerde koppeling, of de handle bestaat niet meer.'],
  WITHDRAWN:['Koppeling ingetrokken','Deze koppeling is ingetrokken. Er wordt geen actuele relatie bevestigd.'],
  UNAVAILABLE:['Controle tijdelijk niet mogelijk','De blockchaincontrole kon niet worden afgerond. Een eerdere bevestiging is geen actuele bevestiging.'],
  NOT_TOKEN:['Geen ondersteund tokenadres','Dit adres is geen geïnitialiseerd SPL- of Token-2022-tokenmint op Solana Mainnet.']
};
const date=value=>value?new Date(value).toLocaleString('nl-BE',{dateStyle:'medium',timeStyle:'long'}):'Niet beschikbaar';
export default function TokenCheckResult({result}) {
  const [label,description]=states[result.status],binding=result.binding;
  return <article className="token-check-result" data-status={result.status} aria-live="polite"><span className="ep-eyebrow">RESULTAAT · SOLANA MAINNET</span><h2>{label}</h2><p>{description}</p>
    {result.token?.name&&<p><strong>{result.token.name}</strong>{result.token.symbol&&` · $${result.token.symbol}`}</p>}
    <dl><div><dt>Exact gecontroleerd tokenadres</dt><dd className="select-text">{result.mint}</dd></div>
    {binding&&<><div><dt>Gepubliceerde handle</dt><dd><Link to={`/profile/${binding.handle}`}>@{binding.handle}</Link></dd></div><div><dt>Ondertekenende wallet</dt><dd className="select-text">{binding.wallet}</dd></div><div><dt>Gepubliceerd op</dt><dd>{date(binding.published_at)}</dd></div></>}
    <div><dt>Laatste afgeronde blockchaincontrole</dt><dd>{date(result.checked_at)}</dd></div>
    {binding&&<div><dt>Laatste bevestiging van de koppeling</dt><dd>{date(result.last_verified_at)}</dd></div>}
    {binding?.withdrawn_at&&<div><dt>Ingetrokken op</dt><dd>{date(binding.withdrawn_at)}</dd></div>}
    <div><dt>Opgevraagd op</dt><dd>{date(result.attempted_at)}</dd></div></dl>
    {result.cached&&<p className="ep-small">Resultaat uit kort geheugen, maximaal 30 seconden oud; bovenstaande controledatum blijft leidend.</p>}
    {result.status==='WITHDRAWN'&&<p className="ep-small">Bij een ingetrokken koppeling wordt geen nieuwe eigendomscontrole uitgevoerd.</p>}
    <a className="ep-link" href={`https://explorer.solana.com/address/${result.mint}`} target="_blank" rel="noopener noreferrer">Bekijk het adres op Solana Explorer</a>
  </article>;
}