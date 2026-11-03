import { useState } from 'react';
import { advisorExamples, advisorInstall } from '@/components/solhandle/ai-advisor/advisorExamples';
export default function AIAdvisorCode({ capability, inline=false }) {
 const Container=inline?'div':'details';
 const [notice,setNotice]=useState('');
 const code=advisorExamples[capability];
 async function copy(){try{await navigator.clipboard.writeText(`${advisorInstall}\n\n${code}`);setNotice('Copied');}catch{setNotice('Select the code to copy it manually.');}}
 return <Container className="advisor-code">{inline?<h4>SDK code to adapt · not executed for this project</h4>:<summary>Official SDK example · not executed for this project</summary>}<p>JavaScript server-side example, not a ready-made patch for this platform. Keep private RPC credentials on your server and preserve your existing wallet connection and signing. Adapt loading and error states to your application; test with a real existing handle.</p><h4>Install the SDK</h4><pre><code>{advisorInstall}</code></pre><h4>Add the integration helper on your server</h4><pre><code>{code}</code></pre><button type="button" className="ep-link" onClick={copy}>Copy installation and code</button><span role="status">{notice}</span></Container>;
}