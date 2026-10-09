export const quiz = [
  { question: 'Wat is een SolHandle?', options: ['Een NFT-gebaseerde identiteit op Solana', 'Een wachtwoord voor je wallet', 'Een gegarandeerde investering'], answer: 0 },
  { question: 'Wie bewaart de NFT van je handle?', options: ['SolHandle', 'Je eigen wallet', 'De Growth Hub'], answer: 1 },
  { question: 'Welke activiteit is een echte SolHandle Pay-betaling?', options: ['Een betaallink aanmaken', 'Op een betaalknop klikken', 'Een succesvolle SOL-overdracht aan de bedoelde ontvanger'], answer: 2 },
  { question: 'Welke referral hoort bij echte adoptie?', options: ['Een nieuw bezoek aan de website', 'Een nieuwe gebruiker die een kwalificerende mint uitvoert', 'Je eigen tweede wallet verbinden'], answer: 1 },
  { question: 'Wat betekent XP?', options: ['Gegarandeerde $HANDLE-tokens', 'Verhandelbaar walletsaldo', 'Erkenning van geverifieerde bijdragen, zonder gegarandeerde geldwaarde'], answer: 2 }
];
export const publicQuiz = () => quiz.map(({ question, options }) => ({ question, options }));
export function gradeQuiz(answers) {
  if (!Array.isArray(answers) || answers.length !== quiz.length || answers.some(a => !Number.isInteger(a) || a < 0 || a > 2)) throw new Error('Beantwoord alle vijf vragen.');
  return quiz.reduce((score, q, index) => score + Number(q.answer === answers[index]), 0);
}