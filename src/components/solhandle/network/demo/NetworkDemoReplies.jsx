import NetworkDemoProfile from '@/components/solhandle/network/demo/NetworkDemoProfile';
import { demoProfileById } from '@/components/solhandle/network/demo/networkDemoData';
export default function NetworkDemoReplies({ replies, id }) {
  return <div id={id} className="sh-demo-replies">{replies.map((reply, index) => {
    const profile = demoProfileById(reply.author);
    return <div key={`${reply.author}:${index}`} className="sh-demo-reply">
      <span aria-hidden="true" className="sh-demo-avatar">{profile.initials}</span>
      <div className="sh-demo-replybody">
        <div className="sh-demo-identity"><NetworkDemoProfile compact profile={profile}/></div>
        <p className="sh-demo-replycopy">{reply.body}</p>
        <span className="sh-demo-replytag">Voorbeeldreactie</span>
      </div>
    </div>;
  })}</div>;
}