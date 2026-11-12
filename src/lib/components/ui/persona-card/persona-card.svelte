<script lang="ts">
  import { CalendarDays, MapPin, UserRound } from '@lucide/svelte';
  import portraitUrl from '../../../../../assets/persona-racer.webp?url&no-inline';

  type Props = {
    name?: string;
    age?: number;
    address?: string;
    job?: string;
    traits?: string[];
    image?: string;
    imageAlt?: string;
    size?: 'default' | 'compact' | 'hero';
  };

  let {
    name = 'Antoine',
    age = 32,
    address = 'Lyon, France',
    job = 'Racing driver',
    traits = ['Competitive', 'Hands-on', 'Early adopter'],
    image = portraitUrl,
    imageAlt = 'Racer standing at the track with his helmet',
    size = 'default',
  }: Props = $props();
  let initials = $derived(name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase());
</script>

<article class="persona-stage" class:compact={size !== 'default'} class:hero={size === 'hero'} aria-label={`${name}, ${job}`}>
  {#if image}
    <img class="portrait" src={image} alt={imageAlt} width="900" height="900" loading="lazy" decoding="async" />
  {:else}
    <div class="portrait portrait-fallback" aria-hidden="true">{initials}</div>
  {/if}
  <div class="identity-card">
    <div class="profile">
      <UserRound size={18} aria-hidden="true" />
      <div><h3>{name}</h3><span class="role">{job}</span></div>
    </div>
    <div class="details">
      <div><CalendarDays size={15} aria-hidden="true" /><span>{age} years</span></div>
      <div><MapPin size={15} aria-hidden="true" /><span>{address}</span></div>
    </div>
    <div class="traits" aria-label="Characteristics">
      {#each traits as trait (trait)}<span>{trait}</span>{/each}
    </div>
  </div>
</article>

<style>
  .persona-stage { position: relative; width: 92%; justify-self: center; min-width: 0; aspect-ratio: 1; margin-bottom: 8rem; }
  .portrait { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; object-position: center 35%; border-radius: 1.2rem; }
  .portrait-fallback { display: grid; place-items: center; background: linear-gradient(145deg, #edf2ff, #cbd9f5); color: rgb(46 93 184 / 0.25); font-size: 5rem; font-weight: 700; letter-spacing: -0.08em; }
  .identity-card { position: absolute; top: 100%; left: 50%; bottom: auto; width: 80%; padding: 0.95rem; border: 1px solid rgb(255 255 255 / 0.9); border-radius: 1.1rem; background: rgb(255 255 255 / 0.97); box-shadow: 0 16px 38px rgb(23 27 34 / 0.17), 0 2px 6px rgb(23 27 34 / 0.06); backdrop-filter: blur(12px); transform: translate(-50%, -30%); }
  .profile { display: flex; align-items: center; gap: 0.65rem; margin: 0 0 0.75rem; }
  .profile > :global(svg) { flex: 0 0 auto; color: var(--secondary-action); }
  h3 { margin: 0; color: var(--foreground); font-size: 1.4rem; letter-spacing: -0.04em; }
  .role { display: block; margin-top: 0.1rem; color: var(--light-ink); font-size: 0.8rem; }
  .details { display: grid; grid-template-columns: 1fr 1.4fr; gap: 0.55rem 0.45rem; padding: 0.7rem 0; border-top: 1px solid #e8edf2; border-bottom: 1px solid #e8edf2; }
  .details div { display: flex; align-items: center; gap: 0.35rem; min-width: 0; color: #424d5a; font-size: 0.7rem; }
  .details div:last-child { grid-column: auto; }
  .details :global(svg) { flex: 0 0 auto; color: var(--secondary-action); }
  .traits { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.7rem; }
  .traits span { padding: 0.32rem 0.52rem; border: 1px solid #dce5f6; border-radius: 999px; background: #f2f5fc; color: #354663; font-size: 0.65rem; font-weight: 600; }

  .compact.persona-stage { width: 100%; aspect-ratio: auto; margin-bottom: 0; }
  .compact .portrait { border-radius: 0.85rem; }
  .compact .identity-card { position: relative; top: auto; left: auto; width: 90%; margin: -1.6rem auto 0; padding: 0.65rem; border-radius: 0.75rem; transform: none; box-shadow: 0 8px 24px rgb(23 27 34 / 0.09), 0 1px 3px rgb(23 27 34 / 0.04); }
  .compact .profile { gap: 0.4rem; margin-bottom: 0.55rem; }
  .compact .profile > :global(svg) { width: 13px; height: 13px; }
  .compact h3 { font-size: 1rem; }
  .compact .role { font-size: 0.62rem; line-height: 1.3; }
  .compact .details { grid-template-columns: 1fr; gap: 0.35rem; padding: 0.5rem 0; }
  .compact .details div { font-size: 0.6rem; }
  .compact .details :global(svg) { width: 11px; height: 11px; }
  .compact .traits { gap: 0.25rem; margin-top: 0.5rem; }
  .compact .traits span { display: inline-flex; flex: 0 0 auto; padding: 0.23rem 0.35rem; font-size: 0.55rem; font-weight: 500; white-space: nowrap; }
  .hero .portrait { aspect-ratio: 3 / 2; }
</style>

