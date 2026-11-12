<script lang="ts">
  import { RotateCcw } from '@lucide/svelte';
  import AIChat, { type ChatSegment } from '$lib/components/ui/ai-chat/ai-chat.svelte';
  import { Button } from '$lib/components/ui/button/index.js';

  const response: ChatSegment[] = [
    { text: 'For daily rides and the occasional track day, ' },
    { text: 'Shoei', highlight: 'brand' },
    { text: ' is a strong starting point: ' },
    { text: 'comfortable on longer rides', highlight: 'positive' },
    { text: ', though ' },
    { text: 'the premium price can be hard to justify', highlight: 'concern' },
    { text: '.\n\n' },
    { text: 'HJC', highlight: 'brand' },
    { text: ' is worth comparing for ' },
    { text: 'good value without sacrificing comfort', highlight: 'positive' },
    { text: '. Try both on—fit matters more than the badge.' },
  ];

  let chat: AIChat | undefined = $state();
  let assistant = $state<'ChatGPT' | 'Claude'>('ChatGPT');
  let completed = $state(false);

  function replay() {
    completed = false;
    chat?.play();
  }
</script>

<div class="chat-showcase">
  <div class="preview-toolbar">
    <div class="provider-choice" role="group" aria-label="Demo assistant">
      <Button size="sm" variant={assistant === 'ChatGPT' ? 'secondary' : 'ghost'} aria-pressed={assistant === 'ChatGPT'} onclick={() => { if (assistant !== 'ChatGPT') { completed = false; assistant = 'ChatGPT'; } }}>ChatGPT</Button>
      <Button size="sm" variant={assistant === 'Claude' ? 'secondary' : 'ghost'} aria-pressed={assistant === 'Claude'} onclick={() => { if (assistant !== 'Claude') { completed = false; assistant = 'Claude'; } }}>Claude</Button>
    </div>
    <Button variant="outline" size="sm" onclick={replay}><span class="inline-flex items-center gap-1.5"><RotateCcw size={13} aria-hidden="true" />Replay</span></Button>
  </div>

  <div class="preview-surface">
    <div class="preview-caption"><span class="caption-line"></span>FROM CONVERSATION TO CONTEXT<span class="caption-line"></span></div>
    <div class="chat-frame">
      <AIChat bind:this={chat} {assistant} personaName="Antoine" question="Which helmet would you recommend for daily riding and occasional track days?" {response} animate onComplete={() => { completed = true; }} />
    </div>
    <p class="preview-note">{completed ? 'The same answer. A clearer picture of your brand.' : 'An answer first. Brand mentions and sentiment, revealed next.'}</p>
  </div>

  <div class="component-notes">
    <div><h3>A conversation, then an insight</h3><p>Neutral chat chrome, a right-aligned question, and an assistant answer. Blue marks brands; green and amber reveal positive language and concerns. Highlight meanings are also available as text on hover.</p><p>Illustrative conversation, with supplied annotations—not a live AI answer or automated sentiment analysis. ChatGPT and Claude share this compact demo layout.</p></div>
    <div><h3>Built to sequence</h3><p>Pass <code>assistant</code>, <code>personaName</code>, <code>question</code> and a <code>response</code> array of text segments with optional <code>highlight</code>: <code>brand</code>, <code>positive</code> or <code>concern</code>.</p><p>Static by default. <code>animate</code> plays on mount or when the conversation changes. <code>play()</code> replays; <code>onComplete</code> signals the next scene. Timing: <code>typingSpeed</code> (ms per four characters), <code>thinkingDuration</code> and <code>highlightDelay</code> (ms). Reduced motion shows the finished analysis immediately.</p></div>
  </div>
</div>

<style>
  .chat-showcase { width: 100%; }
  .preview-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
  .provider-choice { display: flex; gap: 0.3rem; }
  .preview-surface { display: grid; justify-items: center; gap: 1.6rem; padding: 2.25rem 1.25rem 1.75rem; border: 1px solid var(--border); border-radius: 1.25rem; background: linear-gradient(145deg, var(--muted), var(--background)); }
  .preview-caption { display: flex; align-items: center; gap: 0.65rem; color: var(--light-ink); font-size: 0.58rem; letter-spacing: 0.12em; text-align: center; }
  .caption-line { width: 1.5rem; height: 1px; background: var(--border); }
  .chat-frame { width: min(100%, 25rem); }
  .preview-note { margin: 0; color: var(--muted-foreground); font-size: 0.75rem; line-height: 1.6; text-align: center; }
  .component-notes { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; }
  h3 { margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 600; }
  .component-notes p { margin: 0 0 0.6rem; color: var(--muted-foreground); font-size: 0.8rem; line-height: 1.7; }
  code { padding: 0.1em 0.25em; border-radius: 3px; background: var(--muted); color: var(--foreground); font-size: 0.85em; }
  @media (max-width: 560px) { .component-notes { grid-template-columns: 1fr; gap: 1rem; } .preview-surface { padding: 1.5rem 0.7rem 1.2rem; } .preview-caption { font-size: 0.5rem; letter-spacing: 0.08em; gap: 0.4rem; } .caption-line { width: 0.6rem; } }
</style>
