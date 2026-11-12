<script lang="ts">
  import { FileChartColumn } from '@lucide/svelte';

  let { animate = false }: { animate?: boolean } = $props();
  const uid = $props.id();

  // Editorial coding of the two supplied scripts, once per conversation per reason.
  const reasons = [
    { label: 'Required approvals', count: 2 },
    { label: 'Spec / test evidence', count: 2 },
    { label: 'Price / value', count: 1 },
    { label: 'Track-day heat', count: 1 },
  ];
</script>

<article class={['insight-report', { enter: animate }]} aria-labelledby={`${uid}-title`}>
  <header>
    <div>
      <p class="eyebrow"><FileChartColumn size={12} aria-hidden="true" /> REDLINE RS <span>/</span> conversation brief</p>
      <h3 id={`${uid}-title`} tabindex="-1">Mentioned. Not yet recommended.</h3>
    </div>
    <span class="report-number" aria-hidden="true">BUB / 01</span>
  </header>

  <div class="charts">
    <figure class="mentions">
      <figcaption>Brand mentions</figcaption>
      <div class="donut-wrap">
        <svg class="donut" viewBox="0 0 100 100" role="img" aria-labelledby={`${uid}-donut-title ${uid}-donut-desc`}>
          <title id={`${uid}-donut-title`}>REDLINE RS mentioned in 2 of 2 conversations</title>
          <desc id={`${uid}-donut-desc`}>Both scripted assistant conversations mention the brand; zero omit it. This is not a visibility estimate.</desc>
          <circle class="donut-track" cx="50" cy="50" r="38" />
          <circle class="donut-value" cx="50" cy="50" r="38" />
          <text class="donut-count" x="50" y="49" text-anchor="middle">2<tspan class="donut-total"> / 2</tspan></text>
          <text class="donut-label" x="50" y="64" text-anchor="middle">conversations</text>
        </svg>
      </div>
      <div class="legend"><span><i class="mentioned"></i>Mentioned in both chats</span></div>
    </figure>

    <figure class="reasons">
      <figcaption>What shaped the answers</figcaption>
      <p class="axis-title">Conversations citing each reason</p>
      <div class="bar-chart">
        {#each reasons as reason (reason.label)}
          <div class="bar-row">
            <span class="reason-label">{reason.label}</span>
            <span class="bar-track" aria-hidden="true"><span class="bar-fill" style:width={`${reason.count / 2 * 100}%`}></span></span>
            <span class="reason-count">{reason.count}<span class="sr-only"> of 2 conversations</span></span>
          </div>
        {/each}
        <div class="axis" aria-hidden="true"><span>0</span><span>1</span><span>2</span></div>
      </div>
    </figure>
  </div>

  <footer>
    <p><span class="summary-mark" aria-hidden="true"></span>Both ask for evidence before a switch.</p>
    <span class="disclosure">Illustrative · 2 scripted conversations</span>
  </footer>
</article>

<style>
  .insight-report { width: 100%; max-width: 35rem; padding: 0.75rem 1.25rem 0.45rem; border: 1px solid var(--border); border-radius: 1.15rem; background: var(--background); box-shadow: 0 12px 40px rgb(46 93 184 / 0.07); }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.65rem; padding-bottom: 0.45rem; }
  .eyebrow { display: flex; align-items: center; gap: 0.35rem; margin: 0 0 0.35rem; color: var(--primary); font-size: 0.57rem; font-weight: 600; letter-spacing: 0.055em; }
  .eyebrow span { margin-inline: 0.1rem; color: var(--secondary); }
  h3 { margin: 0; color: var(--foreground); font-size: 1.05rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.035em; }
  h3:focus { outline: none; }
  h3:focus-visible { border-radius: 0.2rem; outline: 2px solid var(--ring); outline-offset: 4px; }
  .report-number { padding-top: 0.15rem; color: var(--light-ink); font-size: 0.5rem; letter-spacing: 0.09em; white-space: nowrap; }
  .charts { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 1.25rem; }
  figure { min-width: 0; margin: 0; }
  figcaption { color: var(--foreground); font-size: 0.65rem; font-weight: 600; line-height: 1.4; }
  .mentions { padding-right: 1.05rem; border-right: 1px solid var(--border); }
  .donut-wrap { display: grid; justify-items: center; margin-top: 0.15rem; }
  .donut { display: block; width: 5rem; height: 5rem; overflow: visible; }
  .donut circle { fill: none; stroke-width: 8; }
  .donut-track { stroke: var(--muted); }
  .donut-value { stroke: var(--primary); }
  .donut-count { fill: var(--primary); font-size: 22px; font-weight: 600; letter-spacing: -1px; }
  .donut-total { fill: var(--light-ink); font-size: 15px; font-weight: 400; }
  .donut-label { fill: var(--muted-foreground); font-size: 7.5px; }
  .legend { display: grid; gap: 0.2rem; margin-top: 0.1rem; color: var(--muted-foreground); font-size: 0.54rem; }
  .legend span { display: flex; align-items: center; gap: 0.3rem; }
  .legend i { width: 5px; height: 5px; border-radius: 50%; background: var(--border); }
  .legend i.mentioned { background: var(--primary); }
  .axis-title { margin: 0.2rem 0 0.65rem; color: var(--muted-foreground); font-size: 0.54rem; line-height: 1.4; }
  .bar-chart { display: grid; gap: 0.35rem; }
  .bar-row { display: grid; grid-template-columns: 7rem minmax(0, 1fr) 0.5rem; align-items: center; gap: 0.55rem; }
  .reason-label { color: var(--muted-foreground); font-size: 0.59rem; line-height: 1.3; }
  .bar-track { display: block; height: 0.45rem; border-radius: 2px; background: var(--muted); }
  .bar-fill { display: block; height: 100%; border-radius: inherit; background: var(--secondary); }
  .bar-row:nth-child(-n + 2) .bar-fill { background: var(--primary); }
  .reason-count { color: var(--primary); font-size: 0.6rem; line-height: 1.25; font-weight: 600; font-variant-numeric: tabular-nums; }
  .axis { display: flex; justify-content: space-between; margin: -0.1rem 1.05rem 0 7.55rem; color: var(--light-ink); font-size: 0.5rem; line-height: 1.2; }
  footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.35rem 0.65rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); }
  footer p { display: flex; align-items: center; gap: 0.35rem; margin: 0; color: var(--muted-foreground); font-size: 0.58rem; line-height: 1.5; }
  .summary-mark { width: 4px; height: 4px; border-radius: 50%; background: var(--primary); }
  .disclosure { color: var(--light-ink); font-size: 0.5rem; line-height: 1.5; }
  .enter { animation: report-in 420ms ease both; }
  @keyframes report-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .enter { animation: none; } }
  @media (max-width: 480px) {
    .insight-report { padding: 1rem; }
    header { padding-bottom: 0.8rem; }
    h3 { font-size: 0.95rem; }
    .report-number { display: none; }
    .charts { grid-template-columns: 6.5rem minmax(0, 1fr); gap: 0.8rem; }
    .mentions { padding-right: 0.7rem; }
    .bar-row { grid-template-columns: 5.8rem minmax(0, 1fr) 0.4rem; gap: 0.35rem; }
    .reason-label { font-size: 0.54rem; }
    .axis { margin-left: 6.15rem; margin-right: 0.75rem; }
    .axis-title { margin-bottom: 0.65rem; }
    .legend { font-size: 0.5rem; }
    footer { margin-top: 0.8rem; }
  }
  @media (max-width: 350px) {
    .charts { grid-template-columns: 1fr; gap: 1rem; }
    .mentions { display: grid; grid-template-columns: 5.6rem 1fr; align-items: center; gap: 0 0.8rem; padding: 0 0 0.7rem; border-right: 0; border-bottom: 1px solid var(--border); }
    .mentions figcaption { grid-column: 1 / -1; }
    .legend { margin-top: 0; }
  }
</style>
