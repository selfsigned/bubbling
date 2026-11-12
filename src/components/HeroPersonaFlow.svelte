<script lang="ts">
  import { onMount } from 'svelte';
  import AIInput from '$lib/components/ui/ai-input/ai-input.svelte';
  import BubStatus from '$lib/components/ui/bub-status/bub-status.svelte';
  import PersonaCard from '$lib/components/ui/persona-card/persona-card.svelte';
  import AIChatThread from '$lib/components/ui/ai-chat/ai-chat-thread.svelte';
  import { demoPersonas } from '$lib/demo-personas';
  import { heroConversations, oilPrompt } from '$lib/demo-conversations';

  let stage = $state<'prompt' | 'thinking' | 'personas' | 'chats' | 'complete'>('prompt');
  let completedChats = $state(0);
  const personasVisible = $derived(stage === 'personas' || stage === 'chats' || stage === 'complete');
  const chatsVisible = $derived(stage === 'chats' || stage === 'complete');
  let timer: ReturnType<typeof setTimeout> | undefined;

  function submitDemo() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage = 'chats';
      return;
    }
    // Let the input's send-button press finish before Bub takes over.
    timer = setTimeout(() => {
      stage = 'thinking';
      timer = setTimeout(() => {
        stage = 'personas';
        timer = setTimeout(() => { stage = 'chats'; }, 1100);
      }, 3200);
    }, 450);
  }

  function finishChat() {
    completedChats += 1;
    if (completedChats === heroConversations.length) stage = 'complete';
  }

  onMount(() => () => clearTimeout(timer));
</script>

<!-- This is a non-interactive illustration, not a second CTA or a live AI form. -->
<div class="persona-flow" data-stage={stage} aria-hidden="true" inert>
  <div class="prompt" class:submitted={stage !== 'prompt'}>
    <AIInput size="compact" demoPrompt={oilPrompt} typingSpeed={32} onTypingFinished={submitDemo} />
  </div>
  <div class="scene-output">
    {#if stage === 'thinking'}
      <div class="thinking"><BubStatus message="Generating AI personas" size={52} /></div>
    {/if}
    <div class="personas" class:revealed={personasVisible}>
      {#each demoPersonas as persona, index (persona.name)}
        {@const conversation = heroConversations[index]}
        <div class="persona">
          <div class="profile"><PersonaCard {...persona} size="hero" /></div>
          <div class="conversation" class:visible={chatsVisible}>
            <AIChatThread
              personaName={persona.name}
              personaImage={conversation.avatar}
              assistant={conversation.assistant}
              turns={conversation.turns}
              size="compact"
              presentation="focus"
              animate={chatsVisible}
              typingSpeed={32}
              thinkingDuration={850 + index * 500}
              followUpDelay={1100}
              onComplete={finishChat}
            />
          </div>
        </div>
      {/each}
    </div>
  </div>
  <p class="simulation-note" class:visible={chatsVisible}>Simulated conversations · REDLINE RS is a fictional product</p>
</div>

<style>
  .persona-flow { position: relative; width: 100%; height: 100%; --center-space: clamp(34rem, 44vw, 42rem); --rail-gap: 1.5rem; }
  .prompt { position: absolute; top: 0; left: 0; width: min(32rem, 45vw); transition: opacity 500ms ease; }
  .prompt.submitted { opacity: 0.7; }
  .scene-output { position: relative; height: 100%; }
  .thinking { position: absolute; top: 5rem; left: 0; width: calc((100% - var(--center-space) - 2 * var(--rail-gap)) / 2); display: flex; justify-content: center; animation: appear 400ms ease both; }
  .personas { display: grid; grid-template-columns: minmax(0, 1fr) var(--center-space) minmax(0, 1fr); column-gap: var(--rail-gap); visibility: hidden; }
  .personas.revealed { visibility: visible; }
  .persona { width: 100%; max-width: 20rem; min-width: 0; margin-top: 4.75rem; opacity: 0; transform: translateY(12px); transition: opacity 650ms ease, transform 650ms cubic-bezier(0.2, 0.7, 0.3, 1); }
  .persona:nth-child(2) { grid-column: 3; justify-self: end; margin-top: 0; transition-delay: 180ms; }
  .revealed .persona { opacity: 1; transform: none; }
  .profile { width: min(100%, 12rem); margin-inline: auto; }
  .conversation { margin-top: 1rem; visibility: hidden; opacity: 0; transition: opacity 500ms ease; }
  .conversation.visible { visibility: visible; opacity: 1; }
  .simulation-note { position: absolute; bottom: 0; left: 0; right: 0; margin: 0; color: var(--light-ink); font-size: 0.65rem; text-align: center; visibility: hidden; }
  .simulation-note.visible { visibility: visible; }
  @keyframes appear { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @media (max-width: 1199px) {
    .persona-flow { height: auto; }
    .prompt { position: static; width: min(100%, 32rem); margin-inline: auto; }
    .scene-output { height: auto; margin-top: 2rem; }
    .thinking { width: 100%; }
    .personas { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
    .persona, .persona:nth-child(2) { grid-column: auto; justify-self: center; margin-top: 0; }
    .simulation-note { position: static; margin-top: 2rem; }
  }
  @media (max-width: 600px) {
    .personas { grid-template-columns: minmax(0, 1fr); gap: 3rem; }
    .profile { width: 12rem; }
    .conversation { margin-top: 1.5rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .prompt, .persona, .conversation { transition: none; }
    .thinking { animation: none; }
  }
</style>
