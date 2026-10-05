export default function createWidgetEmbed(url, title, initialHeight = 360) {
  return `<iframe
  src="${url}"
  title="${title}"
  width="100%" height="${initialHeight}"
  style="display:block; border:0; border-radius:16px; max-width:480px;"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
></iframe>
<script>
(function () {
  var frame = document.currentScript.previousElementSibling;
  var origin = new URL(frame.src).origin;
  window.addEventListener('message', function (event) {
    if (event.source !== frame.contentWindow || event.origin !== origin) return;
    var data = event.data;
    if (!data || data.type !== 'solhandle:resize' ||
        typeof data.height !== 'number' || !Number.isFinite(data.height) || data.height <= 0) return;
    frame.style.height = Math.ceil(data.height) + 'px';
  });
  function measure() {
    frame.contentWindow.postMessage({ type: 'solhandle:measure' }, origin);
  }
  frame.addEventListener('load', measure);
  measure();
})();
</script>`;
}