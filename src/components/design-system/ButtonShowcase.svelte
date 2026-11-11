<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="button-examples">
  <div class="button-sample">
    <Button>Primary</Button>
    <span>Default action</span>
  </div>
  <div class="button-sample">
    <Button variant="secondary">Secondary action</Button>
    <span>Quiet action</span>
  </div>
</div>

<style>
  .button-examples {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 2rem 3rem;
  }

  .button-sample {
    display: grid;
    justify-items: start;
    gap: 0.75rem;
  }

  .button-sample span {
    color: var(--muted-foreground);
    font-size: 0.8rem;
  }
</style>
