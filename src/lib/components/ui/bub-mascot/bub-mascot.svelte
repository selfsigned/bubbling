<script lang="ts">
  import mascotSvg from '../../../../../assets/bub.svg?raw';

  let { size = 36, blinking = false }: { size?: number; blinking?: boolean } = $props();
  const uid = $props.id();
  const prefix = `mascot-${uid.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  // Only trusted, bundled artwork. Preserve its geometry and namespace every SVG ID
  // (including CSS and aria references) so multiple mascots can coexist safely.
  const artwork = mascotSvg
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/\bbub-[\w-]+\b/g, (id) => `${prefix}-${id}`);
</script>

<span class={['bub-mascot', { blinking }]} style:width={`${size}px`} style:height={`${size}px`} aria-hidden="true">
  {@html artwork}
</span>

<style>
  .bub-mascot { display: inline-block; flex: 0 0 auto; vertical-align: middle; }
  .bub-mascot :global(svg) { display: block; width: 100%; height: 100%; }
  .bub-mascot.blinking :global([id$='-bub-eye-left']),
  .bub-mascot.blinking :global([id$='-bub-eye-right']) { animation: bub-blink 2.6s ease-in-out infinite; }
  @keyframes bub-blink { 0%, 8%, 16%, 100% { transform: scaleY(1); } 12% { transform: scaleY(0.08); } }
  @media (prefers-reduced-motion: reduce) {
    .bub-mascot.blinking :global([id$='-bub-eye-left']),
    .bub-mascot.blinking :global([id$='-bub-eye-right']) { animation: none; }
  }
</style>
