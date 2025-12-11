<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let count = $state(0);
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  // Optimized transition combining fade and fly (GPU accelerated) - faster
  function fadeFly(node, { delay = 0, duration = 250, y = 20 } = {}) {
    const o = +getComputedStyle(node).opacity;
    node.style.willChange = 'opacity, transform';
    
    return {
      delay,
      duration,
      css: (t) => {
        const eased = 1 - Math.pow(1 - t, 3);
        return `
          opacity: ${eased * o};
          transform: translateY(${(1 - eased) * y}px);
        `;
      },
      tick: (t) => {
        if (t === 1) {
          node.style.willChange = 'auto';
        }
      }
    };
  }

  const increment = () => {
    count += 1
  }
</script>

{#if mounted}
  <button 
    onclick={increment}
    in:fadeFly={{ duration: 250, y: 20 }}
  >
    count is {count}
  </button>
{/if}
