<script lang="ts">
  import AIInput from '$lib/components/ui/ai-input/ai-input.svelte';
  import BubStatus from '$lib/components/ui/bub-status/bub-status.svelte';
  import { oilPrompt } from '$lib/demo-conversations';

  let submitted = $state(false);
</script>

<div class="ai-input-sample">
  <AIInput demoPrompt={oilPrompt} send={() => { submitted = true; }} />
  <div class="generation-slot">
    {#if submitted}
      <BubStatus message="Generating AI personas" size={44} />
    {:else}
      <span class="preview-hint">Typewriter demo · Submit to generate AI personas</span>
    {/if}
  </div>
  <details class="usage-notes">
    <summary>Component notes</summary>
    <p>The input’s <code>send(prompt)</code> callback starts the persona-generation preview. Typing alone does not start it. This is an animation demo, not a live generation request; it remains pending until the parent changes the scene.</p>
    <p><code>AIInput</code> is a native single-line text field, including in the compact hero variant (3.5rem high). It supports keyboard submission with Enter. The shorter REDLINE RS prompt fits on one line at the desktop hero’s 32rem width. The non-interactive homepage illustration uses <code>onTypingFinished</code> to sequence the send-button press, 3.2 seconds of Bub thinking, persona cards, then streamed exchanges and sentiment analysis. It plays once and holds; reduced motion shows the completed scene immediately.</p>
    <p>The desktop headline stays at 40% of the hero height. The two profiles use the landscape-cropped <code>size="hero"</code> card; chats use <code>presentation="focus"</code>, revealing one full exchange at a time instead of stacking the transcript. The bottom-center area stays clear for the separate reply/report scene under review in section 07. Below 1200px the scene falls back beneath the headline; a dedicated mobile experience is not part of this iteration.</p>
    <p>Shared <code>BubStatus</code>: <code>message</code>, <code>size</code> (36px by default), <code>active</code> (visibility) and <code>pending</code> (blinking and animated dots). Active and pending default to true. Set <code>pending={false}</code> for a still completion state, as shown after the conversation in section 06. Reduced motion disables blinking and dot animation.</p>
  </details>
</div>

<style>
  .ai-input-sample {
    display: grid;
    gap: 0.75rem;
    width: min(100%, 42rem);
  }

  .generation-slot {
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    padding-inline: 0.25rem;
  }

  .preview-hint {
    color: var(--muted-foreground);
    font-size: 0.8rem;
  }
  .usage-notes { color: var(--muted-foreground); font-size: 0.76rem; line-height: 1.7; }
  summary { width: fit-content; cursor: pointer; }
  summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; border-radius: 2px; }
  .usage-notes p { margin: 0.6rem 0 0; }
  code { color: var(--foreground); font-size: 0.9em; }
</style>
