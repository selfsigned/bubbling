<script lang="ts" module>
  import type { ChatSegment } from './ai-chat.svelte';

export type ChatTurn = {
  question: string;
  response: ChatSegment[];
  mood?: 'grumpy' | 'skeptical';
};
</script>

<script lang="ts">
  import * as svelte from 'svelte';
  import grumpyUrl from '../../../../../assets/clawd-grumpy.svg?url&no-inline';
  import skepticalUrl from '../../../../../assets/clawd-skeptical.svg?url&no-inline';
  import openAiSymbolUrl from '../../../../../assets/openai-symbol.svg?url&no-inline';
  import BubStatus from '../bub-status/bub-status.svelte';

  type Props = {
    personaName: string;
    personaImage: string;
    turns: ChatTurn[];
    animate?: boolean;
    assistant?: 'claude' | 'chatgpt';
    size?: 'default' | 'compact';
    typingSpeed?: number;
    thinkingDuration?: number;
    highlightDelay?: number;
    followUpDelay?: number;
    onComplete?: () => void;
    presentation?: 'thread' | 'focus';
  };

  let {
    personaName, personaImage, turns, animate = false, assistant = 'claude', size = 'default', typingSpeed = 24,
    thinkingDuration = 700, highlightDelay = 400, followUpDelay = 800, onComplete, presentation = 'thread',
  }: Props = $props();

  let stage = $state<'thinking' | 'typing' | 'analyzing' | 'waiting' | 'complete'>('complete');
  let activeTurn = $state(Infinity);
  let visibleCharacters = $state(Infinity);
  let activeHighlights = $state(Infinity);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const pets = { grumpy: grumpyUrl, skeptical: skepticalUrl };
  const labels = { brand: 'Brand mention', positive: 'Positive sentiment', concern: 'Concern' };

  const conversation = $derived.by(() => {
    let highlightIndex = 0;
    return turns.map((turn) => {
      let offset = 0;
      const firstHighlight = highlightIndex;
      const segments = turn.response.map((segment) => {
        const item = { ...segment, offset, highlightIndex: segment.highlight ? highlightIndex++ : -1 };
        offset += segment.text.length;
        return item;
      });
      return { ...turn, mood: turn.mood ?? 'grumpy', segments, length: offset, highlightCount: highlightIndex - firstHighlight };
    });
  });
  const displayedTurn = $derived(activeTurn === Infinity ? conversation.length - 1 : activeTurn);
  const analysisVisible = $derived(conversation.length > 0 && (stage === 'analyzing' || stage === 'complete'));

  function stop() {
    clearTimeout(timer);
  }

  function showComplete() {
    stop();
    stage = 'complete';
    activeTurn = Infinity;
    visibleCharacters = Infinity;
    activeHighlights = Infinity;
  }

  export function play() {
    stop();
    if (!conversation.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showComplete();
      onComplete?.();
      return;
    }

    const timeline = conversation;
    const highlightCount = timeline.reduce((count, turn) => count + turn.highlightCount, 0);
    const speed = Math.max(typingSpeed, 8);
    const thinking = Math.max(thinkingDuration, 0);
    const highlightPause = Math.max(highlightDelay, 0);
    const followUp = Math.max(followUpDelay, 0);
    const complete = onComplete;
    let index = 0;
    activeHighlights = 0;

    function startTurn() {
      activeTurn = index;
      visibleCharacters = 0;
      stage = 'thinking';
      timer = setTimeout(typeNext, thinking);
    }

    function typeNext() {
      stage = 'typing';
      visibleCharacters = Math.min(visibleCharacters + 4, timeline[index].length);
      if (visibleCharacters < timeline[index].length) {
        timer = setTimeout(typeNext, speed);
      } else if (index < timeline.length - 1) {
        stage = 'waiting';
        index += 1;
        timer = setTimeout(startTurn, followUp);
      } else {
        stage = 'analyzing';
        timer = setTimeout(highlightNext, highlightPause);
      }
    }

    function highlightNext() {
      if (activeHighlights < highlightCount) {
        activeHighlights += 1;
        timer = setTimeout(highlightNext, 460);
      } else {
        stage = 'complete';
        complete?.();
      }
    }

    startTurn();
  }

  $effect(() => {
    // An imperative timeline: only content/settings restart it, never playback ticks.
    const settings = { conversation, animate, typingSpeed, thinkingDuration, highlightDelay, followUpDelay };
    svelte.untrack(() => settings.animate ? play() : showComplete());
    return stop;
  });
  svelte.onDestroy(stop);
