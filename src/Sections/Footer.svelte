<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let mounted = false;
    let visibleElements = new Set();

    onMount(() => {
        mounted = true;
        setupScrollAnimations();
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

    // Scroll-triggered animations
    function setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const id = element.dataset.animateId;
                        if (id && !visibleElements.has(id)) {
                            visibleElements.add(id);
                            element.classList.add('animate-in');
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('[data-animate-id]').forEach((el) => {
            observer.observe(el);
        });
    }
</script>

<footer
    id="Footer"
    class="py-16 flex flex-row items-center justify-center mt-auto"
>
    {#if mounted}
        <div
            class="glass w-full max-w-5xl rounded-2xl p-6 text-center flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 animate-border-glow"
            data-animate-id="footer-card"
            in:fadeFly={{ duration: 300, delay: 100, y: 30 }}
        >
            <!-- HEADLINE -->
            <p 
                class="text-white text-md font-bold tracking-wide"
                data-animate-id="footer-text1"
                in:fadeFly={{ duration: 250, delay: 200, y: 15 }}
            >
                © 2025 HAARP Project — Weather Monitoring System
            </p>

            <p 
                class="text-gray-200 text-md"
                data-animate-id="footer-text2"
                in:fadeFly={{ duration: 250, delay: 250, y: 15 }}
            >
                Designed and Developed by Ashur University Team.
            </p>
        </div>
    {/if}
</footer>
