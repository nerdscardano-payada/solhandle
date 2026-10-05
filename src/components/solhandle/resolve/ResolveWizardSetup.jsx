import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import { html, javascript } from '@/components/solhandle/resolve/resolveExamples';
import { memberJavascript, memberMarkup } from '@/components/solhandle/resolve/memberResolveExample';

const routes = {
  website: { title: 'Download your ready-to-use example', instruction: 'Download the HTML file and open it in your browser. It already contains the input, Resolve button and address display. To put it on your website, upload it through your website host; no wallet or API key is needed.', code: html, language: 'HTML' },
  javascript: { title: 'Resolve a recipient in your existing form', instruction: 'Call resolveSolHandle with the entered @name in your recipient form. Display the returned address for confirmation. Before preparing a native SOL payment, resolve again and require safeForNativeSol === true. This code only looks up the recipient; your platform still prepares the transaction and asks the wallet owner to approve it.', code: javascript, language: 'JavaScript' },
  members: { title: 'Show @names for existing member wallets', instruction: 'In the member, comment or leaderboard template you already use, add the attribute below to each wallet label. Replace MEMBER_WALLET_ADDRESS with that member’s existing wallet address. Then add the JavaScript and call updateMemberLabels after rendering each visible page. Only the display label changes; member IDs, stored wallets and sign-in stay unchanged. Members need a valid primary SolHandle. Otherwise, or if lookup fails, their wallet stays visible. Refresh labels when rendering again because ownership can change.', code: memberJavascript, language: 'JavaScript' }
};
export default function ResolveWizardSetup({ method }) {
  const route = routes[method];
  function download() {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'solhandle-resolve.html'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div><h3 className="text-lg font-semibold">{route.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{route.instruction}</p>
    {method === 'members' && <ResolveCodeBlock code={memberMarkup} language="HTML"/>}
    {method === 'website' ? <><button type="button" onClick={download} className="mt-4 rounded-lg bg-names-accent px-5 py-3 font-semibold text-background">Download HTML example</button><details className="mt-4"><summary className="cursor-pointer text-sm text-names-accent">Prefer to copy the HTML instead?</summary><ResolveCodeBlock code={route.code} language={route.language}/></details></> : <ResolveCodeBlock code={route.code} language={route.language}/>}
  </div>;
}