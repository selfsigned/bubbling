<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import BubMascot from '../bub-mascot/bub-mascot.svelte';
  import { Button } from '../button/index.js';

  type Props = {
    message?: string;
    onReport: () => void;
    animate?: boolean;
  };

  let {
    message = 'Antoine sees track-day potential; Benjamin wants proof of value. Neither assistant recommends switching yet.',
    onReport,
    animate = false,
  }: Props = $props();
</script>

<aside class={['bub-insight', { enter: animate }]} aria-label="Bub’s conversation summary">
  <div class="mascot"><BubMascot size={42} /></div>
  <div class="reply">
    <p class="byline">Bub <span>· the short version</span></p>
    <p class="message">{message}</p>
    <Button size="sm" class="h-8 rounded-full px-3.5 text-xs" onclick={onReport}>
      <span class="inline-flex items-center gap-1.5">See the report <ArrowUpRight size={13} aria-hidden="true" /></span>
    </Button>
  </div>
</aside>

<style>
  .bub-insight { display: flex; align-items: flex-start; gap: 0.85rem; width: 100%; max-width: 30rem; padding: 1rem 1.1rem; border: 1px solid var(--border); border-radius: 1.1rem; background: var(--background); box-shadow: 0 8px 28px rgb(46 93 184 / 0.05); }
  .mascot { display: grid; place-items: center; flex: 0 0 auto; padding-top: 0.1rem; }
  .reply { min-width: 0; }
  .byline { margin: 0 0 0.35rem; color: var(--primary); font-size: 0.7rem; font-weight: 700; line-height: 1.4; }
  .byline span { color: var(--light-ink); font-weight: 400; }
  .message { margin: 0 0 0.75rem; color: var(--foreground); font-size: 0.8rem; line-height: 1.55; text-wrap: pretty; }
  .enter { animation: reply-in 380ms ease both; }
  @keyframes reply-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .enter { animation: none; } }
  @media (max-width: 380px) { .bub-insight { gap: 0.6rem; padding: 0.9rem; } }
</style>
