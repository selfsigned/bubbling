<script lang="ts">
  import { onMount } from 'svelte';
  import { Sparkles } from '@lucide/svelte';

  type Props = {
    placeholder?: string;
    demoPrompt?: string;
    typingSpeed?: number;
    send?: (prompt: string) => void;
    onTypingFinished?: (prompt: string) => void;
    size?: 'default' | 'compact';
  };

  let { placeholder = 'Ask about your AI visibility…', demoPrompt, typingSpeed = 42, send, onTypingFinished, size = 'default' }: Props = $props();
  let value = $state('');
  let isTyping = $state(false);
  let sendPulse = $state(false);

  function pulseSendButton() {
    sendPulse = true;
    window.setTimeout(() => (sendPulse = false), 360);
  }

  onMount(() => {
    if (!demoPrompt) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      value = demoPrompt;
      onTypingFinished?.(demoPrompt);
      return;
    }

    isTyping = true;
    let cursor = 0;
    const timer = window.setInterval(() => {
      cursor += 1;
      value = demoPrompt.slice(0, cursor);
      if (cursor >= demoPrompt.length) {
        window.clearInterval(timer);
        isTyping = false;
        onTypingFinished?.(demoPrompt);
        pulseSendButton();
      }
    }, Math.max(typingSpeed, 16));

    return () => window.clearInterval(timer);
  });

  function submit(event: SubmitEvent) {
    event.preventDefault();
    const prompt = value.trim();
    if (prompt) {
      send?.(prompt);
      pulseSendButton();
    }
  }
</script>

<form class="ai-input" class:compact={size === 'compact'} onsubmit={submit}>
    <input
      type="text"
      aria-label="Ask about your AI visibility"
      bind:value
      {placeholder}
      readonly={isTyping}
    />
  <button type="submit" aria-label="Send prompt" disabled={!value.trim()} class:send-pulse={sendPulse}>
    <Sparkles size={19} strokeWidth={2} aria-hidden="true" />
  </button>
</form>

<style>
  .ai-input {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    min-height: 5rem;
    padding: 0.75rem;
    border: 1px solid #d6e0ea;
    border-radius: 1rem;
    background: #fff;
    box-shadow: 0 10px 32px rgb(23 27 34 / 0.07), 0 1px 2px rgb(23 27 34 / 0.04);
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .ai-input:focus-within {
    border-color: var(--secondary-action);
    box-shadow: 0 0 0 3px rgb(74 114 197 / 0.12), 0 12px 34px rgb(23 27 34 / 0.08);
  }

  input {
    flex: 1;
    min-width: 0;
    min-height: 2.75rem;
    align-self: center;
    padding: 0.55rem 0.7rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--foreground);
    font: inherit;
    font-size: 1rem;
    line-height: 1.5;
  }

  input::placeholder {
    color: var(--muted-foreground);
  }

  button {
    display: grid;
    flex: 0 0 auto;
    width: 2.75rem;
    height: 2.75rem;
    place-items: center;
    border: 0;
    border-radius: 0.7rem;
    background: var(--secondary-action);
    color: var(--secondary-action-foreground);
    cursor: pointer;
    transition: background-color 160ms ease;
  }

  button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--secondary-action) 88%, black);
  }

  button:active:not(:disabled) {
    transform: scale(1.06);
  }

  button.send-pulse {
    animation: send-press 360ms cubic-bezier(0.2, 0.75, 0.3, 1) both;
  }

  @keyframes send-press {
    0% { transform: scale(1); }
    38% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  button:focus-visible {
    outline: 3px solid rgb(74 114 197 / 0.35);
    outline-offset: 3px;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .compact.ai-input { min-height: 3.5rem; gap: 0.35rem; padding: 0.5rem; border-radius: 0.8rem; }
  .compact input { min-height: 2rem; padding: 0.35rem; font-size: 0.8rem; line-height: 1.5; }
  .compact button { width: 2rem; height: 2rem; border-radius: 0.5rem; }
  .compact button :global(svg) { width: 16px; height: 16px; }

  @media (prefers-reduced-motion: reduce) {
    .ai-input,
    button {
      transition: none;
      animation: none;
    }
  }
</style>
