import { useLanguage } from '@/components/i18n/LanguageProvider';

const nl = {
  'Why SolHandle?': 'Waarom SolHandle?',
  'Make your Solana identity easy to remember. One unique @handle instead of a long wallet address, owned in your own wallet and ready to receive SOL with SolHandle Pay. Pay once, with no renewal fees. Your funds and private keys stay yours.': 'Maak je Solana-identiteit herkenbaar. Eén unieke @handle in plaats van een lang walletadres, in je eigen wallet en direct te gebruiken om SOL te ontvangen met SolHandle Pay. Je betaalt eenmalig, zonder verlengkosten. Je geld en privésleutels blijven van jou.',
  'Claim your': 'Claim je',
  '@identity': '@identiteit',
  'on Solana.': 'op Solana.',
  'One memorable @handle. Owned by you. Ready to use in SolHandle Pay.': 'Eén herkenbare @handle. Jouw eigendom. Direct te gebruiken in SolHandle Pay.',
  'Find your @handle': 'Vind je @handle',
  'Already have a handle? Open SolHandle Pay': 'Al een handle? Open SolHandle Pay',
  'Your identity. Your wallet.': 'Jouw identiteit. Jouw wallet.',
  'Claim it. Then use it.': 'Claim je naam. Gebruik hem meteen.',
  'Pay people, not addresses.': 'Betaal mensen, geen adressen.',
  'Your @handle is more than a name. Use it to receive SOL, share payment requests and become a familiar contact.': 'Je @handle is meer dan een naam. Ontvang SOL, deel betaalverzoeken en word een herkenbaar contact.',
  'Receive SOL': 'Ontvang SOL',
  'Share your @handle instead of a long wallet address.': 'Deel je @handle in plaats van een lang walletadres.',
  'Share your payment QR': 'Deel je betaal-QR',
  'Request a payment': 'Vraag een betaling aan',
  'Choose a SOL amount and share a payment link or QR code.': 'Kies een SOL-bedrag en deel een betaallink of QR-code.',
  'Create a payment link': 'Maak een betaallink',
  'Pay a contact': 'Betaal een contact',
  'Send SOL to an @handle or a privately saved contact.': 'Stuur SOL naar een @handle of een privé opgeslagen contact.',
  'Open SolHandle Pay': 'Open SolHandle Pay',
  'Your wallet stays yours. Every payment needs your approval.': 'Je wallet blijft van jou. Iedere betaling vraagt jouw goedkeuring.',
  'SolHandle never holds your funds or private keys. Payers only need a compatible Solana wallet, not their own handle.': 'SolHandle beheert nooit je geld of privésleutels. Betalers hebben alleen een geschikte Solana-wallet nodig, geen eigen handle.',
  'How does my handle work?': 'Hoe werkt mijn handle?',
  'Your unique @handle is an NFT held in your own wallet. The current on-chain owner controls the name. You pay once, with no renewal fees.': 'Je unieke @handle is een NFT in je eigen wallet. De huidige eigenaar op de blockchain beheert de naam. Je betaalt eenmalig, zonder verlengkosten.',
  'Do I need a handle to pay someone?': 'Heb ik een handle nodig om iemand te betalen?',
  'No. Connect a compatible Solana wallet to pay an @handle or a payment request. Claim a handle when you want your own recognizable identity.': 'Nee. Verbind een geschikte Solana-wallet om een @handle of betaalverzoek te betalen. Claim een handle als je zelf een herkenbare identiteit wilt.',
};
const paymentAssets = 'SOL, USDC, USDT or HANDLE';
const assetConjunctions = { en: 'or', nl: 'of', de: 'oder', fr: 'ou', es: 'o', it: 'o', pt: 'ou', ja: 'または', ko: '또는', tr: 'veya', vi: 'hoặc' };

export default function useHomePayCopy() {
  const { language, t } = useLanguage();
  return text => {
    // Reuse each complete translated sentence with a localized asset-list substitution.
    const expanded = text.includes(paymentAssets);
    const source = expanded ? text.replace(paymentAssets, 'SOL') : text;
    const translated = language === 'nl' ? nl[source] || t(source) : t(source);
    return expanded ? translated.replace(/SOL/g, `SOL, USDC, USDT ${assetConjunctions[language] || 'or'} HANDLE`) : translated;
  };
}