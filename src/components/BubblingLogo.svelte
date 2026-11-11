<script>
  import mascotUrl from '../../assets/bub.svg?url&no-inline';

  let { size = 38, class: className = '' } = $props();
</script>

<div class={`logo ${className}`} style={`--mark-size: ${size}px`}>
  <img class="mascot" src={mascotUrl} alt="" aria-hidden="true" />
  <span class="wordmark">bubbling</span>
</div>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--mark-size) * 0.1);
    color: #292927;
    white-space: nowrap;
  }

  .mascot {
    display: block;
    width: var(--mark-size);
    height: var(--mark-size);
    flex: 0 0 auto;
  }

  .wordmark {
    display: inline-flex;
    align-items: center;
    height: var(--mark-size);
    font-family: 'Bricolage Grotesque', 'Arial Rounded MT Bold', sans-serif;
    font-size: calc(var(--mark-size) * 0.54);
    font-weight: 400;
    letter-spacing: -0.055em;
    line-height: 1;
  }
</style>
