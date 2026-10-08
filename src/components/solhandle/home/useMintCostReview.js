import { useEffect, useRef, useState } from 'react';

export default function useMintCostReview(open) {
  const [costs, setCosts] = useState(null);
  const pending = useRef(null);
  const review = value => new Promise((resolve, reject) => { pending.current = { resolve, reject }; setCosts(value); });
  const approve = () => { pending.current?.resolve(); pending.current = null; setCosts(null); };
  const cancel = () => { pending.current?.reject(new Error('Cost review cancelled. No transaction was sent.')); pending.current = null; setCosts(null); };
  useEffect(() => { if (!open) cancel(); }, [open]);
  useEffect(() => () => { pending.current?.reject(new Error('Cost review closed. No transaction was sent.')); }, []);
  return { costs, review, approve, cancel };
}