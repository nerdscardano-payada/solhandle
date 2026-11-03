import { useState } from 'react';
import { advisorExamples, advisorInstall } from '@/components/solhandle/ai-advisor/advisorExamples';
export default function AIAdvisorCode({ capability }) {
 const [notice,setNotice]=useState('');
 const code=advisorExamples[capability];
 async function copy(){try{await navigator.clipboard.writeText(`${advisorInstall}\n\n${code}`);setNotice('Copied');}catch{setNotice('Select the code to copy it manually.');}}
 return <details className="advisor-code"><summary>Official SDK example · not executed for this project</summary><p>JavaScript server-side example. Adapt loading and error states to your application. Use a real existing handle when testing; @demo is illustrative only.</p><pre><code>{advisorInstall}</code></pre><pre><code>{code}</code></pre><button type="button" className="ep-link" onClick={copy}>Copy example</button><span role="status">{notice}</span></details>;
}