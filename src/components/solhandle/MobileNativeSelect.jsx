import { Children, isValidElement } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSelect from '@/components/solhandle/MobileSelect';
const text = children => Children.toArray(children).map(child => isValidElement(child) ? text(child.props.children) : String(child)).join('');
const optionsFrom = children => Children.toArray(children).flatMap(child => {
  if (!isValidElement(child)) return [];
  if (child.type === 'option') return [{ value: String(child.props.value ?? text(child.props.children)), label: text(child.props.children), disabled: child.props.disabled }];
  return optionsFrom(child.props.children);
});
export default function MobileNativeSelect({ children, label, ...props }) {
  const mobile = useIsMobile();
  if (!mobile) return <select {...props}>{children}</select>;
  return <><MobileSelect id={props.id} disabled={props.disabled} label={label || props['aria-label'] || 'Select'} value={String(props.value ?? props.defaultValue ?? '')} onChange={value => props.onChange?.({ target: { value, name: props.name }, currentTarget: { value, name: props.name } })} options={optionsFrom(children)} className={props.className}/>{props.name && <input type="hidden" name={props.name} value={props.value ?? props.defaultValue ?? ''}/>}</>;
}