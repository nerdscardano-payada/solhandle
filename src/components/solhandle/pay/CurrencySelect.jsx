import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import MobileSelect from '@/components/solhandle/MobileSelect';
import CurrencyIcon from '@/components/solhandle/pay/CurrencyIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CurrencySelect({ label, value, onChange, options, className, id, disabled }) {
  const mobile = useIsMobile();
  const { t } = useLanguage();
  const renderOption = option => <span className="inline-flex items-center gap-2"><CurrencyIcon asset={option.value}/>{t(option.label)}</span>;
  if (mobile) return <MobileSelect {...{ label, value, onChange, options, className, id, disabled }} renderOption={renderOption}/>;
  return <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger id={id} aria-label={t(label)} className={`${className} h-auto`}><SelectValue/></SelectTrigger>
    <SelectContent className="dark border-border bg-card text-foreground">
      {options.map(option => <SelectItem key={option.value} value={option.value} disabled={option.disabled}>{renderOption(option)}</SelectItem>)}
    </SelectContent>
  </Select>;
}