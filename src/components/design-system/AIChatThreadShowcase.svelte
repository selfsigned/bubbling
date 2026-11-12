<script lang="ts">
  import { RotateCcw } from '@lucide/svelte';
  import AIChatThread from '$lib/components/ui/ai-chat/ai-chat-thread.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { heroConversations } from '$lib/demo-conversations';
  let chat: AIChatThread | undefined = $state();
  let selected = $state<'claude' | 'chatgpt'>('claude');
  let presentation = $state<'thread' | 'focus'>('thread');
  let completed = $state(false);
  let conversation = $derived(heroConversations.find((item) => item.assistant === selected)!);

  function replay() {
    completed = false;
    chat?.play();
  }
</script>

<div class="thread-showcase" data-complete={completed} data-presentation={presentation}>
  <div class="thread-preview">
    <div class="preview-toolbar">
      <span>{selected === 'claude' ? 'CLAUDE / BENJAMIN' : 'CHATGPT / ANTOINE'}</span>
      <div class="toolbar-actions">
        <Button variant="ghost" size="sm" aria-pressed={selected === 'claude'} onclick={() => { selected = 'claude'; completed = false; }}>Claude</Button>
        <Button variant="ghost" size="sm" aria-pressed={selected === 'chatgpt'} onclick={() => { selected = 'chatgpt'; completed = false; }}>ChatGPT</Button>
        <Button variant="ghost" size="sm" aria-pressed={presentation === 'thread'} onclick={() => presentation = 'thread'}>Thread</Button>
        <Button variant="ghost" size="sm" aria-pressed={presentation === 'focus'} onclick={() => presentation = 'focus'}>Focus</Button>
        <Button variant="ghost" size="sm" onclick={replay}><span class="inline-flex items-center gap-1.5"><RotateCcw size={12} aria-hidden="true" />Replay</span></Button>
      </div>
    </div>
    <AIChatThread bind:this={chat} assistant={conversation.assistant} size="compact" presentation={presentation} personaName={conversation.assistant === 'claude' ? 'Benjamin' : 'Antoine'} personaImage={conversation.avatar} turns={conversation.turns} animate onComplete={() => { completed = true; }} />
    <p class="simulation-note">Simulated conversation · REDLINE RS is a fictional oil product</p>
  </div>

  <details class="usage-notes">
    <summary>Component notes & credits</summary>
    <p><code>AIChatThread</code> is a lightweight chat thread with Claude’s pixel pet or ChatGPT’s OpenAI symbol, and default or compact sizing. Its optional <code>presentation</code> is <code>thread</code> (default; full conversation) or <code>focus</code> (current exchange during playback, final exchange during analysis/completion). Focus reserves one exchange-height slot so turn changes do not shift the scene. Persona faces replace name labels. No app window or composer. Claude turns can use <code>mood</code>: <code>grumpy</code> or <code>skeptical</code>; it defaults to grumpy. ChatGPT does not use the pet. Highlights: periwinkle for brands, mint for positive language, peach for concerns.</p>
    <p>Pass <code>personaName</code> (accessible image label), <code>personaImage</code> (a face-cropped image URL), <code>turns</code> (each with <code>question</code>, <code>response</code> text segments and optional Claude <code>mood</code>), <code>assistant</code> (<code>claude</code> by default or <code>chatgpt</code>), and <code>size</code> (<code>default</code> or rail-friendly <code>compact</code>). Static by default; <code>animate</code> plays the thread. Call <code>play()</code> to restart; <code>onComplete</code> fires after Bub’s analysis and the final marker sweep. Settings in ms: <code>typingSpeed</code> per four characters (24), <code>thinkingDuration</code> (700), <code>highlightDelay</code> before analysis highlights (400) and <code>followUpDelay</code> (800).</p>
    <p>Reduced motion shows the completed analysis without streaming or blinking. The full Thread view retains both exchanges; Focus overlays the exchanges in one height-reserved grid slot, with only the active one exposed visually and accessibly. The hero uses Focus to fit laptop screens. Dialogue and annotations are scripted examples, not live assistant output.</p>
    <p>Claude pets by <a href="https://github.com/abderrahimghazali/clawd-pet">Abderrahim GHAZALI / clawd-pet</a>, MIT licensed. Local copies retain the license, with tighter viewBoxes and reduced-motion support. ChatGPT uses a local copy of the supplied <a href="https://upload.wikimedia.org/wikipedia/commons/6/66/OpenAI_logo_2025_(symbol).svg">OpenAI symbol</a>.</p>
  </details>
</div>

<style>
  .thread-preview { width: min(100%, 27rem); margin: 0 auto; padding: 0.5rem 0 1.5rem; }
  .preview-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6rem 1rem; margin-bottom: 1rem; }
  .toolbar-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
  .preview-toolbar > span { color: var(--light-ink); font-size: 0.58rem; letter-spacing: 0.12em; }
  .simulation-note { margin: 0.8rem 0 0 1.75rem; color: var(--light-ink); font-size: 0.62rem; }
  .usage-notes { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.76rem; line-height: 1.7; color: var(--muted-foreground); }
  summary { width: fit-content; cursor: pointer; color: var(--muted-foreground); }
  summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; border-radius: 2px; }
  .usage-notes p { max-width: 45rem; margin: 0.8rem 0; }
  code { color: var(--foreground); font-size: 0.9em; }
  a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
  @media (max-width: 480px) { .preview-toolbar { align-items: flex-start; flex-direction: column; gap: 0.5rem; } .toolbar-actions { flex-wrap: wrap; } }
</style>
