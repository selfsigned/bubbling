<script lang="ts" module>
  export type ChatSegment = {
    text: string;
    highlight?: 'brand' | 'positive' | 'concern';
  };
</script>

<script lang="ts">
  import * as svelte from 'svelte';
  import { ArrowUp, ChevronDown, MessageCircle, Plus, Sparkles } from '@lucide/svelte';

  type Props = {
    assistant?: 'ChatGPT' | 'Claude';
    personaName: string;
    question: string;
    response: ChatSegment[];
    animate?: boolean;
    typingSpeed?: number;
    thinkingDuration?: number;
    highlightDelay?: number;
    onComplete?: () => void;
  };

  let {
    assistant = 'ChatGPT', personaName, question, response, animate = false,
    typingSpeed = 24, thinkingDuration = 800, highlightDelay = 450, onComplete,
  }: Props = $props();

  let stage = $state<'thinking' | 'typing' | 'analyzing' | 'complete'>('complete');
  let visibleCharacters = $state(Infinity);
  let activeHighlights = $state(Infinity);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const labels = { brand: 'Brand mention', positive: 'Positive sentiment', concern: 'Concern' };
  const segments = $derived.by(() => {
    let offset = 0;
    let highlightIndex = 0;
    return response.map((segment) => {
      const item = { ...segment, offset, highlightIndex: segment.highlight ? highlightIndex++ : -1 };
      offset += segment.text.length;
      return item;
    });
  });
  const fullResponse = $derived(response.map((segment) => segment.text).join(''));
  const highlightCount = $derived(response.filter((segment) => segment.highlight).length);
  const status = $derived(stage === 'thinking' ? 'Thinking' : stage === 'typing' ? 'Writing answer' : stage === 'analyzing' ? 'Reading between the lines' : 'Analysis complete');

  function stop() {
    clearTimeout(timer);
  }

  function showComplete() {
    stop();
    stage = 'complete';
    visibleCharacters = Infinity;
    activeHighlights = Infinity;
  }

  // Also callable by a parent to sequence this scene with the rest of the hero.
  export function play() {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showComplete();
      onComplete?.();
      return;
    }

    const length = fullResponse.length;
    const count = highlightCount;
    const speed = Math.max(typingSpeed, 8);
    const delay = Math.max(highlightDelay, 0);
    const complete = onComplete;
    stage = 'thinking';
    visibleCharacters = 0;
    activeHighlights = 0;

    function finish() {
      stage = 'complete';
      complete?.();
    }

    function highlightNext() {
      if (activeHighlights < count) {
        activeHighlights += 1;
        timer = setTimeout(highlightNext, 460);
      } else {
        finish();
      }
    }

    function typeNext() {
      stage = 'typing';
      visibleCharacters = Math.min(visibleCharacters + 4, length);
      if (visibleCharacters < length) {
        timer = setTimeout(typeNext, speed);
      } else {
        stage = 'analyzing';
        timer = setTimeout(highlightNext, delay);
      }
    }

    timer = setTimeout(typeNext, Math.max(thinkingDuration, 0));
  }

  $effect(() => {
    // This effect owns an imperative animation clock, not derived application state.
    // Untrack playback counters so their timer updates cannot restart the sequence.
    const settings = { response, question, assistant, animate, typingSpeed, thinkingDuration, highlightDelay };
    svelte.untrack(() => settings.animate ? play() : showComplete());
    return stop;
  });

  svelte.onDestroy(stop);
</script>

