export async function advisorResearchLimit(db,website) {
 const since=new Date(Date.now()-86400000).toISOString();
 const windowQuery={created_date:{$gte:since}};
 const [daily,project]=await Promise.all([
  db.AIIntegrationAnalysis.count(windowQuery),
  db.AIIntegrationAnalysis.count({...windowQuery,website})
 ]);
 if(daily<20&&project<2)return null;
 const windows=await Promise.all([
  ...(daily>=20?[db.AIIntegrationAnalysis.filter(windowQuery,{sort:'-created_date',limit:20})]:[]),
  ...(project>=2?[db.AIIntegrationAnalysis.filter({...windowQuery,website},{sort:'-created_date',limit:2})]:[])
 ]);
 const resets=windows.map(page=>page.items.at(-1)?.created_date).filter(Boolean).map(date=>Date.parse(date)+86400000);
 return {
  code:project>=2?'PROJECT_DAILY_LIMIT':'DAILY_LIMIT',
  message:project>=2?'The research limit for this website has been reached (2 attempts in a rolling 24-hour window). Failed research attempts also count. No new research was performed for this request.':'The overall research limit has been reached (20 attempts in a rolling 24-hour window). No new research was performed for this request.',
  retry_after:resets.length?new Date(Math.max(...resets)).toISOString():null
 };
}