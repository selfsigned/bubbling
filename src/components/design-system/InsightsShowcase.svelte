<script lang="ts">
  import { ArrowLeft, RotateCcw } from '@lucide/svelte';
  import { tick } from 'svelte';
  import BubInsight from '$lib/components/ui/bub-insight/bub-insight.svelte';
  import InsightReport from '$lib/components/ui/insight-report/insight-report.svelte';
  import { Button } from '$lib/components/ui/button/index.js';

  let reportOpen = $state(false);
  let replayKey = $state(0);
  let stage: HTMLDivElement | undefined;

  function captureStage(element: HTMLDivElement) {
    stage = element;
    return () => { stage = undefined; };
  }

  async function openReport() {
    reportOpen = true;
    await tick();
    stage?.querySelector('h3')?.focus();
  }

  async function backToReply() {
    reportOpen = false;
    await tick();
    stage?.querySelector('button')?.focus();
  }

  function replay() {
    reportOpen = false;
    replayKey += 1;
  }
</script>

<div class="insights-showcase">
  <div class="preview-toolbar">
    <p class="step-label"><span class="step-dot"></span>{reportOpen ? '02 / THE REPORT' : '01 / BUB’S TAKE'}</p>
    <div class="preview-actions">
      {#if reportOpen}
        <Button variant="ghost" size="sm" onclick={backToReply}><span class="inline-flex items-center gap-1"><ArrowLeft size={12} aria-hidden="true" />Back</span></Button>
      {/if}
      <Button variant="outline" size="sm" onclick={replay}><span class="inline-flex items-center gap-1.5"><RotateCcw size={12} aria-hidden="true" />Replay</span></Button>
    </div>
  </div>

  <div class="preview-surface" {@attach captureStage}>
    {#key replayKey}
      {#if reportOpen}
        <InsightReport animate />
      {:else}
        <BubInsight onReport={openReport} animate />
      {/if}
    {/key}
  </div>

  <details class="component-notes">
    <summary>Component API &amp; what the numbers mean</summary>
    <div class="notes-grid">
      <div>
        <h3>A reply, then the evidence</h3>
        <p><code>BubInsight</code> accepts optional <code>message: string</code>, required <code>onReport: () =&gt; void</code>, and optional <code>animate: boolean</code> (default <code>false</code>). The callback opens this report; the component does not navigate or request an API. Its original Bub artwork is shared, not redrawn.</p>
        <p><code>InsightReport</code> accepts only optional <code>animate</code> (default <code>false</code>). Both components size to their container, with 480px and 560px maximum widths respectively. Entrance animations respect reduced motion. Replay returns to the reply; “See the report” reveals the card again.</p>
        <p>Desktop review footprint: roughly 480 × 140px for the reply and 560 × 220px for the report. These are successive scenes, not a stacked dashboard. Section 07 is the review surface; neither component is integrated into the hero yet.</p>
      </div>
      <div>
        <h3>Two scripts. No population claims.</h3>
        <p>The donut counts REDLINE RS mentions in Antoine’s ChatGPT conversation and Benjamin’s Claude conversation: <strong>2 mentioned, 0 not mentioned</strong>. It is not measured brand visibility or a recommendation score.</p>
        <p>Bars count each reason at most once per conversation, across both turns: required approvals <strong>2</strong>; spec sheets, data or independent tests <strong>2</strong>; price/value <strong>1</strong> (Benjamin); track heat <strong>1</strong> (Antoine). Reasons overlap, so they do not sum to two.</p>
        <p>These are fixed, manually coded examples from <code>demo-conversations.ts</code>, not automatic analysis or live assistant output. Interest is conditional: neither assistant recommends a switch yet. No trend, larger sample or statistical inference is implied.</p>
      </div>
    </div>
  </details>
</div>

<style>
  .insights-showcase { width: 100%; }
  .preview-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .step-label { display: flex; align-items: center; gap: 0.4rem; margin: 0; color: var(--light-ink); font-size: 0.56rem; letter-spacing: 0.08em; }
  .step-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--primary); }
  .preview-actions { display: flex; align-items: center; gap: 0.25rem; }
  .preview-surface { display: grid; min-height: 21rem; place-items: center; padding: 2rem 1.5rem; border: 1px solid var(--border); border-radius: 1.25rem; background: radial-gradient(ellipse at 50% 10%, rgb(184 199 250 / 0.13), transparent 70%), var(--muted); }
  .component-notes { margin-top: 1.25rem; border-bottom: 1px solid var(--border); }
  summary { width: fit-content; padding: 0.5rem 0 1rem; color: var(--muted-foreground); font-size: 0.75rem; cursor: pointer; }
  summary:focus-visible { border-radius: 0.2rem; outline: 2px solid var(--ring); outline-offset: 4px; }
  .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding-bottom: 1rem; }
  h3 { margin: 0 0 0.5rem; color: var(--foreground); font-size: 0.8rem; font-weight: 600; }
  .notes-grid p { margin: 0 0 0.65rem; color: var(--muted-foreground); font-size: 0.75rem; line-height: 1.7; }
  strong { color: var(--foreground); font-weight: 500; }
  code { padding: 0.1em 0.25em; border-radius: 3px; background: var(--muted); color: var(--foreground); font-size: 0.85em; overflow-wrap: anywhere; }
  @media (max-width: 560px) { .preview-surface { padding: 1.25rem 0.65rem; } .notes-grid { grid-template-columns: 1fr; gap: 1rem; } .step-label { font-size: 0.5rem; letter-spacing: 0.04em; } }
</style>