<article class="ai-chat" aria-label={`${personaName}'s simulated conversation with ${assistant}`} data-stage={stage}>
  <header class="chat-header">
    <div class="assistant-name"><MessageCircle size={16} strokeWidth={1.6} aria-hidden="true" />{assistant}<ChevronDown size={12} aria-hidden="true" /></div>
    <span class="simulation-label">Simulated</span>
  </header>

  <div class="conversation">
    <div class="user-message">
      <span class="person-name">{personaName}</span>
      <p class="question">{question}</p>
    </div>

    <div class="assistant-message">
      <div class="answer-heading"><Sparkles size={15} strokeWidth={1.6} aria-hidden="true" /><span>{assistant}</span></div>
      <div class="answer-body">
        <p class="sr-only">{fullResponse}</p>
        <p class={['answer-text', { thinking: stage === 'thinking' }]} aria-hidden="true">{#each segments as segment, i (i)}{@const visible = Math.max(0, visibleCharacters - segment.offset)}{#if segment.highlight}<mark class={[segment.highlight, { highlighted: segment.highlightIndex < activeHighlights }]} title={labels[segment.highlight]}>{segment.text.slice(0, visible)}<span class="unrevealed">{segment.text.slice(visible)}</span></mark>{:else}<span>{segment.text.slice(0, visible)}<span class="unrevealed">{segment.text.slice(visible)}</span></span>{/if}{/each}</p>
        {#if stage === 'thinking'}
          <div class="thinking-indicator" aria-hidden="true"><span></span><span></span><span></span></div>
        {/if}
      </div>
    </div>
  </div>

  <div class="analysis-bar">
    <span class="analysis-status" role="status"><span class={['status-dot', { complete: stage === 'complete' }]}></span>{status}</span>
    <div class={['legend', { pending: stage === 'thinking' || stage === 'typing' }]} aria-label="Highlight key">
      <span><i class="brand-key"></i>Brand</span><span><i class="positive-key"></i>Positive</span><span><i class="concern-key"></i>Concern</span>
    </div>
  </div>

  <div class="composer" aria-hidden="true"><Plus size={16} strokeWidth={1.5} /><span>Message {assistant}</span><span class="send-icon"><ArrowUp size={15} strokeWidth={2} /></span></div>
</article>

<style>
  .ai-chat {
    width: 100%;
    container-type: inline-size;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 1.1rem;
    background: var(--background);
    color: var(--foreground);
    box-shadow: 0 16px 48px rgb(23 27 34 / 0.06), 0 2px 5px rgb(23 27 34 / 0.025);
    font-size: 0.82rem;
    line-height: 1.65;
  }
  .chat-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.2rem; border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent); }
  .assistant-name { display: flex; align-items: center; gap: 0.45rem; font-size: 0.85rem; font-weight: 600; }
  .simulation-label { color: var(--light-ink); font-size: 0.65rem; }
  .conversation { padding: 1.3rem 1.2rem 1rem; }
  .user-message { width: 88%; margin-left: auto; }
  .person-name { display: block; margin: 0 0.3rem 0.35rem; color: var(--muted-foreground); font-size: 0.65rem; text-align: right; }
  .question { margin: 0; padding: 0.7rem 0.9rem; border-radius: 0.9rem 0.9rem 0.25rem 0.9rem; background: var(--muted); line-height: 1.5; }
  .assistant-message { margin-top: 1.3rem; }
  .answer-heading { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.55rem; font-size: 0.7rem; font-weight: 600; }
  .answer-body { position: relative; }
  .answer-text { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  .unrevealed { visibility: hidden; }
  .answer-text.thinking { visibility: hidden; }
  mark { padding: 0.1em 0; border-radius: 0.18em; background: linear-gradient(var(--highlight), var(--highlight)) no-repeat left center / 0% 100%; color: inherit; box-decoration-break: clone; -webkit-box-decoration-break: clone; transition: background-size 420ms cubic-bezier(0.22, 0.65, 0.3, 1); }
  mark.highlighted { background-size: 100% 100%; }
  .brand { --highlight: var(--analysis-brand); }
  .positive { --highlight: var(--analysis-positive); }
  .concern { --highlight: var(--analysis-concern); }
  .thinking-indicator { position: absolute; top: 0.45rem; display: flex; gap: 4px; }
  .thinking-indicator span { width: 5px; height: 5px; border-radius: 50%; background: var(--light-ink); animation: thinking 1s ease-in-out infinite; }
  .thinking-indicator span:nth-child(2) { animation-delay: 150ms; }
  .thinking-indicator span:nth-child(3) { animation-delay: 300ms; }
  .analysis-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0 1.2rem; padding: 0.85rem 0; border-top: 1px solid color-mix(in srgb, var(--border) 55%, transparent); font-size: 0.6rem; }
  .analysis-status { display: flex; align-items: center; gap: 0.35rem; color: var(--muted-foreground); }
  .status-dot { width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%; background: var(--secondary-action); }
  .status-dot.complete { background: var(--analysis-positive-ink); }
  .legend, .legend span { display: flex; align-items: center; gap: 0.3rem; }
  .legend { gap: 0.65rem; color: var(--muted-foreground); transition: opacity 250ms ease; }
  .legend.pending { opacity: 0; }
  .legend i { width: 7px; height: 7px; border-radius: 2px; }
  .brand-key { background: var(--analysis-brand); }
  .positive-key { background: var(--analysis-positive); }
  .concern-key { background: var(--analysis-concern); }
  .composer { display: flex; align-items: center; gap: 0.6rem; margin: 0 1rem 1rem; padding: 0.6rem 0.65rem; border: 1px solid var(--border); border-radius: 0.75rem; color: var(--light-ink); font-size: 0.72rem; }
  .composer > span:first-of-type { flex: 1; }
  .send-icon { display: grid; width: 1.55rem; height: 1.55rem; place-items: center; border-radius: 50%; background: var(--muted); color: var(--muted-foreground); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  @keyframes thinking { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
  @container (max-width: 350px) {
    .analysis-bar { flex-direction: column; align-items: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) { mark, .legend { transition: none; } .thinking-indicator span { animation: none; } }
</style>
