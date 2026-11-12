<script lang="ts">
  import PersonaCard from '$lib/components/ui/persona-card/persona-card.svelte';
  import { demoPersonas } from '$lib/demo-personas';
</script>

<div class="persona-grid">
  {#each demoPersonas as persona (persona.name)}
    <PersonaCard {...persona} />
  {/each}
</div>

<details class="usage-notes">
  <summary>Compact &amp; laptop hero variants</summary>
  <p>Use <code>size="compact"</code> for background scenes: the same portrait and overlapping ID card with smaller type, vertically stacked facts, and lighter shadows. Antoine is the performance-focused racer; Benjamin is a young dad who maintains his road car, reads owner forums, and watches the price. Portraits use local WebP assets.</p>
  <div class="compact-preview">
    {#each demoPersonas as persona (persona.name)}
      <PersonaCard {...persona} size="compact" />
    {/each}
  </div>
  <p><code>size="hero"</code> keeps the compact ID card and readable chips, but crops the portrait to 3:2 to fit the laptop-height scene without stretching the image.</p>
  <div class="compact-preview">
    {#each demoPersonas as persona (persona.name)}
      <PersonaCard {...persona} size="hero" />
    {/each}
  </div>
</details>

<style>
  .persona-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 2rem 2.5rem; }
  .usage-notes { margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem; color: var(--muted-foreground); font-size: 0.76rem; line-height: 1.7; }
  summary { cursor: pointer; width: fit-content; }
  summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  .usage-notes p { max-width: 42rem; }
  .compact-preview { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; max-width: 23rem; margin-top: 1.5rem; }
  @media (max-width: 560px) { .persona-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
</style>
