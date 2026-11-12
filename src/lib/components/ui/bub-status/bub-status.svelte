<script lang="ts">
  import BubMascot from '../bub-mascot/bub-mascot.svelte';

  type Props = {
    message: string;
    active?: boolean;
    pending?: boolean;
    size?: number;
  };

  let { message, active = true, pending = true, size = 36 }: Props = $props();
</script>

<div class={['bub-status', { concealed: !active }]} aria-hidden={!active ? 'true' : undefined} role="status">
  <BubMascot {size} blinking={active && pending} />
  <span>{message}{#if pending}<span class="loading-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>{/if}</span>
</div>

<style>
  .bub-status { display: flex; align-items: center; gap: 0.6rem; min-height: 2.5rem; color: var(--light-ink); font-size: 0.72rem; line-height: 1.4; }
  .bub-status.concealed { visibility: hidden; }
  .loading-dots { display: inline-flex; width: 0.9em; }
  .loading-dots i { font-style: normal; animation: thinking-dots 1.2s ease-in-out infinite; }
  .loading-dots i:nth-child(2) { animation-delay: 150ms; }
  .loading-dots i:nth-child(3) { animation-delay: 300ms; }
  @keyframes thinking-dots { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .loading-dots i { animation: none; } }
</style>
