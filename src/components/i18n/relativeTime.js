export default function relativeTime(value, language, unknown) {
  if (!value || !Number.isFinite(new Date(value).getTime())) return unknown;
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  const [amount, unit] = seconds < 60 ? [seconds, 'second'] : seconds < 3600 ? [Math.floor(seconds / 60), 'minute'] : seconds < 86400 ? [Math.floor(seconds / 3600), 'hour'] : [Math.floor(seconds / 86400), 'day'];
  return new Intl.RelativeTimeFormat(language, { numeric: 'always', style: 'short' }).format(-amount, unit);
}