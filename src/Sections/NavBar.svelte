<script>
    import { onMount } from 'svelte';
    import logo from "../assets/Haarp-Logo.png";
    import { fade, slide } from "svelte/transition";

    let links = ["Home", "Arduino", "Java", "Tools", "Team"];
    let isMenuOpen = false;
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

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<!-- Outer container for sticky positioning -->
<div class="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8">
    {#if mounted}
        <nav
            class="glass-nav-light rounded-2xl px-10 py-3 flex justify-between items-center transition-all duration-300 shadow-xl animate-border-glow"
            in:fadeFly={{ duration: 250, delay: 0, y: -20 }}
        >
            <!-- Logo - Bigger (>40px) and Sharp -->
            <a 
                href="#Home" 
                class="flex items-center" 
                on:click={closeMenu}
                in:fadeFly={{ duration: 200, delay: 50, y: -10 }}
            >
                <img
                    src={logo}
                    alt="Haarp Logo"
                    class="h-12 md:h-12 w-auto object-contain cursor-pointer transition-none image-render-sharp"
                />
            </a>

            <!-- Desktop Menu -->
            <div class="hidden md:flex gap-8 items-center">
                {#each links as link, index}
                    <a
                        href="#{link}"
                        class="text-[#670d2e] font-medium text-lg relative group transition-colors duration-300 hover:text-[#a4385f]"
                        in:fadeFly={{ duration: 200, delay: 100 + index * 30, y: -10 }}
                    >
                        {link}
                        <span
                            class="absolute left-0 bottom-0 w-0 h-0.5 bg-[#a4385f] transition-all duration-300 group-hover:w-full"
                        ></span>
                    </a>
                {/each}
            </div>

            <!-- Mobile Menu Button -->
            <button
                on:click={toggleMenu}
                class="md:hidden text-[#670d2e] focus:outline-none p-2 hover:bg-[#670d2e]/5 rounded-lg transition-colors"
                in:fadeFly={{ duration: 200, delay: 100, y: -10 }}
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-8 h-8"
            >
                {#if isMenuOpen}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                {:else}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                {/if}
            </svg>
            </button>
        </nav>

        <!-- Mobile Dropdown Menu -->
        {#if isMenuOpen}
            <div
                transition:slide={{ duration: 300 }}
                class="md:hidden mt-2 glass-nav-light rounded-xl p-4 flex flex-col gap-4 shadow-xl border border-white/40"
            >
                {#each links as link, index}
                    <a
                        href="#{link}"
                        on:click={closeMenu}
                        class="text-[#670d2e] font-medium text-lg px-4 py-3 hover:bg-[#670d2e]/10 rounded-lg transition-colors border-b border-[#670d2e]/5 last:border-0"
                        in:fadeFly={{ duration: 200, delay: index * 30, y: 10 }}
                    >
                        {link}
                    </a>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .image-render-sharp {
        image-rendering: -webkit-optimize-contrast;
    }
</style>
