import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
export default function GrowthQuiz({ questions, onSubmit, busy }) {
  const [answers, setAnswers] = useState({});
  return <form onSubmit={e => { e.preventDefault(); onSubmit(questions.map((_, index) => answers[index])); }} className="mt-6 space-y-5">
    {questions.map((q, index) => <fieldset key={q.question} className="rounded-xl border border-border bg-card p-5"><legend className="px-2 text-sm font-semibold">{index + 1}. {q.question}</legend><div className="space-y-3">{q.options.map((option, number) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm leading-6"><input required type="radio" name={`question-${index}`} value={number} checked={answers[index] === number} disabled={busy} onChange={() => setAnswers(a => ({ ...a, [index]: number }))} className="mt-1"/><span>{option}</span></label>)}</div></fieldset>)}
    <div className="flex flex-wrap items-center gap-5"><Button disabled={busy || Object.keys(answers).length !== questions.length}>{busy ? 'Antwoorden controleren…' : 'Controleer antwoorden'}</Button><Link to="/docs" target="_blank" rel="noopener noreferrer" className="text-sm text-names-accent">Lees de SolHandle-documentatie →</Link></div>
  </form>;
}