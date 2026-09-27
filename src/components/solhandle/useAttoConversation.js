import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const key = 'solhandle_atto_conversation';
export default function useAttoConversation(open) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open || conversation) return;
    const id = sessionStorage.getItem(key);
    if (!id) return;
    let active = true;
    setLoading(true);
    base44.agents.getConversation(id).then(result => {
      if (active) { setConversation(result); setMessages(result.messages || []); }
    }).catch(() => { if (active) sessionStorage.removeItem(key); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, conversation]);
  useEffect(() => {
    if (!conversation?.id) return;
    return base44.agents.subscribeToConversation(conversation.id, data => {
      setMessages(data.messages || []);
      if (data.messages?.at(-1)?.role === 'assistant') setReplying(false);
    });
  }, [conversation?.id]);
  async function send(text) {
    if (sending || replying || !text.trim()) return;
    setSending(true); setReplying(true); setError('');
    try {
      let current = conversation;
      if (!current) {
        current = await base44.agents.createConversation({ agent_name: 'atto', metadata: { name: 'Chat with Atto' } });
        sessionStorage.setItem(key, current.id);
        setConversation(current);
      }
      setMessages(previous => [...previous, { role: 'user', content: text.trim() }]);
      await base44.agents.addMessage(current, { role: 'user', content: text.trim() });
    } catch (e) { setError(e.message || 'Could not send message. Please try again.'); setReplying(false); }
    finally { setSending(false); }
  }
  function reset() { sessionStorage.removeItem(key); setConversation(null); setMessages([]); setError(''); setReplying(false); }
  return { messages, loading, sending, replying, error, send, reset };
}