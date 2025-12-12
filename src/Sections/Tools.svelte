<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import arduinoLogo from "../assets/pngwing.com.png";
    import cppLogo from "../assets/c-(1).png";
    import javaLogo from "../assets/java.png";
    import svelteLogo from "../assets/512px-Svelte_Logo.svg.png";

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

    const tools = [
        {
            name: "Arduino UNO",
            description: "Microcontroller for Hardware Control",
            logo: arduinoLogo,
            shadowColor: "rgba(0, 150, 136, 0.4)",
        },
        {
            name: "C++",
            description: "Embedded Systems Programming",
            logo: cppLogo,
            shadowColor: "rgba(0, 89, 156, 0.4)",
        },
        {
            name: "Java",
            description: "Desktop Dashboard Application",
            logo: javaLogo,
            shadowColor: "rgba(224, 31, 31, 0.4)",
        },
        {
            name: "Svelte",
            description: "Modern Frontend Web Interface",
            logo: svelteLogo,
            shadowColor: "rgba(255, 62, 0, 0.4)",
        },
    ];
</script>

<section
    id="Tools"
    class="min-h-screen py-24 px-4 relative flex flex-col items-center"
>
    <div class="max-w-4xl w-full">
        {#if mounted}
            <!-- HEADLINE (Smaller) -->
            <h2
                class="leading-normal text-2xl mt-30 md:text-4xl font-bold text-center text-white mb-12 drop-shadow-md headline-glow"
                data-animate-id="tools-title"
                in:fadeFly={{ duration: 1000, delay: 300, y: 30 }}
            >
                Tools & Technologies Used
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each tools as tool, index}
                    <div
                        class="glass p-6 rounded-xl flex flex-col items-center text-center transition-transform duration-500 hover:scale-105 animate-border-glow cursor-default"
                        data-animate-id="tools-card-{index}"
                        in:fadeFly={{
                            duration: 1000,
                            delay: 500 + index * 100,
                            y: 40,
                        }}
                    >
                        <div
                            class="w-24 h-24 mb-4 flex items-center justify-center"
                            data-animate-id="tools-logo-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 700 + index * 100,
                                y: 20,
                            }}
                        >
                            <!-- Logo with specific soft shadow logic -->
                            <img
                                src={tool.logo}
                                alt={tool.name}
                                class="max-w-full max-h-full object-contain"
                                style="filter: drop-shadow(0 4px 8px {tool.shadowColor});"
                            />
                        </div>

                        <h3
                            class="text-lg font-bold mb-2 text-white"
                            data-animate-id="tools-name-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 800 + index * 100,
                                y: 15,
                            }}
                        >
                            {tool.name}
                        </h3>
                        <p
                            class="text-gray-200 text-xs font-medium opacity-90"
                            data-animate-id="tools-desc-{index}"
                            in:fadeFly={{
                                duration: 800,
                                delay: 900 + index * 100,
                                y: 15,
                            }}
                        >
                            {tool.description}
                        </p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>
