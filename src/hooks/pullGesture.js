export const PULL_THRESHOLD = 72;
export function scrollOwner(target, panel) {
  for (let node = target; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
    if (node.scrollHeight > node.clientHeight && /(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node;
    if (node === panel) break;
  }
  return document.scrollingElement;
}
export const blockedTouch = target => Boolean(target.closest('input, textarea, select, button, a, [role="dialog"], [data-vaul-drawer], [contenteditable="true"]'));