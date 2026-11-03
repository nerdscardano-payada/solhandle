export const advisorStatusLabels={queued:'In wachtrij',researching:'Onderzoek bezig',completed:'Voltooid',partial:'Gedeeltelijk rapport',failed:'Mislukt'};
export function advisorAdminState(request,analysis){
 const status=analysis?.status||request.status||'queued';
 const stalled=['queued','researching'].includes(status)&&Date.parse(analysis?.started_at||request.created_date)<Date.now()-10*60000;
 return {status,label:advisorStatusLabels[status]||status,stalled};
}
export const advisorErrorDescriptions={
 HUMAN_CHECK_FAILED:'De anti-spamcontrole is verlopen of niet geslaagd. Er is voor deze poging geen AI-onderzoek gestart.',
 HUMAN_CHECK_UNAVAILABLE:'De anti-spamdienst was niet beschikbaar. Er is voor deze poging geen AI-onderzoek gestart.',
 INVALID_SUBMISSION:'De inzending voldeed niet aan de invoercontroles. Er is geen AI-onderzoek gestart.',
 DAILY_LIMIT:'De dagelijkse onderzoekslimiet of de limiet voor deze website was bereikt. Er is geen nieuw AI-onderzoek gestart.',
 RESEARCH_FAILED:'Het onderzoek of het verwerken van het antwoord is mislukt. Er is geen geldig eindrapport opgeslagen.'
};