</script>

<article class={['chat-thread', { compact: size === 'compact', focus: presentation === 'focus' }]} aria-label={`${personaName}'s simulated conversation with ${assistant === 'claude' ? 'Claude' : 'ChatGPT'}`} data-stage={stage} data-turn={activeTurn} data-presentation={presentation}>
  {#each conversation as turn, turnIndex (turnIndex)}
    {@const current = turnIndex === (presentation === 'focus' ? displayedTurn : activeTurn)}
    <div class={['exchange', { future: presentation === 'thread' && turnIndex > activeTurn, selected: presentation === 'focus' && turnIndex === displayedTurn }]} aria-hidden={presentation === 'focus' ? turnIndex === displayedTurn ? undefined : 'true' : turnIndex > activeTurn ? 'true' : undefined}>
      <div class="user-message">
        <img class="persona-avatar" src={personaImage} alt={personaName} width="28" height="28" />
        <p class="user-bubble">{turn.question}</p>
      </div>
      <div class="assistant-message">
        {#if assistant === 'claude'}
          <img class="claude-pet" src={pets[turn.mood]} alt={`Claude, ${turn.mood}`} width="36" height="32" data-mood={turn.mood} />
        {:else}
          <img class="chatgpt-symbol" src={openAiSymbolUrl} alt="ChatGPT" width="28" height="28" />
        {/if}
        <div class="reply-bubble" aria-label={`${assistant === 'claude' ? 'Claude' : 'ChatGPT'}'s reply`}>
          <p class="sr-only">{turn.response.map((segment) => segment.text).join('')}</p>
          <p class={['reply-text', { thinking: current && stage === 'thinking' }]} aria-hidden="true">{#each turn.segments as segment, segmentIndex (segmentIndex)}{@const visible = current ? Math.max(0, visibleCharacters - segment.offset) : Infinity}{#if segment.highlight}<mark class={[segment.highlight, { highlighted: segment.highlightIndex < activeHighlights }]} title={labels[segment.highlight]}>{segment.text.slice(0, visible)}<span class="unrevealed">{segment.text.slice(visible)}</span></mark>{:else}<span>{segment.text.slice(0, visible)}<span class="unrevealed">{segment.text.slice(visible)}</span></span>{/if}{/each}</p>
          {#if current && stage === 'thinking'}
            <div class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></div>
          {/if}
        </div>
      </div>
    </div>
  {/each}
  <div class="bub-analysis">
    <BubStatus message={stage === 'complete' ? 'Customer sentiment analyzed' : 'Analyzing customer sentiment'} active={analysisVisible} pending={stage === 'analyzing'} size={size === 'compact' ? 28 : 34} />
  </div>
  <span class="sr-only" role="status">{stage === 'thinking' || stage === 'typing' ? `${assistant === 'claude' ? 'Claude' : 'ChatGPT'} is replying` : ''}</span>
</article>

<style>
  .chat-thread { width: 100%; color: var(--foreground); font-size: 0.83rem; line-height: 1.6; }
  .exchange + .exchange { margin-top: 1.6rem; }
  .focus { display: grid; grid-template-columns: minmax(0, 1fr); align-items: start; }
  .focus .exchange { grid-area: 1 / 1; }
  .chat-thread.focus .exchange + .exchange { margin-top: 0; }
  .focus .exchange.selected { visibility: visible; }
  .focus .exchange:not(.selected) { visibility: hidden; }
  .focus .bub-analysis { grid-area: 2 / 1; }
  .exchange.future { visibility: hidden; }
  .user-message { display: flex; flex-direction: row-reverse; align-items: flex-start; gap: 0.5rem; margin-left: 3rem; }
  .persona-avatar { display: block; flex: 0 0 auto; width: 28px; height: 28px; margin-top: 0.3rem; border-radius: 50%; object-fit: cover; object-position: center 25%; }
  .user-bubble { min-width: 0; margin: 0; padding: 0.7rem 0.9rem; border-radius: 1rem 0.25rem 1rem 1rem; background: color-mix(in srgb, var(--secondary) 22%, var(--background)); }
  .assistant-message { display: grid; grid-template-columns: 36px minmax(0, 1fr); align-items: start; gap: 0.5rem; margin-top: 0.9rem; padding-right: 1rem; }
  .claude-pet { display: block; width: 36px; height: 32px; margin-top: 0.3rem; image-rendering: pixelated; }
  .chatgpt-symbol { display: block; width: 28px; height: 28px; margin: 0.3rem 4px 0; object-fit: contain; }
  .reply-bubble { position: relative; padding: 0.8rem 0.95rem; border: 1px solid color-mix(in srgb, var(--border) 65%, transparent); border-radius: 0.25rem 1rem 1rem 1rem; background: var(--background); box-shadow: 0 3px 12px rgb(23 27 34 / 0.025); }
  .reply-text { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  .reply-text.thinking, .unrevealed { visibility: hidden; }
  mark { padding: 0.1em 0; border-radius: 0.15em; color: inherit; background: linear-gradient(var(--highlight), var(--highlight)) no-repeat left center / 0% 100%; box-decoration-break: clone; -webkit-box-decoration-break: clone; transition: background-size 420ms cubic-bezier(0.22, 0.65, 0.3, 1); }
  mark.highlighted { background-size: 100% 100%; }
  .brand { --highlight: var(--analysis-brand); }
  .positive { --highlight: var(--analysis-positive); }
  .concern { --highlight: var(--analysis-concern); }
  .bub-analysis { margin: 1.4rem 0 0 2.75rem; }
  .typing-dots { position: absolute; top: 1.15rem; left: 0.95rem; display: flex; gap: 4px; }
  .typing-dots i { width: 4px; height: 4px; border-radius: 50%; background: var(--light-ink); animation: thinking 1s ease-in-out infinite; }
  .typing-dots i:nth-child(2) { animation-delay: 150ms; }
  .typing-dots i:nth-child(3) { animation-delay: 300ms; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  .compact { font-size: 0.75rem; line-height: 1.5; }
  .compact .exchange + .exchange { margin-top: 0.75rem; }
  .compact .user-message { gap: 0.3rem; margin-left: 1.25rem; }
  .compact .persona-avatar { width: 24px; height: 24px; }
  .compact .user-bubble { padding: 0.45rem 0.6rem; }
  .compact .assistant-message { grid-template-columns: 28px minmax(0, 1fr); gap: 0.35rem; margin-top: 0.5rem; padding-right: 0; }
  .compact .claude-pet { width: 28px; height: 26px; }
  .compact .chatgpt-symbol { width: 22px; height: 22px; margin-inline: 3px; }
  .compact .reply-bubble { padding: 0.5rem 0.65rem; }
  .compact .bub-analysis { margin: 0.8rem 0 0 1.75rem; }
  @keyframes thinking { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
  @media (max-width: 400px) { .assistant-message { padding-right: 0; gap: 0.35rem; grid-template-columns: 30px minmax(0, 1fr); } .claude-pet { width: 30px; height: 28px; } .user-message { margin-left: 1.5rem; } }
  @media (prefers-reduced-motion: reduce) { mark { transition: none; } .typing-dots i { animation: none; } }
</style>
