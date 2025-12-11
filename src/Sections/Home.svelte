<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let mounted = false;
    let visibleElements = new Set();

    onMount(() => {
        mounted = true;
        setupScrollAnimations();
    });

    // Optimized transition combining fade and fly (GPU accelerated) - faster
    function fadeFly(node, { delay = 0, duration = 250, y = 20 } = {}) {
        const o = +getComputedStyle(node).opacity;
        node.style.willChange = "opacity, transform";

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
                    node.style.willChange = "auto";
                }
            },
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
                            element.classList.add("animate-in");
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
        );

        document.querySelectorAll("[data-animate-id]").forEach((el) => {
            observer.observe(el);
        });
    }
</script>

<section
    id="Home"
    class="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-hidden"
>
    <!-- Content container with relative positioning -->
    <div class="relative z-10 flex flex-col items-center w-full">
        {#if mounted}
            <!-- HEADLINE -->
            <h2
                class="text-3xl mt-20 md:text-4xl font-bold text-center text-white mb-8 drop-shadow-md"
                data-animate-id="home-title"
                in:fadeFly={{ duration: 250, delay: 100, y: 20 }}
            >
                HAARP — Weather Monitoring System
            </h2>

            <!-- DESCRIPTION TEXT -->
            <p
                class="text-center text-gray-100 max-w-2xl text-lg leading-relaxed mb-12 drop-shadow-sm"
                data-animate-id="home-desc"
                in:fadeFly={{ duration: 250, delay: 150, y: 20 }}
            >
                A smart environmental monitoring system that integrates
                electronics, sensors, and software to read, analyze, and
                visualize real-time climate data.
            </p>

            <!-- 3D GRADIENT SHAPE -->

            <!-- "What is HAARP?" CARD -->
            <div
                class="glass p-8 rounded-2xl max-w-3xl w-full text-center mb-16 animate-border-glow hover:scale-[1.01] transition-transform duration-400"
                data-animate-id="home-card"
                in:fadeFly={{ duration: 300, delay: 200, y: 30 }}
            >
                <h3
                    class="text-xl font-bold mb-6 text-white drop-shadow-sm"
                    data-animate-id="home-card-title"
                    in:fadeFly={{ duration: 250, delay: 300, y: 15 }}
                >
                    What is HAARP ?
                </h3>
                <p
                    class="text-sm text-gray-100 mb-6 leading-relaxed"
                    data-animate-id="home-card-desc"
                    in:fadeFly={{ duration: 250, delay: 350, y: 15 }}
                >
                    HAARP is a complete weather-monitoring solution designed to
                    collect four main environmental indicators:
                </p>
                <ul
                    class="flex flex-wrap justify-center gap-4 text-gray-100 font-medium mb-6"
                >
                    {#each ["🌡️ Temperature", "💧Humidity", "☀️ Light Intensity", "🍃 Air Quality"] as pill, index}
                        <li
                            class="bg-white/10 px-4 py-1 rounded-full border border-white/20
                                  hover:bg-white/20 hover:text-white transition-colors duration-200 cursor-pointer"
                            data-animate-id="home-pill-{index}"
                            in:fadeFly={{
                                duration: 200,
                                delay: 400 + index * 30,
                                y: 10,
                            }}
                        >
                            {pill}
                        </li>
                    {/each}
                </ul>
                <p
                    class="text-base text-gray-100 leading-relaxed"
                    data-animate-id="home-card-footer"
                    in:fadeFly={{ duration: 250, delay: 500, y: 15 }}
                >
                    These readings are processed by Arduino hardware, visualized
                    through a Java dashboard, and documented through this
                    website.
                </p>
            </div>
        {/if}
    </div>
</section>

<style>
    @keyframes glow-pulse {
        0%,
        100% {
            opacity: 0.5;
            filter: blur(2px) drop-shadow(0 0 15px rgba(139, 58, 139, 0.4));
        }
        50% {
            opacity: 0.7;
            filter: blur(2px) drop-shadow(0 0 25px rgba(139, 58, 139, 0.6));
        }
    }

    .bg-shape {
        position: absolute;
        z-index: 0;
        pointer-events: none;
        animation: glow-pulse 4s ease-in-out infinite;
        /* Edge fade gradient to smooth any sharp edges */
        mask-image: radial-gradient(
            ellipse at center,
            black 60%,
            transparent 100%
        );
        -webkit-mask-image: radial-gradient(
            ellipse at center,
            black 60%,
            transparent 100%
        );
    }

    .bg-shape-top-left {
        top: 20%;
        left: 0;
        width: 250px;
        height: auto;
        transform: translate(-20%, -30%);
    }

    .bg-shape-bottom-right {
        bottom: 20%;
        right: 0;
        width: 250px;
        height: auto;
        transform: translate(20%, 30%);
        /* Show completely - no fade */
        mask-image: none;
        -webkit-mask-image: none;
    }

    /* Responsive adjustments */
    @media (min-width: 640px) {
        .bg-shape-top-left,
        .bg-shape-bottom-right {
            width: 400px;
        }
    }

    @media (min-width: 768px) {
        .bg-shape-top-left {
            top: 18%;
            transform: translate(-25%, -35%);
        }
        .bg-shape-bottom-right {
            bottom: 18%;
            transform: translate(25%, 35%);
        }
        .bg-shape-top-left,
        .bg-shape-bottom-right {
            width: 500px;
        }
    }

    @media (min-width: 1024px) {
        .bg-shape-top-left,
        .bg-shape-bottom-right {
            width: 600px;
        }
    }
</style>
