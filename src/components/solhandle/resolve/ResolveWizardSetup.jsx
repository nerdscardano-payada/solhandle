import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import { html, javascript, sdk } from '@/components/solhandle/resolve/resolveExamples';

const routes = {
  website: { title: 'Download your ready-to-use example', instruction: 'Download the HTML file and open it in your browser. It already contains the input, Resolve button and address display. To put it on your website, upload it through your website host; no wallet or API key is needed.', code: html, language: 'HTML' },
  javascript: { title: 'Add the resolver to your app', instruction: 'Copy this into your JavaScript application. Call resolveSolHandle from your form or button handler with the entered @handle, then display identity.address. The example logs the address only; connect it to your own interface.', code: javascript, language: 'JavaScript' },
  sdk: { title: 'Connect directly to Solana', instruction: 'This advanced route needs Node.js 18+, npm and your own Mainnet RPC endpoint. Run the npm install command in the first line, set rpcUrl to your endpoint, then run the remaining example as an ES module. You do not need the hosted API as well.', code: sdk, language: 'JavaScript' }
};
export default function ResolveWizardSetup({ method }) {
  const route = routes[method];
  function download() {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'solhandle-resolve.html'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div><h3 className="text-lg font-semibold">{route.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{route.instruction}</p>
    {method === 'website' ? <><button type="button" onClick={download} className="mt-4 rounded-lg bg-names-accent px-5 py-3 font-semibold text-background">Download HTML example</button><details className="mt-4"><summary className="cursor-pointer text-sm text-names-accent">Prefer to copy the HTML instead?</summary><ResolveCodeBlock code={route.code} language={route.language}/></details></> : <ResolveCodeBlock code={route.code} language={route.language}/>}
  </div>;
}